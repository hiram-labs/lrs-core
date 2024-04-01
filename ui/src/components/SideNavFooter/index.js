import React from 'react';
import styled from 'styled-components';

const Footer = styled.div`
  color: #999;

  @media screen and (max-height: 765px) {
    width: 150px;
  }
`;

export default () => (
  <Footer>
    <a href="mailto:support@v360energy.com">Help centre</a>
    <div>Powered by</div>
    <a href="https://github.com/LearningLocker/learninglocker" target="_blank" rel="noopener noreferrer">
      Learning Locker
    </a>
  </Footer>
);
