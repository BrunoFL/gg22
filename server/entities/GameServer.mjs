import {UUIDGenerator} from '../utils/UUIDGenerator.mjs'
import {Lobby} from './Lobby.mjs'
import {Player} from './Player.mjs'

export class GameServer {
    /**
     * @type {Emitter}
     */
    io
    /**
     * @type {Lobby[]}
     */
    lobbies
    /**
     * {Player[]}
     */
    players

    /**
     * @param {Emitter} io
     */
    constructor(io) {
        this.io = io
        this.lobbies = []
        this.players = []
        this.listen()
    }

    listen() {
        this.io.on('connection', socket => {
            const player = new Player(UUIDGenerator.uuid, socket, socket.id)
            this.players.push(player)
            socket.on('createLobby', lobbyName => {
                console.log(`create lobby ${lobbyName}`)
                const lobby = new Lobby(this.io, this, lobbyName)
                this.lobbies.push(lobby)
                lobby.join(player)
                this.players = this.players.filter(p => p.id !== player.id)
                this.emitListLobbies()
            })

            socket.on('getLobbies', () => {
                socket.emit('listLobbies', this.encodeLobbies())
            })

            socket.on('joinLobby', lobbyId => {
                if (!player.lobby) {
                    for (const lobby of this.lobbies) {
                        if (lobbyId === lobby.id) {
                            lobby.join(player)
                        }
                    }
                }
            })

            socket.on('joinById', id => {
                for (const lobby of this.lobbies) {
                    lobby.joinById(id)
                }
            })
        })
    }

    /**
     * @param {Lobby} lobby
     */
    destroyLobby(lobby) {
        this.lobbies = this.lobbies.filter(l => l.id !== lobby.id)
        this.emitListLobbies()
    }

    /**
     * @return {object[]}
     */
    openLobbies() {
        return this.lobbies
            .filter(lobby => lobby.isOpen)
            .map(lobby => lobby.encode())
    }

    /**
     * @return {object[]}
     */
    encodeLobbies() {
        return this.lobbies.map(l => l.encode())
    }

    emitListLobbies() {
        for (const player of this.players) {
            player.socket.emit('listLobbies', this.encodeLobbies())
        }
    }
}
