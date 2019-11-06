import { SVG, Rect, Runner, MatrixTransformParam } from '@svgdotjs/svg.js'

import { MouseStrategy } from './strategies/mouse';

export class Stage {
    private static ROOT_ELEMENT_ID = "stage";
    private static STROKE_SIZE = 10;

    private nodeSize: number;
    private rects: Array<Rect[]>;

    private _mouseStrategy: MouseStrategy;

    constructor(private numCols: number, private numRows: number, nodeSize?: number) {
        this.nodeSize = nodeSize ? nodeSize : 25;
        this.rects = new Array<Rect[]>(this.numCols);
    }

    set mouseStrategy(val: MouseStrategy) {
        this._mouseStrategy = val;
    }

    draw(): void {
        let width = this.numCols * this.nodeSize + 2 * Stage.STROKE_SIZE;
        let height = this.numRows * this.nodeSize + 2 * Stage.STROKE_SIZE;

        let svg = SVG().size(width, height).addTo('#' + Stage.ROOT_ELEMENT_ID);
        svg.rect(width, height).attr({ stroke: '#000', 'stroke-width': 10 });
        let stage = svg.group().attr({ 'stroke-opacity': 0.2, stroke: '#000' });
        for (let i = 0; i < this.numCols; i++) {
            this.rects[i] = new Array<Rect>(this.numRows);
            for (let j = 0; j < this.numRows; j++) {
                let x = i * this.nodeSize + Stage.STROKE_SIZE;
                let y = j * this.nodeSize + Stage.STROKE_SIZE;
                let rect = stage.rect(this.nodeSize, this.nodeSize).attr({ fill: '#fff' }).dx(x).dy(y);
                // register event handler
                const thisStage = this;
                rect.mousedown(function() {
                    if (thisStage._mouseStrategy != null) {
                        const coord = thisStage.toGridPosition(this.x(), this.y())
                        thisStage._mouseStrategy.onMousedown(coord[0], coord[1]);
                    }
                });
                rect.mouseover(function() {
                    if (thisStage._mouseStrategy != null) {
                        const coord = thisStage.toGridPosition(this.x(), this.y())
                        thisStage._mouseStrategy.onMouseover(coord[0], coord[1]);
                    }
                });
                rect.mouseout(function() {
                    if (thisStage._mouseStrategy != null) {
                        const coord = thisStage.toGridPosition(this.x(), this.y())
                        thisStage._mouseStrategy.onMouseout(coord[0], coord[1]);
                    }
                });
                this.rects[i][j]= rect;
            }
        }
    }

    /*animateNode2(rowId: number, colId: number, attr?: Object, info?: { ease?: string; duration?: number; delay?: number }) {
        const rect = this.getRect(rowId, colId);
        if (rect != null && attr != null) {
            let runner: Runner;
            if (info == null) {
                runner = rect.animate();
            } else {
                runner = rect.animate(info);
            }
            runner.attr(attr);
        }
    }*/

    animateNode(rowId: number, colId: number, info?: { ease?: string; duration?: number; delay?: number }): Runner {
        const rect = this.getRect(rowId, colId);
        if (rect != null) {
            rect.front();
            if (info == null) {
                return rect.animate();
            } else {
                return rect.animate(info);
            }
        }
    }

    /*animateNoteWithTransform(rowId: number, colId: number, trans: MatrixTransformParam, info?: { ease?: string; duration?: number; delay?: number }) {
        const rect = this.getRect(rowId, colId);
        if (rect != null && trans != null) {
            rect.front();
            let runner: Runner;
            if (info == null) {
                runner = rect.animate();
            } else {
                runner = rect.animate(info);
            }
            runner.transform(trans).reverse();
        }
    }*/

    private getRect(x: number, y: number) {
        if (x >= this.numCols || y >= this.numRows) {
            return;
        }
        return this.rects[x][y];
    }

    private toGridPosition(x: number, y: number): number[] {
        return [
            Math.floor((x - Stage.STROKE_SIZE) / this.nodeSize),
            Math.floor((y - Stage.STROKE_SIZE) / this.nodeSize)
        ]
    }
}
