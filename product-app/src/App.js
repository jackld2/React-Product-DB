import logo from './logo.svg';
import React, { Component }  from 'react';
import './App.css';
import {Home} from './Home'
import {Product} from './Product'
import {BrowserRouter, Route, Switch, NavLink} from 'react-router-dom';

function App() {




  return (
    <BrowserRouter>
    <div className="App container">
      <h3 className="d-flex justify-content-center m-3">
        Product Database
      </h3>

      <nav className="navbar navbar-expand-sm bg-light navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/home">
              Home
            </NavLink>
          </li>
          <li className="nav-item- m-1">
            <NavLink className="btn btn-light btn-outline-primary" to="/product">
              Products
            </NavLink>
          </li>
        </ul>
      </nav>

      <Switch>
        <Route path='/home' component={Home}/>
        <Route path='/product' component={Product}/>
      </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
