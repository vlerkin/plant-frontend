import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }} // Initial state
      animate={{ opacity: 1 }} // Animation state
      exit={{ opacity: 0 }} // Exit state
      transition={{ duration: 1 }} // Duration of the animation
      className="flex justify-center items-center mt-32"
    >
      🌱Loading...
    </motion.div>
  );
};

export default LoadingAnimation;
