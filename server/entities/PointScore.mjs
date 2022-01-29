export class PointScore {
    player
    position
    score
    finished

    pointScoringSystem = [10, 6, 4, 3, 2, 1]

    constructor(player, position, finished) {
        this.player = player
        this.position = position
        this.finished = finished
        this.score = this.getScore(position)
        this.player.addScore(this.score)
    }

    static pointsFor(player, position) {
        return new PointScore(player, position, true)
    }

    static pointsForNonFinisher(player, position) {
        return new PointScore(player, position, true)
    }

    getScore(position) {
        if (position > this.scores.length || !this.finished) {
            return 0
        }
        return this.pointScoringSystem[position - 1]
    }

    encode() {
        return {
            'player': this.player.encode(),
            'position': this.position,
            'score': this.score
        }
    }

}
