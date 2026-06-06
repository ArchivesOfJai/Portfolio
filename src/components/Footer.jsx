import { motion } from 'framer-motion';
import { smoothScroll } from '../utils/scrollUtils';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com', icon: '💻' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📸' },
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="bg-netflix-light border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-red-600 mb-4">About</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Full Stack Developer passionate about creating beautiful and functional web applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-red-600 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button
                  onClick={() => smoothScroll('home')}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScroll('about')}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScroll('projects')}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScroll('contact')}
                  className="hover:text-red-600 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold text-red-600 mb-4">Follow Me</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => handleSocialClick(link.url)}
                  className="text-2xl hover:text-red-600 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={link.name}
                >
                  {link.icon}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {currentYear} My Portfolio. All rights reserved. | Made with{' '}
            <span className="text-red-600">❤️</span> by Me
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
