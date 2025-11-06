import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { cn } from '@/utils/cn';

const AlertItem = ({ alert, onDismiss, onCompleteTask }) => {
  const getAlertStyles = () => {
    switch (alert.priority) {
      case 'high':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'text-red-600',
          iconName: 'AlertTriangle'
        };
      case 'medium':
        return {
          bg: alert.type === 'contact_follow_up' 
            ? 'bg-green-50 border-green-200'
            : 'bg-orange-50 border-orange-200',
          icon: alert.type === 'contact_follow_up' 
            ? 'text-green-600'
            : 'text-orange-600',
          iconName: alert.type === 'contact_follow_up' ? 'Users' : 'Clock'
        };
      case 'low':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'text-blue-600',
          iconName: 'Calendar'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'text-gray-600',
          iconName: 'Info'
        };
    }
  };

  const styles = getAlertStyles();

  const handleAction = async (actionType) => {
    try {
      if (actionType === 'complete' && alert.taskId) {
        await onCompleteTask(alert.taskId);
      } else if (actionType === 'dismiss') {
        await onDismiss(alert.Id);
      }
    } catch (error) {
      console.error('Alert action error:', error);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'p-3 rounded-lg border flex items-center justify-between',
        styles.bg
      )}
    >
      <div className="flex items-center space-x-3">
        <ApperIcon 
          name={styles.iconName}
          className={cn('h-4 w-4 flex-shrink-0', styles.icon)}
        />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900 text-sm">
            {alert.title}
          </p>
          <p className="text-gray-600 text-sm">
            {alert.message}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {alert.actions.map((action) => (
          <Button
            key={action.type}
            variant={action.type === 'complete' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleAction(action.type)}
            className="text-xs whitespace-nowrap"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default AlertItem;