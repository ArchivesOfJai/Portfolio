import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectAPI } from '../services/api';

const ProjectGrid = () => {
  const [projects, setProjects] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectAPI.getAll();
        setProjects(response.data);
        setFiltered(response.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter((p) => p.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const categories = ['All', ...new Set(projects.map((p) => p.category))];

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <div className="text-gray-400">⏳ Loading projects...</div>
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

  return (
    <section className="py-20 bg-netflix-dark">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          All <span className="text-red-600">Projects</span>
        </motion.h2>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-red-600 text-white'
                  : 'bg-netflix-light text-gray-300 hover:bg-netflix-dark border border-gray-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          {filtered.map((project, idx) => (
            <motion.div
              key={project._id}
              className="group relative h-80 rounded-lg overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-200 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech_stack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-red-600 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.github_link && (
                    <motion.a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded text-center font-semibold transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      GitHub
                    </motion.a>
                  )}
                  {project.live_link && (
                    <motion.a
                      href={project.live_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 border-2 border-red-600 hover:bg-red-600 text-red-600 hover:text-white py-2 rounded text-center font-semibold transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectGrid;
