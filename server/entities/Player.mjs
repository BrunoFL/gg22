export class Player {
    id
    socket
    name
    /**
     * @type {Lobby}
     */
    lobby

    constructor(id, socket, name) {
        this.id = id
        this.socket = socket
        this.name = name
        this.listen()
    }

    join(lobby) {
        this.lobby = lobby
    }

    encode() {
        return {
            'id': this.id,
            'name': this.name
        }
    }

    listen() {
        this.socket.on('disconnecting', () => {
            console.log(`player ${this.name} disconnected`);
            if (this.lobby != null) {
                this.lobby.leave(this)
            }
        })
    }
}