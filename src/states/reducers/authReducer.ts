import action from '../../utils/action';
import ActionTypes from '../../utils/types';

export enum ValidityStates {
    IDLE,
    VALID,
    INVALID,
}

export interface authValidity {
    isValidating?: boolean;
    validateState?: ValidityStates | null;
}

export interface authState {
    isAuthenticated?: boolean;
    isLoading?: boolean;
    isAuthFail?: boolean;
    isValidate?: boolean;
    emailValidity?: authValidity;
    user?: object | null;
}

const initialize: authState = { 
    isAuthenticated: false, 
    isAuthFail: false, 
    isLoading: false, 
    isValidate: false, 
    emailValidity: {
        isValidating: false,
        validateState: ValidityStates.IDLE
    }, 
    user: null 
}

const authReducer = (state: authState = initialize, action: action) => {
    switch (action.type) {
        case ActionTypes.AUTH_LOADING:
            return {
                ...state,
                isLoading: action.payload
            }
        case ActionTypes.AUTH_AUTHENTICATION:
            return {
                ...state,
                isAuthenticated: action.payload
            }
        case ActionTypes.AUTH_RESET:
            return {
                ...state,
                isAuthFail: false,
                isAuthenticated: false,
                isValidate:false,
            }
        case ActionTypes.AUTH_FAIL:
            return {
                ...state,
                isAuthFail: action.payload
            }
        case ActionTypes.AUTH_VALIDATE:
            return {
                ...state,
                user: action.payload,
                isValidate: true,
            }
        case ActionTypes.AUTH_VALIDATE_EMAIL:
            return {
                ...state,
                emailValidity: action.payload,
            }
        case ActionTypes.AUTH_LOGOUT:
            return {
                ...state,
                isValidate: action.payload,
            }
        default:
            return state;
    }
}

export default authReducer;