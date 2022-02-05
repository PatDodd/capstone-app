import React, { Component } from 'react';
import {Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Typography} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
   tableBox: {
        display: 'inline-block',
        width: '48%',
        verticalAlign: 'top',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            margin:'0 auto',
            padding: '0'
        }
   },
    table: {
      width: '100%',
       height: '100%',
      [theme.breakpoints.down('sm')]: {
          width: '100%',
          margin:'0 auto',
          padding: '0'
        }
    },
    paper: {
        width: '100%',
        height: '545px',
        verticalAlign: 'top',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            marginBottom: 10
        },
        [theme.breakpoints.down('xs')] : {
            height: '400px'
        },
    },
    tableCell: {
        [theme.breakpoints.down('sm')]: {
            padding: '5px'
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: '11px'
        }
    },
    topRow: {
        backgroundColor: '#e0f2f1',
        [theme.breakpoints.down('sm')]: {
          padding: '0',
          width: '100%'
        }
      },
      heading: {
        margin: 10
    }
  });


class StatsTable extends Component {
    constructor(props){
        super(props)
        this.state = {
            oneMileTime: {},
            twoMileTime: {},
            threeMileTime: {},
            fourMileTime: {},
            fiveMileTime: {}
        }

        const { docArr } = this.props;
        // arrs for filtering mileage ranges
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        let arr4 = [];
        let arr5 = [];

       //get all runs in each of the mileage ranges and set them to state appropriately

        arr1 = docArr.filter((item) =>  item.distance > 0.9 && item.distance < 1.2);
        this.state.oneMileTime = this.getFastestRun(arr1);

        arr2 = docArr.filter((item) => item.distance > 1.9 && item.distance < 2.2);
        this.state.twoMileTime = this.getFastestRun(arr2);        
       
        arr3 = docArr.filter((item) =>  item.distance > 2.9 && item.distance < 3.2);
        this.state.threeMileTime = this.getFastestRun(arr3);
       
        arr4 = docArr.filter((item) => item.distance > 3.9 && item.distance < 4.2 );
        this.state.fourMileTime = this.getFastestRun(arr4);
        
        arr5 = docArr.filter((item) => item.distance > 4.9 && item.distance < 5.2);
        this.state.fiveMileTime = this.getFastestRun(arr5);
    }

    // get's the fastest run in an array of given mileage range
    getFastestRun(arr){
        // get all runs in the one mile range
        arr.sort((a,b)=> (a.elapsedTime > b.elapsedTime) ? 1 : -1);
        return arr[0];
    }

    // creates data to pass to table rows
    createRowData(rowName, timeMinutes, timeSeconds, paceMinutes, paceSeconds, date, id){
        return { rowName, timeMinutes, timeSeconds, paceMinutes, paceSeconds, date, id };
    }

    render(){

        const { oneMileTime, twoMileTime, threeMileTime, fourMileTime, fiveMileTime} = this.state;
        const { classes } = this.props;

        // create data to pass to table rows
        const rows = [
            this.createRowData(
                'One Mile', 
                parseInt(oneMileTime.elapsedTime/60), 
                (oneMileTime.elapsedTime - parseInt(oneMileTime.elapsedTime/60)*60), 
                oneMileTime.averagePaceMinutes,
                oneMileTime.averagePaceSeconds,
                oneMileTime.activityDate,
                oneMileTime.activityID
            ),
            this.createRowData(
                'Two Miles', 
                parseInt(twoMileTime.elapsedTime/60), 
                (twoMileTime.elapsedTime - parseInt(twoMileTime.elapsedTime/60)*60), 
                twoMileTime.averagePaceMinutes,
                twoMileTime.averagePaceSeconds,
                twoMileTime.activityDate,
                twoMileTime.activityID
            ),
            this.createRowData(
                'Three Miles', 
                parseInt(threeMileTime.elapsedTime/60), 
                (threeMileTime.elapsedTime - parseInt(threeMileTime.elapsedTime/60)*60), 
                threeMileTime.averagePaceMinutes,
                threeMileTime.averagePaceSeconds,
                threeMileTime.activityDate,
                threeMileTime.activityID
            ),
            this.createRowData(
                'Four Miles', 
                parseInt(fourMileTime.elapsedTime/60), 
                (fourMileTime.elapsedTime - parseInt(fourMileTime.elapsedTime/60)*60), 
                fourMileTime.averagePaceMinutes,
                fourMileTime.averagePaceSeconds,
                fourMileTime.activityDate,
                fourMileTime.activityID
            ),
            this.createRowData(
                'Five Miles', 
                parseInt(fiveMileTime.elapsedTime/60), 
                (fiveMileTime.elapsedTime - parseInt(fiveMileTime.elapsedTime/60)*60), 
                fiveMileTime.averagePaceMinutes,
                fiveMileTime.averagePaceSeconds,
                fiveMileTime.activityDate,
                fiveMileTime.activityID
            ),
        ]; // END rows array

        return(
            <div className={classes.tableBox}>
                
                <TableContainer component={Paper} variant="outlined" className={classes.paper}>
                <Typography variant="subtitle1" className={classes.heading}>Fastest runs: </Typography>
                    <Table className={classes.table} size="small" aria-label="simple-table">
                        <TableHead className={classes.head}>
                        <TableRow className={classes.topRow}>
                            <TableCell className={classes.tableCell} variant="head">Mileage</TableCell>
                            <TableCell className={classes.tableCell} variant="head" align="left">Time</TableCell>
                            <TableCell className={classes.tableCell} variant="head" align="left">Pace</TableCell>
                            <TableCell className={classes.tableCell} variant="head" align="left">Date</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.rowName} hover>
                                <TableCell component="th" scope="row" className={classes.tableCell}>
                                    
                                    <a rel="noopener noreferrer" target="_blank" style={{textDecoration: 'underline'}} href={`https://www.strava.com/activities/${row.id}`}>{row.rowName}</a>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    {row.timeMinutes}:
                                    {row.timeSeconds < 10 && (
                                        `0${row.timeSeconds}`
                                    )}
                                    {row.timeSeconds >= 10 && (
                                        row.timeSeconds
                                    )}    
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    {row.paceMinutes}:
                                    {row.paceSeconds < 10 && (
                                        `0${row.paceSeconds}`
                                    )}
                                    {row.paceSeconds >= 10 && (
                                        row.paceSeconds
                                    )}
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    {new Date(row.date).getMonth()+1}/
                                    {new Date(row.date).getDate()}/
                                    {new Date(row.date).getFullYear()}
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div> 
        );
    }
}

export default withStyles(styles)(StatsTable);