import {Team} from '../Team.mjs'
import {TeamGameResult, TeamGameResults} from '../TeamGameResults.mjs'
import {GameInstance} from './GameInstance.mjs'

export class TugWar extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {Team}
     */
    teamA
    /**
     * @type {Team}
     */
    teamB
    /**
     * @type {boolean}
     */
    isEnded
    /**
     * @type {number[]}
     */
    touchsA
    /**
     * @type {number[]}
     */
    touchsB
    /**
     * @type {number}
     */
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
        let cpt = 0
        this.teamA = new Team('Team A')
        this.teamB = new Team('Team B')
        for (const player of this.lobby.players) {
            if (cpt % 2 === 0) {
                this.teamA.addPlayer(player)
            } else {
                this.teamB.addPlayer(player)
            }
            cpt++
        }
        this.lobby.emitPlayers('tugInit', this.encodeTeams())
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
        this.isEnded = false
        this.touchsA = []
        this.touchsB = []
        this.center = 0
    }

    startGame(endStartGameClb) {
        this.onceTouchTeamA(endStartGameClb)
        this.onceTouchTeamB(endStartGameClb)
        this.lobby.emitPlayers('tugStart', null)
        setTimeout(() => {
            endStartGameClb()
        }, 30_000)
    }

    onceTouchTeamA(endStartGameClb) {
        this.touchsA = []
        for (const player of this.teamA.players) {
            player.socket.once('touch', time => {
                this.touchsA.push(time)
                if (this.touchsA.length === this.teamA.players.length) {
                    const etendue = this.getEtendue(this.touchsA)
                    this.center -= etendue
                    this.lobby.emitPlayers('tug', this.center)
                    if (this.center <= -30) {
                        endStartGameClb()
                    } else {
                        this.onceTouchTeamA(endStartGameClb)
                    }
                }
            })
        }
    }

    onceTouchTeamB(endStartGameClb) {
        this.touchsB = []
        for (const player of this.teamB.players) {
            player.socket.once('touch', time => {
                this.touchsB.push(time)
                if (this.touchsB.length === this.teamB.players.length) {
                    const etendue = this.getEtendue(this.touchsB)
                    this.center += etendue
                    this.lobby.emitPlayers('tug', this.center)
                    if (this.center >= 30) {
                        endStartGameClb()
                    } else {
                        this.onceTouchTeamB(endStartGameClb)
                    }
                }
            })
        }
    }

    getEtendue(values) {
        let min = values[0]
        let max = values[0]
        for (const val of values) {
            if (val < min) {
                min = val
            }
            if (val > max) {
                max = val
            }
        }
        const etendue = 3 - (max - min) / 1000
        return Math.max(etendue, 0)
    }

    removeTouchs() {
        for (const player of this.lobby.players) {
            player.socket.removeAllListeners('touch')
        }
    }

    endGame(endEndGameClb) {
        if (!this.isEnded) {
            this.lobby.emitPlayers('tugEnd', null)
            this.isEnded = true
            this.removeTouchs()
            endEndGameClb()
        }
    }

    leaderBoard(endLeaderBoardCLb) {
        const gameResults = new TeamGameResults([
            new TeamGameResult(this.teamA, this.center < 0),
            new TeamGameResult(this.teamB, this.center > 0)
        ])
        gameResults.attributePoints()
    }

    encodeTeams() {
        return {
            'teamA': this.teamA.encode(),
            'teamB': this.teamA.encode()
        }
    }
}
