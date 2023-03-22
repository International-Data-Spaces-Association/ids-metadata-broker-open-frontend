import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import axios from 'axios';
import ResourceKeywordsView from './components/ResourceKeywordsView';
import ResourceLanguagesView from './components/ResourceLanguagesView';
import ResourcePublishersView from './components/ResourcePublishersView';
import iconSet from "./assets/icons/selection.json"
import IcomoonReact, { iconList } from "icomoon-react";

import MapConnectors from './maps/MapConnectors';
import MapResourcesCountries from './maps/MapResourcesCountries';

import addConnector from './helpers/addConnector';

import { elasticsearchURL } from './urlConfig';
import { getAllConnectors, getAllResources } from './helpers/sparql/connectors';

import { connect } from 'react-redux';

const data = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },

];

const data01 = [
  { name: 'Complete', value: 98 }, { name: 'Empty', value: 2 },
];

const COLORS = ['#5FB6A1'];


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  table: {
    minWidth: 400,
  },
  card: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'

  },
});

function createData(name, percentage) {
  return { name, percentage };
}

const rows = [
  createData('example_one.csv', 77),
  createData('example_two.csv', 63),
  createData('example_three.csv', 49)
];

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" color="secondary" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

class Dashboard extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      connectors: [],
      dateSorted: [],
      resources: 0,
      tabValue: 0,
      filteredConnectors: [],
      //attributes needed for SPARQL functionality
      connectorsS: [],
      resourcesS: [],
      dateSortedS: [],
      filteredConnectorsS: []
    };
  }

  //M.P: uncomment when running locally in IMP
   setBrokerURL = () => {
    return elasticsearchURL;
  } 
