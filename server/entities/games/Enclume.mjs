import {Touch} from './Touch.mjs'
import {GameInstance} from './GameInstance.mjs'
import {GameResult, IndividualGameResult} from './GameResult.mjs'

export class Enclume extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {number}
     */
    seconds
    /**
     * @type {Touch[]}
     */
    touchs

    constructor(lobby) {
        super()
        this.lobby = lobby
    }

    /**
     * @return {string}
     */
    static name() {
        return 'Enclume'
    }

    initGame() {
        this.touchs = []
        this.seconds = Math.floor(Math.random() * 3) + 3
    }

    /**
     * @param {function} endRulesClb
     */
    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', 'Dans quelques secondes, une enclume va vous tomber sur la tete.')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', 'À vous de l\'arrêter au plus tard pour un maximum de points !')
            setTimeout(() => {
                this.lobby.emitPlayers('rules', 'Attention nous allons démarrer')
                setTimeout(() => {
                    endRulesClb()
                }, 3000)
            }, 3000)
        }, 3000)
    }

    /**
     * @param {function} endStartGameClb
     */
    startGame(endStartGameClb) {
        this.lobby.emitPlayers('startEnclume', this.seconds)
        setTimeout(() => endStartGameClb(), this.seconds * 1000 + 2000)
        for (const player of this.lobby.players) {
            player.socket.once('touch', delta => {
                player.socket.removeAllListeners('touch')
                player.socket.emit('rules', delta >= 0  ? `C'était juste ! ${delta/1000}s` : `Perdu ! de ${delta/1000}s`)
                const touch = new Touch(player, delta)
                this.lobby.emitPlayers('playerTouch', touch.encode())
                this.touchs.push(touch)
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
        setTimeout(() => endLeaderBoardCLb(), 3000)
    }

    /**
     * @return {string}
     */
    encode() {
        return Enclume.name()
    }
}
