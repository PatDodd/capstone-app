import React, { Component, Fragment } from 'react';
import { navigate } from '@reach/router';

import { TextField, Button, Snackbar, IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons/';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';

import '@firebase/auth';
import firebase from './Firebase';

const styles = theme => ({
    form: {
        display: "block",
        width: '80%',
       '& > *':{
            margin: theme.spacing(2),
            width: '80%'
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
    signup: {
        
      
    },
    ErrorBtn: {
        color: theme.palette.error.main
    },
    alert: {
        width:'275px',
        marginRight: theme.spacing(2),
        marginTop: '10px',
        padding: '10px'
    }
})

class Signup extends Component {
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

        const userName = this.state.userName;
        const password = this.state.password;

        firebase.auth().createUserWithEmailAndPassword(userName, password)
            .then(() => {
                navigate('/');
            }) 
            .catch((error) =>{
                var errorMessage = error.message;
                this.setState({
                    error: true,
                    errorMsg: errorMessage
                })
        });
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        this.setState({error: false});
    };

    render(){
        const { auth, classes } = this.props;
        return (
            
            <Fragment>
                {!auth && (
                    <form  className={classes.form} noValidate autoComplete="off">
                        <Typography variant="h6">Sign-Up below:</Typography>
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
                        />
                        <Button onClick={this.handleClick} className={classes.button}>Sign-Up</Button>
                    </form>
                )}
                {auth && (
                    <div className="userInfo">
                        <Alert className={classes.alert} variant="filled" severity="error">
                            Page not available while logged in!
                        </Alert>
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
        )
    }
    
}

export default withStyles(styles)(Signup);