import React, { Component, Fragment }from 'react';
import { d3Elevation } from './d3Elevation';
import { Skeleton } from '@material-ui/lab';

class ElevationGraph2 extends Component {

    componentDidMount(){
        const { data, dataIndex, canvas, color } = this.props;
        d3Elevation(data[dataIndex].elevations, canvas, color); // build graph
    }

    render(){
        const { data, dataIndex } = this.props;
        
        // initialize variables for dates and max/min
        let dateStartMonth, dateStartDay, dateStartYear, dateStartHours, dateStartMinutes, dateStartSeconds = "";
        let dateEndMonth, dateEndDay, dateEndYear, dateEndHours, dateEndMinutes, dateEndSeconds = "";
        let size = data[dataIndex].elevations.length;
        let max = 0;
        let min = 0;

        if(data.length !== 0){
            
            // formate start date
            dateStartMonth = (new Date(data[dataIndex].elevations[0].dateTime).getMonth()+1).toString();
            dateStartDay = new Date(data[dataIndex].elevations[0].dateTime).getDate().toString();
            dateStartYear = new Date(data[dataIndex].elevations[0].dateTime).getFullYear().toString();
            dateStartHours = new Date(data[dataIndex].elevations[0].dateTime).getHours().toString();
            dateStartMinutes = new Date(data[dataIndex].elevations[0].dateTime).getMinutes().toString();
            if(dateStartMinutes < 10) dateStartMinutes = 0 + dateStartMinutes;
            dateStartSeconds = new Date(data[dataIndex].elevations[0].dateTime).getSeconds().toString();
            if(dateStartSeconds < 10) dateStartSeconds = 0 + dateStartSeconds; // ex: 01
            
            // format end date
            dateEndMonth = (new Date(data[dataIndex].elevations[size-1].dateTime).getMonth()+1).toString();
            dateEndDay = new Date(data[dataIndex].elevations[size-1].dateTime).getDate().toString();
            dateEndYear = new Date(data[dataIndex].elevations[size-1].dateTime).getFullYear().toString();
            dateEndHours = new Date(data[dataIndex].elevations[size-1].dateTime).getHours().toString();
            dateEndMinutes = new Date(data[dataIndex].elevations[size-1].dateTime).getMinutes().toString();
            if(dateEndMinutes < 10) dateEndMinutes = 0 + dateEndMinutes;
            dateEndSeconds = new Date(data[dataIndex].elevations[size-1].dateTime).getSeconds().toString();
            if(dateEndSeconds < 10) dateEndSeconds = 0 + dateEndSeconds; // ex: 01
           
            // format max and min
            max = parseFloat(Math.max(...data[dataIndex].elevations.map(d => d.elevation*3.28084)));
            min = parseFloat(Math.min(...data[dataIndex].elevations.map(d => d.elevation*3.28084)));
        }
        
        return (
            <div> 
                <div className="canvas2">
                    { data.length === 0 && (
                    <Fragment>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text" animation={false} />
                        <Skeleton variant="rect" animation="wave" height={400} />
                    </Fragment>
                    )}
                    <div className="innerCanvas">
                        <h3 className="graphTitle">Elevations Changes</h3>
                        <p className="graphTitle" style={{color: 'grey'}}>
                            Start: {dateStartMonth}/{dateStartDay}/{dateStartYear}
                            , {dateStartHours}:{dateStartMinutes}:{dateStartSeconds}   
                        </p>
                        <p className="graphTitle" style={{color: 'grey'}}>
                            End: {dateEndMonth}/{dateEndDay}/{dateEndYear}
                            , {dateEndHours}:{dateEndMinutes}:{dateEndSeconds}
                        </p>
                        <p className="graphTitle" style={{color: 'grey'}}>
                            Min: {Math.round(min)} ft.,
                            Max: {Math.round(max)} ft.,
                            Variance: {Math.round(max - min)} ft.
                        </p> 
                    </div>
                </div>
            </div>
        );
    }
}

export default ElevationGraph2;