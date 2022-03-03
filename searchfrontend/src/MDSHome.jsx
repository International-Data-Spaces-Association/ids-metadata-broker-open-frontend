import React from "react";
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import './css/MDSHome.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Typography } from "@material-ui/core";

class CategoryItem extends React.Component {

    render() {
        let cat = this.props.category

        return <Card className="category">
            <CardMedia
                component="img"
                height="180"
                image={cat.icon}
                alt={cat.title}
            />
            <CardContent>
                <Typography gutterBottom className="category-title" component="div">
                    {cat.title}
                </Typography>
                {/*<Typography className="category-text" variant="body2">
                    {cat.description}
                </Typography>*/}
            </CardContent>
        </Card>
    }
}

class MDSHome extends React.Component {

    render() {
        const categoryItems = [
            {
                "title": "Traffic information",
                "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod",
                "icon": "./search.svg"
            },
            {
                "title": "Roadworks and Road conditions",
                "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod",
                "icon": "./search.svg"
            },
            {
                "title": "Traffic Flow Information",
                "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod",
                "icon": "./search.svg"
            },
            {
                "title": "Parking Information",
                "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod",
                "icon": "./search.svg"
            }
        ]
        const showButtons = false, showTrusted = false;

        return <Container maxWidth="md">
            <h1 component="h1" id="home-title">Welcome to Mobility<br />Data Space Catalog</h1>
            <p id="home-subtitle">Get acces to different data Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.</p>
            {showButtons ? <Box className="button-container">
                <span className="button-light">Choose your data category <img src="./arrow-right.svg" alt="Search" height='15px' /></span>
                <span className="button-default">Get in touch</span>
            </Box> : ''}
            {showTrusted ? <Box id="trusted-container" className="content-container" >
                <Typography id="trusted-title">Trusted by Teams at</Typography>
                <Grid container justifyContent="flex-start">
                    <Grid item><Typography>Mercedes Benz</Typography></Grid>
                    <Grid item><Typography>Volkswagen GIS</Typography></Grid>
                    <Grid item><Typography>Mercedes Benz</Typography></Grid>
                    <Grid item><Typography>Volkswagen GIS</Typography></Grid>
                </Grid>
            </Box> : ''}
            <Box className="content-container">
                <h2 style={{marginTop: '50px'}}>Categories</h2>
                <Grid container id="categories-container" spacing={3}>
                    { categoryItems.map((item, i) => <Grid item key={i} xs={12} sm={6} md={3}><CategoryItem category={item} /></Grid>)}
                </Grid>
            </Box>
            
        </Container>
    }

}

export default MDSHome