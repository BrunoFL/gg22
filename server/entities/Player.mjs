import { UUIDGenerator } from "../utils/UUIDGenerator.mjs"

export class Player {
    id
    socket
    name
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {number}
     */
    score
    /**
     * @type {boolean}
     */
    isAdmin

    constructor(id, socket, name) {
        this.id = UUIDGenerator.uuid()
        this.socket = socket
        this.name = name
        this.isAdmin = false
        this.resetScore()
        this.listen()
    }

    join(lobby) {
        this.lobby = lobby
        this.resetScore()
    }

    resetScore() {
        this.score = 0
    }

    encode() {
        return {
            'id': this.id,
            'name': this.name,
            'score': this.score,
            'isAdmin': this.isAdmin
        }
    }

    listen() {
        this.socket.on('disconnecting', () => {
            console.log(`player ${this.name} disconnected`)
            if (this.lobby != null) {
                this.lobby.leave(this)
            }
        })

        this.socket.on('getLobby', () => {
            this.emit('updateLobby', this.lobby.encode())
        })

        this.socket.on('updateName', name => {
            this.name = name
            if (this.lobby) {
                this.emit('updateLobby', this.lobby.encode())
            }
        })
    }

    leave() {
        this.isAdmin = false
    }

    emit(event, content) {
        this.socket.emit(event, content)
    }

    setAdmin(isAdmin) {
        this.isAdmin = isAdmin
    }

    addScore(score) {
        this.score += score
    }
}
