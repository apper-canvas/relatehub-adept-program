import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-8"
        >
          <ApperIcon name="Search" className="h-12 w-12 text-white" />
        </motion.div>

        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track!
        </p>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" className="h-5 w-5 mr-2" />
              Go Home
            </Button>
          </Link>
          
          <Link to="/contacts">
            <Button variant="secondary" className="w-full">
              <ApperIcon name="Users" className="h-5 w-5 mr-2" />
              View Contacts
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
className="mt-8 text-sm text-gray-500"
        >
          <p>Need help? Contact support or check our documentation.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;