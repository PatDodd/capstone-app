import React, { Component, Fragment } from 'react';

import { CircularProgress, FormControl, InputLabel, Select, MenuItem, 
         Button, IconButton, Snackbar } from '@material-ui/core';
import { Close } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

import firebase from './Firebase';

import EffPercGraph from './EffPercGraph';

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
        color: red[500]
    }
});

class EffortPercent extends Component {
    constructor(props){
      
        super(props)
      
        this.state = {
            data: [],
            options: [],
            from: "",
            to: "",
            ready: false,
            error: false
        }

        // get ref to db
        const db = firebase.firestore();
    
        var arr = []; // to hold initial data from db

        // call db if there's nothing in data[] yet
        if(this.state.data.length === 0){
            db.collection('runs').get().then((querySnapshot) =>{
                querySnapshot.forEach((doc) => {
                    arr.push(doc.data());
                });
            }).then(() => {
               
                this.setState({data: arr})
                const arr2 = this.state.data.map((item, i) => item.activityDate);
                this.setState({options: arr2}); 
                console.log(this.state.data);
            });
        } 
        
        // bind handlers
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

   } // END CONSTRUCTOR

    // set state for from and to to dropdown values
    handleChange(e){
        e.preventDefault();
        //toggle ready state to prevent change until click occurs
        if(this.state.ready){
            this.setState({ready: false});
        } 
        
        //console.log(e.target.value);  
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

        
    } // end handleChange

    // page won't rerender until click event, changes ready to true if from and to are defined
    // and set to appropriate values
    handleClick(e){
        e.preventDefault();

        let a = this.state.from;
        let b = this.state.to;
      
        if((a && b) && (new Date(a) <= new Date(b))){
            this.setState({ ready: true });
        } else {
            if((a === "undefined" || b === "undefined")){
                //alert("form is incomplete or data span is invalid");
                this.setState({error: true});
            } else {
                //alert("please enter a valid date span");
                this.setState({error: true});
            }
            
        }
    } // END HANDLECLICK

    
    
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({error: false});
    };

    render(){

        
        //get options from state
        const { options } = this.state;
        //get classes from props
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
            chartComponent = <EffPercGraph data={this.state.data} to={this.state.to} from={this.state.from}/>;
        }
       
     return (
        <Fragment>
            {opt.length === 0 && (
                <CircularProgress color="primary"/>
            )}
            {opt !==0 && (
                <Fragment>
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
                    <FormControl className={classes.formControl}>
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
    } // END RENDER
} // END CLASS

export default withStyles(styles)(EffortPercent);