import {GameInstance} from './GameInstance.mjs'
import {GameResult, IndividualGameResult} from './GameResult.mjs'

export class HundredMetersClick extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {Map}
     */
    meters
    /**
     * @type {Boolean}
     */
    isEnded

    constructor(lobby) {
        super()
        this.lobby = lobby
    }

    /**
     * @return {string}
     */
    static name() {
        return '100 mètre clic'
    }

    /**
     * @param {function} endRulesClb
     */
    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', 'Dans le cent metre clic, le premier à cliquer 100 fois gagne !')
        setTimeout(() => endRulesClb(), 5000)
    }

    initGame() {
        this.meters = new Map()
        for (const player of this.lobby.players) {
            this.meters.set(player.id, 0)
        }
        this.isEnded = false
    }

    /**
     * @param {function} endStartGameClb
     */
    startGame(endStartGameClb) {
        for (const player of this.lobby.players) {
            this.lobby.emitPlayers('rules', 'C\'est parti')
            this.lobby.emitPlayers('startRun', null)
            player.socket.on('touch', () => {
                const value = this.meters.get(player.id)
                if (value === 99) {
                    player.socket.removeAllListeners('touch')
                    this.offTouch()
                    endStartGameClb()
                }
                if (value < 100) {
                    this.meters.set(player.id, value + 1)
                    this.lobby.emitPlayers('100meters', this.encodeMeters())
                }
            })
        }
        setTimeout(() => {
            endStartGameClb()
        }, 10_000)
    }

    /**
     * @param {function} endEndGameClb
     */
    endGame(endEndGameClb) {
        if (!this.isEnded) {
            this.offTouch()
            endEndGameClb()
        }
    }

    offTouch() {
        for (const player of this.lobby.players) {
            player.socket.removeAllListeners('touch')
        }
    }

    /**
     * @param {function} endLeaderBoardCLb
     */
    leaderBoard(endLeaderBoardCLb) {
        const gameResults = new GameResult(
            this.meters.map((meters, player) => new IndividualGameResult(player, meters))
        )
        this.lobby.emitPlayers('leaderBoardGame', gameResults.encode())
        setTimeout(() => endLeaderBoardCLb(), 3000)
    }

    /**
     * @return {object[]}
     */
    encodeMeters() {
        const res = []
        for (const [key, value] of this.meters) {
            res.push({'id': key, 'meter': value})
        }
        return res
    }

    /**
     * @return {string}
     */
    encode() {
        return HundredMetersClick.name()
    }
}
