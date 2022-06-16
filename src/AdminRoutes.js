import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import AdminLayout from 'layouts/Admin';
import { isAuthenticated } from 'api/auth';

const AdminRoutes = () => {
  return <Route render={() => (isAuthenticated() !== false ? <AdminLayout /> : <Redirect to="/login" />)} />;
};

export default AdminRoutes;
