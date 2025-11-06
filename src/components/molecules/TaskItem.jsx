import { motion } from "framer-motion";
import { format, isAfter } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, contact, onToggleComplete, onEdit, onDelete }) => {
  const isOverdue = !task.completed && isAfter(new Date(), new Date(task.dueDate));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200",
        task.completed 
          ? "bg-gray-50 border-gray-200" 
          : isOverdue 
          ? "bg-red-50 border-red-200" 
          : "bg-white border-gray-200 hover:shadow-sm"
      )}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onToggleComplete(task.Id)}
        className={cn(
          "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
          task.completed
            ? "bg-success border-success text-white"
            : "border-gray-300 hover:border-primary"
        )}
      >
        {task.completed && <ApperIcon name="Check" className="h-4 w-4" />}
      </motion.button>

      <div className="flex-1 min-w-0">
        <h4 className={cn(
          "font-medium text-sm",
          task.completed ? "text-gray-500 line-through" : "text-gray-900"
        )}>
          {task.title}
        </h4>
        <div className="flex items-center space-x-4 mt-1">
          {contact && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <ApperIcon name="User" className="h-3 w-3" />
              <span>{contact.name}</span>
            </div>
          )}
          <div className={cn(
            "flex items-center space-x-1 text-xs",
            isOverdue && !task.completed ? "text-error" : "text-gray-500"
          )}>
            <ApperIcon name="Calendar" className="h-3 w-3" />
            <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
            {isOverdue && !task.completed && (
              <span className="text-error font-medium ml-1">(Overdue)</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(task)}
          className="p-2"
        >
          <ApperIcon name="Edit2" className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.Id)}
          className="p-2 text-error hover:text-error"
        >
          <ApperIcon name="Trash2" className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskItem;