import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  disabled,
  ...rest
}) {
  const classes = `btn btn--${variant} btn--${size} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'ghost', 'mars']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit']),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