/*
  setBrokerURL = () => {
    if (window._env_ === undefined)
      this.brokerURL = 'http://localhost:9200';
    else
      this.brokerURL = window._env_.REACT_APP_BROKER_URL;
    this.brokerURL = new URL(this.brokerURL).toString();
  }*/

  componentDidUpdate(prevProps, prevState) {
    //the case when both resources and connectors info is in state // TODO
    if (prevState.resourcesS !== undefined && this.state.connectorS !== undefined && prevState.resourcesS.length === 0 && this.state.connectorsS.length !== 0) {
      let { connectorsS, resourcesS } = this.state;
      if (connectorsS.length !== 0 && resourcesS.length !== 0) {
        for (let i = 0; i < resourcesS.length; i++) {
          let connectorURI = resourcesS[i].connectorURI;
          let connector = connectorsS.find(connector => connector.connector.originURI === connectorURI);
          connector.resources.push(resourcesS[i]);
        }
        //Filtering out connectors with 0 resources
        let filteredConnectors = connectorsS.filter(connector => connector.resources.length !== 0);

        // Sorting filtered connectors according to their resources number (descending order)
        filteredConnectors.sort((connector_a, connector_b) => connector_b.resources.length - connector_a.resources.length);

        this.setState({
          connectorsS: connectorsS,
          filteredConnectorsS: filteredConnectors
        });
      }
    }
  }

  componentDidMount() {
    this.setBrokerURL();
    if (process.env.REACT_APP_USE_SPARQL === 'true') {
      //get connectors (without resources)
      getAllConnectors(this.props.token)
        .then(data => {
          this.setState({
            connectorsS: data,
            dateSortedS: data
          })
        })
      //get resources
      getAllResources(this.props.token)
        .then(data => {
          if(data != undefined) {
            this.setState({
              resources: data.length,
              resourcesS: data
            })
          }
        })
    } else {
      axios
      .get(elasticsearchURL + '/registrations/_search?size=100&q=*:*')
      .then(response => {
        if (response.status === 200) {


          this.setState({
            connectors: response.data.hits.hits,
            dateSorted: response.data.hits.hits,
          })

          let resources = 0;

          // Filtering out connectors with 0 resources (in various JSON formats, it was causing the bug)
          var filteredConnectors = this.state.connectors.filter(function (item) {
            return (!(typeof item["_source"].catalog === "undefined" || typeof item["_source"].catalog?.[0].resources?.length === "undefined" || item["_source"].catalog?.[0].resources?.length === 0));
          });

          // Sorting filtered connectors according to their resources number (descending order)
          filteredConnectors.sort((a, b) => b["_source"].catalog[0].resources.length - a["_source"].catalog[0].resources.length);

          // Counting the total number of resources to be displayed in the dashboard
          filteredConnectors.map(item => (
            resources += item["_source"]?.catalog?.[0]?.resources?.length
          ))

          this.setState({
            resources: resources,
            filteredConnectors: filteredConnectors
          })

        }
      })
      .catch(err => {
        console.log("An error occured: " + err);
      })
    }
  }

  getConnectorsWithResources() {
    axios
      .get(elasticsearchURL + "/registrations/_search?size=100")
      .then(response => {
        if (response.status === 200) {
          this.setState({ connectors: response.data.hits.hits });
        }
      })
      .catch(err => {
        console.log("An error occured: " + err);
      })
  }

  getNumberOfResources() {
    let cnt = 0;
    let { connectors } = this.state;
    for (let i = 0; i < connectors.length; i++) {
      let catalogs = connectors[i]._source.catalog;
      for (let j = 0; j < catalogs.length; j++) {
        let resources = catalogs[j].resources;
        if (resources) {
          let cntResourcesForConnector = catalogs[j].resources.length;
          cnt += cntResourcesForConnector;
        }
      }
    }
    return cnt;
  }

  getSizeOfResources() {
    let size = 0;
    let { connectors } = this.state;
    for (let i = 0; i < connectors.length; i++) {
      let resources = connectors[i]._source.catalog[0].resources;
      if (resources) {
        for (let j = 0; j < resources.length; j++) {
          let sizeOfResource = resources[j].representation ? parseInt(resources[j].representation[0].instance[0].bytesize, 10) : 0; // M.P. change to support multiple representations and instances
          size += sizeOfResource;
        }
      }
    }
    return size / 1000;
  }

  getResourceTypesDistribution() {
    let data = [];
    let { connectors } = this.state;
    for (let i = 0; i < connectors.length; i++) {
      let resources = connectors[i]._source.catalog[0].resources;
      if (resources) {
        for (let j = 0; j < resources.length; j++) {
          let resourceFileName = resources[j].representation ? resources[j].representation[0].instance[0].filename : null; // M.P. change to support multiple representations and instances
          if (resourceFileName) {
            let resourceFileType = resourceFileName.split(".")[1];
            if (data.some(o => o.name === resourceFileType)) {
              let index = data.findIndex(o => o.name === resourceFileType);
              data[index].value = data.find(o => o.name === resourceFileType).value + 1;
            } else {
              data.push({ "name": resourceFileType, "value": 1 });
            }
          }
        }
      }
    }
    return data;
  }

  getConnectorsAndResourcesData() {
    let data = [];
    let { connectors } = this.state;
    for (let i = 0; i < connectors.length; i++) {
      let resources = connectors[i]._source.catalog[0].resources;
      let cntResourcesForConnector = 0;
      if (resources) {
        cntResourcesForConnector = resources.length;
      }
      data.push({
        "name": "C" + i, //M.P. should be changed
        "cntResources": cntResourcesForConnector
      })
    }
    return data;
  }

  getConnectors() {
    let connectorsWithoutResources = [];
    if (process.env.REACT_APP_USE_SPARQL === 'true') {
      let { connectorsS } = this.state;
      for (let i = 0; connectorsS !== undefined && i < connectorsS.length; i++) {
        let connectorS = connectorsS[i].connector;
        if (connectorS) {
          connectorsWithoutResources.push(connectorS);
        }
      }
    } else {
      let { connectors } = this.state;
      for (let i = 0; i < connectors.length; i++) {
        let connector = connectors[i]._source.connector;
        if (connector) {
          connectorsWithoutResources.push(connector);
        }
      }
    }
    return connectorsWithoutResources;
  }

  getResources() {
    let resources = [];
    if (process.env.REACT_APP_USE_SPARQL === 'true') {
      let { connectorsS } = this.state;
      for (let i = 0; connectorsS !== undefined && i < connectorsS.length; i++) {
        let resourcesPerConnector = connectorsS[i].resources;
        if (resourcesPerConnector) {
          resources.push(resourcesPerConnector);
        }
      }
    } else {
      let { connectors } = this.state;
      for (let i = 0; connectors != undefined && i < connectors.length; i++) {
        let resourcesPerConnector = connectors[i]._source.catalog?.[0].resources;
        if (resourcesPerConnector) {
          resources.push(resourcesPerConnector);
        }
      }
    }
    return resources;
  }

  getResourcesSpatialCoverages() {
    let { connectors } = this.state;
    let resourcesSpatialCoverages = [];
    for (let i = 0; i < connectors.length; i++) {
      let resources = connectors[i]._source.catalog[0].resources;
      if (resources) {
        for (let j = 0; j < resources.length; j++) {
          resourcesSpatialCoverages.push(resources[j].spatialCoverages);
        }
      }
    }
    return resourcesSpatialCoverages;
  }

  handleTabChange(event, newValue) {
    this.setState({ tabValue: newValue });
  }

  renderLabel(entry) {
    return entry.name;
  }

  getTime(unixTime) {
    var dateTime = new Date(unixTime);
    return dateTime.toISOString();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className="dashboard">
        <Grid container spacing={3}>
          <Grid container item xs={6} spacing={3} alignContent='flex-start'>
            <Grid item xs={4}>
              <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Connectors
                </Typography>
                <Typography variant="h5" component="h3" color='primary' style={{ fontWeight: 'bold' }} >
                  {process.env.REACT_APP_USE_SPARQL === 'true' && (this.state.connectorsS ? this.state.connectorsS.length : 0)}
                  {process.env.REACT_APP_USE_SPARQL === 'false' && (this.state.connectors ? this.state.connectors.length : 0)}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Resources
                </Typography>
                <Typography variant="h5" component="h3" color='primary' style={{ fontWeight: 'bold' }} >
                  {this.state.resources}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className={classes.card}>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Participants
                </Typography>
                <Typography variant="h5" component="h3" color='primary' style={{ fontWeight: 'bold' }} >
                  -
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <ResourceKeywordsView {...this.props} es_url={this.brokerURL} />
            </Grid>
            <Grid item xs={12}>
              <ResourceLanguagesView {...this.props} es_url={this.brokerURL} />
            </Grid>
          </Grid>

          <Grid container item xs={6} spacing={3} >
            <Grid item xs={12}>
              <Card className={classes.card} variant='outlined'>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Connector Positions
                </Typography>
                <MapConnectors connectors={this.getConnectors()} />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.card} variant='outlined'>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Resource Coverage
                </Typography>
                <MapResourcesCountries resources={this.getResources()} />
              </Card>
            </Grid>
            <Grid item xs={12}>
              <ResourcePublishersView {...this.props} es_url={this.brokerURL} />
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.card} >
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Top 5 Connectors: Resources
                </Typography>
                <List className="info-list">
                  {process.env.REACT_APP_USE_SPARQL === 'true' && (
                    this.state.filteredConnectorsS.slice(0, 5).map((item) => (
                      <ListItem onClick={() => window.open(`/connector/connector?id=` + encodeURIComponent(item.connector.originURI))}>
                        <ListItemIcon>
                          <IcomoonReact iconSet={iconSet} size={20} icon="link" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item.connector.title}
                          secondary={(item.resources.length === 0) ? `Resources: 0` : `Resources: ${item.resources.length}`}
                        />
                      </ListItem>
                    ))
                  )}
                  {process.env.REACT_APP_USE_SPARQL === 'false' && (
                    this.state.filteredConnectors.slice(0, 5).map((item) => (
                      <ListItem onClick={() => window.open(`/connector/connector?id=${item["_id"]}`)}>
                        <ListItemIcon>
                          <IcomoonReact iconSet={iconSet} size={20} icon="link" />
                        </ListItemIcon>
                        <ListItemText
                          primary={item["_source"].connector.title}
                          secondary={(Object.keys(item["_source"].catalog[0]).length === 0) ? `Resources: 0` : `Resources: ${item["_source"].catalog[0].resources.length}`}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card className={classes.card} >
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                  Top 5 Connectors: Last Updated
                </Typography>
                <List className="info-list">
                  {process.env.REACT_APP_USE_SPARQL === 'true' && (
                    "Test"
                  )}
                  {process.env.REACT_APP_USE_SPARQL === 'false' && (
                    <div>
                      {this.setState({
                        dateSorted: this.state.dateSorted.sort((a, b) => b["_source"].connector.lastChanged - a["_source"].connector.lastChanged)
                      })}
                      {this.state.dateSorted.slice(0, 5).map((row) => (
                        <ListItem onClick={() => window.open(`/connector/connector?id=${row["_id"]}`)}>
                          <ListItemIcon>
                            <IcomoonReact iconSet={iconSet} size={20} icon="link" />
                          </ListItemIcon>
                          <ListItemText
                            primary={row["_source"].connector.title}
                            secondary={this.getTime(row["_source"].connector.lastChanged)}
                          />
                        </ListItem>
                      ))}
                    </div>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>

        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  token: state.auth.token
})

export default connect(mapStateToProps)(withStyles(styles)(Dashboard));
