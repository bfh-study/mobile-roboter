import { Node } from './node';

export class Grid {

    private nodes: Array<Array<Node>>;
    private sNode: Node;
    private eNode: Node;

    constructor(private width: number, private height: number) {
        this.nodes = new Array<Array<Node>>(this.width);
    }

    init(startCoord: number[], stopCoord: number[]) {
        for (let i = 0; i < this.width; i++) {
            this.nodes[i] = new Array(this.width);
            for (let j = 0; j < this.height; j++) {
                this.nodes[i][j] = new Node(i, j, startCoord, stopCoord);
                if (startCoord[0] === i && startCoord[1] === j) {
                    // this.nodes[i][j].isStart = true;
                    this.sNode = this.nodes[i][j]
                }
                if (stopCoord[0] === i && stopCoord[1] === j) {
                    // this.nodes[i][j].isStop = true;
                    this.eNode = this.nodes[i][j]
                }
            }
        }
    }

    getNodeAt(x: number, y: number): Node {
        return this.nodes[x][y];
    }

    get startNode(): Node {
        return this.sNode;
    }

    get endNode(): Node {
        return this.eNode;
    }

    get rowCount(): number {
        return this.height;
    }

    get columnCount(): number {
        return this.width;
    }
}
