import {Enclume} from './games/enclume/Enclume.mjs'
import {UUIDGenerator} from '../utils/UUIDGenerator.mjs'
import {GameManager} from './GameManager.mjs'
import {HundredMetersClick} from './games/hundredmetersclicker/HundredMetersClick.mjs'
import {ObstacleRun} from './games/ObstacleRun.mjs'
import {TugWar} from './games/tugowar/TugWar.mjs'
import {Goche} from './games/goche/Goche.mjs'

export class Lobby {
    /**
     * @type {Emitter}
     */
    io
    /**
     * @type {Player[]}
     */
    players
    /**
     * @type {string}
     */
    id
    /**
     * @type {string}
     */
    name
    /**
     * @type {Map}
     */
    games
    /**
     * @type {Player}
     */
    admin
    /**
     * @type {boolean}
     */
    isOpen
    /**
     * @type {GameManager}
     */
    gameManager
    /**
     * @type {Player[]}
     */
    disconnected

    /**
     * @param {Emitter} io
     * @param {GameServer} server
     * @param {string} name
     */
    constructor(io, server, name) {
        this.io = io
        this.server = server
        this.name = name
        this.players = []
        this.games = new Map()
        this.games.set(Enclume.name(), new Enclume(this))
        this.games.set(HundredMetersClick.name(), new HundredMetersClick(this))
        // this.games.set(ObstacleRun.name(), new ObstacleRun(this))
        this.games.set(TugWar.name(), new TugWar(this))
        this.games.set(Goche.name(), new Goche(this))
        this.id = UUIDGenerator.uuid()
        this.admin = null
        this.isOpen = true
        this.gameManager = new GameManager(this)
        this.disconnected = []
    }

    /**
     * @param {Player} player
     */
    join(player) {
        if (this.isOpen) {
            console.log(`player ${player.name} joined ${this.name}`)
            player.setAdmin(false)
            if (!this.admin) {
                this.admin = player
                this.setAdmin(player)
            }
            this.players.push(player)
            this.notifyLobbyUpdate(player)
            player.socket.on('askListGames', () => {
                this.listGames()
            })
            player.join(this)
        }
    }

    /**
     * @param {Player} player
     */
    leave(player) {
        console.log(`player ${player.name} leave ${this.name}`)
        player.socket.removeAllListeners('listGames')
        player.socket.removeAllListeners('startGame')
        player.leave()
        this.players = this.players.filter(p => p.id !== player.id)
        if (this.players.length === 0) {
            this.destroy()
        } else if (this.admin.id === player.id) {
            const newAdmin = this.players[0]
            this.setAdmin(newAdmin)
            this.notifyLobbyUpdate()
            this.disconnected.push(player)
        }
    }

    /**
     * @param {Player} player
     */
    setAdmin(player) {
        this.admin = player
        player.setAdmin(true)
        this.admin.socket.on('startGame', gameName => {
            this.startGame(gameName)
        })
    }

    notifyLobbyUpdate() {
        const encodedLobby = this.encode()
        for (const player of this.players) {
            player.emit('updateLobby', encodedLobby)
        }
    }

    /**
     * @param {string} event
     * @param {*} value
     */
    emitPlayers(event, value) {
        for (const player of this.players) {
            player.emit(event, value)
        }
    }

    /**
     * @return {object}
     */
    encode() {
        return {
            'id': this.id,
            'name': this.name,
            'admin': this.admin.encode(),
            'players': this.encodePlayers(),
            'isOpen': this.isOpen
        }
    }

    /**
     * @return {object[]}
     */
    encodePlayers() {
        return this.players
            .sort((p1, p2) => p2.score - p1.score)
            .map(p => p.encode())
    }

    /**
     * @return {string[]}
     */
    encodeGames() {
        return Array.from(this.games.keys())
    }

    destroy() {
        console.log(`Destroy lobby ${this.name}`)
        for (const player of this.players) {
            this.leave(player)
        }
        this.server.destroyLobby(this)
    }

    closeLobby() {
        this.isOpen = false
    }

    startGame(gameName) {
        const game = this.games.get(gameName)
        if (game) {
            this.closeLobby()
            console.log(`Start Game ${gameName} in lobby ${this.name}`)
            this.gameManager.runGame(game)
        }
    }

    listGames() {
        this.isOpen = true
        this.emitPlayers('listGames', this.encodeGames())
    }

    joinById(id, socket) {
        if (this.isOpen) {
            const disconnected = []
            for (const player of this.disconnected) {
                if (player.id === id) {
                    console.log(`reconnect player ${player.name}`)
                    player.reconnect(socket)
                    this.notifyLobbyUpdate()
                } else {
                    disconnected.push(this.disconnected)
                }
            }
            this.disconnected = disconnected
        }
        return null
    }

    getPlayerById(id) {
        return this.players.find(p => p.id === id)
    }

    leaderBoardGeneral() {
        this.emitPlayers('leaderBoardGeneral', this.encodePlayers())
    }
}
