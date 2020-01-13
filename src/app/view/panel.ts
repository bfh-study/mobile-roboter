import { ButtonStrategy } from './strategies/button';

export enum ControlPanelButtons {
    START = 'start',
    PAUSE = 'pause',
    SHUFFLE = 'shuffle'
}

export type ControlPanelElements = ControlPanelButtons;

export class ControlPanel {

    private startStopButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;
    private shuffleButton: HTMLButtonElement;

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
        this.shuffleButton = <HTMLButtonElement> document.getElementById(ControlPanelButtons.SHUFFLE);
        this.shuffleButton.addEventListener('click', function (el: HTMLButtonElement, ev: MouseEvent) {
            if (this._buttonStrategy != null) {
                this._buttonStrategy.onShuffleButtonClick();
            }
        }.bind(this));
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

    get startButton(): HTMLButtonElement {
        return this.startStopButton;
    }

    private getButton(btn: ControlPanelButtons): HTMLButtonElement {
        switch (btn) {
            case ControlPanelButtons.START:
                return this.startStopButton;
            case ControlPanelButtons.PAUSE:
                return this.pauseButton;
            case ControlPanelButtons.SHUFFLE:
                    return this.shuffleButton;
            default:
                return new HTMLButtonElement();
        }
    }
}
