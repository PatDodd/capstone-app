import React, { Component } from 'react';

import { Container, Card, CardActionArea, CardActions, CardContent, Typography, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Timeline, OpenInNew, BarChart, TableChart, Map, Room, ShowChart} from '@material-ui/icons';

import { Link } from '@reach/router';

 
const styles = theme => ({
    card: {
        width: '25%',
        maxHeight: '100%',
        backgroundColor: theme.palette.secondary.main,
        color: 'white',
        marginTop: '20px',
        paddingLeft: '20px',
        marginRight: '20px',
        display: 'inline-block',
        [theme.breakpoints.up('lg')]: {
            width: '25%',
        },
        [theme.breakpoints.down('md')]: {
            width: '29%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '48%',
        },
        [theme.breakpoints.down('xs')]: {
            width: '90%',
            margin: 'auto',
            display: 'block',
            marginTop: '10px'
        },
        
    },
    lineplotIcon: {
        transform: 'translate(0px, 5px)'
    },
    button: {
        color: 'white',
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.contrastText
        },
        padding: '10px'
    },
    link: {
        color: 'white'
    },
    openIcon: {
        transform: 'translate(0px, -1px)',
        fontSize: '1.3em'
    }
});

class GetData extends Component {
    
    constructor(props){
        
        super(props);
        
        this.state = {
            
        }        
    }

    render(){
        
        const { classes } = this.props;

        return(
            <Container>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="body1" component="p">
                                Average Pace - Line Plot <Timeline className={classes.lineplotIcon} />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Link className={classes.link} to="/getdata/pace">
                            <Button size="medium" className={classes.button}>
                                OPEN CHART TYPE &nbsp; <OpenInNew className={classes.openIcon} />
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="body1" component="p">
                                Effort Breakdown - Bar Chart <BarChart className={classes.lineplotIcon} />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    <Link className={classes.link} to="/getdata/effortpercent">
                        <Button size="medium" className={classes.button}>
                                OPEN CHART TYPE &nbsp; <OpenInNew className={classes.openIcon} />
                        </Button>
                    </Link>
                    </CardActions>
                </Card>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="body1" component="p">
                                Stats - Table &amp; Graph &nbsp;
                                <TableChart className={classes.lineplotIcon} />
                                <BarChart className={classes.lineplotIcon} />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    <Link className={classes.link} to="/getdata/stats">
                        <Button size="medium" className={classes.button}>
                                OPEN CHART TYPE &nbsp; <OpenInNew className={classes.openIcon} />
                        </Button>
                    </Link>
                    </CardActions>
                </Card>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="body1" component="p">
                                 Heatmap of my Runs - Map &nbsp;
                                <Map className={classes.lineplotIcon} />
                                <Room className={classes.lineplotIcon} />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    <Link className={classes.link} to="/getdata/heatmap">
                        <Button size="medium" className={classes.button}>
                                OPEN CHART TYPE &nbsp; <OpenInNew className={classes.openIcon} />
                        </Button>
                    </Link>
                    </CardActions>
                </Card>
                <Card className={classes.card}>
                    <CardActionArea>
                        <CardContent>
                            <Typography gutterBottom variant="body1" component="p">
                                 Elevation Analysis - Line Graph &nbsp;
                                <ShowChart className={classes.lineplotIcon} />
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                    <Link className={classes.link} to="/getdata/elevation">
                        <Button size="medium" className={classes.button}>
                                OPEN CHART TYPE &nbsp; <OpenInNew className={classes.openIcon} />
                        </Button>
                    </Link>
                    </CardActions>
                </Card>
            </Container>
        );
    }
}



export default withStyles(styles)(GetData);