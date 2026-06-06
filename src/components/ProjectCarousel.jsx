import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectAPI } from '../services/api';

const ProjectCarousel = () => {
  const [projects, setProjects] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await projectAPI.getFeatured();
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load featured projects');
        console.error('Error fetching featured projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [projects.length]);

  if (loading) {
    return (
      <div className="w-full h-96 bg-netflix-light flex items-center justify-center">
        <div className="text-gray-400">⏳ Loading featured projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 bg-netflix-light flex items-center justify-center">
        <div className="text-red-400">⚠️ {error}</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  const nextProject = () => {
    setCurrent((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrent((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <section className="py-16 bg-netflix-dark">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Featured Projects</h2>

        <div className="relative group">
          <motion.div
            className="relative w-full h-96 rounded-lg overflow-hidden"
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={projects[current].image}
              alt={projects[current].title}
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {projects[current].title}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-2">
                {projects[current].description}
              </p>
              <div className="flex flex-wrap gap-2">
                {projects[current].tech_stack.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={prevProject}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-red-600 text-white rounded-full p-3 transition-colors opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            &#10094;
          </motion.button>

          <motion.button
            onClick={nextProject}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-red-600 text-white rounded-full p-3 transition-colors opacity-0 group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            &#10095;
          </motion.button>

          <div className="flex justify-center gap-2 mt-6">
            {projects.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === current ? 'bg-red-600 w-8' : 'bg-gray-600 w-2'
                }`}
                whileHover={{ scale: 1.2 }}
              ></motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectCarousel;
