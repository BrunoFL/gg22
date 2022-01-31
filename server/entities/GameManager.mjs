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
     * @type {boolean}
     */
    running

    /**
     * @param {Lobby} lobby
     */
    constructor(lobby) {
        this.lobby = lobby
        this.running = false
    }

    timer() {
        this.lobby.emitPlayers('rules', '3')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', '2')
            setTimeout(() => {
                this.lobby.emitPlayers('rules', '1')
                setTimeout(() => {
                    this.lobby.emitPlayers('rules', 'C\'est parti !')
                    this.lobby.emitPlayers('startGame', null)
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
        if (!this.running) {
            this.game = game
            this.running = true
            console.log(`Start game ${this.game.encode()}`)
            this.lobby.emitPlayers('gameStarted', this.game.encode())
            this.game.rules(() => {
                this.game.initGame()
                this.timer()
            })
        }
    }

    endGame() {
        console.log(`Ending game ${this.game.encode()}`)
        this.game.endGame(() => {
            console.log(`LeaderBoard game ${this.game.encode()}`)
            this.game.leaderBoard(() => {
                setTimeout(() => {
                    this.lobby.leaderBoardGeneral()
                    setTimeout(() => {
                        console.log(`End game ${this.game.encode()}`)
                        this.running = false
                        this.lobby.listGames()
                    }, 8000)
                }, 8000)
            })
        })
    }
}
