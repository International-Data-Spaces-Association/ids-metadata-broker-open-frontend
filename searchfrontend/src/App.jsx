import React from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import { ReactiveBase } from "@appbaseio/reactivesearch";
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import { Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import SearchConnectors from "./components/SearchConnectors";
import SearchFhgResources from "./components/SearchFhgResources";
import DataPrivacyView from "./DataPrivacyView";
import ImprintView from "./ImprintView";
import MDSHome from "./MDSHome"
import ToolbarList from './components/ToolbarList';

import "./css/App.scss"
import "./css/MDS.css"
import Maintainer from "./components/Maintainer";
import UsageControl from "./components/UsageControl";
import ParticipantList from "./components/ParticipantList";
import SearchMDMResources from './components/SearchMDMResources';
import { BrokerResourceView } from './components/BrokerResourceView';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';
import LoginOrLogout from './components/auth/LoginOrLogout';
import SidebarList from './components/SidebarList';
import Adminx from './components/Adminx';
import { BrokerConnectorViewComponent } from './components/BrokerConnectorViewComponent';

import { elasticsearchURL } from './urlConfig';
import Footer from './components/Footer';
import ImprintViewMDS from './ImprintViewMDS';

const drawerWidth = 300;
const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        backgroundColor: '#F2F2F2',
        height: '65px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        boxShadow: '0 1px #ccc',
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.leavingScreen
        }),
    },
    appBarMDS: {
        background: 'none !important',
        boxShadow: 'none'
    },
    appBarShift: {
        marginLeft: drawerWidth,
        boxShadow: '0 1px #ccc',
        width: `calc(100% - ${drawerWidth}px)`,
        height: '65px',
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    menuButtonHidden: {
        display: 'none',
    },
    logo: {
        marginTop: '6px',
        display: 'flex',
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        '& p': {
            marginTop: '25px'
        },
        '& h4': {
            marginTop: '2px'
        }
    },
    drawerPaper: {
        whiteSpace: 'nowrap',
        width: drawerWidth,
        borderWidth: '0px',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        //backgroundColor: 'white',
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: 0,
    },
    contentShift: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
    },
    container: {
        padding: '20px !important'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    titles: {
        marginLeft: '48px',
        flexGrow: 3,
        display: 'flex',
    },
});

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: true,
            resource: {}
        };

        // localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("user", "");
    }

    // change eis to paris to have the paris frontend
    tenant = process.env.REACT_APP_TENANT || 'eis';
    tenant = this.tenant.toLowerCase();

    /*
    Do not initialize broker URL in componentDidMount because it is only called onComponentMount.
    Get Broker URL dynamically to make it available for all routing paths.
    */
    getBrokerURL = () => {        
        // development only
       // return new URL(window._env_.REACT_APP_BROKER_URL).toString();

        // uncomment for deployment
        return elasticsearchURL;
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

    updateResource = (obj) => {
        this.setState({
            resource: obj
        }, () => {
            window.localStorage.setItem('resource', JSON.stringify(this.state.resource))
        })
    }

    renderSubTitle = (url) => {
        if (url.indexOf('connector') > -1 || url.indexOf('resources') > -1) {
            return 'Search';
        } else if (url.indexOf('browse') > -1) {
            return 'Dashboard';
        } else {
            return 'Dashboard';
        }
    }

    renderMainTitle = (name) => {
        if (name === 'paris') {
            document.title = "Participant Information Service";
            return 'Participant Information Service (ParIS)';
        } else if (name === 'eis') {
            document.title = "International Data Spaces Broker";
            return 'Fraunhofer IAIS';
        } else if (name === 'fhg') {
            document.title = "Fraunhofer-Digital Data Space Broker";
            return 'Fraunhofer-Datenraum';
        } else if (name === 'mobids') {
            document.title = "Mobility Data Space Broker";
            return 'Mobility Data Space Broker';
        } else return 'International Data Spaces';
    }

    renderComponentTenant = (name) => {
        if (name === 'paris') {
            return (
                <SearchConnectors {...this.props} />
            )
        } else if (name === 'eis') {
            return (
                <SearchConnectors {...this.props} />
            )
        } else if (name === 'fhg') {
            return (
                <SearchFhgResources {...this.props} updateResource={this.updateResource} />
            )
        } else {
            return (
                <SearchConnectors {...this.props} />
            )
        }
    }

    getElasticSearchIndex = (name) => {
        if (name === 'fhg')
            return 'fhgresources';
        else
            return 'registrations';
    }

    componentDidMount() {
        this.setState({
            resource: window.localStorage.getItem("resource")
        })
        store.dispatch(loadUser());
    }

    render() {
        const { classes } = this.props;
        let tenant = this.tenant.toLowerCase();
        let currentResource = this.state.resource;
        let footerPos1 = ""
        let footerPos2 = ""
        let logo = <Link style={{ textDecoration: 'none' }} to="/">
            <h1>IDS</h1>
        </Link>
        let hasDrawer = this.tenant !== 'mobids'

        if (tenant === 'mobids') {
            this.state.open = false
            footerPos2 = <Footer />
        }
        else {
            footerPos2 = <Box component="footer" className="footer" m={2}>
                <Grid container spacing={6} className="footer-copyright">
                    <Grid container item xs={6} className="footer-header">
                        <h5 style={{ fontSize: '14px', paddingTop: '6px' }}>{this.renderMainTitle(this.tenant)}</h5>
                        <p style={{ fontSize: '10px', textAlign: 'left' }}>International Data Spaces</p>
                    </Grid>
                   
                    <Grid className="footer-mail" container item xs={6} lg={6} md={6} >
                        <a href="https://www.iais.fraunhofer.de/.org/" style={{ fontSize: '10px' }}>© {new Date().getFullYear()}&nbsp;Fraunhofer IAIS</a>
                    </Grid>

                    <Grid className="footer-privacy" container item xs={6} lg={6} md={6} style={{ marginTop: '10px' }}>
                        <Link to="/data-protection" style={{ fontSize: '10px' }}>Data Protection Policy</Link>
                    </Grid>
                    <Grid className="footer-mail" container item xs={6} lg={6} md={6}  >
                        <p style={{ fontSize: '10px' }}>  Last Modified: {new Date(document.lastModified).getDate() + "." + parseInt(new Date(document.lastModified).getMonth() + 1) + "." + new Date(document.lastModified).getFullYear()}</p>
                    </Grid>
                    <Grid className="footer-privacy" container item xs={6} lg={6} md={6}>
                        <Link to="/imprint" style={{ fontSize: '10px' }}>Imprint</Link>
                    </Grid>

                </Grid>
            </Box>
        }

        let drawer = <Drawer
            variant="persistent"
            classes={{
                paper: clsx(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}>
            <div className={classes.toolbarIcon} >
                {logo}
            </div>
            <SidebarList tenant={this.tenant} />
            {footerPos1}
        </Drawer>

        let defaultAppbar = <AppBar position="absolute" className={clsx(classes.appBar, this.state.open && classes.appBarShift, this.tenant === 'mobids' && classes.appBarMDS)}>
        <Toolbar className={classes.toolbar}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={this.state.open ? this.handleDrawerClose : this.handleDrawerOpen}
                className={hasDrawer ? classes.menuButton : classes.menuButtonHidden}
            >
                <MenuIcon />
            </IconButton>

            <div color="inherit" className={classes.logo}>
                <div className={classes.titles}>
                    <h3 style={{ color: '#808080' }}>{this.renderMainTitle(this.tenant)}</h3>
                    <h3 style={{ fontWeight: 'bold', marginLeft: '10px', color: '#808080' }}>{this.renderSubTitle(this.props.location.pathname)}</h3>
                </div>
            </div>

            <LoginOrLogout />
        </Toolbar>
    </AppBar>

        return (
            <Provider store={store}>
                <div className={clsx("theme-" + this.tenant, {['home']: this.props.location.pathname === '/'})}>
                    <CssBaseline />

                    { this.tenant === 'mobids' ? <ToolbarList /> : defaultAppbar }

                    { hasDrawer ? drawer : '' }
                    <main className={clsx({
                        [classes.content]: this.tenant !== 'mobids',
                        [classes.contentShift]: this.state.open
                    })}>
                        <div className={clsx(classes.appBarSpacer, 'appBarSpacer')} />
                        <Container maxWidth="xl" className={classes.container}>
                            
                            
                        { this.tenant == 'mobids' ? <Route exact path="/">
                                <MDSHome />
                            </Route> : ""}
                            { this.tenant == 'eis' ? <Route path="/browse">
                                <Dashboard />
                            </Route> : ""}
                            <Route path="/connector/:resID">
                                <Grid container>
                                    <Grid item md={3} xs={12}>
                                    </Grid>
                                    <Grid item lg={6} md={9} xs={12}>
                                        <BrokerConnectorViewComponent {...this.props} es_url={this.getBrokerURL()} showBackButton={false} />
                                    </Grid>
                                </Grid>
                            </Route>
                            <Route exact path="/connector">
                                <ReactiveBase
                                    app={this.getElasticSearchIndex(this.tenant)}
                                    credentials="null"
                                    url={this.getBrokerURL()}
                                    analytics
                                >
                                    {
                                        this.renderComponentTenant(this.tenant)
                                    }
                                </ReactiveBase>
                            </Route>
                            <Route path="/resources/:resID">
                                <Grid container>
                                    <Grid item md={3} xs={12}>
                                    </Grid>
                                    <Grid item lg={6} md={9} xs={12}>
                                        <BrokerResourceView {...this.props} es_url={this.getBrokerURL()} showBackButton={false} />
                                    </Grid>
                                </Grid>
                            </Route>
                            <Route exact path="/resources">
                                <ReactiveBase
                                    app="resources"
                                    credentials="null"
                                    url={this.getBrokerURL()}
                                    analytics
                                >
                                    <SearchMDMResources {...this.props} />
                                </ReactiveBase>
                            </Route>
                            <Route exact path="/participants">
                                <ReactiveBase
                                    app={this.getElasticSearchIndex(this.tenant)}
                                    credentials="null"
                                    url={this.getBrokerURL()}
                                    analytics
                                >
                                    {
                                        this.renderComponentTenant(this.tenant)
                                    }
                                </ReactiveBase>
                            </Route>
                            <Route path="/data-protection">
                                <DataPrivacyView />
                            </Route>
                            { this.tenant !== 'mobids' ? <Route path="/imprint">
                                <ImprintView />
                            </Route> : ""}
                            { this.tenant == 'mobids' ? <Route path="/imprint">
                                <ImprintViewMDS />
                            </Route> : ""}
                            <Route path="/maintainer">
                                <Maintainer />
                            </Route>
                            <Route path="/usage-control">
                                <UsageControl />
                            </Route>
                            <Route path="/participant-list">
                                <ParticipantList />
                            </Route>
                            <Route path="/admin">
                                <Adminx />
                            </Route>
                            
                        </Container>
                        {footerPos2}
                    </main>
                </div>
            </Provider>
        );
    }
}

export default withStyles(styles)(App);