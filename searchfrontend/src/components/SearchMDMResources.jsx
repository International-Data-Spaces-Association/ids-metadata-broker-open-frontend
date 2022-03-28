import React from "react";
import {
    SelectedFilters,
    DataSearch,
    MultiList,
    SingleDropdownList,
    MultiDropdownList
} from "@appbaseio/reactivesearch";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { propertyArray } from '../propertyArray';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { ReactiveList } from "@appbaseio/reactivesearch";
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { Button, Divider } from "@material-ui/core";

import { getAllResources } from '../helpers/sparql/connectors';
import { connect } from 'react-redux';
import useExpandableFilter from "../helpers/useExpandableFilter";
import { renderPagination, renderResultStats } from "./ConnectorBroker";
import clsx from 'clsx';

import SearchIcon from '../assets/icons/search.svg'

class SearchMDMResources extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            mdmSearchValue: '',
            resources: [],
            openSearch: true
        };
    }

    handleSearch = value => {
        this.setState({
            mdmSearchValue: value
        }, () => {
            window.localStorage.setItem('SearchValue', this.state.mdmSearchValue);
        });
    };

    handleOpenSearch = open => {
        this.setState({
            openSearch: open
        })
    }

    processResourceID = id => {
        let resId;
        try {
            resId = new URL(id);
        }
        catch (_) {
            return id;
        }
        return resId.pathname.split('/').pop();
    }

    componentDidMount() {
        this.setState({
            mdmSearchValue: window.localStorage.getItem('SearchValue')
        })
        getAllResources(this.props.token).then(data => {
            this.setState({ resources: data });
        });
    }

    renderMobilityResources = ({ data }) => {
        return (
            <React.Fragment>
                {
                    data.map(resource => (
                        resource.length !== 0 ?
                            <React.Fragment key={resource.resourceID}>
                                <Link to={'/resources/resource?id=' + encodeURIComponent(resource.resourceID)} >
                                    <Card  style={{ border: 'none', boxShadow: "none" }}>
                                        <CardActionArea>
                                            <CardContent className="connector-content">
                                                <Typography variant="h5" component="h2">
                                                    {resource.title_en || resource.title || resource.title_de}
                                                </Typography>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {resource.description_en || resource.description || resource.description_de}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {resource.publisher ? "Publisher: " + resource.publisher : ""
                                                    }
                                                </Typography>
                                                <Typography variant="body1">
                                                    {resource.sovereign ? "Sovereign: " + resource.sovereign : ""
                                                    }
                                                </Typography>
                                                <Typography variant="body2">
                                                    {resource.labelStandardLicense ? "Standard License: " + resource.labelStandardLicense.map(val => val.split("_").join(" "))
                                                        : ""
                                                    }
                                                </Typography>


                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                    <Divider />
                                </Link>
                            </React.Fragment>
                            : ""
                    ))
                }
            </React.Fragment >
        );
    }

    renderResultStats(stats) {
        return <p className="results">{stats.numberOfResults} Results</p>
    }

    render() {
        let tenant = process.env.REACT_APP_TENANT || 'mobids';
        tenant = tenant.toLowerCase();

        let advancedSearch = <div className="advanced-filter-container">
            <Grid item xs={12} md={3} lg={3}>
                <MultiDropdownList
                    componentId="adv_category"
                    dataField="mobids:DataCategory.keyword"
                    placeholder="Data Category"
                    className="advanced-filter"
                    filterLabel="Data Category"
                    showCount={false}
                />
            </Grid>

            <Grid item xs={12} md={3} lg={3}>
                <MultiDropdownList
                    componentId="adv_publishers"
                    dataField="publisher.keyword"
                    placeholder="Publisher"
                    className="advanced-filter"
                    filterLabel="Publisher"
                    showCount={false}
                />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
                <MultiDropdownList
                    componentId="adv_transport"
                    dataField="mobids:transportMode.keyword"
                    placeholder="Transport Mode"
                    className="advanced-filter"
                    filterLabel="Transport Mode"
                    showCount={false}
                />
            </Grid>
            <Divider style={{backgroundColor: "#B9B9B9", marginTop: 30, marginBottom: 30 }} />

        </div>

        let search = <React.Fragment>
            <Grid container>
                <Grid item xs={12} md={tenant == "mobids" ? 7 : 12}
                 lg={tenant == "mobids" ? 8 : 12}
                  xl={tenant == "mobids" ? 9 : 12} >
                    <DataSearch
                    componentId="search"
                    dataField={['title', 'title_en', 'title_de', 'description', 'description_de', 'description_en']}
                    URLParams={true}
                    queryFormat="or"
                    autosuggest={true}
                    showClear={true}
                    icon={<img src={SearchIcon} className="search-icon" />}
                    onValueChange={
                        function (value) {
                            if (propsFromApp.location.pathname.indexOf('resources') === -1) {
                                propsFromApp.history.push("/resources");
                            }
                        }
                    }
                    value={this.state.value}
                    onChange={this.handleSearch}
                /></Grid>
                {tenant == "mobids" ? <Grid item md={5} lg={4} xl={3}>
                    <Button className={clsx("advanced-button", this.state.openSearch && "expanded")} onClick={() => this.handleOpenSearch(!this.state.openSearch)}>Advanced Search</Button></Grid> : ""
                }
            </Grid>
            {tenant == "mobids" && this.state.openSearch ? advancedSearch : ""}
            <SelectedFilters className="selected-filters" />
        </React.Fragment>

        let filterSection = <Grid item xl={3} md={4} xs={12}>
            <Card className="filter-container">
                <React.Fragment>
                    <MultiList
                        componentId="Keywords"
                        dataField="keyword.keyword"
                        style={{
                            margin: 20
                        }}
                        showSearch={true}
                        showCount={false}
                        title="Keywords"
                        URLParams={true}
                        className="expandable expanded"
                    />
                    <Divider />
                    <MultiList
                        componentId="Publishers"
                        dataField="publisher.keyword"
                        style={{
                            margin: 20
                        }}
                        showSearch={true}
                        showCount={false}
                        title="Publisher"
                        URLParams={true}
                        className="expandable"
                    />
                    {/*<Divider />
                    <MultiList
                        componentId="Category"
                        dataField="mobids:DataCategory.keyword"
                        style={{
                            margin: 20
                        }}
                        showSearch={false}
                        title="MobiDS Category"
                        URLParams={true}
                        className="expandable"
                    />

                    <Divider />
                    <MultiList
                        componentId="SubCategory"
                        dataField="mobids:DataCategoryDetail.keyword"
                        style={{
                            margin: 20
                        }}
                        showSearch={false}
                        title="MobiDS Category Details"
                        URLParams={true}
                    />
                    <Divider />

                    <MultiList
                        componentId="NutsLocation"
                        dataField="mobids:nutsLocation.keyword"
                        style={{
                            margin: 20
                        }}
                        showSearch={false}
                        title="NUTS Code"
                        URLParams={true}
                        className="expandable"
                    />*/}



                </React.Fragment>
            </Card>
        </Grid>

        let propsFromApp = this.props;
        return (
            <div className="connectors-list">
                {/* Helper component to use the useExpandableFilter hook in this class component */}
                {tenant == 'mobids' ? <HookHelper /> : ''}
                <React.Fragment>
                    {tenant != 'mobids' ? search : ''}
                    <Grid container>
                        {/* Filter section on the left-side onnly for mobids */}
                        {tenant == 'mobids' ? filterSection : ''}

                        {/* List of resources in the /query page */}
                        <Grid item xl={tenant == 'mobids' ? 6 : 9}
                        md={tenant == 'mobids' ? 8 : 9}
                        xs={12} 
                        className="search-column-container">
                            {tenant == 'mobids' ? search : ''}

                            <div className="conn-list">
                                {(process.env.REACT_APP_USE_SPARQL === 'true') && (
                                    this.renderMobilityResources({ data: this.state.resources })
                                )}
                                {(process.env.REACT_APP_USE_SPARQL === 'false') && (
                                    <ReactiveList
                                        componentId="result"
                                        dataField="title.keyword"
                                        pagination={true}
                                        URLParams={true}
                                        react={{
                                            and: ["search", "Keywords", "adv_publishers"]
                                        }}
                                        render={this.renderMobilityResources}
                                        renderResultStats={renderResultStats}
                                        renderPagination={renderPagination}
                                        size={5}
                                        style={{
                                            margin: 0
                                        }}
                                    />
                                )}
                            </div>
                        </Grid>

                        {tenant != 'mobids' ? filterSection : ''}
                    </Grid>
                </React.Fragment>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    token: state.auth.token
})

const HookHelper = () => {
    useExpandableFilter()

    return null // component does not render anything
}

export default connect(mapStateToProps)(SearchMDMResources)