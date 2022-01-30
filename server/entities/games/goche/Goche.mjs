import {GameInstance} from '../GameInstance.mjs'
import {GameResult, IndividualGameResult} from '../GameResult.mjs'
import {Proposition} from './Proposition.mjs'

export class Goche extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {number}
     */
    seconds
    /**
     * @type {Map}
     */
    responses
    /**
     * @type {number}
     */
    responsesRun
    /**
     * @param {Proposition[]}
     */
    proposition = [
        new Proposition('1', 1),
        new Proposition('1', 0),
    ]
    /**
     * @param {number}
     */
    cpt

    constructor(lobby) {
        super()
        this.lobby = lobby
    }

    /**
     * @return {string}
     */
    static name() {
        return 'Gôche Droate'
    }

    initGame() {
        this.responses = new Map()
        this.cpt = 0
        this.responsesRun = 0
        for (const player of this.lobby.players) {
            this.responses.set(player.id, 0)
        }
    }

    /**
     * @param {function} endRulesClb
     */
    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', 'Il faut simplement deviner si les propositions sont de Gôche ou de Droate')
        setTimeout(() => {
            endRulesClb()
        }, 3000)
    }

    /**
     * @param {function} endStartGameClb
     */
    startGame(endStartGameClb) {
        this.responsesRun = 0
        const proposition = this.proposition[this.cpt]
        this.lobby.emitPlayers('question', proposition)
        for (const player of this.lobby.players) {
            player.socket.once('touch', response => {
                this.responsesRun++
                const value = this.responses.get(player.id)
                this.responses.set(player.id, proposition.res === response ? value + 1 : value)
                if (this.cpt === 5) {
                    endStartGameClb()
                } else if (this.responsesRun === this.lobby.players.length) {
                    this.startGame(endStartGameClb)
                }
            })
        }
    }

    /**
     * @param {function} endEndGameClb
     */
    endGame(endEndGameClb) {
        for (const player of this.lobby.players) {
            player.socket.removeAllListeners('touch')
        }
        setTimeout(() => endEndGameClb(), 3000)
    }

    /**
     * @param {function} endLeaderBoardCLb
     */
    leaderBoard(endLeaderBoardCLb) {
        for (const player of this.lobby.players) {
            let isPresent = false
            for (const touch of this.touchs) {
                if (touch.player.id === player.id) {
                    isPresent = true
                }
            }
            if (!isPresent) {
                this.touchs.push(new Touch(player, -Infinity))
            }
        }

        const gameResults = new GameResult(
            this.touchs.map(touch => new IndividualGameResult(touch.player, touch.delta, touch.delta >= 0))
        )
        this.lobby.emitPlayers('leaderBoardGame', gameResults.encode())
        endLeaderBoardCLb()
    }

    /**
     * @return {string}
     */
    encode() {
        return Goche.name()
    }
}
