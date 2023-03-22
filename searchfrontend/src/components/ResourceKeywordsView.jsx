import React, { Component } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { elasticsearchURL } from '../urlConfig';
import { getCntResourcesByKeyword } from '../helpers/sparql/connectors';


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


class ResourceKeywordsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buckets: [],
    };

  }

  componentDidMount() {
    if (process.env.REACT_APP_USE_SPARQL === 'true') {
      getCntResourcesByKeyword(this.props.token)
        .then(data => {
          this.setState({ buckets: data });
        })
    } else {
      axios
      .post(elasticsearchURL + '/registrations/_msearch?',
          '{"preference":"list-2"}\n{"query":{"match_all":{}},"size":0,"aggs":{"catalog.resources.keyword.keyword":{"terms":{"field":"catalog.resources.keyword.keyword","size":100,"order":{"_count":"desc"}}}}}\n'
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
              buckets: response.data.responses[0].aggregations["catalog.resources.keyword.keyword"].buckets
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
    return (
      <div>
        <Card className={classes.card}>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Resource Keywords
    </Typography>
          <ResponsiveContainer width="95%" height={300}>
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
              <Bar dataKey="doc_count" fill='#888' name="Keywords Count" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles)(ResourceKeywordsView);