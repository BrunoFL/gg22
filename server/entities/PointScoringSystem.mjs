export class PointScoringSystem {

    static pointScoringSystem = [10, 6, 4, 3, 2, 1]

    /**
     * @param {number} position 
     * @param {boolean} finished 
     * @returns {number}
     */
    static pointsFor(position, finished) {
        if (position > PointScoringSystem.pointScoringSystem.length || !finished) {
            return 0
        }
        return PointScoringSystem.pointScoringSystem[position]
    }
}
