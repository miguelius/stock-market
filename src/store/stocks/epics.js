import { keyBy } from 'lodash';
import axios from 'axios';
import querystring from 'querystring';
import { Observable } from 'rxjs/Observable';
import { push } from 'react-router-redux';

import * as actionTypes from './actionTypes';
import * as stocksActions from './actionCreators';

export function fetchStock(action$) {
  return action$.ofType(actionTypes.FETCH_ONE)
    .map(action => action.payload)
    .switchMap(id => {
      return Observable.fromPromise(
        axios.get(`http://localhost:8081/stocks/${id}`)
      ).map(res => stocksActions.fetchStockSuccess(res.data));
    });
}

export function fetchStocks(action$) {
  return action$.ofType(actionTypes.FETCH_COLLECTION)
    .map(action => action.payload)
    .switchMap(params => {
      return Observable.fromPromise(
        axios.get(`http://localhost:8081/stock?${querystring.stringify(params)}`)
      ).map(res => stocksActions.fetchStocksSuccess(res.data.items, params));
    });
}

export function updateStock(action$) {
  return action$.ofType(actionTypes.UPDATE)
    .map(action => action.payload)
    .switchMap(stock => {
      return Observable.merge(
        Observable.fromPromise(
          axios.put(`http://localhost:8081/stock/${stock.id}`, stock)
        ).map(res => stocksActions.updateStockSuccess(res.data)),
        Observable.of(push('/stocks'))
      );
    });
}

export function createStock(action$) {
  return action$.ofType(actionTypes.CREATE)
    .map(action => action.payload)
    .switchMap(stock => {
      return Observable.merge(
        Observable.fromPromise(
          axios.post(`http://localhost:8081/trade`, stock)
        ).map(res => stocksActions.createStockSuccess(res.data)),
        Observable.of(push('/stocks'))
      );
    });
}

export function deleteStock(action$) {
  return action$.ofType(actionTypes.DELETE)
    .map(action => action.payload)
    .switchMap(stock => {
      return Observable.fromPromise(
        axios.delete(`http://localhost:8081/stock/${stock.id}`)
      ).map(res => stocksActions.deleteStockSuccess(stock));
    });
}

export function fetchIndex(action$) {
  return action$.ofType(actionTypes.FETCH_INDEX)
  .map(action => action.payload)
  .switchMap(id => {
    return Observable.fromPromise(
      axios.get(`http://localhost:8081/mervalIndex`)
    ).map(res => stocksActions.fetchIndexSuccess(res.data));
  });
}
