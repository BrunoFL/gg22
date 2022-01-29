import {GameInstance} from './GameInstance.mjs'

export class TugWar extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {Player[]}
     */
    teamA
    /**
     * @type {Player[]}
     */
    teamB
    /**
     * @type {boolean}
     */
    isEnded
    touchsA
    touchsB
    center

    constructor(lobby) {
        super()
        this.lobby = lobby
    }

    static name() {
        return 'La guerre des tugs sans haches'
    }

    encode() {
        return TugWar.name()
    }

    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', '2 équipes l\'une contre l\'autre !')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', 'Il va falloir faire preuve de coordination !')
            setTimeout(() => {
                this.lobby.emitPlayers('rules', 'ouais c\'est squid game')
                setTimeout(() => {
                    endRulesClb()
                }, 1000)
            }, 2000)
        }, 2000)
    }

    initGame() {
        let cpt = 0
        for (const player of this.lobby.players) {
            if (cpt % 2 === 0) {
                this.teamA.push(player)
            } else {
                this.teamB.push(player)
            }
            cpt++
        }
        this.isEnded = false
        this.touchsA = []
        this.touchsB = []
        this.center = 0
    }

    startGame(endStartGameClb) {
        this.updateGame()
        setTimeout(() => {
            endStartGameClb()
        }, 30_000)
    }

    onceTouch() {
        this.removeTouchs()
        for (const player of this.teamA) {
            player.socket.on('touch', time => {
                this.touchsA.push(time)
            })
        }
        for (const player of this.teamB) {
            player.socket.on('touch', time => {
                this.touchsA.push(time)
            })
        }
    }

    updateGame() {
        if (!this.isEnded) {
            this.onceTouch()
            setTimeout(() => {

                this.touchsA = []
                this.touchsB = []
                this.updateGame()
            }, 1000)
        }
    }

    removeTouchs() {
        for (const player of this.lobby.players) {
            player.socket.removeAllListeners('touch')
        }
    }

    endGame(endEndGameClb) {
        this.isEnded = true
        this.removeTouchs()
        endEndGameClb()
    }

    leaderBoard(endLeaderBoardCLb) {
        super.leaderBoard(endLeaderBoardCLb)
    }
}
