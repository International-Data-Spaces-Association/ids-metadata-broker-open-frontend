import React, { Component } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { List, ListItem } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';


import Logo from '../assets/MDS-Logo-black.svg'

const styles = theme => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: '0 1px #ccc',
        padding: '30px 20px',
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.leavingScreen
        }),
    },
    appBarMDS: {
        background: 'none !important',
        boxShadow: 'none'
    },
    appBarOpen: {
        height: '100%',
        backgroundColor: '#FFFF00 !important',
        boxShadow: 'none'
    },
    container: {
        padding: '0 8px',
    },
    selectedContainer: {
        background: 'linear-gradient(180deg, #FFF0 40%, #FF0 0)',
    },
    appBarIconDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    text: {
        color: 'black !important',
        marginLeft: '24px',
        fontSize: 18,
    },
    searchIcon: {
        margin: "0 50px"
    }
})

function ToolbarLinkFunction(props) {
    const { classes } = props;
    return (
        <ListItem button className={props.className} selected={props.selected} onClick={props.onClick}>
            <div className={clsx(classes.container, props.selected && classes.selectedContainer)}>
                <Link to={props.linkTo} style={{ textDecoration: 'none' }}>
                    <Typography className={classes.text}>{props.label}</Typography>
                </Link>
            </div>
        </ListItem>
    )
}

const ToolbarLink = withStyles(styles)(ToolbarLinkFunction)

class ToolbarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openBrokerMenu: false
        };
    }

    static propTypes = {
        auth: PropTypes.object.isRequired,
    }

    handleDrawerOpen = () => {
        this.setState({
            open: true
        })
    };

    handleDrawerClose = () => {
        this.setState({
            open: false
        })
    };

    handleBrokerMenuClick = () => {
        let newState = !this.state.openBrokerMenu
        this.setState({
            openBrokerMenu: newState
        })
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;
        const { classes } = this.props;
        const showDashboard = false;
        const selectedPath = this.props.location.pathname;
        const mobilityForumUrl = "http://forum.mobility-dataspace.eu/"
        const mobilityContactUrl = "https://mobility-dataspace.eu/#c317"

        return (
            <AppBar position={this.state.open ? "absolute" : "static"} className={clsx(classes.appBar, this.state.open ? classes.appBarOpen: classes.appBarMDS, 'appbar')}>
                <Toolbar>
                    <div className="logo-wrapper">
                        <Link style={{ textDecoration: 'none' }} className="header-logo" to="/" 
                                onClick={this.handleDrawerClose}>
                            <img src={Logo} alt="Mobility Data Space" width='200px' />
                        </Link>

                        <div className="menu-button">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.state.open ? this.handleDrawerClose : this.handleDrawerOpen}
                            >
                                {this.state.open ? <CloseIcon /> : <MenuIcon />}
                            </IconButton>
                        </div>
                    </div> 

                    <nav className={clsx(!this.state.open && "mobile-hidden")}>
                        <div className={clsx("mobile-only", "menu-item", "expandable", this.state.openBrokerMenu && "expanded")} onClick={this.handleBrokerMenuClick}>Broker Platform</div>
                        <List className={clsx("toolbar-list", !this.state.openBrokerMenu && "mobile-hidden")} component="div">

                            <ToolbarLink
                                linkTo="/"
                                className="mobile-only"
                                selected={selectedPath === '/'}
                                onClick={this.handleDrawerClose}
                                label="Home" />

                            <ToolbarLink
                                linkTo="/resources"
                                selected={selectedPath.startsWith('/resources')}
                                onClick={this.handleDrawerClose}
                                label="Resources" />

                            <ToolbarLink
                                linkTo="/connector"
                                selected={selectedPath.startsWith('/connector')}
                                onClick={this.handleDrawerClose}
                                label="Connectors" />


                            {
                                showDashboard 
                                    ? <ToolbarLink
                                        linkTo="/browse"
                                        selected={selectedPath.startsWith('/browse')}
                                        onClick={this.handleDrawerClose}
                                        label="Dashboard" />
                                    : ""
                            }
                            
                            {
                                isAuthenticated && user.role === "admin"
                                    ? <ToolbarLink
                                        linkTo="/admin"
                                        selected={selectedPath.startsWith('/admin')}
                                        onClick={this.handleDrawerClose}
                                        label="Admin" />
                                    : ""
                            }

                            {
                                isAuthenticated && user.role === "admin"
                                    ? <ToolbarLink
                                        linkTo="/maintainer"
                                        selected={selectedPath.startsWith('/maintainer')}
                                        onClick={this.handleDrawerClose}
                                        label="Maintainer" />
                                    : ""
                            }
                        </List>

                        <div className='mobile-only menu-item'><a href={mobilityForumUrl} target="_blank">MDS Forum</a></div>
                        <div className='mobile-only menu-item'><a href={mobilityContactUrl}>Contact</a></div>
                    </nav>

                    <div className={classes.appBarIconDiv}>
                        <div className={clsx("login-button", "mobile-hidden")}>
                            <Button
                            onClick={() => {
                                window.open(mobilityForumUrl, "_blank");
                            }}>MDS Forum</Button>
                        </div>
                    </div>

                </Toolbar>
            </AppBar>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    null
)(withStyles(styles)(withRouter(ToolbarList)));