import Actions from './types';

interface Action {
    type: Actions,
    payload ?: any
}

export default Action;