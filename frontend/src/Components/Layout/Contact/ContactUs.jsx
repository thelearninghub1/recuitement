import React, { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  MessageSquare,
  Users,
  Building,
  Calendar
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createContactUsAction, clearErrors } from "../../../actions/contactUsActions";
import { toast } from "react-toastify";
import { CONTACT_US_RESET } from "../../../constants/contactConstants";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.createContactUs);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send as plain object instead of FormData
    const contactData = {
      name,
      email,
      message
    };
    
    dispatch(createContactUsAction(contactData));
  };

  // Reset form fields after successful submission
  useEffect(() => {
    if (success) {
      setName("");
      setEmail("");
      setMessage("");
      toast.success("Message Sent Successfully");
      dispatch({ type: CONTACT_US_RESET });
    }
    
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch, success]);

  return (
    <Fragment>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#0077BB]"></div>
        </div>
      ) : (
        <div className="font-[Parkinsans] overflow-hidden">
          {/* Enhanced Hero Section */}
          <section className="relative bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white py-32 px-6 md:px-20 text-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#00AEEF]/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-500"></div>
              
              {/* Floating Icons */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 360, 0],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                  }}
                >
                  <MessageSquare className="w-8 h-8 text-white/20" />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-medium">Get in Touch with Our Team</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="text-white">Let's Start </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFD700] via-[#FF9F43] to-[#FF6B6B]">
                  Your Journey
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="max-w-3xl mx-auto text-xl text-white/90 mb-10 leading-relaxed"
              >
                Have questions about our platform? Ready to transform your educational recruitment? 
                Our team is here to help you every step of the way.
              </motion.p>
            </div>
          </section>

          {/* 📬 Contact Form & Info */}
          <section className="py-24 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-6 md:px-20">
              {/* Contact Form - Centered */}
              <div className="flex justify-center items-center">
                <motion.form
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  onSubmit={handleSubmit}
                  className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 w-full max-w-2xl border-t-4 border-[#0077BB] hover:shadow-[0_0_25px_rgba(0,119,187,0.25)] transition-all duration-500"
                >
                  {/* Name Field */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077BB] transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077BB] transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2 font-semibold">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0077BB] transition-all resize-none"
                      required
                      disabled={loading}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={!loading ? {
                      scale: 1.03,
                      boxShadow: "0 0 15px rgba(0,119,187,0.4)",
                    } : {}}
                    whileTap={!loading ? { scale: 0.97 } : {}}
                    type="submit"
                    disabled={loading}
                    className={`w-full mt-6 bg-gradient-to-r from-[#0077BB] to-[#00AEEF] text-white py-3 rounded-lg font-semibold transition-all duration-300 ${
                      loading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'hover:from-[#00AEEF] hover:to-[#0077BB]'
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </motion.form>
              </div>
              
              {/* Info Cards */}
              <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <Mail className="w-10 h-10 mx-auto text-[#0077BB] mb-4" />
                    <h3 className="font-bold text-lg mb-2">Email</h3>
                    <p className="text-gray-600">jobs@theteachingpath.com</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <Clock className="w-10 h-10 mx-auto text-[#0077BB] mb-4" />
                    <h3 className="font-bold text-lg mb-2">Response Time</h3>
                    <p className="text-gray-600">Within 24-48 hours</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <CheckCircle className="w-10 h-10 mx-auto text-[#0077BB] mb-4" />
                    <h3 className="font-bold text-lg mb-2">Form Status</h3>
                    <p className="text-green-600 font-semibold">Active ✓</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* 📍 Map Section */}
          <div className="max-w-7xl mx-auto px-6 pb-24">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Our <span className="text-[#2C7EAD]">Location</span>
              </h2>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  title="location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28947.053927103567!2d67.04047436711074!3d24.882190576091746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33d86c37a16c7%3A0xd0ef0b0c2a6aabc3!2sKarachi!5e0!3m2!1sen!2s!4v1697393143521!5m2!1sen!2s"
                  className="w-full h-[400px] border-none"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* CTA Section - Ready to Transform */}
          <section className="py-24 bg-gradient-to-br from-[#2C7EAD] via-[#1E5F8B] to-[#0D3B66] text-white text-center overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -40, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: Math.random() * 4 + 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
              
              {/* Gradient Orbs */}
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-4xl mx-auto px-6 md:px-20 z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium">Join Thousands of Satisfied Users</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Ready to Transform Your Recruitment Process?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of schools and teachers who trust TeachingPath for their educational recruitment needs
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-gradient-to-r from-[#FFD700] to-[#FF9F43] text-gray-900 font-bold rounded-xl hover:shadow-2xl transition-all duration-300 shadow-lg flex items-center gap-3"
                  >
                    <Users className="w-5 h-5" />
                    Get Started for Free
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white hover:text-[#2C7EAD] transition-all duration-300 flex items-center gap-3"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule a Demo
                  </motion.button>
                </div>
                
                {/* Feature Highlights */}
                <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold">For Schools</div>
                      <div className="text-sm text-white/80">Premium hiring tools</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold">For Teachers</div>
                      <div className="text-sm text-white/80">Free career platform</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold">24/7 Support</div>
                      <div className="text-sm text-white/80">Dedicated assistance</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      )}
    </Fragment>
  );
};

export default ContactUs;