import React from "react";
import { motion } from "framer-motion";
import { Home, Search, Mail, Users, School, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Pricing", path: "/pricing", icon: <School size={20} /> },
    { name: "Contact", path: "/contact-us", icon: <Mail size={20} /> },
    { name: "About", path: "/about", icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 mt-20 font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#F6B400] to-[#0077BB] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#8A2BE2] to-[#FF69B4] rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Animated 404 Number */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-8"
          >
            <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-[#0077BB] via-[#00AEEF] to-[#F6B400] bg-clip-text text-transparent">
              404
            </h1>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Class Not Found!
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Looks like this page has transferred to another school. 
              Don't worry, we'll help you find your way back!
            </p>
          </motion.div>

        


          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border border-gray-200"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(link.path)}
                  className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 shadow-md hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                      {link.icon}
                    </div>
                    <span className="font-semibold text-gray-700">{link.name}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Fun Educational Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-12"
          >
            <p className="text-gray-500 text-lg">
              Even the best teachers sometimes lose their lesson plans. 
              Let's get you back on track!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="fixed top-20 left-10 opacity-20 animate-bounce">
        <School size={40} className="text-blue-400" />
      </div>
      <div className="fixed top-40 right-20 opacity-20 animate-bounce delay-75">
        <Users size={35} className="text-yellow-400" />
      </div>
      <div className="fixed bottom-40 left-20 opacity-20 animate-bounce delay-150">
        <Search size={30} className="text-purple-400" />
      </div>
      <div className="fixed bottom-20 right-10 opacity-20 animate-bounce delay-300">
        <Mail size={25} className="text-green-400" />
      </div>
    </div>
  );
};

export default NotFoundPage;