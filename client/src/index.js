import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";


const Index = () => (
    <Router>
        <App />
    </Router>
)
ReactDOM.render(<Index />, document.getElementById('root'));

