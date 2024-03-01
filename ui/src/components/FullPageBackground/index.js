import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { setPropTypes, compose, lifecycle } from 'recompose';

import { fetchAppData } from 'ui/redux/modules/app';
import backgroundImg from 'ui/assets/background.png';
import logoImg from 'ui/static/logo.png';

const Background = styled.div`
  background-image: url('${backgroundImg}');
  background-size: cover;
  display: flex;
  width: 100%;
  min-height: 100vh;
  color: #687b88;
`;

const Centered = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  & h3 {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  & [data-react-toolbox='avatar'] {
    background-color: transparent;
  }
`;

const Headline = styled.span`
  text-transform: uppercase;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  margin: 12px 0;
`;

const Copyright = styled.p`
  margin-top: 28px;
  color: #687b88;
  opacity: 0.7;
`;

const enhance = compose(
  setPropTypes({
    children: PropTypes.node
  }),
  connect(() => ({}), { fetchAppData }),
  lifecycle({
    componentDidMount() {
      this.props.fetchAppData({ key: 'version' });
    }
  })
);

const FullPageBackground = ({ children, width = 800 }) => (
  <Background>
    <Centered>
      <img alt="logo" src={logoImg} />
      <Headline>making learning measurable</Headline>
      <div style={{ width }}>{children}</div>
      <Copyright>
        &copy; {new Date().getFullYear()}&nbsp;&nbsp; poweredBy&nbsp;&nbsp;
        <a
          href="https://github.com/LearningLocker"
          title="Learning Locker - Learning Locker is the open source Learning Record Store for tracking learning data using the Experience API."
          target="_blank"
          rel="noopener noreferrer"
        >
          Learning Locker
        </a>
      </Copyright>
    </Centered>
  </Background>
);

export default enhance(FullPageBackground);
