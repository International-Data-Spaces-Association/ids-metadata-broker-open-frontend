import { Button, Container, Grid, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import clsx from 'clsx';

import ArrowBack from '../assets/icons/arrow-back.svg'
import '../css/ConnectorView.css'

export function BrokerViewComponent(props) {

    let backLink = props.parentLink
    let title = props.title
    let showMore = props.showMore

    let [openSecondary, setOpenSecondary] = React.useState(false);

    return (
        <Container className="resource-view">
            {
                props.showBackButton ?
                    <Link to={backLink}>
                        <IconButton aria-label="go back"
                            style={{
                                color: "black",
                                padding: 0,
                                marginBottom: 10
                            }}
                            size="medium">
                            <img src={ArrowBack} alt="Back" width="25" />
                        </IconButton>
                    </Link> : ""
            }
            <Typography className="connector-title" variant="h4" component="h1" display="block" gutterBottom>
                {title}
            </Typography>

            {props.children}

            {showMore ? <React.Fragment>
                <Button className={clsx("expandButton", openSecondary && "expanded")} variant="contained"
                    onClick={() => { setOpenSecondary(!openSecondary); }} style={{ marginTop: 60 }}>
                    {openSecondary ? "Show less" : "Show more"}
                </Button>

                {openSecondary ? <div className="secondary-view">
                    {showMore}
                </div> : ""}
            </React.Fragment> : ""}

        </Container>
    )

}

export function BrokerAttribute(props) {
    let col = props.col ? props.col : 4
    let fieldLabel = props.label
    let fieldVal = props.value || props.children

    return (
        <Grid item md={col} xs={12} className={props.className}>
            <Typography className="attr-title" variant="body2" gutterBottom>{fieldLabel}</Typography>
            <Typography className="attr-content" gutterBottom>{fieldVal}</Typography>
        </Grid>
    )
}

export function BrokerAttributeUrl(props) {
    return (
        <BrokerAttribute
            col={props.col}
            className={props.className}
            label={props.label}>
                <a rel="noopener noreferrer" href={props.value} target="_blank">{props.value}</a>
        </BrokerAttribute>
    )
}