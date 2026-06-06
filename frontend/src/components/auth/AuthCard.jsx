import { motion } from "framer-motion";

const AuthCard = ({ eyebrow, title, subtitle, children }) => (
  <motion.section
    className="auth-card"
    initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <div className="auth-card-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {children}
  </motion.section>
);

export default AuthCard;
