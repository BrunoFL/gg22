export class Proposition {
    name
    res

    /**
     * @param {string} name
     * @param {number} res
     */
    constructor(name, res) {
        this.name = name
        this.res = res
    }

    encode() {
        return {
            'name': this.name,
            'res': this.res
        }
    }
}
