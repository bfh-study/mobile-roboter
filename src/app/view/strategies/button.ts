import { Interpreter } from 'xstate';

import { Context, StateSchema, SMEvent, ReadyEvent, StartEvent, PauseEvent, StopEvent, ShuffleEvent } from '../statemachine';
import { ControlPanel, ControlPanelButtons } from '../panel';

export interface ButtonStrategy {
    onStartButtonClick(): void;
    onPauseButtonClick(): void;
    onShuffleButtonClick(): void;
}

class BaseButtonState {
    constructor(protected interpreter: Interpreter<Context, StateSchema, SMEvent>, protected panel: ControlPanel) {}
}

export class ReadyButtonState extends BaseButtonState implements ButtonStrategy {

    onStartButtonClick(): void {
        this.panel.changeText(ControlPanelButtons.START, "Stop");
        this.panel.toggleButton(ControlPanelButtons.PAUSE);
        this.panel.toggleButton(ControlPanelButtons.SHUFFLE);
        this.interpreter.send(new StartEvent());
    }

    onPauseButtonClick(): void {}

    onShuffleButtonClick(): void {
        this.interpreter.send(new ShuffleEvent());
    };
}

export class StartedButtonState extends BaseButtonState implements ButtonStrategy {

    onStartButtonClick(): void {
        this.panel.changeText(ControlPanelButtons.START, "Clear");
        this.panel.changeText(ControlPanelButtons.PAUSE, "Pause");
        this.panel.toggleButton(ControlPanelButtons.PAUSE);
        this.interpreter.send(new StopEvent());
    }

    onPauseButtonClick(): void {
        this.panel.changeText(ControlPanelButtons.PAUSE, "Paused");
        this.interpreter.send(new PauseEvent());
    }

    onShuffleButtonClick(): void {};
}

export class PausedButtonState extends StartedButtonState implements ButtonStrategy {

    onPauseButtonClick(): void {
        this.panel.changeText(ControlPanelButtons.PAUSE, "Pause");
        let event = new StartEvent();
        event.paused = true;
        this.interpreter.send(event);
    }

    onShuffleButtonClick(): void {};
}

export class FinishedButtonState extends ReadyButtonState implements ButtonStrategy {

    onStartButtonClick(): void {
        this.panel.changeText(ControlPanelButtons.START, "Start");
        this.panel.toggleButton(ControlPanelButtons.SHUFFLE);
        let event = new ReadyEvent();
        event.clear = true;
        this.interpreter.send(event);
    }

    onShuffleButtonClick(): void {};
}
