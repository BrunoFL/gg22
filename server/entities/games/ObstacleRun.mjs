import {GameInstance} from './GameInstance.mjs'

export class ObstacleRun extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby

    /**
     * @type {Map}
     */
    affectations

    characterPos

    constructor(lobby) {
        super()
        this.lobby = lobby
        this.characterPos = {'pos_x': 0, 'pos_y': 0}
    }

    /**
     * @return {string}
     */
     static name() {
        return 'Course d\'obstacle'
    }

    initGame() {
        this.affectations = new Map()
        var direction = 0//0 = right, 1 = left, 2 = up, 3 = down
        for (const player of this.lobby.players) {
            this.affectations.set(player.id, direction)
            ++direction
        }
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
        this.lobby.emitPlayers('startObstacleRun')
        for (const player of this.lobby.players) {
            player.socket.on('interactWithCharacter', () => {
                this.lobby.emitPlayers('updateCharacterPos', this.updateCharacterPos(player.id))
            })
        }
    }

    endGame(endEndGameClb) {
        for (const player of this.lobby.players) {
            player.socket.removeAllListeners('interactWithCharacter')
        }
        setTimeout(() => endEndGameClb(), 2000)
    }

    leaderBoard(endLeaderBoardClb) {
        super.leaderBoard(endLeaderBoardClb)
    }

    updateCharacterPos(playerId) {
        switch (this.affectations.get(playerId)) {
            case 0: //right
                this.characterPos.pos_x += 5
                break;
            case 1: //left
                this.characterPos.pos_x -= 5
                break;
            case 2: //top
                this.characterPos.pos_y += 5
                break;
            case 3: //down
                this.characterPos.pos_y -= 5
                break;
            default:
                break;
        }
        return this.characterPos
    }
    /**
     * @return {string}
     */
    encode() {
        return ObstacleRun.name()
    }
}