import { Machine, interpret, Interpreter } from 'xstate';

import { Stage } from './stage';
import { ControlPanel } from './panel';
import * as strgBtn from './strategies/button';
import { Context, StateSchema, SMEvent } from './statemachine';

class Controller {
    private _interpreter: Interpreter<Context, StateSchema, SMEvent>;

    private stage: Stage;
    private panel: ControlPanel;

    constructor(numCols: number, numRows: number) {
        this.stage = new Stage(numCols, numRows);
        this.panel = new ControlPanel();
    }

    set interpreter(val: Interpreter<Context, StateSchema, SMEvent>) {
        this._interpreter = val;
    }

    init(): void {
        this.panel.init();
        this.stage.draw();
        this._interpreter.send('READY');
    }

    ready(): void {
        this.panel.buttonStrategy = new strgBtn.ReadyButtonState(this._interpreter, this.panel);
    }

    start(): void {
        this.panel.buttonStrategy = new strgBtn.StartedButtonState(this._interpreter, this.panel);
    }

    pause(): void {
        this.panel.buttonStrategy = new strgBtn.PausedButtonState(this._interpreter, this.panel);
    }

    finish(): void {
        this.panel.buttonStrategy = new strgBtn.FinishedButtonState(this._interpreter, this.panel);
    }
}

export function createStateMachine(numCols: number, numRows: number): Interpreter<Context, StateSchema, SMEvent> {
    let controller = new Controller(numCols, numRows);
    let machine = Machine<Context, StateSchema, SMEvent>(
        {
            id: 'main',
            initial: 'initial',
            context: controller,
            states: {
                initial: {
                    type: 'atomic',
                    onEntry: ['init'],
                    on: {
                        READY: 'ready'
                    }
                },
                ready: {
                    type: 'atomic',
                    onEntry: ['ready'],
                    on: {
                        START: 'started'
                    }
                },
                started: {
                    type: 'atomic',
                    onEntry: ['start'],
                    on: {
                        PAUSE: 'paused',
                        STOP: 'finished'
                    }
                },
                paused: {
                    type: 'atomic',
                    onEntry: ['pause'],
                    on: {
                        START: 'started',
                        STOP: 'finished'
                    }
                },
                finished: {
                    type: 'atomic',
                    onEntry: ['finish'],
                    on: {
                        READY: 'ready',
                    }
                }
            }
        },
        {
            actions: {
                init: (context, event) => {
                    context.init();
                },
                ready: (context, event) => {
                    context.ready();
                },
                start: (context, event) => {
                    context.start();
                },
                pause: (context, event) => {
                    context.pause();
                },
                finish: (context, event) => {
                    context.finish();
                }
            }
        }
    );
    let interpreter = interpret(machine).onTransition(state => {
        console.log(state.value);
    });
    controller.interpreter = interpreter;

    return interpreter;
}
