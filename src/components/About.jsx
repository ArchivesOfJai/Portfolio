import { motion } from 'framer-motion';
import DP from '../../assets/Jaisingh_img.jpg';

const About = () => {
  return (
    <section className="py-20 bg-netflix-dark">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          About <span className="text-red-600">Me</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src={DP}
              alt="Profile"
              className="rounded-lg"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              Hi! I'm a passionate full-stack developer with hands-on experience building
              web applications. I specialize in creating beautiful, responsive interfaces
              and robust backend systems.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed">
              I love working with modern technologies like React, Node.js, and MongoDB.
              My goal is to build applications that not only look great but also provide
              excellent user experiences.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-red-600 text-2xl">✓</span>
                <span className="text-gray-300">Full Stack Development</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-red-600 text-2xl">✓</span>
                <span className="text-gray-300">UI/UX Design</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-red-600 text-2xl">✓</span>
                <span className="text-gray-300">Mobile Responsive</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-red-600 text-2xl">✓</span>
                <span className="text-gray-300">Performance Optimization</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
