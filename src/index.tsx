import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let bodyElement = document.getElementsByTagName('body')[0];

bodyElement.classList.add('jsxc-fullscreen');
bodyElement.classList.add('jsxc-two-columns');

if (window.location.hostname && window.location.hostname !== 'localhost') {
    alert('This application stores passwords in the local storage. This should not be done on a website.');

    throw new Error('Unsecure enviornment');
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
