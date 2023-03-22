import React from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing(50),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '40ch',
    },
    '& .loginButtonWrapper': {
      width: '100%',
      // marginLeft: '1ch',
      margin: theme.spacing(1)
    },
    '& .login-message': {
      color: "#B22222"
    }
  },
  button: {

    color: '#FFF', fontWeight: 'bold', borderRadius: 32,
    boxShadow: 'none',
    backgroundColor: '#666',
    '&:hover': {
      backgroundColor: '#999',
      color: '#666',
      boxShadow: 'none',
    }

  }
});

class Login extends React.Component {

  state = {
    modal: false,
    username: '',
    password: '',
    msg: null
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for login error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close Modal
    if (this.state.modal) {
      if (isAuthenticated) {
        this.toggle();
      }
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = e => {
    e.preventDefault();

    const { username, password } = this.state;

    const user = {
      username,
      password
    }

    // Attempt to login
    this.props.login(user);

  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.loginForm}>
        <Button
          className={classes.button}
          onClick={this.toggle}>
          Admin Login
        </Button>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.modal}
          onClose={this.toggle}

        >
          <div
            style={getModalStyle()}
            className={classes.paper}
            ref={el => { this.myEl = el; }}
          >
            {this.state.msg ? (
              <div className="login-message">{this.state.msg}</div>
            ) : null}

            <form onSubmit={this.onSubmit}>
              <TextField
                id="outlined-basic"
                label="Username"
                variant="outlined"
                name="username"
                value={this.state.username}
                onChange={this.onChange}
              // required
              />
              <TextField
                id="standard-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                name="password"
                value={this.state.password}
                onChange={this.onChange}
              // required
              />
              <div className="loginButtonWrapper">
                <Button type="submit" className={classes.button}>Login</Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
})

export default connect(
  mapStateToProps,
  { login, clearErrors }
)(withStyles(styles)(Login));
