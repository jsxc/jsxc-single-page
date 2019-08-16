import { IconButton, List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { createStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import AccountManager from './utils/AccountManager';

const styles = theme => createStyles({
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
		marginTop: theme.spacing(3),
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
		marginBottom: theme.spacing(2),
		'&:before': {
			backgroundColor: 'rgba(255,255,255,0.5)',
		},
		'&:hover:before': {
			backgroundColor: 'rgba(255,255,255,0.5) !important',
		},
	},
	warning: {
		padding: '1rem 3rem',
		marginTop: 24,
		backgroundColor: '#214a75',
	},
	dialog: {
		backgroundColor: 'white',
		padding: theme.spacing(2),
	},
	buttonLeft: {
		marginRight: theme.spacing(1),
	},
});

class Overview extends React.Component<any, any> {
	private accountManager: AccountManager;

	state = {
		accounts: [],
	};

	constructor(props) {
		super(props);

		this.accountManager = AccountManager.get();
	}

	componentDidMount() {
		this.setState({ accounts: this.accountManager.getAllIds() });
	}

	onChange = name => ev => { };

	onSubmit = ev => { };

	onDelete = jid => ev => {
		this.accountManager.remove(jid);

		this.setState({ accounts: this.accountManager.getAllIds() });

		//@TODO logout
	};

	render() {
		const { classes, onClose, onAddAccount, ...other } = this.props;
		const { accounts } = this.state;

		return (
			<Dialog
				open
				onClose={onClose}
				aria-labelledby="simple-dialog-title"
				classes={{ paper: classes.dialog }}
				{...other}
			>
				<DialogTitle id="simple-dialog-title">Accounts</DialogTitle>
				<div>
					<List>
						{accounts.map(jid => {
							let account = this.accountManager.get(jid);

							return (
								<ListItem button key={jid}>
									<ListItemText primary={jid} secondary={account.url} />
									<ListItemSecondaryAction>
										<IconButton onClick={this.onDelete(jid)}>
											<DeleteIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>

					<Button disabled onClick={onAddAccount}>
						<AddIcon className={classes.buttonLeft} /> add account
					</Button>
				</div>
			</Dialog>
		);
	}
}

export default withStyles(styles, { withTheme: true })(Overview);
