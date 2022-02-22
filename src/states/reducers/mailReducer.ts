import action from '../../utils/action';
import ActionTypes from '../../utils/types';

export enum MailResultStates {
    NULL,
    SUCCESS,
    ERROR,
    INVALID
}

export interface mailState {
    isLoading: boolean;
    responseState: MailResultStates;
}

const initialState: mailState = {
    isLoading: false,
    responseState: MailResultStates.NULL
}

const mailReducer = (state: mailState = initialState, action: action) => {
    switch (action.type) {

        case ActionTypes.MAIL_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }

        case ActionTypes.MAIL_SET_STATE:
            return {
                ...state,
                responseState: action.payload,
                isLoading:false,
            }

        case ActionTypes.MAIL_CLEAR:
            state = initialState;
            return {
                ...state,
            }

        default:
            return state;
    }
}

export default mailReducer;