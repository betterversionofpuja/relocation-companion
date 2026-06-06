import { motion } from "framer-motion";

const LoadingScreen = ({ label = "Preparing secure workspace" }) => (
  <div className="loading-screen" role="status" aria-live="polite">
    <motion.div
      className="loading-card"
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="loading-mark" aria-hidden="true" />
      <p>{label}</p>
    </motion.div>
  </div>
);

export default LoadingScreen;
