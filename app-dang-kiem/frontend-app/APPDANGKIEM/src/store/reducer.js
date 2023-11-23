import { combineReducers } from 'redux';
import { reducer as authReducer } from './auth';
import { RESET_STATE } from './shared';

export default reducer = combineReducers({
    auth: authReducer,
})

