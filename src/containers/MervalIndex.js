import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { stocksActions, stocksSelectors } from '../store/stocks/index';
import { isEqual } from 'lodash';

@connect(
  (state) => {
    return {
      index: stocksSelectors.getIndex(state),
    };
  }
)
export class MervalIndex extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object,
    store: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.state,
    }      
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.stock, this.state.stock)) {
      this.setState({...this.state, stock: nextProps.stock});
    }
  }

  componentDidMount() {
    this.fetchIndex({});
  }

  fetchIndex(params) {
    this.context.store.dispatch(stocksActions.fetchIndex(params));
  }

  render() {
    const {
      index,
    } = this.props;

    return (
      <div className="jumbotron">
        <h1>MERVAL Index</h1>
        <h2>Current value*: {index.index}</h2>
        <h5>* The index is computed taking in account the Volume Weight Price of the Last 5 minutes trades.</h5>
      </div>
    );
  }
}
