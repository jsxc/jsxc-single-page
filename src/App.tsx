import React from 'react';
import AddAccount from './AddAccount';
import Overview from './Overview';
import { ThemeProvider } from '@material-ui/styles';
import AccountManager from './utils/AccountManager';
import ConnectionWatcher from './utils/ConnectionWatcher';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			light: 'rgba(#ffffff, 0.6)',
			main: 'rgba(#ffffff, 0.8)',
			dark: '#ffffff',
			contrastText: '#fff',
		},
		secondary: {
			light: 'rgba(#ffffff, 0.6)',
			main: 'rgba(#ffffff, 0.8)',
			dark: '#ffffff',
			contrastText: '#fff',
		},
		background: '#2e7bcf',
	},
} as any);

const SUSPEND = 0;
const LOADING = 1;
const ADD_ACCOUNT = 2;
const OVERVIEW = 3;

class App extends React.Component {
	state = {
		page: LOADING,
  };

  private jsxc;

	componentDidMount() {
		this.jsxc = new (window as any).JSXC({
			connectionCallback: (jid, status, condition) => {
				if (jid) {
					connectionWatcher.callback(jid, status, condition);
				}

				if (status === 7) {
					if (condition === 'forced') {
						accountManager.disableAutoConnect();
					} else if (!accountManager.enableAutoConnect()) {
						this.connect(accountManager);
					}
				}
			},
			onUserRequestsToGoOnline: () => {
				accountManager.enableAutoConnect();

				this.connect(accountManager);
			},
		});

		// bootstrap ui
		this.jsxc.start();

		let accountManager = AccountManager.get(this.jsxc);
		let connectionWatcher = new ConnectionWatcher(
			jid => accountManager.connect(jid),
			jid => accountManager.disable(jid)
		);

		if (this.jsxc.numberOfCachedAccounts === 0) {
			this.connect(accountManager);
		} else {
			this.setState({ page: SUSPEND });
		}

		this.jsxc.addMenuEntry({
			id: 'account-manager',
			label: 'Accounts',
			handler: ev => {
				this.setState({ page: OVERVIEW });
			},
			offlineAvailable: true,
		});
	}

	connected = () => {
		this.setState({ page: SUSPEND });
	};

	connect = accountManager => {
		let connectionPromises = accountManager.connectAllEnabled();
		let numberOfStoredAccounts = accountManager.getNumberOfStoredAccounts();

		if (numberOfStoredAccounts === 0) {
			this.setState({ page: ADD_ACCOUNT });
		} else {
			if (connectionPromises.length) {
				connectionPromises.forEach(([jid, promise]) => {
					promise
						.then(() => {
							console.log(jid, 'connected');
						})
						.catch(err => {
							console.log(jid, err); //@TODO show error; disable account?
						});
				});
			} else {
				this.jsxc.start();
			}

			this.setState({ page: SUSPEND });
		}
	};

	onOverviewClose = () => {
		this.setState({ page: SUSPEND });
	};

	onAddAccount = () => {
		this.setState({ page: ADD_ACCOUNT });
	};

	render() {
		let page: any = '';

		switch (this.state.page) {
			case LOADING:
				page = <p>Loading</p>;
				break;
			case ADD_ACCOUNT:
				page = <AddAccount jsxc={this.jsxc} onConnected={this.connected} closable={true} />;
				break;
			case OVERVIEW:
				page = (
					<Overview
						onClose={this.onOverviewClose}
						onAddAccount={this.onAddAccount}
					/>
				);
				break;
			default:
				page = '';
		}
		return <ThemeProvider theme={theme}>{page}</ThemeProvider>;
	}
}

export default App;
