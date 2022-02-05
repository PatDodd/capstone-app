import React, { Component } from 'react';
import { Router, navigate } from '@reach/router';

import '@firebase/auth';
import firebase from './Firebase';

import Navigation from './Navigation';
import UploadRun from './UploadRun';
import Home from './Home';
import Signup from './Signup';
import GetData from './GetData';
import Pace from './Pace';
import EffortPercent from './EffortPercent';
import Stats from './Stats';
import Heatmap from './Heatmap';
import Elevation from './Elevation';

import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      auth: null
    }
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount(){
      firebase.auth().onAuthStateChanged((user) => {
        if(user){
          this.setState({ auth: true });
        } 
      });
  }

  logOut(e){
    e.preventDefault();
    this.setState({auth: false});
    firebase.auth().signOut().then(() => {
      navigate('/');
    });
  }
  render(){
    return (
      <div>
        <Navigation auth={this.state.auth} logOut={this.logOut} />
         
        <Router >
          <Home path="/" auth={this.state.auth} />
            <Signup path="/sign-up" auth={this.state.auth}/>
            {this.state.auth && ( <UploadRun path="/uploadrun" auth={this.state.auth} /> )}
            {this.state.auth && ( <GetData path="/getdata" auth={this.state.auth} /> )}
            {this.state.auth && ( <Pace path="/getdata/pace" auth={this.state.auth} /> )}
            {this.state.auth && ( <EffortPercent path="/getdata/effortpercent" auth={this.state.auth} /> )}
            {this.state.auth && ( <Stats path="/getdata/stats" auth={this.state.auth} /> )}
            {this.state.auth && ( <Heatmap path="/getdata/heatmap" auth={this.state.auth} /> )}
            {this.state.auth && ( <Elevation path="/getdata/elevation" auth={this.state.auth} /> )}
        </Router>
      
      </div>
    );
  }
}

export default App;
