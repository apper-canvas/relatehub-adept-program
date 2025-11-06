import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType = "positive", 
  icon, 
  trend,
  className 
}) => {
  const getTrendIcon = () => {
    if (changeType === "positive") return "TrendingUp";
    if (changeType === "negative") return "TrendingDown";
    return "Minus";
  };

  const getTrendColor = () => {
    if (changeType === "positive") return "text-success";
    if (changeType === "negative") return "text-error";
    return "text-gray-500";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "card p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
          <ApperIcon name={icon} className="h-6 w-6 text-primary" />
        </div>
        {trend && (
          <div className={cn("flex items-center space-x-1 text-sm", getTrendColor())}>
            <ApperIcon name={getTrendIcon()} className="h-4 w-4" />
            <span>{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;