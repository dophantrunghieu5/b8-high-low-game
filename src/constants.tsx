export enum GAME_STATE {
    NEW = 'new',
    STARTED = 'started',
    RESULT = 'result'
}
export enum GAME_ACTION {
    START_GAME = 'START_GAME',
    USER_CHOOSE_ACTION = 'USER_CHOOSE_ACTION',
    RESTART = 'RESTART'
}
export enum USER_CHOOSE {
    HIGHER = 'higher',
    LOWER = 'lower',
}
export enum GAME_RESULT {
    WIN = 'win',
    LOSE = 'lose'
}