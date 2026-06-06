import { motion } from 'framer-motion';
import { smoothScroll } from '../utils/scrollUtils';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-netflix-dark to-netflix-light flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-20 w-72 h-72 bg-red-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-red-600 rounded-full filter blur-3xl"></div>
      </div>

      <motion.div
        className="relative z-10 text-center max-w-3xl mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-4 text-white"
          variants={itemVariants}
        >
          Welcome to My
          <span className="text-red-600"> Portfolio</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-2xl text-gray-300 mb-8"
          variants={itemVariants}
        >
          Full Stack Developer crafting beautiful and functional web experiences
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center flex-col sm:flex-row"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => smoothScroll('projects')}
            className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View My Work
          </motion.button>

          <motion.button
            onClick={() => smoothScroll('contact')}
            className="px-8 py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get in Touch
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
