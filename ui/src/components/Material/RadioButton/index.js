import React from 'react';
import { RadioButton } from 'react-toolbox/lib/radio';
import styled from 'styled-components';

const radioCheckedClassName = 'rb-radioChecked';
const rippleClassName = 'rb-styled-ripple';
// Because `radio` is in `core.css`
const radioClassName = 'rb-radio';

const StyledRadioButton = styled(RadioButton)`
  && {
    .${radioCheckedClassName} {
      border-color: rgb(151, 193, 31);
    }

    .${radioClassName}:before, .${radioCheckedClassName}:before {
      background-color: rgb(151, 193, 31);
    }

    .${radioClassName} .${rippleClassName}, .${radioCheckedClassName} .${rippleClassName} {
      background-color: rgb(151, 193, 31);
      border-color: rgb(151, 193, 31);
    }
  }
`;

export default (props) => (
  <StyledRadioButton
    theme={{
      radio: radioClassName,
      radioChecked: radioCheckedClassName,
      ripple: rippleClassName
    }}
    {...props}
  />
);
