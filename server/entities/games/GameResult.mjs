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
        this.attributePoints = PointScoringSystem.pointsFor(this.position, this.finished)
    }
}

export class GameResult {
    /**
     * @type {IndividualGameResult[]}
     */
    results

    /**
     * @param {IndividualGameResult[]} playerResults 
     */
    constructor(playerResults) {
        this.results = playerResults
        this.attributedPoints()
    }

    attributePoints() {
        this.results
            .sort((r1, r2) => {
                if (!r1.finished) {
                    return 1
                }
                if (!r2.finished) {
                    return -1
                }
                return r1.gameScore - r2.gameScore
            })
            .forEach((val, position) => {
                val.setPosition(position + 1)
                val.attributePoints()
            })
    }

    encode() {
        return this.results.map(r => r.encode())
    }
}