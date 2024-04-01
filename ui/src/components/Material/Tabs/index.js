import React from 'react';
import { Tabs } from 'react-toolbox/lib/tabs';
import styled from 'styled-components';

const tabClassName = 'tab';
const pointerClassName = 'tab-pointer';

const StyledTabs = styled(Tabs)`
  && {
    .${pointerClassName} {
      background-color: rgb(151, 193, 31);
    }

    .${tabClassName} {
      overflow: visible;
    }
  }
`;

export default ({ children, ...props }) => (
  <StyledTabs
    theme={{
      tab: tabClassName,
      pointer: pointerClassName
    }}
    {...props}
  >
    {children}
  </StyledTabs>
);
