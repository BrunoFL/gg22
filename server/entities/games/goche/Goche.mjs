import {GameInstance} from '../GameInstance.mjs'
import {GameResult, IndividualGameResult} from '../GameResult.mjs'
import {Proposition} from './Proposition.mjs'

export class Goche extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby
    /**
     * @type {number}
     */
    seconds
    /**
     * @type {Map}
     */
    responses
    /**
     * @type {number}
     */
    responsesByRun
    /**
     * @type {number}
     */
    run
    /**
     * res == 0 de goche
     * res == 1 de droate
     * @param {Proposition[]}
     */
    propositions = [
        new Proposition('Le barbecue', 0),
        new Proposition('Relocaliser', 0),
        new Proposition('Le djembé', 0),
        new Proposition('Le train', 0),
        new Proposition('Flexio', 0),
        new Proposition('Besançon', 0),
        new Proposition('Pierre Martinez', 0),
        new Proposition('Les impôts', 0),
        new Proposition('La rando', 0),
        new Proposition('Les jeux vidéo', 0),
        new Proposition('Julien Bernard', 0),
        new Proposition('Le PMU', 0),
        new Proposition('LA LUTTE DES CLASSES', 0),
        new Proposition('Le RSA jeunes', 0),
        new Proposition('Les anti-vaxx', 0),
        new Proposition('Twitter', 0),
        new Proposition('Tryo', 0),
        new Proposition('Twingo', 0),
        new Proposition('Le foot', 0),
        new Proposition('Les apéritifs dinatoires', 1),
        new Proposition('Le cigare', 1),
        new Proposition('Jeanne', 1),
        new Proposition('La global game jam', 1),
        new Proposition('Les jupes fuseau', 1),
        new Proposition('Yannick Jadot', 1),
        new Proposition('Le nucléaire', 1),
        new Proposition('Léa Salamé', 1),
        new Proposition('Manuel Valls', 1),
        new Proposition('JDG', 1),
        new Proposition('L\'informatique', 1),
        new Proposition('Bouter l\'envahisseur hors de France', 1),
        new Proposition('La campagne', 1),
        new Proposition('La fierté française', 1),
        new Proposition('Les dividendes', 1),
        new Proposition('Le salaire à vie', 1),
        new Proposition('La voiture électrique', 1),
        new Proposition('La zoubida', 1),
        new Proposition('Les allemands', 1),
    ]

    constructor(lobby) {
        super()
        this.lobby = lobby
    }

    /**
     * @return {string}
     */
    static name() {
        return 'Gôche Droate'
    }

    initGame() {
        this.responses = new Map()
        this.run = 0
        this.responsesByRun = 0
        for (const player of this.lobby.players) {
            this.responses.set(player.id, 0)
        }
    }

    /**
     * @param {function} endRulesClb
     */
    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', 'Il faut simplement deviner si les propositions sont de Gôche ou de Droate')
        setTimeout(() => {
            endRulesClb()
        }, 3000)
    }

    /**
     * @param {function} endStartGameClb
     */
    startGame(endStartGameClb) {
        this.responsesByRun = 0
        this.run++
        if (Math.random() < 0.2) {
            const index = Math.floor(Math.random() * this.lobby.players.length)
            this.lobby.emitPlayers('rules', `Il semblerait que ${this.lobby.players[index].name} soit de droite ...`)
        }
        const index = Math.floor(Math.random() * this.propositions.length)
        const proposition = this.propositions[index]
        this.lobby.emitPlayers('question', proposition)
        for (const player of this.lobby.players) {
            player.socket.once('touch', response => {
                this.responsesByRun++
                const value = this.responses.get(player.id)
                this.responses.set(player.id, proposition.res === response ? value + 1 : value)
                if (this.run >= 5) {
                    endStartGameClb()
                } else if (this.responsesByRun === this.lobby.players.length) {
                    this.startGame(endStartGameClb)
                }
            })
        }
    }

    /**
     * @param {function} endEndGameClb
     */
    endGame(endEndGameClb) {
        for (const player of this.lobby.players) {
            player.socket.removeAllListeners('touch')
        }
        setTimeout(() => endEndGameClb(), 3000)
    }

    /**
     * @param {function} endLeaderBoardCLb
     */
    leaderBoard(endLeaderBoardCLb) {
        const res = []
        for (const [id, score] of this.responses.entries()) {
            const player = this.lobby.getPlayerById(id)
            res.push(new IndividualGameResult(player, score))
        }

        const gameResults = new GameResult(res)
        this.lobby.emitPlayers('leaderBoardGame', gameResults.encode())
        endLeaderBoardCLb()
    }

    /**
     * @return {string}
     */
    encode() {
        return Goche.name()
    }
}
