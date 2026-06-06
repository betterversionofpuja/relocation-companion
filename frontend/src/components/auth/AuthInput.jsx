const AuthInput = ({ id, label, error, ...props }) => (
  <div className="auth-field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} className="auth-error">
        {error}
      </p>
    )}
  </div>
);

export default AuthInput;
