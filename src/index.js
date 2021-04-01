import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import zhCN from 'antd/es/locale/zh_CN';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import RouteList from './routers';
import store from './store'
import { Provider } from 'react-redux'

const Routes = RouteList.map(item => <Route exact path={item.path} render={() => {
  document.title = (item.meta && item.meta.title) || 'Quick_Tem';
  return item.component;
}}>
</Route>)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      {Routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
