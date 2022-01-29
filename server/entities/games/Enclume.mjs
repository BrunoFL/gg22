import {Touch} from './Touch.mjs'
import {Classement} from './Classement.mjs'
import {GameInstance} from './GameInstance.mjs'

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

    start() {
        this.lobby.emitPlayers('rules', 'Dans quelques secondes, une enclume va vous tomber sur la tete. À vous de l\'arreter au plus tard pour un maximum de points !')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', 'Attention nous allons démarrer')
            setTimeout(() => {
                this.timer()
            }, 2000)
        }, 5000)
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
        setTimeout(() => this.leaderBoard(), 3000)
    }

    leaderBoard() {
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
