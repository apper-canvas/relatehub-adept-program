import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Users", 
  title = "No data found", 
  description = "Get started by adding your first item",
  actionText = "Add Item",
  onAction 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 p-8 max-w-md mx-auto"
      >
        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <ApperIcon name={icon} className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
        </div>
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="h-4 w-4" />
            <span>{actionText}</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default Empty;