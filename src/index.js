import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'react-app-polyfill/ie9';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { cyan, blueGrey } from '@material-ui/core/colors/';



const theme = createMuiTheme({
    palette: {
        primary: {
            main: cyan[800],
            light: cyan[700],
            contrastText: cyan[600]
        },
        secondary: {
          main: blueGrey[500]
        }
    },
    typography: {
        fontFamily: 'Libre Franklin, sans-serif'
    },
    spacing: 5
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <App />
    </MuiThemeProvider>, 
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
