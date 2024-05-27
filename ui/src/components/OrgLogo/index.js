import React from 'react';
import blankImage from 'ui/static/blankImage.png';

const getLogoSrc = (organisation) => {
  const orgId = organisation.get('_id');
  const updatedAt = organisation.getIn(['logo', 'updatedAt']);
  return `/api/downloadlogo/${orgId}?t=${updatedAt}`;
};

const getSrc = (organisation) => (organisation.has('logo') ? getLogoSrc(organisation) : blankImage);

export default ({ organisation, style = {} }) => (
  <img role="presentation" style={style} alt="logo" src={getSrc(organisation)} />
);
