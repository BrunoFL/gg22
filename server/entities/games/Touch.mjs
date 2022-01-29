export class Touch {
    player
    delta

    constructor(player, delta) {
        this.player = player
        this.delta = delta
    }

    setDelta(delta) {
        this.delta = delta
    }

    encode() {
        return {
            'player': this.player.encode(),
            'delta': this.delta
        }
    }
}
