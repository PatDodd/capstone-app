import React, { Component, Fragment } from 'react';

import { CircularProgress, FormControl, InputLabel, Select, MenuItem, 
    Button, IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import firebase from './Firebase';

import OneMileLine from './OneMileLine';

const styles = theme => ({
    formControl: {
        margin: theme.spacing(3),
        width: '10%',
        [theme.breakpoints.up('lg')]: {
            width: '10%',
        },
        [theme.breakpoints.down('md')]: {
            width: '15%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '20%',
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
        color: theme.palette.error.main
    }
})



class Pace extends Component {
    
    constructor(props){
        
        super(props);
        
        this.state = {
            data: [],
            options: [],
            distance: '',
            effort: "",
            from: "",
            to: "",
            ready: false,
            graphLoaded: false,
            error: false
        }

        // get ref to db
        const db = firebase.firestore();
    
        var arr = []; // to hold initial data from db

        // call db if there's nothing in data[] yet
        if(this.state.data.length === 0) {
            db.collection('runs').get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) => {
                    arr.push(doc.data());
                });
            }).then(() => {
               
                this.setState({data: arr})
                const arr2 = this.state.data.map((item, i) => item.activityDate);
                this.setState({options: arr2}); 
            });
        }
         
        //console.log(this.state.data);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this); 
    }//end CONSTRUCTOR

    

    handleChange(e){
        e.preventDefault();

        //toggle state to prevent change until click event occurs
        if(this.state.ready){
            this.setState({ready: false});
        } 
        if(e.target.name === "mileage"){
            e.preventDefault();
            const val = parseFloat(e.target.value);
            this.setState({ distance: val });
        }

        if(e.target.name === "effort"){ this.setState({ effort: e.target.value }); }

        var from;
        var to;
        if(e.target.name === "from"){
            from = e.target.value;
            this.setState({from: from});
        }

        if(e.target.name === "to"){
            to = e.target.value;
            this.setState({to: to});
        }

        
    }

    handleClick(e){
        e.preventDefault();
        let a = this.state.distance;
        let b = this.state.effort;
        let c = this.state.from;
        let g = this.state.to;
      
        if((a && b && c && g) && (new Date(c) <= new Date(g))){
            this.setState({ ready: true });
            if((a === "undefined" || b === "undefined")){
                //alert("form is incomplete");
                this.setState({error: true});
            }
            
        } else {
            //alert('form is incomplete or date span invalid');
            this.setState({error: true});
        }       
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({error: false});
    };

    render(){

        //get options from state
        const { options } = this.state;
        // classes for styling
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
    
         // render bar graph when ready is true
        let chartComponent;

        if(this.state.ready){
            chartComponent = <OneMileLine 
                                data={this.state.data} 
                                distance={this.state.distance} 
                                effort={this.state.effort}
                                from={this.state.from}
                                to={this.state.to}
                             />
            
        }

        return(

            <Fragment>
                {opt.length === 0 && (
                    <CircularProgress color="primary"/>
                )}
                {opt !==0 && (
                <Fragment>
                    <FormControl className={classes.formControl}>
                        <InputLabel >Mileage: </InputLabel>
                        <Select name="mileage" onChange={this.handleChange} value={this.state.distance}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                            <MenuItem value="5">5</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel >Effort Level: </InputLabel>
                        <Select name="effort" onChange={this.handleChange} value={this.state.effort}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel >From: </InputLabel>
                        <Select name="from" onChange={this.handleChange} value={this.state.from}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            {opt}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel>To: </InputLabel>
                        <Select name="to" onChange={this.handleChange} value={this.state.to}>
                            <MenuItem value=""><em>None</em></MenuItem>
                            {opt}
                        </Select>
                    </FormControl>
                <   FormControl className={classes.formControl}>
                        <Button type="submit" onClick={this.handleClick} className={classes.button}>Get Chart</Button>
                    </FormControl>
                    {chartComponent}
                </Fragment>
            )}
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                    }}
                open={this.state.error}
                autoHideDuration={6000}
                onClose={this.handleClose}
                message="Form is incomplete or date range is invalid."
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
        </Fragment>
        );
    }
}



export default withStyles(styles)(Pace);