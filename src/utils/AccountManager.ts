export default class AccountManager {
	private static instance: AccountManager;
	private jsxc;
	private accounts;
	private autoReconnect;

	static get(jsxc?) {
		if (!AccountManager.instance) {
			AccountManager.instance = new AccountManager(jsxc);
		}

		return AccountManager.instance;
	}

	constructor(jsxc) {
		this.jsxc = jsxc;
		this.accounts =
			JSON.parse(localStorage.getItem('AccountManager:accounts') || '{}') || {};
		this.autoReconnect =
			JSON.parse(localStorage.getItem('AccountManager:autoReconnect') || 'true');

		if (!this.jsxc) {
			throw new Error('JSXC has to be in scope');
		}
	}

	enableAutoConnect() {
		return this.setAutoConnect(true);
	}

	disableAutoConnect() {
		return this.setAutoConnect(false);
	}

	setAutoConnect(autoConnect) {
		let previous = this.autoReconnect;

		this.autoReconnect = autoConnect;

		this.save();

		return previous;
	}

	getNumberOfStoredAccounts() {
		return Object.keys(this.accounts).length;
	}

	getAllIds() {
		return Object.keys(this.accounts);
	}

	get(jid) {
		return this.accounts[jid];
	}

	add(url, jid, password) {
		this.accounts[jid] = {
			url: url,
			password: password,
		};

		this.save();
	}

	remove(jid) {
		delete this.accounts[jid];

		this.save();
	}

	enable(jid) {
		if (this.accounts[jid]) {
			this.accounts[jid].disabled = false;

			this.save();
		}
	}

	disable(jid) {
		if (this.accounts[jid]) {
			this.accounts[jid].disabled = true;

			this.save();
		}
	}

	save() {
		let hostname = window.location.hostname;

		if (hostname !== '' && hostname !== 'localhost') {
			return;
		}

		localStorage.setItem(
			'AccountManager:accounts',
			JSON.stringify(this.accounts)
		);
		localStorage.setItem('AccountManager:autoReconnect', JSON.stringify(this.autoReconnect));
	}

	connect(jid) {
		if (!this.accounts[jid]) {
			throw new Error('No account information available');
		}

		let account = this.accounts[jid];

		return this.jsxc.start(account.url, jid, account.password);
	}

	connectAll = function() {
		if (!this.autoReconnect) {
			return [];
		}

		let jids = Object.keys(this.accounts);

		return jids.map(jid => [jid, this.connect(jid)]);
	};

	connectAllEnabled = function() {
		if (!this.autoReconnect) {
			return [];
		}

		let enabledAccounts = [];

		for (let jid in this.accounts) {
			let account = this.accounts[jid];

			if (!account.disabled) {
				enabledAccounts.push([jid, this.connect(jid)]);
			}
		}

		return enabledAccounts;
	};
}
