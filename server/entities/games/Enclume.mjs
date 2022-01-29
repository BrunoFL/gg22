import { Touch } from './Touch.mjs'
import { Touch } from './Touch.mjs'
import { GameInstance } from './GameInstance.mjs'
import { GameResult, IndividualGameResult } from './GameResult.mjs'

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

    initGame() {
        this.touchs = []
        this.seconds = Math.floor(Math.random() * 7) + 3
    }

    /**
     * @param {function} endRulesclb
     */
    rules(endRulesclb) {
        this.lobby.emitPlayers('rules', 'Dans quelques secondes, une enclume va vous tomber sur la tete. À vous de l\'arreter au plus tard pour un maximum de points !')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', 'Attention nous allons démarrer')
            setTimeout(() => {
                endRulesclb()
            }, 2000)
        }, 5000)
    }

    /**
     * @param {function} endStartGameClb
     */
    startGame(endStartGameClb) {
        this.lobby.emitPlayers('startEnclume', this.seconds)
        setTimeout(() => endStartGameClb(), this.seconds + 2000)
        for (const player of this.lobby.players) {
            player.socket.on('touch', delta => {
                player.socket.off('touch')
                const touch = new Touch(player, delta)
                this.lobby.emitPlayers('playerTouch', touch)
                this.touchs.push(touch)
            })
        }
    }

    /**
     * @param {function} endEndGameClb
     */
    endGame(endEndGameClb) {
        for (const player of this.lobby.players) {
            player.socket.off('touch')
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
            this.touchs.map(touch => {
                new IndividualGameResult(touch.player, touch.delta, touch.delta >= 0)
            })
        )
        this.lobby.emitPlayers('leaderBoardGame', gameResults.encode())
        setTimeout(() => endLeaderBoardCLb(), 3000)
    }
}
