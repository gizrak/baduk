// import React and our routing dependencies
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// import our shared layout component
import Layout from '../components/Layout';

// import our routes
import BoardPage from './board';
import GiboPage from './gibo';

// define our routes
const Pages = props => {
  return (
    <Router>
      <Layout>
        <Route exact path="/" component={BoardPage} />
        <Route path="/gibo" component={GiboPage} />
      </Layout>
    </Router>
  );
};

export default Pages;
