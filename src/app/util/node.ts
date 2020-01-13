
export class Node {

    private _isStart: boolean;
    private _isStop: boolean;
    private _isClear: boolean;
    private _isWall: boolean;

    lastNode: Node;

    set isStart(val: boolean) {
        this._isClear = false;
        this._isStart = val;
    }

    get isStart(): boolean {
        return this._isStart;
    }

    set isStop(val: boolean) {
        this._isClear = false;
        this._isStop = val;
    }

    get isStop(): boolean {
        return this._isStop;
    }

    set isClear(val: boolean) {
        this._isClear = val;
        this._isWall = !val;
        this._isStart = false;
        this._isStop = false;
    }

    get isClear() {
        return this._isClear;
    }

    get isWall() {
        return this._isWall;
    }

    get xCoord(): number {
        return this.x;
    }

    get yCoord(): number {
        return this.y;
    }

    constructor(private x: number, private y: number, private startCoord: number[], private endCoord: number[]) {
        this.isClear = true;
        if (x == startCoord[0] && y == startCoord[1]) {
            this.isStart = true;
        } else if (x == endCoord[0] && y == endCoord[1]) {
            this.isStop = true;
        }
        this._isWall = false;
    }

    // return if state was toogled
    toggleState(): boolean {
        if (this._isStart || this._isStop) {
            return false;
        }
        this.isClear = !this.isClear;
        return true;
    }

    getCosts(): number {
        //return Math.abs(this.x - this.startCoord[0]) + Math.abs(this.y - this.startCoord[1])
        if (this.isStart) {
            return 1;
        } else if (this.lastNode != null) {
            return this.lastNode.getCosts() + 1;
        }
        throw new Error('no last node found');
    }

    getHeurristic(): number {
        let dx = Math.abs(this.x - this.endCoord[0])
        let dy = Math.abs(this.y - this.endCoord[1])
        return 1 * Math.sqrt(dx * dx + dy * dy)
    }
}
