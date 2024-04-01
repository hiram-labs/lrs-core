import React from 'react';
import Input from 'react-toolbox/lib/input';
import styled from 'styled-components';

const inputClassName = 'mi-input';
const inputElementClassName = 'mi-inputElement';
const labelClassName = 'mi-label';
const barClassName = 'mi-bar';
const fixedClassName = 'mi-fixed';

const StyledInput = styled(Input)`
  .${inputElementClassName}:focus:not([disabled]):not([readonly]) ~ .${labelClassName}:not(.${fixedClassName}) {
    color: rgb(151, 193, 31);
  }

  .${barClassName} {
    &:before,
    &:after {
      background-color: rgb(151, 193, 31);
    }
  }
`;

export default (props) => (
  <StyledInput
    theme={{
      input: inputClassName,
      inputElement: inputElementClassName,
      bar: barClassName,
      label: labelClassName
    }}
    {...props}
  />
);
