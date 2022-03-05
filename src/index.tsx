import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let bodyElement = document.getElementsByTagName('body')[0];

bodyElement.classList.add('jsxc-fullscreen');
bodyElement.classList.add('jsxc-two-columns');

const secureHostname = process.env.SECURE_HOSTNAME ?? 'localhost';
console.info('secure hostname', secureHostname)
if (window.location.hostname && window.location.hostname !== secureHostname) {
    const environmentSecurityMode = process.env.ENVIRONMENT_SECURITY_MODE ?? 'strict';
    console.info('environment security mode', environmentSecurityMode)
    switch (environmentSecurityMode) {
        case 'persistent':
            if (window.localStorage.getItem('jsxc2:security-confirmed')) {
                break;
            }
            if (!window.confirm('This application stores passwords in the local storage. This should be done only if your browser is only yours and properly secured.')) {
                throw new Error('Unsecure enviornment');
            }
            window.localStorage.setItem('jsxc2:security-confirmed', 'true');
            break;
        case 'lax':
            if (!window.confirm('This application stores passwords in the local storage. This should be done only if your browser is only yours and properly secured.')) {
                throw new Error('Unsecure enviornment');
            }
            break;
        default: //strict
            alert('This application stores passwords in the local storage. This should not be done on a website.');
            throw new Error('Unsecure enviornment');
    }

}

ReactDOM.render(<App/>, document.getElementById('root'));

const useServiceWorker = process.env.SERVICE_WORKER === 'true'
console.info('service worker', useServiceWorker)
if (useServiceWorker) {
    serviceWorker.register();
} else {
    serviceWorker.unregister();
}
