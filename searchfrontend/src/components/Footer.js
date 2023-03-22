import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import { List, ListItem } from '@material-ui/core';
import LoginOrLogout from './auth/LoginOrLogout';
import "../css/MDS.css"

class Footer extends Component {
    render() {
        return (
            <Box component="footer" className="footer" m={4}>
                <Grid container className="footer-copyright">
                    <Grid container item xs={6}  lg={3} md={3} className="footer-header">
                        <h5 style={{ fontSize: '22px', marginTop: '16px', fontWeight: 'normal' }}>Mobility<br />Data Space</h5>
                        <LoginOrLogout />
                    </Grid>
                    <Grid className="footer-mail" container item xs={6} lg={3} md={3} >
                        <List>
                            <ListItem button>
                                <Link to="/imprint">Legal Notice</Link>
                            </ListItem>
                            <ListItem button>
                                <a href="https://mobility-dataspace.eu/#c317" target="_blank">Contact</a>
                            </ListItem>
                            <ListItem button>
                                <a href="https://mobility-dataspace.eu/privacy-policy">Data Protection Policy</a>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid className="footer-mail" container item xs={6} lg={3} md={3} >
                        
                    </Grid>
                    <Grid className="footer-right" item xs={6} lg={3} md={3}  >
                        <p className="modified">  Last Modified: {new Date(document.lastModified).getDate() + "." + parseInt(new Date(document.lastModified).getMonth() + 1) + "." + new Date(document.lastModified).getFullYear()}</p>
                        <p>&nbsp;</p>
                        <p>© {new Date().getFullYear()}&nbsp;Mobility Data Space</p>
                    </Grid>

                </Grid>
            </Box>
        )
    }
}

export default Footer