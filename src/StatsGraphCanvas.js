import React, { Component } from "react";
import { d3StatsGraph } from './d3StatsGraph';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    heading: {
        margin: 10
    }
});
  
class StatsGraphCanvas extends Component{
    
    // call d3 code for bar chart after canvas renders
    componentDidMount(){
        let { data } = this.props;
        d3StatsGraph(data); 
    }
    render(){
        
        const { classes } = this.props;

        return (
            
            <div>
                <div className="canvas">
                    <div className="innerCanvas">
                        <Typography variant="subtitle1" className={classes.heading}>
                            Number of runs in each mileage range: 
                        </Typography>
                    </div>
                </div>
            </div>
        
        );
    }
}

export default withStyles(styles)(StatsGraphCanvas);