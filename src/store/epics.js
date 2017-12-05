import { combineEpics } from 'redux-observable';
import { values } from 'lodash';

import * as stocksEpics from './stocks/epics';

export default combineEpics(
  ...values(stocksEpics)
);
