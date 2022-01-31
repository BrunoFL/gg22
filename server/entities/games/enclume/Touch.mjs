export class Touch {
    player
    delta

    constructor(player, delta) {
        this.player = player
        this.delta = delta
    }

    /**
     * @return {object}
     */
    encode() {
        return {
            'player': this.player.encode(),
            'delta': this.delta
        }
    }
}
