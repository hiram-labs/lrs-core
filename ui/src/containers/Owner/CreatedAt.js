import moment from 'moment';
import React from 'react';

export default (createdAt) => {
  if (!createdAt) return '';
  return (
    <span>
      {'Created '}
      <span title={moment(createdAt).utc().format('YYYY-MM-DD HH:mm:ss')}>{moment(createdAt).utc().fromNow()}</span>
    </span>
  );
};
