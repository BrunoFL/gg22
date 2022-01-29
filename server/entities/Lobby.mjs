import {GameServer} from './GameServer.mjs'
import {Enclume} from './games/Enclume.mjs'

export class Lobby {
    /**
     * @type {Emitter}
     */
    io
    players
    id
    name
    games

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
        this.id = Math.random()
    }

    join(player) {
        console.log(`player ${player} joined ${this.name}`)
        this.players.push(player)
        this.notifyLobbyUpdate(player)
        player.socket.on('listGames', () => this.encodeGames())
        player.join(this)
    }

    leave(player) {
        console.log(`player ${player} leave ${this.name}`)
        player.off('listGames')
        this.players = this.players.filter(p => p !== player)
        this.notifyLobbyUpdate(player)
        if (this.players.length === 0) {
            this.destroy()
        }
    }

    notifyLobbyUpdate() {
        const encodedLobby = this.encode()
        this.players.forEach(player => player.emit('updateLobby', encodedLobby))
    }

    encode() {
        return {
            'id': this.id,
            'name': this.name,
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
        for(const player of this.players){
            this.leave(player)
        }
        this.server.destroyLobby(this)
    }
}
