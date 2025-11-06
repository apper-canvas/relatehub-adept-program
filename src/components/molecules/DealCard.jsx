import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const DealCard = ({ deal, contact, onDragStart, onDragEnd }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 75) return "success";
    if (probability >= 50) return "warning";
    return "default";
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragStart={() => onDragStart?.(deal)}
      onDragEnd={() => onDragEnd?.(deal)}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.05, rotate: 2, zIndex: 1000 }}
      className="card p-4 bg-gradient-to-br from-white to-gray-50 hover:shadow-md cursor-grab active:cursor-grabbing mb-3"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
        <Badge variant={getProbabilityColor(deal.probability)} className="text-xs">
          {deal.probability}%
        </Badge>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(deal.value)}
          </span>
        </div>
        
        {contact && (
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <ApperIcon name="User" className="h-3 w-3" />
            <span>{contact.name}</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <ApperIcon name="Calendar" className="h-3 w-3" />
          <span>
            Close: {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;