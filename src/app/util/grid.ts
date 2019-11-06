import { Node } from './node';

export class Grid {

    private nodes: Array<Array<Node>>;

    constructor(private width: number, private height: number) {
        this.nodes = new Array<Array<Node>>(this.width);
    }

    init() {
        for (let i = 0; i < this.width; i++) {
            this.nodes[i] = new Array(this.width);
            for (let j = 0; j < this.height; j++) {
                this.nodes[i][j] = new Node(i, j);
            }
        }
    }

    getNodeAt(x: number, y: number): Node {
        return this.nodes[x][y];
    }
}
