import React from 'react';
import Dropdown from 'react-toolbox/lib/dropdown';
import styled from 'styled-components';

const valuesClassName = 'values';
const selectedClassName = 'selected';

const StyledDropdown = styled(Dropdown)`
  .${valuesClassName} {
    .${selectedClassName} {
      color: rgb(151, 193, 31);
    }
  }
`;

export default (props) => (
  <StyledDropdown
    theme={{
      values: valuesClassName,
      selected: selectedClassName
    }}
    {...props}
  />
);
