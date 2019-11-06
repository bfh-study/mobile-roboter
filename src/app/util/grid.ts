import { Node } from './node';

export class Grid {

    private nodes: Array<Array<Node>>;

    constructor(private width: number, private height: number) {
        this.nodes = new Array<Array<Node>>(this.width);
    }

    init(startCoord: number[], stopCoord: number[]) {
        for (let i = 0; i < this.width; i++) {
            this.nodes[i] = new Array(this.width);
            for (let j = 0; j < this.height; j++) {
                this.nodes[i][j] = new Node(i, j);
                if (startCoord[0] === i && startCoord[1] === j) {
                    this.nodes[i][j].isStart = true;
                }
                if (stopCoord[0] === i && stopCoord[1] === j) {
                    this.nodes[i][j].isStop = true;
                }
            }
        }
    }

    getNodeAt(x: number, y: number): Node {
        return this.nodes[x][y];
    }

    clear(startCoord?: number[], stopCoord?: number[]) {
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                let node = this.getNodeAt(i, j);
                node.isClear = true;
                if (startCoord != null && startCoord[0] === i && startCoord[1] === j) {
                    node.isStart = true; 
                }
                if (stopCoord != null && stopCoord[0] === i && stopCoord[1] === j) {
                    node.isStop = true;
                }
            }
        }
    }
}
