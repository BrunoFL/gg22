export class Team {

    /**
     * @type {string}
     */
    name
    /**
     * @param {Player[]} 
     */
    players

    /**
     * @param {string} name 
     */
    constructor(name) {
        this.name = name
        this.players = []
    }

    /**
     * @param {Player} player 
     */
    addPlayer(player) {
        this.players.push(player)
    }

    encode() {
        return {
            'name': this.name,
            'players': this.players.map(p=>p.encode())
        }
    }
}