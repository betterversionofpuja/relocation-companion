import { motion } from "framer-motion";

const AuthButton = ({ loading, children, ...props }) => (
  <motion.button
    className="auth-button"
    disabled={loading || props.disabled}
    whileHover={!loading && !props.disabled ? { y: -2 } : undefined}
    whileTap={!loading && !props.disabled ? { scale: 0.98 } : undefined}
    {...props}
  >
    {loading ? "Please wait..." : children}
  </motion.button>
);

export default AuthButton;
