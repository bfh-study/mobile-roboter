import { BasePathFinder, EventListener, OperationEvents, PathFinder } from './base';
import { Grid } from '../util';
import { BinaryHeap } from '../util/heap';
import { Node } from '../util/node';

class Score {

    constructor(node: Node, gVal: number) {
        this.node = node;
        this.gVal = gVal;
    }
    node: Node;
    gVal: number;
}

export class AStar extends BasePathFinder implements PathFinder {

    private eventListener: Map<OperationEvents, EventListener[]>; 

    private openList: BinaryHeap<Score>;
    private closeList: Array<Node>;

    constructor(grid: Grid) {
        super(grid);
        this.eventListener = new Map<OperationEvents, EventListener[]>();
        this.openList = new BinaryHeap<Score>((s: Score) => {
            if (s.node.isStart) {
                return 0
            }
            return s.node.getCosts() + s.node.getHeurristic();
        });
        this.closeList = new Array<Node>();
    }

    addEventListener(event: OperationEvents, listener: EventListener): void {

    }

    start(): void {
        this.openList.push(new Score(this.grid.startNode, 0));
        this.run();
    }

    private run(): void {
        let run  = true;
        while (run) {
            let currentNodeScore = this.openList.pop();
            if (currentNodeScore.node.isStop) {
                run = false;
            }

            this.closeList.push(currentNodeScore.node);
            this.expandNode(currentNodeScore);

            if (this.openList.isEmpty()) {
                run = false;
            }
        }
    }

    private expandNode(currentNodeScore: Score) {
        let currentNode = currentNodeScore.node;
        this.getNextNodes(currentNode).forEach(function(nextNode: Node) {
            if (this.closeList.includes(nextNode)) {
                return;
            }
            let newGVal = currentNode.getCosts() + 1;
            if (this.openList.includes(nextNode)) {  //contains(successor) and tentative_g >= g(successor) then
                return;
            }
            nextNode.lastNode = currentNode;

            if (this.openlist.contains(nextNode)) {
                // this.openlist.updateKey(successor, f)
            } else {
                this.openlist.push(nextNode)
            }
        }, this);
    }

    private getNextNodes(currentNode: Node): Node[] {
        let nodeList = new Array<Node>();
        let addFunc = (n: Node) => {if (n.isClear) {nodeList.push(n)}}

        if (currentNode.xCoord > 0) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord - 1, currentNode.yCoord));
        }
        if (currentNode.yCoord > 0) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord, currentNode.yCoord - 1));
        }
        if (currentNode.xCoord < this.grid.columnCount) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord + 1, currentNode.yCoord));
        }
        if (currentNode.yCoord < this.grid.rowCount) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord, currentNode.yCoord + 1));
        }

        return nodeList;
    }

    pause(): void {

    }
}
