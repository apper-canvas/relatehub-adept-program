import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail",
      meeting: "Users",
      note: "FileText",
      task: "CheckSquare",
      deal: "DollarSign",
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      call: "text-blue-600 bg-blue-50",
      email: "text-green-600 bg-green-50",
      meeting: "text-purple-600 bg-purple-50",
      note: "text-gray-600 bg-gray-50",
      task: "text-orange-600 bg-orange-50",
      deal: "text-primary bg-blue-50",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={cn(
        "p-2 rounded-full",
        getActivityColor(activity.type)
      )}>
        <ApperIcon 
          name={getActivityIcon(activity.type)} 
          className="h-4 w-4" 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500 mt-1">
          {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;