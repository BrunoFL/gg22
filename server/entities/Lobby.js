import {Player} from "./Player.js";

export class Lobby {
    /**
     * @type {Emitter} 
     */
    io
    players
    id

    /**
     * @param {Emitter} io 
     */
    constructor(io) {
        this.io = io
        this.players = []
        this.listen()
        this.id = Math.random()
    }

    listen() {
        this.io.on('connection', socket => {
            const player = new Player(Math.random(), socket, socket.id)
            this.join(player)
        })
    }

    join(player) {
        this.players.push(player)
        this.notifyPlayerChange(player)
        player.join(this)
        console.log(`player ${player} connected`);
    }

    leave(player) {
        this.players = this.players.filter(p => p != player)
        this.notifyPlayerChange(player)
        if (this.players.length === 0) {
            this.destroy()
        }
    }

    notifyPlayerChange(player) {
        this.io.emit('updateClients', this.encodePlayers())
    }

    encodePlayers() {
        return this.players.map(p => p.encode())
    }

    encode() {
        return {
            'id': this.id,
            'players': this.encodePlayers()
        }
    }

    destroy() {
        this.server.destroyLobby(this)
    }
}
