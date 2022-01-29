import {Touch} from './Touch.mjs'
import {Classement} from './Classement.mjs'

export class Enclume {
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
        this.lobby = lobby
    }

    start() {
        this.lobby.emitPlayers('rules', 'Dans quelques secondes, une enclume va vous tomber sur la tête. À vous de l\'arrêter au plus tard pour un maximum de points !')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', 'Attention nous allons démarrer')
            setTimeout(() => {
                this.timer()
            }, 2000)
        }, 5000)
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

    startGame() {
        this.seconds = Math.floor(Math.random() * 7) + 3
        this.lobby.emitPlayers('startEnclume', this.seconds)
        setTimeout(() => this.endGame(), this.seconds + 2000)
        for (const player of this.lobby.players) {
            player.socket.on('touch', delta => {
                player.socket.off('touch')
                const touch = new Touch(player, delta)
                this.lobby.emitPlayers('playerTouch', touch)
                this.touchs.push(touch)
            })
        }
    }

    endGame() {
        for (const player of this.lobby.players) {
            player.socket.off('touch')
        }
        setTimeout(() => this.showResults(), 3000)
    }

    showResults() {
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
        const touchsSorted = this.touchs.sort((touchA, touchB) => touchB.delta - touchA.delta)
        const leaderBoard = []
        let position = 1
        for (const board of touchsSorted) {
            leaderBoard.push(new Classement(board.player, position))
            position++
        }
        this.lobby.emitPlayers('leaderBoardGame', leaderBoard)
    }
}
