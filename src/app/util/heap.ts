export class BinaryHeap<T> {

    private content: T[];

    constructor(private scoreFunc: (n: T) => number) {
        this.content = [];
    }

    includes(n: T): boolean {
        return this.content.includes(n);
    }

    push(element: T) {
        this.content.push(element);
        this.bubbleUp(this.content.length - 1);
    }

    pop(): T {
        let result = this.content[0];
        let end = this.content.pop();
        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    }

    isEmpty(): boolean {
        return this.content.length === 0;
    }

    private bubbleUp(n: number) {
        let element = this.content[n];
        let score = this.scoreFunc(element);
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            let parentN = Math.floor((n + 1) / 2) - 1,
                parent = this.content[parentN];
            // If the parent has a lesser score, things are in order and we
            // are done.
            if (score >= this.scoreFunc(parent))
                break;

            // Otherwise, swap the parent with the current element and
            // continue.
            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    }

    private sinkDown(n: number) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunc(element);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) * 2, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = this.scoreFunc(child1);
                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }
            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunc(child2);
                if (child2Score < (swap == null ? elemScore : child1Score))
                    swap = child2N;
            }

            // No need to swap further, we are done.
            if (swap == null) break;

            // Otherwise, swap and continue.
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    }
}
