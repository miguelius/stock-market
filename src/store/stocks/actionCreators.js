import { keyBy } from 'lodash';
import * as actionTypes from './actionTypes';

export function fetchStock(payload) {
  return {type: actionTypes.FETCH_ONE, payload};
}

export function fetchStockSuccess(payload) {
  const byId = {[payload.id]: payload};
  return {type: actionTypes.FETCH_ONE_SUCCESS, payload: {byId}};
}

export function fetchStocks(payload) {
  return {type: actionTypes.FETCH_COLLECTION, payload};
}

export function fetchStocksSuccess(stocks, params) {
  const byId = keyBy(stocks, (stock) => stock.id);
  return {type: actionTypes.FETCH_COLLECTION_SUCCESS, payload: {byId, params}};
}

export function createStock(payload) {
  return {type: actionTypes.CREATE, payload};
}

export function createStockSuccess(payload) {
  return {type: actionTypes.CREATE_SUCCESS, payload};
}

export function updateStock(payload) {
  return {type: actionTypes.UPDATE, payload};
}

export function updateStockSuccess(payload) {
  return {type: actionTypes.UPDATE_SUCCESS, payload};
}

export function deleteStock(payload) {
  return {type: actionTypes.DELETE, payload};
}

export function deleteStockSuccess(payload) {
  return {type: actionTypes.DELETE_SUCCESS, payload};
}

export function fetchIndex(payload) {
  return {type: actionTypes.FETCH_INDEX, payload};
}

export function fetchIndexSuccess(payload) {
  return {type: actionTypes.FETCH_INDEX_SUCCESS, payload};
}