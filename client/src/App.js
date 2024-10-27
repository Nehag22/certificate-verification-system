// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/pages/AdminDashboard';
import StudentPortal from './components/pages/StudentPortal';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/student-portal" element={<StudentPortal />} />

      </Routes>
    </Router>
  );
};

export default App;
