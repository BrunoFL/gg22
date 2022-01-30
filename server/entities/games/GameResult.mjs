import { PointScoringSystem } from "../PointScoringSystem.mjs"

export class IndividualGameResult {

    /**
     * @type {Player}
     */
    player
    /**
     * @type {number}
     */
    gameScore
    /**
     * @type {boolean}
     */
    finished

    /**
    * @type {number}
    */
    position
    /**
     * @type {number}
     */
    attributedPoints

    /**
     * 
     * @param {Player} player 
     * @param {number} gameScore
     * @param {boolean} finished 
     */
    constructor(player, gameScore, finished = true) {
        this.player = player
        this.gameScore = gameScore
        this.finished = finished
    }

    encode() {
        return {
            'player': this.player.encode(),
            'gameScore': this.gameScore,
            'position': this.position,
            'attributedPoints': this.attributePoints,
            'finished': this.finished
        }
    }

    /**
     * @param {number} position 
     */
    setPosition(position) {
        this.position = position
    }

    attributePoints() {
        this.attributedPoints = PointScoringSystem.pointsFor(this.position, this.finished)
        this.player.scorePoints(this.attributedPoints)
    }
}

export class GameResult {
    /**
     * @type {IndividualGameResult[]}
     */
    results
    /**
     * @type {boolean} 
     */

    /**
     * @param {IndividualGameResult[]} playerResults 
     * @param {boolean} invertScorePoints
     */
    constructor(playerResults, invertScorePoints = false) {
        this.results = playerResults
        this.invertScorePoints = invertScorePoints
        this.attributePoints()
    }

    attributePoints() {
        this.results = this.results
            .sort((r1, r2) => {
                if (!r1.finished) {
                    return 1
                }
                if (!r2.finished) {
                    return -1
                }
                console.log(`invertScorePoints : ${this.invertScorePoints}`)
                console.log(`r1 : ${r1.player.name} ${r1.gameScore}`);
                console.log(`r2 : ${r2.player.name} ${r2.gameScore}`);
                if (this.invertScorePoints) {
                    return r1.gameScore - r2.gameScore
                }
                return r2.gameScore - r1.gameScore
            })
        this.results
            .forEach((val, position) => {
                val.setPosition(position)
                val.attributePoints()
            })
        this.results.forEach(r=>console.log(`${r.player.name} P${r.position} : ${r.gameScore}pts`))
    }

    encode() {
        return this.results.map(r => r.encode())
    }
}