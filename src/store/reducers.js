import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './auth/reducer';
import stocks from './stocks/reducer';

export default combineReducers({
  auth,
  stocks,
  routing: routerReducer,
});
