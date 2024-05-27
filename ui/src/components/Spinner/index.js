import React from 'react';
import styled from 'styled-components';

import { rotation } from 'ui/utils/styled/animations';

const Spinner = styled.div`
  height: 30px;
  width: 30px;
  margin: auto;
  animation: ${rotation} 0.6s infinite linear;
  border-left: 4px solid rgba(194, 212, 0, 0.15);
  border-right: 4px solid rgba(194, 212, 0, 0.15);
  border-bottom: 4px solid rgba(194, 212, 0, 0.15);
  border-top: 4px solid rgba(194, 212, 0, 0.8);
  border-radius: 100%;
`;

const spinner = () => <Spinner />;

export default spinner;
