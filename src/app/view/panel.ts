import { ButtonStrategy } from './strategies/button';

export enum ControlPanelButtons {
    START = 'start',
    PAUSE = 'pause'
}

export type ControlPanelElements = ControlPanelButtons;

export class ControlPanel {

    private startStopButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;

    private _buttonStrategy: ButtonStrategy

    init(): void {
        this.startStopButton = <HTMLButtonElement> document.getElementById(ControlPanelButtons.START);
        this.startStopButton.addEventListener('click', function (el: HTMLButtonElement, ev: MouseEvent) {
            if (this._buttonStrategy != null) {
                this._buttonStrategy.onStartButtonClick();
            }
        }.bind(this));
        this.pauseButton = <HTMLButtonElement> document.getElementById(ControlPanelButtons.PAUSE);
        this.pauseButton.addEventListener('click', function (el: HTMLButtonElement, ev: MouseEvent) {
            if (this._buttonStrategy != null) {
                this._buttonStrategy.onPauseButtonClick();
            }
        }.bind(this));
        this.pauseButton.disabled = true;
    }

    set buttonStrategy(val: ButtonStrategy) {
        this._buttonStrategy = val;
    }

    changeText(btn: ControlPanelButtons, newText: string): void {
        this.getButton(btn).textContent = newText;
    }

    toggleButton(btn: ControlPanelButtons): void {
        let button = this.getButton(btn);
        button.disabled = !button.disabled;
    }

    private getButton(btn: ControlPanelButtons): HTMLButtonElement {
        switch (btn) {
            case ControlPanelButtons.START:
                return this.startStopButton;
            case ControlPanelButtons.PAUSE:
                return this.pauseButton;
            default:
                return new HTMLButtonElement();
        }
    }
}
