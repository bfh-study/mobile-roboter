import { createStateMachine } from './view';

import '../assets/sass/style.scss'

const stateMachine = createStateMachine(40, 25);
stateMachine.start();
