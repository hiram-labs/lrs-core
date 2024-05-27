import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import styled from 'styled-components';

const valueClassName = 'value';

const StyledProgressBar = styled(ProgressBar)`
  && {
    .${valueClassName} {
      background-color: rgb(194, 213, 0);
    }
  }
`;

export default (props) => <StyledProgressBar theme={{ value: valueClassName }} {...props} />;
