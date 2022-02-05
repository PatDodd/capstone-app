import React, { Component } from 'react';

import firebase from './Firebase';
import GoogleMapReact from 'google-map-react';
import { Skeleton } from '@material-ui/lab/';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const styles = theme => ({
    skeleton: {
        height: '100vh',
        width: '90%',
        margin: '0 auto',
        padding: '0'
        
    }
});

class Heatmap extends Component {
    constructor(props){
        super(props);

        this.state = {
            xmlData: [],
            isSet: false
        }
      
        this.generateHeatMapData();

    }// END CONSTRUCTOR

    generateHeatMapData(){
        // get database reference for routes collection
        const db = firebase.firestore();
        const routesRef = db.collection('routes');

        let arr = [];

        // get each route document from database and combine all that data into an array
        routesRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(arr.length === 0){
                    arr = doc.data().locations;
                } else {
                    arr = arr.concat(doc.data().locations);
                }
                
            });
        }).then(() => {
            this.setState({xmlData: arr}); // set state to arr containing all route lat/lng data
        });
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({ isSet: true});
        }, 1000)
    }

    render(){

        const key = 'AIzaSyDvt0lBXY2CXiPsPiw4DbpuqGohWiYVJ5I'; // api key
        
        // center of map
        const center = {
            
            lat: 47.891405,
            lng: -122.304067
        };

        // zoom level of map
        const zoom = 14;

        // data obj to initialize heatmap
        const heatMapData = { 
            positions: this.state.xmlData,
            options: {
                radius: 5,
                opacity: 0.6,
                dissipating: true,
            }
        }
       
        const { classes } = this.props;
        
        window.scrollTo(0,0); // make page is scrolled to top when it loads
        
        return(
            <div style={{height: '89vh', width: '100%'}}>
               
                { !this.state.isSet && (
                    <div className={classes.skeleton}>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text" animation={false} />
                        <Typography variant="body1">Loading...This may take a moment.</Typography>
                        <Skeleton variant="rect" animation="wave" height={400} />
                    </div>
                )}
                
                { this.state.isSet && (
                   <GoogleMapReact 
                        ref={(el) => this._googleMap = el}
                        bootstrapURLKeys={{key: key, libraries:'visualization'}}
                        defaultCenter={center}
                        defaultZoom={zoom}
                        heatmapLibrary={true}
                        heatmap={heatMapData} 
                    />
                    
                )}   
            </div>
            
        );
    }
}

export default withStyles(styles)(Heatmap);