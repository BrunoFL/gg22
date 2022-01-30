export class TeamGameResult {

    /**
    * @type {Team}
    */
    team
    /**
     * @type {boolean}
     */
    win
    /**
     * @type {number}
     */
    attributedPoints

    /**
     * @param {Team} team
     * @param {boolean} win
     */
    constructor(team, win) {
        this.team = team
        this.win = win
    }

    attributePoints() {
        if (this.win) {
            this.attributedPoints = 5
        } else {
            this.attributedPoints = 0
        }
        this.team.players.forEach(player => player.scorePoints(this.attributedPoints))
    }

    encode() {
        return {
            'team': this.team.encode(),
            'win': this.win,
            'attributedPoints': this.attributedPoints
        }
    }
}

export class TeamGameResults {

    /**
     * @type {TeamGameResult[]}
     */
    teamResults

    /**
     * @param {TeamGameResult[]} teamResults
     */
    constructor(teamResults) {
        this.teamResults = teamResults
    }

    attributePoints() {
        this.teamResults.forEach(teamResult => {
            teamResult.attributePoints()
        })
    }

    encode() {
        return this.teamResults.map(r => r.encode())
    }
}
