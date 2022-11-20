import React from 'react';
import PropTypes from 'prop-types';
import './ErrorToast.css';

const ErrorToast = ({ message }) => {
  if (!message.length) return null;
  return (
    <div className="ErrorToast" role="alert">
      {message}
    </div>
  );
};

ErrorToast.defaultProps = {
  message: ''
};

ErrorToast.propTypes = {
  message: PropTypes.string.isRequired
};

export default ErrorToast;
