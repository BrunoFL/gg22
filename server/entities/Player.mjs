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

    constructor(id, socket, name) {
        this.id = id
        this.socket = socket
        this.name = name
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
            'score': this.score
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
            if (this.lobby){
                this.emit('updateLobby', this.lobby.encode())
            }
        })
    }

    emit(event, content) {
        this.socket.emit(event, content)
    }
}
