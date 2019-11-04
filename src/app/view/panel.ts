export enum ControlPanelButtons {
    START = 'start',
    PAUSE = 'pause'
}

export type ControlPanelElements = ControlPanelButtons;

export class ControlPanel {

    private startStopButton: HTMLButtonElement;
    private pauseButton: HTMLButtonElement;

    constructor() {
        this.init();
    }

    private init(): void {
        this.startStopButton = <HTMLButtonElement> document.getElementById(ControlPanelButtons.START);
        this.pauseButton = <HTMLButtonElement> document.getElementById(ControlPanelButtons.PAUSE);
    }

    toggleButton(btn: ControlPanelButtons) :void {
        let button: HTMLButtonElement;
        switch (btn) {
            case ControlPanelButtons.START:
                button = this.startStopButton;
                break;
            case ControlPanelButtons.PAUSE:
                button = this.pauseButton;
                break;
            default:
                return;
        }
        button.disabled = !button.disabled;
    }
}
