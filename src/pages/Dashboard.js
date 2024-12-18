import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Welcome to Busy Bee Learning!</h1>
      <p>Select a course to get started:</p>
      <div>
        <Link to="/course/english">English</Link>
        <Link to="/course/mathematics">Mathematics</Link>
        <Link to="/course/history">History</Link>
      </div>
    </div>
  );
};

export default Dashboard;
