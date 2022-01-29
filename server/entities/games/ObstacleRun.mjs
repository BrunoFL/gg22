import {GameInstance} from './GameInstance.mjs'

export class ObstacleRun extends GameInstance {
    /**
     * @type {Lobby}
     */
    lobby

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
        for (const player of this.lobby.players) {

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
                this.lobby.emitPlayers('updateCharacterPos', this.updateCharacterPos())
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

    updateCharacterPos() {
        console.log('recu')
        ++this.characterPos.pos_x
        ++this.characterPos.pos_y
        return this.characterPos
    }
}