export class Classement {
    player
    position
    score
    scores = [5, 3, 1]

    constructor(player, position) {
        this.player = player
        this.position = position
        this.score = this.getScore(position)
        this.player.addScore(this.score)
    }

    getScore(position) {
        if (position > 3) {
            return 0
        }
        return this.scores[position - 1]
    }

    encode() {
        return {
            'player': this.player.encode(),
            'position': this.position,
            'score': this.score
        }
    }

}
