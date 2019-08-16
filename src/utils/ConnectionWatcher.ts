const Status = {
	ATTACHED: 8,
	AUTHENTICATING: 3,
	AUTHFAIL: 4,
	CONNECTED: 5,
	CONNECTING: 1,
	CONNFAIL: 2,
	CONNTIMEOUT: 10,
	DISCONNECTED: 6,
	DISCONNECTING: 7,
	ERROR: 0,
	REDIRECT: 9,
};

class Connection {
	private disconnectingReason = '';
	private reconnectAttempts = 0;

	constructor(private jid, private reconnectCallback) {

	}

	update(status, condition) {
		if (status === Status.DISCONNECTING) {
			this.disconnectingReason = condition;
		} else if (status === Status.DISCONNECTED) {
			if (this.disconnectingReason !== 'forced') {
				setTimeout(() => this.reconnect(), 800);
			} else {
				console.log('Dont reconnect, because disconnect was forced');
			}
		} else if (status === Status.CONNECTED) {
			this.reconnectAttempts = 0;
		}
	}

	reconnect() {
		console.log('reconnectAttempts', this, this.reconnectAttempts);
		if (++this.reconnectAttempts < 3) {
			console.log('do reconnect');
			try {
				this.reconnectCallback(this.jid);
			} catch (err) {}
		} else {
			console.warn('Too many reconnect attempts');
		}
	}
}

export default class ConnectionWatcher {
	private instances = {};
	private reconnect;

	constructor(reconnect, disable) {
		this.reconnect = reconnect || function() {};
	}

	get(jid) {
		if (!this.instances[jid]) {
			this.instances[jid] = new Connection(jid, () => this.reconnect(jid));
		}

		return this.instances[jid];
	}

	callback(jid, status, condition) {
		console.log('#### Account', jid, status, condition);

		if (jid) {
			this.get(jid).update(status, condition);
		}
	}
}
