export function getParams(state) {
  return state.stocks.params;
}

export function getStock(state, id) {
  return state.stocks.byId[id];
}

export function getStocks(state) {
  return Object.values(state.stocks.byId);
}

export function getIndex(state) {
  return state.stocks.index;
}