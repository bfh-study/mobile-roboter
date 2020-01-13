export interface Context {
    init(): void;
    ready(event: SMEvent): void;
    start(event: SMEvent): void;
    pause(): void;
    finish(): void;
    shuffle(): void;
}

export interface StateSchema {
    states: {
        initial: {};
        ready: {};
        started: {};
        paused: {};
        finished: {};
        shuffled: {};
    };
}

export class ReadyEvent {
    type: string = 'READY';
    shuffled: boolean = false;
    clear: boolean = false;
}

export class StartEvent {
    type: string = 'START';
    paused: boolean = false;
}

export class PauseEvent {
    type: string = 'PAUSE';
}

export class StopEvent {
    type: string = 'STOP';
}

export class ShuffleEvent {
    type: string = 'SHUFFLE';
}

export type SMEvent =
  | { type: 'INIT' }
  | ReadyEvent
  | StartEvent
  | PauseEvent
  | StopEvent
  | ShuffleEvent;
