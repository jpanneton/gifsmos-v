import React from 'react';
import './Header.css';
import logo from './icons/gifsmos-v-logo.svg';

const Header = () => (
  <div className="Header">
    <img className="Header-logo" src={logo} alt="GIFsmos logo" />
    <div className="Header-help">
      Paste a Desmos link into the expressions list to import a saved graph.
    </div>
  </div>
);

export default Header;
