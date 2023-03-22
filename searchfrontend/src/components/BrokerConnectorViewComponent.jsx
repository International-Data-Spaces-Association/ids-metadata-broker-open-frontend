import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Container, Divider, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";

import { useSelector } from 'react-redux';
import { getConnector, prepareConnectorFormat } from '../helpers/sparql/connectors';
import { BrokerAttribute, BrokerAttributeUrl, BrokerViewComponent } from "./BrokerViewComponent";

export function BrokerConnectorViewComponent(props) {

    let [provider, setProvider] = useState({});
    let [connector, setConnector] = useState({});
    let [id, setId] = useState({});
    let [objCatalog, setObjCatalog] = useState([]);
    let [resourcesArray, setResourcesArray] = useState([]);
    //useEffect and useState helps in managing the states of the corresponding resource
    useEffect(() => {
        prepareResource();
    }, []); //the [] braces means to run it when the component is mounted/loaded


    let elasticsearchURL = props.es_url

    const token = useSelector(state => state.auth.token);

    const prepareResource = () => {
        let resourceId = decodeURIComponent(props.location.search);
        if (process.env.REACT_APP_USE_SPARQL === 'true') {
            let validResourceId;
            //extracting the connector ID
            if (resourceId !== null && resourceId !== "") {
                resourceId = resourceId.split("=")[1];
                validResourceId = resourceId;
            }
            //getting a connector based on the ID
            getConnector(token, validResourceId).then(data => {
                let connector = prepareConnectorFormat(data, validResourceId);
                setConnector(connector.connector);
                setProvider(connector.provider);
                setResourcesArray(connector.resources);
            });
        } else {
            let validResourceId;
            // The id of the resource will be appended in the url. eg.., https://<hostname>/resources/resource?id=https%3A%2F%2Fiais.fraunhofer.de%2Feis%2Fids%2FsomeBroker%2Fcatalog541260824%2F1091662930%2F1213443818
            if (resourceId !== null && resourceId !== "") {
                //split the above url to get only the resource id
                resourceId = resourceId.split("=")[1];
                // The id's of the object will contain unique paths added by the elastic search. Here in the resourceId: https://iais.fraunhofer.de/eis/ids/someBroker/catalog541260824/1091662930/1213443818, the valid resource id excludes the last path. So the valid url is: https://iais.fraunhofer.de/eis/ids/someBroker/catalog541260824/1091662930
                validResourceId = resourceId;
            }
            //find and get the respective validResourceId in Elastic search

            axios.get(elasticsearchURL + "/registrations/_search?size=1000&pretty", {
                data: {
                    query: {
                        term: {
                            _id: validResourceId
                        }
                    }
                }
            })
                .then(response => {

                    if (response.status === 200) {
                        const resVal = response.data.hits.hits.find(({ _id }) => _id === validResourceId);
                        if (resVal !== null) {
                            setProvider(resVal._source.provider)
                            setConnector(resVal._source.connector)
                            setId(resVal._source._id)
                            setObjCatalog(resVal._source.catalog ? resVal._source.catalog[0] : [])
                        }


                    }
                })
                .catch(err => {
                    console.log("An error occured: " + err);
                })
        }
    }
    let resources = [];
    if (process.env.REACT_APP_USE_SPARQL === 'false') {
        resources = objCatalog.resources ? objCatalog.resources : [];
    } else {
        resources = resourcesArray;
    }

    function displayField(fieldLabel, fieldVal, col) {
        if (!fieldVal)
            return ""

        return (
            <BrokerAttribute col={col}
                label={fieldLabel}
                value={fieldVal} />
        );
    }

    function displayURI(fieldLabel, fieldVal, col) {
        if (!fieldVal)
            return ""

        return (
            <BrokerAttributeUrl col={col}
                label={fieldLabel}
                value={fieldVal} />
        );
    }

    return (
        <BrokerViewComponent
            title={connector.title ? connector.title.join(", ") : "Unknown Connector"}
            parentLink="/connector"
            showBackButton={props.showBackButton}
            showMore={
                <Grid container>
                    {
                        displayURI("Connector URI", connector.originURI)
                    }
                    {
                        displayField("Software Version", connector.connectorVersion)
                    }
                    {
                        displayField("Security Profile", connector.securityProfile)
                    }
                    {
                        connector.inboundModelVersions ? displayField("Inbound IDS Model Versions", connector.inboundModelVersions.join(", ")) : ""
                    }
                    {
                        displayField("Outbound IDS Model Version", connector.outboundModelVersion)
                    }
                </Grid>
            }>
            <Grid container className="main-container">
                {
                    connector.description ?
                        <BrokerAttribute className="attr-description" col={12}
                            label="Description"
                            value={connector.description.join(", ")} /> : ""
                }

                {
                    displayURI("Access URL", connector.accessUrl, 12)
                }

                {
                    resources.length !== 0 ?
                        <BrokerAttribute
                            col={12}
                            label="Resources ID">
                            {resources.map(resource => (
                                <Link to={'/resources/resource?id=' + resource.resourceID} target="_blank"
                                    key={resource.resourceID}
                                    className="resource-link">
                                    {resource.title ? resource.title.join(", ") : "Unknown Resource"}
                                </Link>
                            ))}
                        </BrokerAttribute> : ""
                }
            </Grid>

            <Grid container className="rounded-borders">
                {
                    displayURI("Curator", provider.curatorAsUri, 6)
                }
                {
                    displayURI("Maintainer", provider.maintainerAsUri, 6)
                }
            </Grid>
        </BrokerViewComponent>
    );
}
