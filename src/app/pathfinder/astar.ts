import { BasePathFinder, EventListener, OperationEvents, PathFinder } from './base';
import { Grid } from '../util';
import { BinaryHeap } from '../util/heap';
import { Node } from '../util/node';

class EventListenerStore {

    eventListener: EventListener;
    bindThis: any;

    constructor(eventListener: EventListener, bindThis: any) {
        this.eventListener = eventListener;
        this.bindThis = bindThis;
    }
}

export class AStar extends BasePathFinder implements PathFinder {

    private eventListener: Map<OperationEvents, EventListenerStore[]>; 

    private openList: BinaryHeap<Node>;
    private closeList: Array<Node>;

    private run: boolean;

    constructor(grid: Grid) {
        super(grid);
        this.eventListener = new Map<OperationEvents, EventListenerStore[]>();
        this.openList = new BinaryHeap<Node>((s: Node) => {
            if (s.isStart) {
                return 0
            }
            return s.getCosts() + s.getHeurristic();
        });
        this.closeList = new Array<Node>();
        this.run = true;
    }

    addEventListener(event: OperationEvents, listener: EventListener, bind: any): void {
        let listeners = this.eventListener.get(event);
        if (listeners == null) {
            listeners = new Array<EventListenerStore>();
        }
        listeners.push(new EventListenerStore(listener, bind));
        this.eventListener.set(event, listeners);
    }

    start(): void {
        this.openList.push(this.grid.startNode);
        this.test();
    }

    private getNextNodes(currentNode: Node): Node[] {
        let nodeList = new Array<Node>();
        let addFunc = (n: Node) => {if (!n.isWall) {nodeList.push(n)}}

        if (currentNode.xCoord > 0) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord - 1, currentNode.yCoord));
        }
        if (currentNode.yCoord > 0) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord, currentNode.yCoord - 1));
        }
        if (currentNode.xCoord + 1 < this.grid.columnCount) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord + 1, currentNode.yCoord));
        }
        if (currentNode.yCoord + 1 < this.grid.rowCount) {
            addFunc(this.grid.getNodeAt(currentNode.xCoord, currentNode.yCoord + 1));
        }

        return nodeList;
    }

    private delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    private notify(event: OperationEvents, node: Node) {
        let listeners = this.eventListener.get(event);
        if (listeners != null) {
            for(let store of listeners) {
                store.eventListener.call(store.bindThis, node);
            }
        }
    }

    private notifyEnd(nodes: Node[]) {
        let listeners = this.eventListener.get(OperationEvents.AFTER);
        if (listeners != null) {
            for(let store of listeners) {
                store.eventListener.call(store.bindThis, nodes);
            }
        }
    }

    pause(): void {
        this.run = !this.run;
        if (this.run) {
            this.test();
        }
    }

    updateGrid(grid: Grid) {
        this.grid = grid;
    }

    private getPath(lastNode: Node): Node[] {
        let nodes = new Array<Node>();
        let currentNode = lastNode.lastNode;
        while (currentNode != null && !currentNode.isStart) {
            nodes.push(currentNode);
            currentNode = currentNode.lastNode;
        }
        return nodes;
    }

    private async test(): Promise<void> {
        while(this.run && !this.openList.isEmpty()) {
            const currentNode = this.openList.pop();

            if (currentNode.isStop) {
                this.notifyEnd(this.getPath(currentNode));
                return;
            }

            this.closeList.push(currentNode);
            this.notify(OperationEvents.CLOSE_LIST, currentNode);

            const neighbors = this.getNextNodes(currentNode);
            for (let i = 0, len = neighbors.length; i < len; ++i) {
                const neighbor = neighbors[i];

                if (this.closeList.includes(neighbor) || neighbor.isWall) {
                    continue;
                }

                const gScore = currentNode.getCosts() + 1;
                if (this.openList.includes(neighbor) && gScore >= neighbor.getCosts()) {
                    continue;
                }

                neighbor.lastNode = currentNode;
                if (this.openList.includes(neighbor)) {
                    console.log("remove neighbor");
                    this.openList.remove(neighbor);
                }
                this.openList.push(neighbor);
                this.notify(OperationEvents.OPEN_LIST, neighbor);
                await this.delay(100);
            }
        }
        console.log("algo end");
    }
}
