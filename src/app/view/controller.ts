import { Machine, interpret, Interpreter } from 'xstate';

import { Stage } from './stage';

interface Context {
    init(): void;
}

class Controller {
    private stage: Stage;

    constructor(numCols: number, numRows: number) {
        this.stage = new Stage(numCols, numRows);
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

type Event =
  | { type: 'INIT' }

export function createStateMachine(numCols: number, numRows: number): Interpreter<Context, StateSchema, Event> {
    let machine = Machine<Context, StateSchema, Event>(
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
