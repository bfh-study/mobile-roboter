import { Machine, interpret, Interpreter } from 'xstate';

import { Stage } from './stage';
import { ControlPanel } from './panel';
import { strgBtn, strgMouse } from './strategies';
import { Context, StateSchema, SMEvent, ReadyEvent } from './statemachine';
import { Grid } from '../util/grid';

class Controller {
    private _interpreter: Interpreter<Context, StateSchema, SMEvent>;

    private grid: Grid;
    private stage: Stage;
    private panel: ControlPanel;

    constructor(private numCols: number, private numRows: number) {
        this.grid = new Grid(numCols, numRows);
        this.stage = new Stage(numCols, numRows);
        this.panel = new ControlPanel();
    }

    set interpreter(val: Interpreter<Context, StateSchema, SMEvent>) {
        this._interpreter = val;
    }

    init(): void {
        let coords = this.generateRandomCoords();
        this.panel.init();
        this.grid.init(coords[0], coords[1]);
        this.stage.draw(coords[0], coords[1]);
        this._interpreter.send(new ReadyEvent());
    }

    ready(event: SMEvent): void {
        if (event instanceof ReadyEvent && !event.shuffled) {
            this.panel.buttonStrategy = new strgBtn.ReadyButtonState(this._interpreter, this.panel);
            this.stage.mouseStrategy = new strgMouse.EditMouseState(this.stage, this.grid);
        }
    }

    start(): void {
        this.panel.buttonStrategy = new strgBtn.StartedButtonState(this._interpreter, this.panel);
        this.stage.mouseStrategy = new strgMouse.NoActionState(this.stage, this.grid);
    }

    pause(): void {
        this.panel.buttonStrategy = new strgBtn.PausedButtonState(this._interpreter, this.panel);
    }

    finish(): void {
        this.panel.buttonStrategy = new strgBtn.FinishedButtonState(this._interpreter, this.panel);
    }

    shuffle(): void {
        let coords = this.generateRandomCoords();
        this.stage.clear(coords[0], coords[1]);
        this.grid.clear(coords[0], coords[1]);

        let readyEvent = new ReadyEvent();
        readyEvent.shuffled = true;
        this._interpreter.send(readyEvent);
    }

    private generateRandomCoords(): number[][] {
        let generate = function(): number[] {return [Math.round(Math.random() * (this.numCols - 1)), Math.round(Math.random() * (this.numRows - 1))]}.bind(this);
        let startCoord = generate();
        let stopCoord = generate();
        while(startCoord[0] === stopCoord[0] && startCoord[1] === stopCoord[1]) {
            stopCoord = generate();
        }
        return [startCoord, stopCoord];
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
                        START: 'started',
                        SHUFFLE: 'shuffled'
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
                },
                shuffled: {
                    type: 'atomic',
                    onEntry: ['shuffle'],
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
                    context.ready(event);
                },
                start: (context, event) => {
                    context.start();
                },
                pause: (context, event) => {
                    context.pause();
                },
                finish: (context, event) => {
                    context.finish();
                },
                shuffle: (context, event) => {
                    context.shuffle();
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
