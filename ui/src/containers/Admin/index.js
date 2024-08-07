import React from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import TopNav from 'ui/containers/TopNav';
import createAsyncComponent from 'ui/utils/createAsyncComponent';
import { routeNodeSelector } from 'redux-router5';
import { startsWithSegment } from 'router5.helpers';
import AuthContainer from 'ui/containers/AuthContainer';
import AdminSideNav from 'ui/containers/Admin/AdminSideNav';

const renderPage = (routeName) => {
  const testRoute = startsWithSegment(routeName);

  if (testRoute('admin.users')) {
    return React.createElement(
      createAsyncComponent({
        loader: import('ui/pages/SiteUsersPage')
      })
    );
  }

  if (testRoute('admin.organisations')) {
    return React.createElement(
      createAsyncComponent({
        loader: import('ui/pages/SiteOrgsPage')
      })
    );
  }
};

const render = ({ route }) => {
  const { name } = route;
  return (
    <div id="app">
      <AuthContainer>
        <Helmet title=" - Admin" />
        <TopNav />
        <div className="container-fluid">
          <AdminSideNav />
          <div className="main">{renderPage(name)}</div>
        </div>
      </AuthContainer>
    </div>
  );
};

export default connect(
  (state) => ({
    route: routeNodeSelector('admin')(state).route,
    users: routeNodeSelector('admin.data')(state).route,
    organisations: routeNodeSelector('admin.organisations')(state).route
  }),
  {}
)(render);
