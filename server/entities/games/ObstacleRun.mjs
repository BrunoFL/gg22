import {GameInstance} from './GameInstance.mjs'
import {GameResult, IndividualGameResult} from './GameResult.mjs'
import { Obstacle } from './Obstacle.mjs'

export class ObstacleRun extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby

    /**
     * @type {Map}
     */
    teams

    /**
     * @type {Map}
     */
     affectations

    /**
     * @type {number}
     */
    character1Pos

    /**
     * @type {number}
     */
    character2Pos

    /**
     * @type {Obstacle[]}  
     */
    obstacles
    /**
     * @type {boolean}
     */
     isEnded

    constructor(lobby) {
        super()
        this.lobby = lobby
        this.character1Pos = 0
        this.character2Pos = 0
        this.obstacles = []
    }

    /**
     * @return {string}
     */
     static name() {
        return 'Course d\'obstacle'
    }

    initGame() {
        this.teams = new Map()
        this.affectations = new Map()
        var direction1 = 0
        var direction2 = 0
        var toggle = false
        for (const player of this.lobby.players) {
            if (toggle) {
                this.teams.set(player.id, 1)
                this.affectations.set(player.id, direction1)
                ++direction1
                toggle = false
            } else {
                this.teams.set(player.id, 2)
                this.affectations.set(player.id, direction2)
                ++direction2
                toggle = true
            }
        }
        this.isEnded = false
    }

    /**
     * @param {function} endRulesClb
     */
    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', 'Chacun contrôle une direction du personnage, évitez les obstacles peuplant le chemin et vous aurez gagné !')
        setTimeout(() => {
            this.lobby.emitPlayers('rules', 'Attention nous allons démarrer')
            setTimeout(() => {
                endRulesClb()
            }, 2000)
        }, 5000)
    }

    /**
     * @param {function} endRulesClb
     */
    startGame(endStartGameClb) {
        //start game
        for (const player of this.lobby.players) {
            var data = {
                'team': this.teams.get(player.id),
                'direction': this.affectations.get(player.id)
            }
            console.log(data)
            player.emit('startObstacleRun', data)
        }

        //update data
        this.updateObstaclePos()
        this.addObstacle()

        //update character position
        for (const player of this.lobby.players) {
            player.socket.on('interactWithCharacter', () => {
                this.lobby.emitPlayers('updateCharacterPos', {'position': this.updateCharacterPos(player.id), 'team': this.teams.get(player.id)})
            })
        }
        setTimeout(() => endStartGameClb(), 6_000)
    }

    /**
     * @param {function} endEndGameClb
     */
    endGame(endEndGameClb) {
        if (!this.isEnded) {
            this.isEnded = true
            for (const player of this.lobby.players) {
                player.socket.removeAllListeners('interactWithCharacter')
            }
            setTimeout(() => endEndGameClb(), 3000)
        }
    }

    /**
     * @param {function} endLeaderBoardCLb
     */
     leaderBoard(endLeaderBoardCLb) {
        const res = []
        /*for (const [id, score] of this.responses.entries()) {
            const player = this.lobby.getPlayerById(id)
            res.push(new IndividualGameResult(player, score))
        }*/

        const gameResults = new GameResult(res)
        this.lobby.emitPlayers('leaderBoardGame', gameResults.encode())
        endLeaderBoardCLb()
    }

    updateCharacterPos(playerId) {
        if (this.teams.get(playerId) == 1) { //team 1
            if (this.affectations.get(playerId) == 0) { // direction up
                this.character1Pos += 10;
            } else { // direction down
                this.character1Pos -= 10;
            }
            return this.character1Pos
        }
        //team 2
        if (this.affectations.get(playerId) == 0) { // direction up
            this.character2Pos += 10;
        } else { // direction down
            this.character2Pos -= 10;
        }
        return this.character2Pos

    }

    updateObstaclePos() {
        if (!this.isEnded){
        setTimeout(() => {
            for (const obstacle of this.obstacles) {
                obstacle.position.x += obstacle.speed * obstacle.direction
                obstacle.updateStyle()
            }
            this.lobby.emitPlayers('updateObstacles', this.obstacles)
            this.updateObstaclePos()
        }, 200)
    }
    }
    
    addObstacle() {
        if (!this.isEnded){
        setTimeout(() => {
            this.obstacles.push(new Obstacle())
            this.lobby.emitPlayers('updateObstacles', this.obstacles)
            this.addObstacle()
        }, (Math.random() * 1000) + 500)
    }
}

    /**
     * @return {string}
     */
    encode() {
        return ObstacleRun.name()
    }
}
