import axios from 'axios';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionRoundedIcon from '@material-ui/icons/DescriptionRounded';
import { Container } from '@material-ui/core';
import { elasticsearchURL } from '../urlConfig';
import { getCntResourcesByPublisher } from '../helpers/sparql/connectors';


const styles = theme => ({
    card: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold'

    },
});
const url = window.location.hostname;

class ResourcePublishersView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buckets: [],
        };

    }

    componentDidMount() {
        if (process.env.REACT_APP_USE_SPARQL === 'true') {
            getCntResourcesByPublisher(this.props.token)
                .then(data => {
                    this.setState({ buckets: data });
                })
        } else {
            axios
            .post(elasticsearchURL + '/registrations/_msearch?',

                    '{"preference":"list-3"}\n{"query":{"match_all":{}},"size":0,"aggs":{"catalog.resources.publisher.keyword":{"terms":{"field":"catalog.resources.publisher.keyword","size":100,"order":{"_count":"desc"}}}}}\n'
                    , {
                        headers: {
                            'accept': 'application/json',
                            'content-type': 'application/x-ndjson'
                        }
                    }
                )
                .then(response => {
                    if (response.status === 200) {
                        this.setState({
                            buckets: response.data.responses[0].aggregations["catalog.resources.publisher.keyword"].buckets
                        })
                        console.log(this.state.buckets)
                    }
                })
                .catch(err => {
                    console.log("An error occured: " + err);
                })
        }
    }

    render() {
        const { classes } = this.props;

        let renderLabel = function (entry) {
            return entry.key;
        }

        return (
            <div>
                <Card className={classes.card}>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Top 3 Publishers: Number of Resources
        </Typography>
                    <List className="info-list">
                        {this.state.buckets !== undefined && this.state.buckets.slice(0, 3).map((item) => (
                            <ListItem onClick={() => item.key}>
                                <ListItemIcon>
                                    <DescriptionRoundedIcon />
                                </ListItemIcon>
                                <ListItemText style={{ whiteSpace: 'normal' }}
                                    primary={`${item.key} (${item.doc_count})`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(ResourcePublishersView);