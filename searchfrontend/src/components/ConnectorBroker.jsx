import React, { useState, useEffect } from "react";
import {
    ReactiveList,
    MultiList
} from "@appbaseio/reactivesearch";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Container, Divider, TextField } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { getAllConnectors } from '../helpers/sparql/connectors';

import ArrowNext from '../assets/icons/arrow-next.svg'
import ArrowPrev from '../assets/icons/arrow-previous.svg'
import useExpandableFilter from "../helpers/useExpandableFilter";

export function BrokerFilter(props) {

    useExpandableFilter()

    return (
        <React.Fragment>
            <MultiList
                componentId="list-2"
                dataField="catalog.resources.keyword.keyword"
                showSearch={true}
                showCount={false}
                title="Keyword"
                filterLabel="Keyword"
                className="expandable expanded"
                URLParams={true}
            />
            <Divider />
            <MultiList
                componentId="list-3"
                dataField="catalog.resources.publisherAsUri.keyword"
                showSearch={true}
                showCount={false}
                title="Publisher"
                filterLabel="Publisher"
                className="expandable"
                URLParams={true}
            />
            <Divider />
            <MultiList
                componentId="list-1"
                dataField="connector.securityProfile.keyword"
                showSearch={true}
                showCount={false}
                title="Connector Security Profile"
                filterLabel="Security Profile"
                className="expandable"
                URLParams={true}
            />
            {/* <Query /> */}
        </React.Fragment>
    )
}

export function SearchBroker(props) {


    const [connectors, setConnectors] = useState([]);
    const token = useSelector(state => state.auth.token);

    useEffect(() => {
        getAllConnectors(token).then(data => {
            setConnectors(data);
        });
    }, []);

    function handleBrokerClick(e) {
        //props.updateCurrentConnector(e);
        // we do not need to inform the parent component anymore because we use routing/links instead
    }

    function renderBrokerData(res) {
        let objCatalog = res.catalog ? res.catalog[0] : [];
        let resources = objCatalog.resources ? objCatalog.resources[0] : null;
        let provider = res.provider;
        let connector = res.connector;
        // let type = res._type;
        return (
            <React.Fragment key={process.env.REACT_APP_USE_SPARQL === 'true' ? encodeURIComponent(connector.originURI) : encodeURIComponent(res._id)}>
                <Link to={'/connector/connector?id=' + (process.env.REACT_APP_USE_SPARQL === 'true' ? encodeURIComponent(connector.originURI) : encodeURIComponent(res._id))} >
                    <Card key={res._id} style={{ border: 'none', boxShadow: "none" }} onClick={() => handleBrokerClick(res)}>
                        <CardActionArea>
                            <CardContent className="connector-content">
                                <Typography variant="h5" component="h2">
                                    {connector.title.join(", ")}
                                </Typography>
                                <Typography variant="body2" className="connector-description">
                                    {connector.description.join(", ")}
                                </Typography>
                                {
                                    resources && resources.description ?
                                        <div className="connector-resource connector-content-container">
                                            <Typography component="p" className="link-title">
                                                Resource Description
                                            </Typography>
                                            <Typography variant="body2" component="p">
                                                {resources.description}
                                            </Typography>
                                        </div>
                                    : ""
                                }
                                
                                <Grid container className="connector-links connector-content-container">
                                    <Grid item xs={6}>
                                        <Typography component="p" className="link-title">
                                            Curator
                                        </Typography>
                                        <Typography component="p" className="link-content">
                                            {provider.curatorAsUri}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography component="p" className="link-title">
                                            Maintainer
                                        </Typography>
                                        <Typography component="p" className="link-content">
                                            {provider.maintainerAsUri}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Divider />
                </Link>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {(process.env.REACT_APP_USE_SPARQL === 'true') && (
                connectors.map((connector) => (
                    renderBrokerData(connector)
                ))
            )}
            {(process.env.REACT_APP_USE_SPARQL === 'false') && (
                <ReactiveList
                    componentId="result"
                    dataField="connector.title.keyword"
                    pagination={true}
                    URLParams={true}
                    react={{
                        and: ["search", "list-1", "list-3", "list-2", "list-4"]
                    }
                    }
                    renderItem={renderBrokerData}
                    renderResultStats={renderResultStats}
                    renderPagination={renderPagination}
                    size={10}
                    style={{
                        margin: 0
                    }}
                />
            )}
        </React.Fragment>

    )
}

export function renderPagination({pages, totalPages, currentPage, setPage, fragmentName}) {
    if(totalPages == 0)
        return null // no results means no pagination

    return <div className='pagination'>
        <Button variant='contained' 
        onClick={() => setPage(currentPage-1)}
        startIcon={<img src={ArrowPrev} height={15} width={15}/>}
        disabled={currentPage == 0} disableElevation>Previous</Button>

        <TextField value={currentPage+1} variant="outlined" 
        onChange={(e) => {
            let val = parseInt(e.target.value)
            if(val > 0 && val <= totalPages)
                setPage(val-1)
        }}
        style={{width: 50, marginRight: 12, textAlign: 'center'}} />
        of {totalPages}

        <Button variant='contained' 
        onClick={() => setPage(currentPage+1)}
        endIcon={<img src={ArrowNext} height={15} width={15}/>}
        disabled={currentPage == totalPages-1} disableElevation>Next</Button>
    </div>
}

export function renderResultStats(stats) {
    return <p className="results">{stats.numberOfResults} {stats.numberOfResults == 1 ? "Result" : "Results"}</p>
}