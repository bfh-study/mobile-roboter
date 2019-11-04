export interface Context {
    init(): void;
    ready(): void;
    start(): void;
    pause(): void;
    finish(): void;
}

export interface StateSchema {
    states: {
        initial: {};
        ready: {};
        started: {};
        paused: {};
        finished: {};
    };
}

export class ReadyEvent {
    type: string = 'READY'
}

export class StartEvent {
    type: string = 'START'
}

export class PauseEvent {
    type: string = 'PAUSE'
}

export class StopEvent {
    type: string = 'STOP'
}

export type SMEvent =
  | { type: 'INIT' }
  | ReadyEvent
  | StartEvent
  | PauseEvent
  | StopEvent;
