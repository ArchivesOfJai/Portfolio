import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { skillAPI } from '../services/api';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await skillAPI.getAll();
        setSkills(response.data);
      } catch (err) {
        setError('Failed to load skills');
        console.error('Error fetching skills:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupByCategory = () => {
    const grouped = {};
    skills.forEach((skill) => {
      if (!grouped[skill.category]) {
        grouped[skill.category] = [];
      }
      grouped[skill.category].push(skill);
    });
    return grouped;
  };

  const skillsByCategory = groupByCategory();
  const categories = Object.keys(skillsByCategory);

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-gray-400">⏳ Loading skills...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-red-400">⚠️ {error}</div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 bg-netflix-light">
      <div className="max-w-6xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          My <span className="text-red-600">Skills</span>
        </motion.h2>

        {categories.map((category) => (
          <motion.div
            key={category}
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-red-600">{category}</h3>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {skillsByCategory[category].map((skill) => (
                <motion.div
                  key={skill._id}
                  className="bg-netflix-dark p-6 rounded-lg border border-gray-700 hover:border-red-600 transition-colors"
                  variants={itemVariants}
                  whileHover={{ y: -5, borderColor: '#e50914' }}
                >
                  <div className="text-4xl mb-3">{skill.icon}</div>
                  <h4 className="text-lg font-semibold mb-3">{skill.name}</h4>

                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-red-600 to-red-400 h-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(skill.proficiency / 5) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      viewport={{ once: true }}
                    ></motion.div>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-400">
                      {'★'.repeat(skill.proficiency)}
                      {'☆'.repeat(5 - skill.proficiency)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
