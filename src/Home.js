import React, { Component, Fragment } from 'react';
import { Link, navigate } from '@reach/router';

import { TextField, Button, Snackbar, IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons/';
import { withStyles } from '@material-ui/core/styles';
import '@firebase/auth';
import firebase from './Firebase';

const styles = theme => ({
   
    root: {
         width: '80%',
        // display: "block",
       '& > *':{
            margin: theme.spacing(2),
           // display: 'block',
            width: '80%'
        } 
    },
    
    button: {
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText
        },
        //width: '100%',
        padding: '10px'
    },
    signup: {
       display: 'inline' 
      
    },
    ErrorBtn: {
        color: theme.palette.error.main
    }
})

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            password: '',
            error: false,
            errorMsg: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);    
    }

    handleChange(e){
        const itemName = e.target.name;
        const itemVal = e.target.value;

        this.setState({
            [itemName]: itemVal
        });
    }

    handleClick(e){
        e.preventDefault();
        var email = this.state.userName;
        var password = this.state.password;
    
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            navigate('/getdata');
        }) 
            .catch((error) => {
               
                var errorMessage = error.message;
                var errorBool = true;
                this.setState({
                    error: errorBool, 
                    errorMsg: errorMessage
                });
                
        });

     
        
        
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({error: false});
    };



    render(){

        // get auth and classes
        const { auth, classes} = this.props;
        

        return(
            <Fragment>
            {!auth && (
                
                <form  className={classes.root} noValidate autoComplete="off">
                    <Typography variant="h6">Log-In below:</Typography>
                    <TextField 
                        id="outlined-basic" 
                        label="Email" 
                        variant="outlined"
                        required
                        type="text" 
                        placeholder="Enter User Name"
                        name="userName"
                        value={this.state.userName}
                        onChange={this.handleChange}
                        className={classes.text} 
                    />
                    <TextField 
                        id="outlined-password-input" 
                        type="password" 
                        label="Password" 
                        variant="outlined" 
                        required
                        placeholder="Enter Password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        className={classes.text}
                    />
                    <Button onClick={this.handleClick} className={classes.button}>Log In</Button>
                   <Typography variant="body1" component="p">Not a member yet? </Typography>
                    <Link to="/sign-up" className={classes.signup} >Sign Up</Link>
                </form>
            )}
            {auth && (
                <div className="userInfo">
                    <h5 className="offset-s6">Welcome to Runalytical</h5>
                        <p className="about">
                        Runalytical examines your Strava run data and analyzes
                        it further, using custom visualizations to help you dig deeper into your running 
                        habits. Go to "Get Data" in the menu to see what we're talking about.
                        </p>
                        <img className="about bannister" src="https://upload.wikimedia.org/wikipedia/commons/0/06/Roger_Bannister_1953.jpg" alt="Roger Bannister 1953.jpg" />
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
                    message={this.state.errorMsg}
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

export default withStyles(styles)(Home);