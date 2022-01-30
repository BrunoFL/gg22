export class Obstacle {
    position
    direction
    speed

    constructor() {
        this.position = {
            'x': 0,
            'y': Math.floor(Math.random() * 100)
        }
        this.speed = 4 + Math.floor(Math.random() * 3)
        this.direction = Math.random() < 0.5 ? 1 : -1
    }

    moveForward() {
        position.x += (speed * direction)
    }

    /**
     * @return {object}
     */
    encode() {
        return {
            'posX': this.position.x,
            'posY': this.position.y
        }
    }
}