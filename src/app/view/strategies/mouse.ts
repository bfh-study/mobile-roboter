import { Stage } from "../stage";
import { Grid } from "../../util/grid";

export interface MouseStrategy {
    onMousedown(posX: number, posY: number): void;
    onMouseover(posX: number, posY: number): void;
    onMouseout(posX: number, posY: number): void;
}

class BaseMouseState {
    constructor(protected stage: Stage, protected grid: Grid) {}
}

export class NoActionState extends BaseMouseState implements MouseStrategy {
    onMousedown(posX: number, posY: number): void {}
    onMouseover(posX: number, posY: number): void {}
    onMouseout(posX: number, posY: number): void {}
}

export class EditMouseState extends NoActionState {
    onMousedown(posX: number, posY: number): void {
        let node = this.grid.getNodeAt(posX, posY);

        if (node.toggleState()) {
            // attention points to the new state!
            if (node.isClear) {
                this.stage.animateNode(posX, posY, {duration: 10, ease: '-'}).attr({ fill: '#fff' });
            } else {
                this.stage.animateNode(posX, posY, {duration: 10, ease: '-'}).attr({ fill: '#f03' });   
            }
        }
        
        this.stage.animateNode(posX, posY)
            .transform({ scale: 1.2})
            .reverse();
    }
}
