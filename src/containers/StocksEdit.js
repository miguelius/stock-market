import 'react-select/dist/react-select.css';

import React from 'react';
import Textarea from 'react-textarea-autosize';
import {Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import { stocksActions, stocksSelectors } from '../store/stocks/index';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { Async } from 'react-select';
import { Select } from 'react-select';

@connect(
  (state, props) => {
    return {
      stock: stocksSelectors.getStock(state, props.params.stockId),
    };
  }
)
export class StocksEdit extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object
  };

  static propTypes = {
    params: React.PropTypes.object,
    stock: React.PropTypes.object,
  };

  getTradeTypeOptions = (input, callback) => {
    setTimeout(() => {
      callback(null, {
        options: [
          { value: 'buy', label: 'Buy' },
          { value: 'sell', label: 'Sell' }
        ],
        // CAREFUL! Only set this to true when there are no more options,
        // or more specific queries will not be sent to the server.
        complete: true
      });
    }, 500);
  };

  getOptions = (input, callback) => {
    let url =  `http://localhost:8081/stock` + (input ? (`?q=`+input) : ``);
    return fetch(url)
      .then((response) => {
        return response.json();
      }).then((json) => {
        console.log(json.items);
        let stocks = json.items.map(s => { return { 'value':  s.symbol, 'label': s.symbol} })
        return { options: stocks };
      })
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      stockId: this.props.params.stockId,
      stock: {stock: '', time: new Date().toISOString(), quantity: 0, type: '', price: 0 }
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.stock, this.state.stock)) {
      this.setState({...this.state, stock: nextProps.stock});
    }
  }

  componentDidMount() {
    if (this.state.stockId) {
      this.context.store.dispatch(stocksActions.fetchStock(this.props.params.stockId));
    }
  }

  handleSelectChange(field, e) {
    const stock = Object.assign({}, this.state.stock, {[field]: e.value});
    this.setState(Object.assign({}, this.state, {stock}));
  }

  handleChange(field, e) {
    const stock = Object.assign({}, this.state.stock, {[field]: e.target.value});
    this.setState(Object.assign({}, this.state, {stock}));
  }

  handleSubmit() {
    if (this.state.stockId) {
      this.context.store.dispatch(stocksActions.updateStock(this.state.stock));
    } else {
      this.context.store.dispatch(stocksActions.createStock(this.state.stock));
    }
  }

  
  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} noValidate>
        <div className="form-group">
          <label className="label-control">Stock</label>
          <Async
              loadOptions={this.getOptions}
              value={this.state.stock.stock}
              onChange={this.handleSelectChange.bind(this, 'stock')}
          />
        </div>
        <div className="form-group">
          <label className="label-control">Type</label>
          <Async
              value={this.state.stock.type}
              onChange={this.handleSelectChange.bind(this, 'type')}
              loadOptions={this.getTradeTypeOptions}
          />
        </div>

        <div className="form-group">
          <label className="label-control">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={this.state.stock.quantity}
            onChange={this.handleChange.bind(this, 'quantity')} />
        </div>

        <div className="form-group">
          <label className="label-control">Price</label>
          <input
            type="number"
            className="form-control"
            value={this.state.stock.price}
            onChange={this.handleChange.bind(this, 'price')} />
        </div>

        <button type="submit" className="btn btn-default">
          {this.state.stockId ? 'Update' : 'Create' } Trade
        </button>
      </form>
    );
  }
}
