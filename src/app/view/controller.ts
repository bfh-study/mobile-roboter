import { Machine, interpret, Interpreter } from 'xstate';

import { Stage } from './stage';
import { ControlPanel } from './panel';

interface Context {
    init(): void;
}

class Controller {
    private stage: Stage;
    private panel: ControlPanel;

    constructor(numCols: number, numRows: number) {
        this.stage = new Stage(numCols, numRows);
        this.panel = new ControlPanel();
    }

    init(): void {
        this.stage.draw();
    }
}

interface StateSchema {
    states: {
        initial: {};
    };
}

type SMEvent =
  | { type: 'INIT' }

export function createStateMachine(numCols: number, numRows: number): Interpreter<Context, StateSchema, SMEvent> {
    let machine = Machine<Context, StateSchema, SMEvent>(
        {
            id: 'main',
            initial: 'initial',
            context: new Controller(numCols, numRows),
            states: {
                initial: {
                    type: 'atomic',
                    onEntry: ['init']
                }
            }
        },
        {
            actions: {
                init: (context, event) => {
                    context.init();
                }
            }
        }
    );
    return interpret(machine).onTransition(state => {
        console.log(state.value);
    });
}
