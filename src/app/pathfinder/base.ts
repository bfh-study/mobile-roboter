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

export class BasePathFinder {
    constructor(protected grid: Grid) {}
}
