import React, { Component } from 'react';
import { Link } from '@reach/router';

import { AppBar, Toolbar, Button, Typography } from '@material-ui/core';
import { DirectionsRun } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    menuItem: {
        marginLeft: 'auto',
        color:'white',
        textTransform: 'capitalize',
        fontSize: 16
    },
    runningIcon: {
        [theme.breakpoints.down('xs')]: {
            display:'none'
        }
    },
    logoText: {
        [theme.breakpoints.down('xs')]: {
            fontSize: '16px'
        }
    },

    logoLink: {
        color:'white'
    }

});

class Navigation extends Component {
    
    render(){

      const { auth, logOut, classes } = this.props; // check if logged in

      return (
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography  className={classes.logoText} variant="h5" color="inherit">
                        <Link to="/" className={classes.logoLink}>
                            Runalytical
                            <DirectionsRun className={classes.runningIcon} />
                        </Link>
                    </Typography>
                    <div className={classes.menuItem}>
                        { auth && (
                             <Link to="/getdata"  >
                                <Button color="inherit" className={classes.menuItem}>
                                    Data
                                </Button>
                             </Link>
                        )}
                        { auth &&(
                             <Link to="/uploadrun"  >
                                <Button className={classes.menuItem} color="inherit" label="Upload Run">
                                    Upload
                                </Button>
                             </Link>
                        )}
                        { !auth && (
                             <Link to="/">
                                <Button color="inherit" className={classes.menuItem}>
                                    Log In
                                </Button>
                             </Link>
                        )}
                        { auth && (
                             <Link to="/">
                                <Button className={classes.menuItem} color="inherit" onClick={e => logOut(e)}>
                                    Log Out
                                </Button> 
                             </Link>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(Navigation);