import { Grid, Node } from '../util';
import { type } from 'os';

export enum OperationEvents {
    AFTER = 'after'
}

export interface AfterOperationEvent {
    (node: Node): void;
}

export type EventListener = AfterOperationEvent;

export interface PathFinder {
    addEventListener(event: OperationEvents, listener: EventListener): void;
    start(): void;
    pause(): void;
}

export class BasePathFinder implements AbstractWorker {
    constructor(protected grid: Grid) {}

    onerror: (this: AbstractWorker, ev: ErrorEvent) => any;
    addEventListener(type: any, listener: any, options?: any) {
        throw new Error("Method not implemented.");
    }

    removeEventListener(type: any, listener: any, options?: any) {
        throw new Error("Method not implemented.");
    }
}
