import React from 'react';
import Switch from 'react-toolbox/lib/switch';
import styled from 'styled-components';

const rippleClassName = 'ms-ripple';
const offClassName = 'ms-off';
const onClassName = 'ms-on';
const thumbClassName = 'ms-thumb';

const StyledSwitch = styled(Switch)`
  .${rippleClassName} {
    background-color: rgb(194, 213, 0);
    border-color: rgb(194, 213, 0);
  }

  .${offClassName} {
    background-color: rgba(0, 0, 0, 0.26);

    .${thumbClassName} {
      background-color: white;
    }
  }

  .${onClassName} {
    background-color: rgba(194, 213, 0, 0.26);

    .${thumbClassName} {
      background-color: rgb(194, 213, 0);
    }
  }
`;

export default (props) => (
  <StyledSwitch
    theme={{
      ripple: rippleClassName,
      off: offClassName,
      on: onClassName,
      thumb: thumbClassName
    }}
    {...props}
  />
);
