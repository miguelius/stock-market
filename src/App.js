import React from 'react';
import { Navbar, Nav, NavItem, Brand } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import { Route, IndexRoute, Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import store from './store';
import { Auth } from './services/Auth';
import {
  Login,
  MervalIndex,
  StocksIndex,
  StocksEdit,
} from './containers/index';

require('./app.scss');

const history = syncHistoryWithStore(hashHistory, store);

let App = ({children}) => {
  return (
    <div>
      <Navbar inverse={true}>
        <Navbar.Brand>
        <a href="#">MERVAL</a></Navbar.Brand>
        <Nav>
          <IndexLinkContainer to="/">
            <NavItem>The Index</NavItem>
          </IndexLinkContainer>
          <LinkContainer to="/stocks">
            <NavItem>Stocks</NavItem>
          </LinkContainer>
        </Nav>
        {Auth.authenticated() && <Nav className="pull-right">
          <NavItem onClick={Auth.logout.bind(this)}>Logout</NavItem>
        </Nav>}
        {!Auth.authenticated() && <Nav className="pull-right">
          <LinkContainer to="/login">
            <NavItem>Login</NavItem>
          </LinkContainer>
        </Nav>}
      </Navbar>
      <div className="container">
        {children}
      </div>
    </div>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Route path="/login" component={Login} />
        <Route path="/" component={App}>
          <IndexRoute component={MervalIndex} />
          <Route path="/stocks" component={StocksIndex} />
          <Route path="/trade/new" component={StocksEdit} />
          <Route path="/stocks/:stockId" component={StocksEdit} />
        </Route>
      </Router>
    </Provider>
  )
}
