import {GameInstance} from './GameInstance.mjs'

export class TugWar extends GameInstance {

    static name() {
        return 'La guerre des tugs sans haches'
    }

    encode() {
        return TugWar.name()
    }

    rules(endRulesClb) {
        super.rules(endRulesClb)
    }

    initGame() {
        super.initGame()
    }

    startGame(endStartGameClb) {
        super.startGame(endStartGameClb)
    }

    endGame(endEndGameClb) {
        super.endGame(endEndGameClb)
    }

    leaderBoard(endLeaderBoardCLb) {
        super.leaderBoard(endLeaderBoardCLb)
    }
}
