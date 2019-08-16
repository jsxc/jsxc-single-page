import React from 'react';
import classNames from 'classnames';
import { withStyles, createStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ImageLogo from './jsxc-icon-white.svg';
import AccountManager from './utils/AccountManager';
import { TextField } from '@material-ui/core';

const styles = ({ spacing }) => createStyles({
	root: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: '#2e7bcf',
		zIndex: 999,
	},
	inner: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: 500,
		margin: 'auto',
		color: 'white',
		marginTop: 40,
		padding: 30,
	},
	button: {
		color: 'white',
		marginTop: spacing(3),
		float: 'right',
	},
	buttonDisabled: {
		color: 'rgba(255,255,255,0.7)',
	},
	label: {
		color: 'rgba(255,255,255,0.8)',
	},
	field: {
		color: 'white',
		marginBottom: spacing(2),
		'&:before': {
			borderColor: 'rgba(255,255,255,0.5)',
		},
		'&:hover:before': {
			borderColor: 'rgba(255,255,255,0.5) !important',
		},
	},
	warning: {
		padding: '1rem 3rem',
		marginTop: 24,
		backgroundColor: '#214a75',
	},
});

const URLPREFIX = 'https://';
const STATUS = {
	Idle: 0,
	Connecting: 1,
	Connected: 2,
};

class AddAccount extends React.Component<any, any> {
	state = {
		status: STATUS.Idle,
		warning: '',
		url: '',
		jid: '',
		password: '',
	};

	onChange = name => ev => {
		let value = ev.target.value;

		if (name === 'url') {
			value = this.hasHTTPSPrefix(value) ? value : URLPREFIX + value;
		}

		this.setState({ [name]: value });
		this.setState({ warning: '' });
	};

	onSubmit = ev => {
		ev.preventDefault();

		this.setState({ status: STATUS.Connecting });

		const { url, jid, password } = this.state;
		const domain = this.getDomainFromJid(jid);

		(window as any).JSXC.testBOSHServer(url, domain)
			.then(() => {
				return this.props.jsxc.start(url, jid, password);
			})
			.then(() => {
				AccountManager.get().add(url, jid, password);

				this.setState({ status: STATUS.Connected });

				this.props.onConnected();
			})
			.catch(error => {
				if (typeof error === 'string') {
					this.setState({ warning: error });
				} else if (error.message) {
					this.setState({ warning: error.message });
				} else {
					this.setState({
						warning:
							'Sorry we could not connect. Maybe your Jabber ID or password is wrong.',
					});
				}

				this.setState({ status: STATUS.Idle });
			});
	};

	getDomainFromJid(jid) {
		let parts = jid.split('@');

		return parts[1];
	}

	hasHTTPSPrefix(url = '') {
		for (let i = 0; i < url.length && i < URLPREFIX.length; i++) {
			if (url[i] !== URLPREFIX[i]) return false;
		}

		return true;
	}

	render() {
		const { classes } = this.props;
		const { status, url } = this.state;
		const disabled = status === STATUS.Connecting;
		let buttonLabel = disabled ? 'Connecting...' : 'Connect';

		return (
			<div className={classes.root}>
				<div className={classes.inner}>
					<img
						src={ImageLogo}
						style={{ maxWidth: '100%', margin: 40, minWidth: 180 }}
						alt="Logo"
					/>

					<form onSubmit={this.onSubmit}>
						<TextField
							autoFocus
							disabled={disabled}
							required
							label="BOSH Url"
							value={url}
							onChange={this.onChange('url')}
							InputProps={{
								className: classes.field,
							}}
							InputLabelProps={{
								className: classes.label,
							}}
							fullWidth
						/>
						<TextField
							type="email"
							disabled={disabled}
							required
							label="Jabber Id"
							onChange={this.onChange('jid')}
							InputProps={{
								className: classes.field,
							}}
							InputLabelProps={{
								className: classes.label,
							}}
							autoComplete="off"
							fullWidth
						/>
						<TextField
							type="password"
							disabled={disabled}
							required
							label="Password"
							onChange={this.onChange('password')}
							InputProps={{
								className: classes.field,
							}}
							InputLabelProps={{
								className: classes.label,
							}}
							autoComplete="off"
							fullWidth
						/>

						{/* @TODO clear button */}
						<Button
							type="submit"
							disabled={disabled}
							className={classNames(
								classes.button,
								disabled && classes.buttonDisabled
							)}
							color="primary"
						>
							{buttonLabel} <KeyboardArrowRight />
						</Button>
						<div style={{ clear: 'both' }} />

						{this.state.warning ? (
							<div className={classes.warning}>{this.state.warning}</div>
						) : (
							''
						)}
					</form>
				</div>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(AddAccount);
