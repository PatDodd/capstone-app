import React, { Component } from "react";
import { d3AvgPace} from './AveragePace';


class OneMileLine extends Component {
   
    constructor(props){
        super(props)
        this.state = {
            loading: true
        }
    }

    componentDidMount(){
        let { data, distance, effort, from, to } = this.props;
        // draw graph after canvas renders
        d3AvgPace(data, distance, effort, from, to);     
    }

    render(){
           
        return (
                <div>
                    <div className="canvas">
                        <div className="innerCanvas">
                            <h3 className="graphTitle">Average Pace</h3>
                            <p className="graphTitle" style={{color: 'grey'}}>
                                distance: {this.props.distance} miles, effort: {this.props.effort}
                            </p> 
                        </div>
                    </div>
                </div>
        );
    }   
    
}

export default OneMileLine;