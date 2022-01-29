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

    rules(endRulesClb) {
        this.lobby.emitPlayers('rules', 'Chacun contrôle une direction du personnage, évitez les obstacles peuplant le chemin et vous aurez gagné !')
        setTimeout(() => endRulesClb(), 5000)
    }

    initGame() {
        for (const player of this.lobby.players) {

        }
    }

    startGame(endStartGameClb) {
        for (const player of this.lobby.players) {
            player.socket.on('interactWithCharacter', () => {
                socket.emit('updateCharacterPos', this.updateCharacterPos())
            })
        }
    }

    endGame(endEndGameClb) {
        super.endGame(endEndGameClb)
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