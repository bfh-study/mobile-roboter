import {SVG, G} from '@svgdotjs/svg.js'

export class Stage {

    private nodeSize: number;

    constructor(private numCols: number, private numRows: number) {
        this.nodeSize = 30;
    }

    draw() {
        let strokeWidth = 10;
        let width = this.numCols * this.nodeSize + 2 * strokeWidth;
        let height = this.numRows * this.nodeSize + 2 * strokeWidth;

        let svg = SVG().size(width, height).addTo('#stage');
        svg.rect(width, height).attr({ stroke: '#000', 'stroke-width': 10 });
        let stage = svg.group().attr({ fill: '#fff', 'stroke-opacity': 0.2, stroke: '#000' });
        for (let i = 0; i < this.numRows; i++) {
            for (let j = 0; j < this.numCols; j++) {
                let x = j * this.nodeSize + strokeWidth;
                let y = i * this.nodeSize + strokeWidth;
                stage.rect(this.nodeSize, this.nodeSize).dx(x).dy(y);
            }
        }
    }
}
