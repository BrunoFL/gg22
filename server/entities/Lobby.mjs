import {Enclume} from './games/Enclume.mjs'
import {UUIDGenerator} from '../utils/UUIDGenerator.mjs'
import {GameManager} from './GameManager.mjs'

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
    game

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
        this.games.set('Enclume', new Enclume(this))
        this.id = UUIDGenerator.uuid()
        this.admin = null
        this.isOpen = true
        this.game = new GameManager(this)
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
        player.socket.off('listGames')
        player.socket.off('startGame')
        player.leave()
        this.players = this.players.filter(p => p.id !== player.id)
        if (this.players.length === 0) {
            this.destroy()
        } else if (this.admin.id === player.id) {
            const newAdmin = this.players[0]
            this.setAdmin(newAdmin)
            this.notifyLobbyUpdate()
        }
    }

    /**
     * @param {Player} player
     */
    setAdmin(player) {
        this.admin = player
        player.setAdmin(true)
        this.admin.socket.on('startGame', gameName => {
            const game = this.games.get(gameName)
            if (game) {
                this.game.runGame(game)
            }
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
        return this.players.map(p => p.encode())
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

    listGames(){
        this.emitPlayers('listGames', this.encodeGames())
    }
}
