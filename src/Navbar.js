import React, { Component } from 'react';
import { Link } from '@reach/router';

class Navbar extends Component{
  
    render(){

      const {auth} = this.props;  

        return (
            <div>
                <ul className="navbar">
                { auth && ( <li><Link to="/getdata">Get Data</Link></li> )}
                { auth && ( <li><Link to="/uploadrun" >Upload Run</Link></li> )}
                { !auth && ( <li><Link to="/" >Log In</Link></li> )}
                { auth && ( <li><Link to="/" >Log Out</Link></li> )}
                </ul>  
             </div>
        )
        
    }
}

export default Navbar;