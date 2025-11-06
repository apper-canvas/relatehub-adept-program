import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, subDays } from "date-fns";
import { alertService } from "@/services/api/alertService";
import AlertBanner from "@/components/molecules/AlertBanner";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import ActivityItem from "@/components/molecules/ActivityItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    pipelineValue: 0,
    completedTasks: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError("");
    
try {
      const [contacts, deals, tasks, activities, alertsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll(),
        alertService.getAll(),
      ]);

      // Calculate stats
      const activeDeals = deals.filter(deal => !["Won", "Lost"].includes(deal.stage));
      const pipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
      const completedTasks = tasks.filter(task => task.completed).length;

      setStats({
        totalContacts: contacts.length,
        totalDeals: activeDeals.length,
        pipelineValue,
        completedTasks,
      });

      // Get recent activities (last 10)
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);

      setRecentActivities(sortedActivities);
      setAlerts(alertsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissAlert = async (alertId) => {
    try {
      await alertService.dismissAlert(alertId);
      setAlerts(prev => prev.filter(alert => alert.Id !== alertId));
      toast.success("Alert dismissed");
    } catch (err) {
      console.error("Dismiss alert error:", err);
      toast.error("Failed to dismiss alert");
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await alertService.completeTask(taskId);
      setAlerts(prev => prev.filter(alert => alert.taskId !== taskId));
      // Refresh stats to reflect completed task
      loadDashboardData();
      toast.success("Task completed successfully");
    } catch (err) {
      console.error("Complete task error:", err);
      toast.error("Failed to complete task");
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          change="+12%"
          changeType="positive"
          trend
        />
        <StatsCard
          title="Active Deals"
          value={stats.totalDeals}
          icon="GitBranch"
          change="+8%"
          changeType="positive"
          trend
        />
        <StatsCard
          title="Pipeline Value"
          value={formatCurrency(stats.pipelineValue)}
          icon="DollarSign"
          change="+23%"
          changeType="positive"
          trend
        />
        <StatsCard
          title="Tasks Completed"
          value={stats.completedTasks}
          icon="CheckSquare"
          change="+5%"
          changeType="positive"
          trend
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <ApperIcon name="Activity" className="h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <ActivityItem key={activity.Id} activity={activity} />
                ))
              ) : (
                <Empty
                  icon="Activity"
                  title="No recent activity"
                  description="Your recent interactions will appear here"
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Pipeline Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Pipeline Progress</h3>
              <ApperIcon name="TrendingUp" className="h-5 w-5 text-success" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium text-success">+23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-success h-2 rounded-full w-3/4"></div>
              </div>
              <p className="text-xs text-gray-500">
                {formatCurrency(stats.pipelineValue)} in active deals
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <ApperIcon name="UserPlus" className="h-4 w-4 text-primary" />
                <span>Add New Contact</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <ApperIcon name="Plus" className="h-4 w-4 text-primary" />
                <span>Create New Deal</span>
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <ApperIcon name="Calendar" className="h-4 w-4 text-primary" />
                <span>Schedule Follow-up</span>
              </button>
            </div>
          </motion.div>

{/* Alerts Banner */}
          <AlertBanner
            alerts={alerts}
            onDismiss={handleDismissAlert}
            onCompleteTask={handleCompleteTask}
            className="col-span-full"
          />

          {/* Today's Tasks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Today's Focus</h3>
              <ApperIcon name="Clock" className="h-5 w-5 text-warning" />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-error"></div>
                <span className="text-gray-600">{alerts.filter(a => a.type === 'task_overdue').length} overdue tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-warning"></div>
                <span className="text-gray-600">{alerts.filter(a => a.type === 'contact_follow_up').length} follow-ups due</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-success"></div>
                <span className="text-gray-600">{alerts.filter(a => a.type === 'task_due_today').length} tasks due today</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;