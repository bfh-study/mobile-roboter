import { Machine, interpret, Interpreter } from 'xstate';

import { Stage } from './stage';
import { ControlPanel } from './panel';
import { strgBtn, strgMouse } from './strategies';
import { Context, StateSchema, SMEvent, ReadyEvent, StopEvent, StartEvent } from './statemachine';
import { Grid } from '../util/grid';
import { AStar } from '../pathfinder/astar';
import { OperationEvents } from '../pathfinder/base';
import { Node } from '../util/node';

class Controller {
    private _interpreter: Interpreter<Context, StateSchema, SMEvent>;

    private grid: Grid;
    private stage: Stage;
    private panel: ControlPanel;

    private algo: AStar

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
        console.log("ready event", event);
        if (event instanceof ReadyEvent && !event.shuffled) {
            if (event.clear) {
                this.shuffle(false);
            }
            this.panel.buttonStrategy = new strgBtn.ReadyButtonState(this._interpreter, this.panel);
            this.stage.mouseStrategy = new strgMouse.EditMouseState(this.stage, this.grid);

            this.algo = new AStar(this.grid);
            this.algo.addEventListener(OperationEvents.OPEN_LIST, this.stage.nodeAddedToOpenList, this.stage);
            this.algo.addEventListener(OperationEvents.CLOSE_LIST, this.stage.nodeAddedToCloseList, this.stage);
            this.algo.addEventListener(OperationEvents.AFTER, this.algoEnd, this);
        } 
    }

    start(event: SMEvent): void {
        this.panel.buttonStrategy = new strgBtn.StartedButtonState(this._interpreter, this.panel);
        this.stage.mouseStrategy = new strgMouse.NoActionState(this.stage, this.grid);

        if (event instanceof StartEvent && event.paused) {
            this.algo.pause();  
        } else {
            this.algo.start();
        }
    }

    pause(): void {
        this.algo.pause();
        this.panel.buttonStrategy = new strgBtn.PausedButtonState(this._interpreter, this.panel);
    }

    finish(): void {
        this.algo.finish();
        this.panel.buttonStrategy = new strgBtn.FinishedButtonState(this._interpreter, this.panel);
    }

    shuffle(event = true): void {
        let coords = this.generateRandomCoords();
        this.stage.clear(coords[0], coords[1]);
        this.grid.init(coords[0], coords[1]);
        this.algo.updateGrid(this.grid);
        if (event){
            let readyEvent = new ReadyEvent();
            readyEvent.shuffled = true;
            this._interpreter.send(readyEvent);
        }
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

    private algoEnd(nodes: Node[]): void {
        this.stage.drawPath(nodes);
        this.panel.startButton.click();
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
                    context.start(event);
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
