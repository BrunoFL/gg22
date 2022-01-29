import {GameServer} from './GameServer.mjs'
import {Enclume} from './games/Enclume.mjs'
import { UUIDGenerator } from '../utils/UUIDGenerator.mjs'

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
    }

    join(player) {
        console.log(`player ${player.name} joined ${this.name}`)
        player.setAdmin(false)
        if (!this.admin) {
            this.admin = player
            player.setAdmin(true)
        }
        this.players.push(player)
        this.notifyLobbyUpdate(player)
        player.socket.on('listGames', () => this.encodeGames())
        player.join(this)
    }

    leave(player) {
        console.log(`player ${player.name} leave ${this.name}`)
        player.socket.off('listGames')
        player.leave()
        this.players = this.players.filter(p => p.id !== player.id)
        if (this.players.length === 0) {
            this.destroy()
        } else if (this.admin.id === player.id) {
            const newAdmin = this.players[0]
            this.admin = newAdmin
            newAdmin.setAdmin(true)
            this.notifyLobbyUpdate()
        }
    }

    notifyLobbyUpdate() {
        const encodedLobby = this.encode()
        for (const player of this.players) {
            player.emit('updateLobby', encodedLobby)
        }
    }

    encode() {
        return {
            'id': this.id,
            'name': this.name,
            'admin': this.admin.encode(),
            'players': this.encodePlayers()
        }
    }

    encodePlayers() {
        return this.players.map(p => p.encode())
    }

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
}
