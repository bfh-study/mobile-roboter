import { Grid, Node } from '../util';

export enum OperationEvents {
    AFTER = 'after',
    OPEN_LIST = 'open',
    CLOSE_LIST = 'close'
}

export interface AfterOperationEvent {
    (nodes: Node[]): void;
}

export interface AddToOpenListEvent {
    (node: Node): void;
}

export interface AddToCloseListEvent {
    (node: Node): void;
}

export type EventListener = AfterOperationEvent | AddToOpenListEvent | AddToCloseListEvent;

export interface PathFinder {
    addEventListener(event: OperationEvents, listener: EventListener, bind: any): void;
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
