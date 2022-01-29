import {UUIDGenerator} from '../utils/UUIDGenerator.mjs'

export class Player {
    /**
     * @type {string}
     */
    id
    socket
    /**
     * @type {string}
     */
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
        this.socket.emit('setId', this.id)
    }

    join(lobby) {
        this.lobby = lobby
        this.resetScore()
    }

    resetScore() {
        this.score = 0
    }

    /**
     * @param {number} points 
     */
    scorePoints(points) {
        this.score += points
    }

    /**
     * @return {object}
     */
    encode() {
        return {
            'id': this.id,
            'name': this.name,
            'socketId': this.socket.id,
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

    /**
     * @param {string} event
     * @param {object} content
     */
    emit(event, content) {
        this.socket.emit(event, content)
    }

    /**
     * @param {boolean} isAdmin
     */
    setAdmin(isAdmin) {
        this.isAdmin = isAdmin
    }

    /**
     * @param {number} score
     */
    addScore(score) {
        this.score += score
    }

    reconnect(socket) {
        this.socket = socket
    }
}
