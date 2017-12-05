import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { StockList } from '../components/stocks/StockList';
import { SearchInput } from '../components/shared/SearchInput';
import { stocksActions, stocksSelectors } from '../store/stocks/index';
import { Auth } from '../services/Auth';

@connect(
  (state) => {
    return {
      params: stocksSelectors.getParams(state),
      stocks: stocksSelectors.getStocks(state),
    };
  }
)
export class StocksIndex extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.deleteStock = this.deleteStock.bind(this);
    this.handleSearch = this.handleSearch.bind(this, 'symbol_like');
  }

  componentDidMount() {
    this.fetchStocks({});
  }

  fetchStocks(params) {
    this.context.store.dispatch(stocksActions.fetchStocks(params));
  }

  deleteStock(stock) {
    this.context.store.dispatch(stocksActions.deleteStock(stock));
  }

  handleSearch(field, value) {
    this.fetchStocks({q: value})
  }

  render() {
    const {
      params,
      stocks,
    } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <SearchInput
              value={params.q}
              onSearch={this.handleSearch}
              placeholder="Stock search ..."
            />
          </div>
          <div className="col-md-6 text-right">
            {Auth.authenticated() &&
              <Link to="/trade/new" className="btn btn-primary">New Trade</Link>
            }
          </div>
        </div>
        {stocks.length > 0 &&
        <StockList stocks={stocks} onDelete={this.deleteStock}/>}
      </div>
    );
  }
}
