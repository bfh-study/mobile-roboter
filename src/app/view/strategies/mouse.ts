import { Stage } from "../stage";

export interface MouseStrategy {
    onMousedown(posX: number, posY: number): void;
    onMouseover(posX: number, posY: number): void;
    onMouseout(posX: number, posY: number): void;
}

class BaseMouseState {
    constructor(protected stage: Stage) {}
}

export class NoActionState extends BaseMouseState implements MouseStrategy {
    onMousedown(posX: number, posY: number): void {}
    onMouseover(posX: number, posY: number): void {}
    onMouseout(posX: number, posY: number): void {}
}

export class EditMouseState extends NoActionState {
    onMousedown(posX: number, posY: number): void {
        this.stage.animateNode(posX, posY, {duration: 10, ease: '-'}).css({ fill: '#f03' });

        this.stage.animateNode(posX, posY)
            .transform({ scale: 1.2})
            .reverse();
    }
}
