export class GameManager {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {GameInstance}
     */
    game

    /**
     * @param {Lobby} lobby
     */
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
                    this.game.startGame(() => {
                        this.endGame()
                    })
                }, 1000)
            }, 1000)
        }, 1000)
    }

    /**
     * @param {GameInstance} game
     */
    runGame(game) {
        this.game = game
        this.game.rules(() => {
            this.game.initGame()
            this.timer()
        })
    }

    endGame() {
        this.game.endGame(() => {
            this.game.leaderBoard(() => {
                this.lobby.listGames()
            })
        })
    }
}
