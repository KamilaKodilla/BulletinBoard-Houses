import React from 'react';
import PropTypes from 'prop-types';

import clsx from 'clsx';

import { connect } from 'react-redux';
import { getStatus, getUserStatus } from '../../../redux/userSwitcherRedux';

import styles from './Header.module.scss';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';

class Component extends React.Component {
  handleOnChange = (event) => {
    const { getUserStatus, user } = this.props;

    if (event === 'true') {
      user.active = true;
      getUserStatus(true);
    } else {
      user.active = false;
      getUserStatus(false);
    }
  };

  render() {
    const { className, userStatus, children } = this.props;

    return (
      <div className={clsx(className, styles.root)}>
        <AppBar position="sticky" className={styles.appbar}>
          <Container maxWidth="xl">
            <Toolbar className={styles.toolbar}>
              <Typography variant="h4">
                <Link to={'/'} className={styles.link}>
                    Bulletin Board - HOUSES
                </Link>
              </Typography>
              {userStatus === true ? (
                <>
                  <Typography variant="h6">
                    <Link to={'/'} className={styles.link}>
                      LIST OF YOURS ADDS
                    </Link>
                  </Typography>
                  <Button
                    color="inherit"
                    variant="outlined"
                    component={Link}
                    className={styles.login}
                    to={'/'}
                    value="false"
                    onClick={(event) => this.handleOnChange(event.target.value)}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  color="inherit"
                  variant="outlined"
                  href="https://google.com"
                  className={styles.login}
                  value="true"
                  onClick={(event) => this.handleOnChange(event.target.value)}
                >
                  Login
                </Button>
              )}
            </Toolbar>
          </Container>
        </AppBar>

        {children}
      </div>
    );
  }
}

Component.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  userStatus: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  userStatus: getStatus(state),
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  getUserStatus: (user) => dispatch(getUserStatus(user)),
});

const ContainerHeader = connect(mapStateToProps, mapDispatchToProps)(Component);

export {
  //Component as Header,
  ContainerHeader as Header,
  Component as HeaderComponent,
};
