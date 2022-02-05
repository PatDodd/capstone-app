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

class UploadElevations extends Component {
    constructor(){
        super();
        this.handleXmlElev = this.handleXmlElev.bind(this);
        this.getActivityIdsElev = this.getActivityIdsElev.bind(this);
    }


    // parse each xml file and pass data to db
    handleXmlElev(data, id, date){
        // parse xml for latitude and longitude data
        let arr = [];

        xml(data).then( data => {
           let elem = data.querySelectorAll('ele'); // get all trkpt elements from xml doc
           let timeElem = data.querySelectorAll('time');
           
           // get lat and long data from each element
           for(var i = 0; i < elem.length; i++){
               let elev = parseFloat(elem[i].innerHTML);
               let tmStmp = timeElem[i+1].innerHTML;
               arr[i] = {elevation: elev, dateTime: tmStmp};
           }
         
           const db = firebase.firestore();
           db.collection('elevations').doc(id).set({
            activityID: id,
            date: date,
            elevations: arr 
           });
       }).then(() => {
           //console.log(arr);
       })
    }


    // get ids from db, use them to parse each xml file of matching id,
    getActivityIdsElev(){
        
        // get database reference
        const db = firebase.firestore();
        const runsRef = db.collection('runs');
        
        // array to catch activityIDs
        let arr = [];

        // get activity ids from db
        runsRef.get()
            .then((querySnapshot)=> {
                querySnapshot.forEach((doc)=> {
                    arr.push({id: doc.data().activityID, date: doc.data().activityDate});
                });
            }).then(()=>{
                // get gpx data from each file in the activities folder
                for(var i = 0; i < arr.length; i++){
                    try {
                        let data = require(`./activities/${arr[i].id}.gpx`); // get data from xml file with that id
                        this.handleXmlElev(data, arr[i].id, arr[i].date); // parse file and upload data to database
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
        return(
            <Fragment>
                <Typography variant="h6">Upload Elevation Data from: "/activities/...":</Typography>
                <Button className={classes.button} onClick={this.getActivityIdsElev}>Upload Elevation Data</Button>
            </Fragment>
        );

    }
}

export default withStyles(styles)(UploadElevations);