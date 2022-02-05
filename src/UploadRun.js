import React, { Component } from 'react';
import { csv } from 'd3';
import data from './activities.csv';
import firebase from './Firebase';

import { Button, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

import UploadRoutes from './UploadRoutes';
import UploadElevations from './UploadElevations';

const styles = theme => ({
    form: {
        display: "block",
       '& > *':{
            margin: theme.spacing(3),
            width: 250,
            display: 'block'
        } 
    },
    button: {
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText
        },
        padding: '10px'
    }
});

class UploadRun extends Component {
    constructor(){
        super();
        this.state = {
            data: [],
            error: null
        }
        
        this.handleCSV = this.handleCSV.bind(this);
    }


    handleCSV(e) {
        // prevent page reload onClick
        e.preventDefault();
       
        // get data from csv, csv is a d3 method btw
        csv(data).then(data => {

            // change these items from strings to floats so we can calculate with them later
            // convert kilometers to miles for distance and set decimal places to two
            // set time to Pacific instead of GMT, change to timestamp
            let arr1 = data.map( item => {

                item.elapsedTime = parseFloat(item.elapsedTime); // turn into float
                item.distance = parseFloat(item.distance * 0.621371); // converting kms to mi

                item.averagePace = parseFloat(item.elapsedTime/item.distance); // add averagePace to object
                item.averagePaceMinutes = item.averagePace/60; // get val to use to calc seconds
                item.averagePaceSeconds = (item.averagePaceMinutes%1)*60; // get decimal portion for seconds and calc
                
                // make minutes and seconds whole numbers
                item.averagePaceMinutes = parseInt(item.averagePaceMinutes);
                item.averagePaceSeconds = parseInt(item.averagePaceSeconds);

                const monthDayYearTime = new Date(item.activityDate); // get date
                monthDayYearTime.setHours(monthDayYearTime.getHours()-8); // set time to PST
                item.activityDate = new Date(monthDayYearTime).toString(); // pass back

                // turn date to timestamp and append it to the item object
                const db = firebase.firestore;
                const ts = db.Timestamp.fromDate(monthDayYearTime);
                item.tmStmp = ts;

                return item;
            });

            // only allow an activityType of "Run" in this array
            const arr = arr1.filter(item => item.activityType === "Run");
            // pass to this.state.data
            this.setState({data: arr});  

            // get a reference to a firestore connection
            const db = firebase.firestore(); 
            
            // add to each obj to db, set will overwrite existing docs based on doc#, and add new if it doesn't exist
            this.state.data.forEach(element => {
              db.collection('runs').doc(element.activityID).set(element)
                .then(() => {
                    console.log("Document successfully written " + element);
                })
                .catch((error) => {
                    console.error("Error writing document: " + error)
                    this.setState({ error: true });
                });
            });       
        }); 
    }

   

    

    render(){

        const { classes } = this.props;

        return(
                    <form className={classes.form}>
                        <Typography variant="h6">Upload Runs From "activities.csv":</Typography>
                        <Button className={classes.button} onClick={this.handleCSV}>Upload Runs</Button>
                        { this.state.error !== null && this.state.error === false && (
                            <p className="successMsg">Added successfully!</p>  
                        )}
                        { this.state.error && (
                            <p>Error: {this.state.error} </p>
                        )}
                        <UploadRoutes />
                        <UploadElevations />      
                    </form>
        );
    }
}

export default withStyles(styles)(UploadRun);