import React, { Component, Fragment } from 'react';

import { Skeleton } from '@material-ui/lab/';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Paper } from '@material-ui/core';

import firebase from './Firebase';
import StatsTable from './StatsTable';
import StatsGraphCanvas from './StatsGraphCanvas';


const styles = theme => ({
    wrapper: {
        margin: theme.spacing(4),
        height: '500px', 
    },
    statsTable: {
        display: 'inline-block',
        width: '25%'
    },
    statsGraph: {
        display: 'inline-block'
    },
    
    skeleton: {
        height: '100%',
        width: '50%',
        display: 'inline-block'
    },
    graphPaper: {
        width: "48%",
        marginLeft: '10px',
        verticalAlign: 'top',
        height: '545px',
        display: 'inline-block',
        [theme.breakpoints.down('sm')] : {
            width: '100%',
            margin: 0
        }, 
        [theme.breakpoints.down('xs')] : {
            height: '400px'
        }, 

    },
   
  });

class Stats extends Component {
    constructor(props){
        super(props)

        this.state = {
            docArr: [],
            isMounted: false 
        }

        const db = firebase.firestore();
        const runsRef = db.collection('runs');
        
        let arr = [];
        // get all documents for counting, and finding fastest runs
        runsRef.get()
            .then((querySnapshot)=> {
                querySnapshot.forEach((doc)=> {
                    arr.push(doc.data());
                });
            }).then(() => {
                // pass all runs to state
                this.setState({ docArr : arr});
            }).catch((error)=>{
                console.log(error);
            });
    }// END CONSTRUCTOR

    // grab runs from database, get each fastest and pass those objects to state
    runQuery(query, key){

        let arr = [];
        query.get()
            .then((querySnapshot)=> {
                querySnapshot.forEach((doc)=> {
                    arr.push(doc.data());
                   
                })
            }).then(()=>{
                // sort so that index 0 is the fastest time
                arr.sort((a,b)=> (a.elapsedTime > b.elapsedTime) ? 1 : -1);
                this.setState({[key]: arr[0]});
            }).catch((error)=>{
                console.log(error);
            });
    } // end runQuery

    componentDidMount(){
        this.setState({ isMounted: true});
    }

    render(){

         const { classes } = this.props;

        return(
            <div className={classes.wrapper}>
            <Typography variant="h6">Your All-Time Stats: </Typography>
            {this.state.docArr.length === 0 &&(
                <div>
                <div className={classes.skeleton}>
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="wave" />
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="wave" />
                </div>
                <div className={classes.skeleton}>
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="wave" />
                    <Skeleton />
                    <Skeleton animation={false} />
                    <Skeleton animation="wave" />
                </div>
                </div>
            )}
            <Fragment>
                {this.state.docArr.length !== 0 && (
                    <div>
                        <StatsTable docArr={this.state.docArr} className={classes.statsTable} />
                        {/* <StatsGraph docArr={this.state.docArr} className ={classes.statsGraph}/> */}
                        <Paper className={classes.graphPaper} variant="outlined">
                            <StatsGraphCanvas data={this.state.docArr}  />
                        </Paper>
                    </div>
                    )}
                
                </Fragment> 
            </div>
            
        );
    }
}

export default withStyles(styles)(Stats);