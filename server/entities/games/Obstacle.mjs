import {UUIDGenerator} from '../../utils/UUIDGenerator.mjs'

export class Obstacle {
    id
    position
    direction
    speed
    style

    constructor() {
        this.id = UUIDGenerator.uuid()
        this.position = {
            'x': 530,
            'y': Math.floor(Math.random() * 700)
        }
        this.speed = 4 + Math.floor(Math.random() * 3)
        this.direction = Math.random() < 0.5 ? 1 : -1
        this.style = {
            top: this.position.y + 'px',
            right: this.position.x + 'px'
        }
    }

    updateStyle() {
        this.style = {
            top: this.position.y + 'px',
            right: this.position.x + 'px'
        }
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
