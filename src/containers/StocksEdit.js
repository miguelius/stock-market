import React from 'react';
import Textarea from 'react-textarea-autosize';
import {Form, FormGroup, ControlLabel, FormControl} from 'react-bootstrap'
import { stocksActions, stocksSelectors } from '../store/stocks/index';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

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

  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      stockId: this.props.params.stockId,
      stock: {symbol: '', time: Date.now(), quantity: 0, type: '', price: 0 }
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
          <input
            type="text"
            className="form-control"
            value={this.state.stock.symbol}
            onChange={this.handleChange.bind(this, 'symbol')} />
        </div>

          <FormGroup controlId="formControlsSelect">
            <ControlLabel>Type</ControlLabel>
            <FormControl componentClass="select" placeholder="select"
              value={this.state.stock.type}
              onChange={this.handleChange.bind(this, 'type')}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </FormControl>
          </FormGroup>

        <div className="form-group">
          <label className="label-control">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={this.state.stock.quantity}
            onChange={this.handleChange.bind(this, 'quantity')} />
        </div>

        <button type="submit" className="btn btn-default">
          {this.state.stockId ? 'Update' : 'Create' } Trade
        </button>
      </form>
    );
  }
}
