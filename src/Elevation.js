import React, { Component, Fragment }from 'react';

import ElevationGraph from './ElevationGraph';
import ElevationGraph2 from './ElevationGraph2';

import firebase from './Firebase';
import { InputLabel, FormControl, Select, MenuItem, Button, Snackbar, IconButton, Paper } from '@material-ui/core';
import { Close } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

const styles = theme => ({
    formControl: {
        margin: theme.spacing(3),
        width: '20%',
        [theme.breakpoints.down('sm')]: {
            width: '25%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '45%',
        }
    },
    button: {
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText
        },
        padding: '10px'
    },
    ErrorBtn: {
        color: red[500]
    },
    paper: {
        width: '48%',
        margin: '10px',
        display: 'inline-block',
        [theme.breakpoints.up('md')]: {
            width: '45%',
        },
        [theme.breakpoints.down('md')]: {
            width: '45%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '95%',
            margin: '2%'
        }
    },
    wrapper: {
        width: '100%'
    }
});

class Elevation extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: [],
            dataIndex: -1,
            date1: "",
            date2: "",
            options:[],
            compareIndex: -1,
            dataLoaded: false,
            ready: false,
            error: false
        }

        const db = firebase.firestore();
        var arr = []; // to hold initial data from db
        var dates = [];

        // get data from db for select items and to use to pass as props to <ElevationGraph /> 
        db.collection('elevations').get().then( querySnapshot => {
            querySnapshot.forEach(doc => {
                    arr = arr.concat(doc.data()); 
                    dates.push(doc.data().date); 
            });
        }).then(() => {
            this.setState({ data: arr });
            this.setState({options: dates});
        });

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    } // end constructor

    handleChange(e){
        e.preventDefault();

        // toggle ready state
        if(this.state.ready){
            this.setState({ready: false});
        } 
        
        let d1 = "";

        // get value of select item
        if(e.target.value){
            d1 = e.target.value
            this.setState({[e.target.name]: d1 });
        } 
    } // end handleChange

    handleClick(e){
        e.preventDefault();

        // handle form errors
        if(!this.state.date1 && !this.state.date2){
            this.setState({ error: true });
        }

        // if the data is loaded, find the index of the date string comparison in it
        if(this.state.data.length !== 0){
            
            let strIndex = this.state.data.map( item => {
                let d = new Date(item.date);
                let date = d.getDate().toString();
                let month = (d.getMonth()+1).toString(); // 0 indexed for some reason
                let year = d.getFullYear().toString();
                let dateStr = `${month}/${date}/${year}`;
                return dateStr;
            }).indexOf(this.state.date1);

            let compareIndex = this.state.data.map( item => {
                let d = new Date(item.date);
                let date = d.getDate().toString();
                let month = (d.getMonth()+1).toString(); // 0 indexed for some reason
                let year = d.getFullYear().toString();
                let dateStr = `${month}/${date}/${year}`;
                return dateStr;
            }).indexOf(this.state.date2);

            // set found indexes to state
            this.setState({ dataIndex: strIndex});
            this.setState({ compareIndex: compareIndex});
            console.log(compareIndex);

            if(this.state.date1 && this.state.date2){
                this.setState({ ready: true}); // is there's a date loaded
            } else {
                this.setState({error: true}); // if there's an erro
            }   
        }
        
    } // end handleClick

    // handles close of error snackbar
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({error: false});
    };

    componentDidMount(){
        this.setState({ dataLoaded: true }); 
    }
    
    render(){  
        const { options } = this.state;
        const { classes } = this.props;

        // parse options and format data as a string to insert into select box
        var opt = options.map((item, i) => {
            let d = new Date(item);
            let date = d.getDate();
            let month = d.getMonth()+1; // 0 indexed for some reason
            let year = d.getFullYear();
            let dateStr = `${month}/${date}/${year}`;
            return <MenuItem value={dateStr} key={i}>{dateStr}</MenuItem>;
        });

        let chartComponent, chartComponent2;

        if(this.state.ready){
            chartComponent = <ElevationGraph 
                                data={this.state.data} 
                                dataIndex={this.state.dataIndex}
                                canvas=".canvas"
                                color="#25A2BB"
                                className={classes.chart} 
                             />;
            chartComponent2 = <ElevationGraph2 
                                data={this.state.data} 
                                dataIndex={this.state.compareIndex}
                                canvas=".canvas2"
                                color="#25BA88"
                                className={classes.chart} 
                              />;
        }

        return (
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel>Select a run: </InputLabel>
                    <Select name="date1" onChange={this.handleChange} value={this.state.date1}>
                        <MenuItem value=""><em>None</em></MenuItem>
                            {opt}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel>Compare to run: </InputLabel>
                    <Select name="date2" onChange={this.handleChange} value={this.state.date2}>
                        <MenuItem value=""><em>None</em></MenuItem>
                            {opt}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <Button type="submit" onClick={this.handleClick} className={classes.button}>Get Chart</Button>
                </FormControl>
                
                {this.state.ready && (
                <div  className={classes.wrapper}>
                    <Paper className={classes.paper} variant="outlined">
                        {chartComponent}
                    </Paper>
                    <Paper className={classes.paper} variant="outlined">
                        {chartComponent2}
                    </Paper>
                </div>
                )}
                
                
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                        }}
                    open={this.state.error}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                    message="Form is incomplete."
                    action={
                        <Fragment>
                            <Button className={classes.ErrorBtn} size="small" onClick={this.handleClose}>
                            ERROR
                            </Button>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                            <Close fontSize="small" />
                            </IconButton>
                        </Fragment>
                    }
             />
            </div>
        );
    }
}

export default withStyles(styles)(Elevation);