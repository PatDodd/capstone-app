import React, { Component, Fragment } from 'react';
import { xml } from 'd3';
import firebase from './Firebase';

import { Button, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    
    button: {
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText
        },
        width: 150,
        padding: '10px'
    }
});

class UploadRoutes extends Component {
    constructor(){
        super();

        this.getActivityIds = this.getActivityIds.bind(this);
        this.handleXML = this.handleXML.bind(this);
    }

     // get long. and lat. data from gpx file and append to this.state.xmlData
     handleXML(data, id){
        // parse xml for latitude and longitude data
        let arr = [];

        xml(data).then( data => {
           let elem = data.querySelectorAll('trkpt'); // get all trkpt elements from xml doc
           
           // get lat and long data from each element
           for(var i = 0; i < elem.length; i++){
               let lon = parseFloat(elem[i].getAttribute('lon'));
               let lat = parseFloat(elem[i].getAttribute('lat'));
               arr[i] = { 'lat': lat, 'lng': lon  };
           }
         
           const db = firebase.firestore();
           db.collection('routes').doc(id).set({
            activityID: id,
            locations: arr 
           });
       }).then(() => {
          // console.log(this.state.xmlData);
       })
   }

   // get all gpx files using the activity id of each doc
    // in the db, adds their latitude and longitude to xmlData
    // using the handleXML(data) method
    getActivityIds(){
        // get database reference
        const db = firebase.firestore();
        const runsRef = db.collection('runs');
        
        // array to catch activityIDs
        let arr = [];

        // get activity ids from db
        runsRef.get()
            .then((querySnapshot)=> {
                querySnapshot.forEach((doc)=> {
                    arr.push(doc.data().activityID);
                });
            }).then(()=>{
                // get gpx data from each file in the activities folder
                for(var i = 0; i < arr.length; i++){
                    try {
                        let data = require(`./activities/${arr[i]}.gpx`); // get data from xml file with that id
                        this.handleXML(data, arr[i]); // parse file and upload data to database
                    } catch(err){
                        console.log(err);
                    }
                }
            }).catch((error)=>{
                console.log(error);
            });
    }

    render(){

        const { classes } = this.props;

        return (
            <Fragment>
            <Typography variant="h6">Upload Routes from: "/activities/...":</Typography>
            <Button className={classes.button} onClick={this.getActivityIds}>Upload Routes</Button>
            </Fragment>
        );
    }
}

export default withStyles(styles)(UploadRoutes);