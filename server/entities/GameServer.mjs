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
     * @param {Emitter} io
     */
    constructor(io) {
        this.io = io
        this.lobbies = []
        this.listen()
    }

    listen() {
        this.io.on('connection', socket => {
            const player = new Player(UUIDGenerator.uuid, socket, socket.id)
            socket.on('createLobby', lobbyName => {
                console.log(`create lobby ${lobbyName}`)
                const lobby = new Lobby(this.io, this, lobbyName)
                this.lobbies.push(lobby)
                lobby.join(player)
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
        })
    }

    /**
     * @param {Lobby} lobby
     */
    destroyLobby(lobby) {
        this.lobbies = this.lobbies.filter(l => l.id !== lobby.id)
        this.io.emit('listLobbies', this.openLobbies())
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

    updateCharacterPos() {
        return {'pos_x': 3, 'pos_y': 5}
    }
}
