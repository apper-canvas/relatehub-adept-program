import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import AlertItem from './AlertItem';
import { cn } from '@/utils/cn';

const AlertBanner = ({ alerts, onDismiss, onCompleteTask, className }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!alerts || alerts.length === 0) {
    return null;
  }

  const highPriorityCount = alerts.filter(alert => alert.priority === 'high').length;
  const mediumPriorityCount = alerts.filter(alert => alert.priority === 'medium').length;
  const lowPriorityCount = alerts.filter(alert => alert.priority === 'low').length;

  const getBannerColor = () => {
    if (highPriorityCount > 0) return 'bg-red-50 border-red-200';
    if (mediumPriorityCount > 0) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getIconColor = () => {
    if (highPriorityCount > 0) return 'text-red-600';
    if (mediumPriorityCount > 0) return 'text-orange-600';
    return 'text-blue-600';
  };

  const getSummaryText = () => {
    const parts = [];
    if (highPriorityCount > 0) parts.push(`${highPriorityCount} urgent`);
    if (mediumPriorityCount > 0) parts.push(`${mediumPriorityCount} important`);
    if (lowPriorityCount > 0) parts.push(`${lowPriorityCount} upcoming`);
    
    return parts.join(', ') + ` alert${alerts.length === 1 ? '' : 's'}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-lg border-2 shadow-sm mb-6',
        getBannerColor(),
        className
      )}
    >
      {/* Banner Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApperIcon 
              name="AlertTriangle" 
              className={cn('h-5 w-5', getIconColor())} 
            />
            <div>
              <h3 className="font-semibold text-gray-900">
                Alerts & Reminders
              </h3>
              <p className="text-sm text-gray-600">
                You have {getSummaryText()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/50 transition-colors"
            >
              <ApperIcon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                className="h-4 w-4" 
              />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Alert List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200"
          >
            <div className="p-4 space-y-3">
              {alerts.map((alert) => (
                <AlertItem
                  key={alert.Id}
                  alert={alert}
                  onDismiss={onDismiss}
                  onCompleteTask={onCompleteTask}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AlertBanner;