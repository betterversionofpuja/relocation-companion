import { motion } from "framer-motion";

const PageTransition = ({ children, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
    transition={{ duration: 0.42, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
