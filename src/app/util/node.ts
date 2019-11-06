
export class Node {

    private _isStart: boolean;
    private _isStop: boolean;
    private _isClear: boolean;

    set isClear(val: boolean) {
        this._isClear = val;
        this._isStart = false;
        this._isStop = false;
    }

    get isClear() {
        return this._isClear;
    }

    constructor(private x: number, private y: number) {
        this.isClear = true;
    }

    toggleState() {
        if (this._isStart || this._isStop) {
            return this.isClear;
        }
        this.isClear = !this.isClear;
        return this.isClear;
    }
}
