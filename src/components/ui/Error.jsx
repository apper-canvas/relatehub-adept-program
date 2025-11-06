import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 p-8 max-w-md mx-auto"
      >
        <div className="mx-auto h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
          <ApperIcon name="AlertCircle" className="h-10 w-10 text-red-500" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{message}</p>
        </div>
        {onRetry && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetry}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Try Again</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Error;