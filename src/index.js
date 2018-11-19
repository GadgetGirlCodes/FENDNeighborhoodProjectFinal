import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


// The code below was taken from the material-ui page. Because I am not using a theme of any sort, 
// I put this code in place to remove the error being logged to the console about depriciation. 
// Reference can be found here:
// https://material-ui.com/style/typography/#migration-to-typography-v2 and here:
// https://github.com/mui-org/material-ui/issues/13366
window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true; 

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
