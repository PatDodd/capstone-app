import React, { Component } from "react";
import { d3EffortPercent } from './d3EffortPercent';


class EffPercGraph extends Component{
    
    // call d3 code for bar chart after canvas renders
    componentDidMount(){
        let { data, from, to } = this.props;
        d3EffortPercent(data, from, to); 
    }
    render(){

        return (
            <div>
                <div className="canvas">
                    <div className="innerCanvas">
                        <h5 className="graphTitle">Effort Percentages</h5>
                    </div>
                </div>
            </div>
        );
    }
}

export default EffPercGraph;