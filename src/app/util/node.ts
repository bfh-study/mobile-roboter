
export class Node {

    private _isStart: boolean;
    private _isStop: boolean;
    private _isClear: boolean;

    set isStart(val: boolean) {
        this._isClear = false;
        this._isStart = val;
    }

    set isStop(val: boolean) {
        this._isClear = false;
        this._isStop = val;
    }

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

    // return if state was toogled
    toggleState(): boolean {
        if (this._isStart || this._isStop) {
            return false;
        }
        this.isClear = !this.isClear;
        return true;
    }
}
