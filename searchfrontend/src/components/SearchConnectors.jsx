import React from "react";
import {
    SelectedFilters,
    DataSearch
} from "@appbaseio/reactivesearch";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { SearchBroker, BrokerConnectorView, BrokerFilter } from "./ConnectorBroker";
import { SearchParis, ParisConnectorView, ParisFilter } from "./ConnectorParis";
import { propertyArray } from '../propertyArray';
// import Query from "../Query.jsx";
import '../css/ConnectorsList.css'

export default class SearchConnectors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentConnector: {
            },
            currentConnectorTenant: '',
            value: ''
        };
    }

    handleSearch = value => {
        this.setState({
            value
        });
    };
    componentDidMount() {
        let tenant = process.env.REACT_APP_TENANT || 'eis';

        this.setState({
            currentConnectorTenant: tenant
        });
    }

    setResultSize = (size) => {
        this.setState({
            resultSize: size
        })
    }

    render() {
        let tenant = process.env.REACT_APP_TENANT || 'mobids';

        tenant = tenant.toLowerCase();

        const renderConnectorView = (name) => {
            let obj = this.state.currentConnector;
            if (name === 'paris') {
                return <ParisConnectorView updateCurrentConnector={this.updateCurrentConnector} connector={obj} />;
            } else if (name === 'eis') {
                return <BrokerConnectorView updateCurrentConnector={this.updateCurrentConnector} connector={obj} />;
            } else
                return <BrokerConnectorView updateCurrentConnector={this.updateCurrentConnector} connector={obj} />;
        }

        const renderTenant = (name) => {
            if (name === 'paris') {
                return (
                    <SearchParis updateCurrentConnector={this.updateCurrentConnector} />
                )
            } else if (name === 'eis') {
                return (
                    <SearchBroker updateCurrentConnector={this.updateCurrentConnector} />
                )
            } else {
                return (
                    <SearchBroker updateCurrentConnector={this.updateCurrentConnector} />
                )
            }
        }

        const renderFilterTenant = (name) => {
            if (name === 'paris') {
                return (
                    <ParisFilter />
                )
            } else if (name === 'eis') {
                return (
                    <BrokerFilter />
                )
            } else {
                return (
                    <BrokerFilter />
                )
            }
        }

        // const renderQueryExpansion = (name) => {
        //     if (name === 'eis') {
        //         return (
        //             <Query userRole={this.props.userRole} />
        //         )
        //     }
        //     else
        //         return ("")
        // }

        let currentConnector = this.state.currentConnector;
        let propsFromApp = this.props;

        let filterSection = <Grid item lg={3} md={3} xs={12}>
            <Card className="filter-container">
                {
                    renderFilterTenant(tenant)
                }
            </Card>
            {/* <Annotate /> */}
            <br />
            {
                // renderQueryExpansion(tenant)
            }
        </Grid>

        return (
            <div className="connectors-list">
                {
                    Object.entries(currentConnector).length === 0 ?
                        <React.Fragment>
                            <Grid container>

                                {/* Filter section on the left-side onnly for mobids */}
                                {tenant == 'mobids' ? filterSection : ''}
                                
                                <Grid item lg={tenant == 'mobids' ? 6 : 9} md={tenant == 'mobids' ? 6 : 9} xs={12}>
                                <DataSearch
                                    componentId="search"
                                    dataField={['connector.title','connector.title_en','connector.title_de','connector.description','connector.description_de', 'participant.title', 'participant.description','participant.corporateHompage']}
                                    URLParams={true}
                                    queryFormat="or"
                                    className="data-search"
                                        value={this.state.value}
                                        autosuggest={true}
                                        showClear={true}
                                        onChange={this.handleSearch}
                                        onValueChange={
                                            function (value) {
                                                if (propsFromApp.location.pathname.indexOf('connector') === -1) {
                                                    propsFromApp.history.push("/connector");
                                                }
                                            }
                                        }
                                    // title="Search for Connectors"
                                    />
                                    <SelectedFilters />

                                    <div className="conn-list">
                                        {
                                            renderTenant(tenant)
                                        }
                                    </div>
                                </Grid>

                                {/* Filter section on the left-side onnly for mobids */}
                                {tenant != 'mobids' ? filterSection : ''}

                            </Grid>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Grid container>
                                <Grid item className="conn-list" lg={12} md={12} xs={12}>
                                    {
                                        renderConnectorView(tenant)
                                    }
                                </Grid>
                            </Grid>
                        </React.Fragment>
                }
            </div >
        )
    }
}