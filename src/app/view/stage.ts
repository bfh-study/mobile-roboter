import { SVG, Rect, Runner } from '@svgdotjs/svg.js'

import { MouseStrategy } from './strategies/mouse';
import { Node } from '../util';
import { EventListener, AddToOpenListEvent, AddToCloseListEvent } from '../pathfinder/base'

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

    draw(startCoord: number[], stopCoord: number[]): void {
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

                if (startCoord[0] === i && startCoord[1] === j) {
                    rect.attr({ fill: '#00d33b' });
                }
                if (stopCoord[0] === i && stopCoord[1] === j) {
                    rect.attr({ fill: '#3d42ce' });
                }

                this.rects[i][j] = rect;
            }
        }
    }

    clear(startCoord?: number[], stopCoord?: number[]) {
        for (let i = 0; i < this.numCols; i++) {
            for (let j = 0; j < this.numRows; j++) {
                let rect = this.rects[i][j];
                rect.attr({ fill: '#fff' });
                if (startCoord != null && startCoord[0] === i && startCoord[1] === j) {
                    rect.attr({ fill: '#00d33b' });
                }
                if (stopCoord != null && stopCoord[0] === i && stopCoord[1] === j) {
                    rect.attr({ fill: '#3d42ce' });
                }
            }
        }
    }

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

    drawPath(nodes: Node[]) {
        for(let node of nodes) {
            let rect = this.rects[node.xCoord][node.yCoord];
            rect.front().attr({ fill: '#ef1616' });
        }
    }

    nodeAddedToOpenList(node: Node): void {
        if (node.isStart || node.isStop) {
            return;
        } 
        let rect = this.rects[node.xCoord][node.yCoord];
        rect.front().attr({ fill: '#ffcd00' });
    }

    nodeAddedToCloseList(node: Node): void {
        if (node.isStart || node.isStop) {
            return;
        } 
        let rect = this.rects[node.xCoord][node.yCoord];
        rect.front().attr({ fill: '#fffa82' });
    }

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
