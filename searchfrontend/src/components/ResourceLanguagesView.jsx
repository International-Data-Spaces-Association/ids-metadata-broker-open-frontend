import React, { Component } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { elasticsearchURL } from '../urlConfig';
import { getCntResourcesByLanguage } from '../helpers/sparql/connectors';


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
const data01 = [
    { name: 'Complete', value: 98 }, { name: 'Empty', value: 2 }
];

const COLORS = ['#5FB6A1', '#E96A22'];

class ResourceLanguagesView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buckets: [],
        };

    }

    componentDidMount() {
        if (process.env.REACT_APP_USE_SPARQL === 'true') {
            getCntResourcesByLanguage(this.props.token)
                .then(data => {
                    this.setState({ buckets: data });
                })
        } else {
            axios
            .post(elasticsearchURL + '/registrations/_msearch?',
                    '{"preference":"list-6"}\n{"query":{"match_all":{}},"size":0,"aggs":{"catalog.resources.language.keyword":{"terms":{"field":"catalog.resources.language.keyword","size":100,"order":{"_count":"desc"}}}}}\n'
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
                            buckets: response.data.responses[0].aggregations["catalog.resources.language.keyword"].buckets
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
                        Resources Languages
      </Typography>
                    <ResponsiveContainer width="95%" height={160}>
                        <BarChart
                            data={this.state.buckets}
                            margin={{
                                top: 20, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid />
                            <XAxis dataKey="key" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="doc_count" fill='#888' name="Languages" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        )
    }
}

export default withStyles(styles)(ResourceLanguagesView);