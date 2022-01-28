import { GameServer } from "./GameServer.mjs";

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
        this.listen()
        this.id = Math.random()
    }

    listen() {

    }

    join(player) {
        this.players.push(player)
        this.notifyPlayerChange(player)
        player.socket.on('listGames', this.encodeGames())
        player.join(this)
        console.log(`player ${player} connected`)
    }

    leave(player) {
        this.players = this.players.filter(p => p != player)
        this.notifyPlayerChange(player)
        if (this.players.length === 0) {
            this.destroy()
        }
    }

    notifyLobbyUpdate() {
        const encodedLobby = this.encode();
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
        this.server.destroyLobby(this)
    }
}
