export class Game {
    lobby

    constructor(lobby) {
        this.lobby = lobby
    }


    timer() {
        this.lobby.emitPlayers('rules', '3')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', '2')
            setTimeout(() => {
                this.lobby.emitPlayers('rules', '1')
                setTimeout(() => {
                    this.startGame()
                }, 1000)
            }, 1000)
        }, 1000)
    }

}
