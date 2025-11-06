import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    dueDate: "",
  });

  const [contacts, setContacts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        contactId: task.contactId || "",
        dueDate: task.dueDate || "",
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        dueDate: "",
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const loadContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      toast.success(task ? "Task updated successfully!" : "Task created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save task. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {task ? "Edit Task" : "Add New Task"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
            <FormField
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              required
              placeholder="Enter task title"
            />

            <FormField
              label="Contact"
              type="select"
              value={formData.contactId}
              onChange={(e) => handleChange("contactId", e.target.value)}
              error={errors.contactId}
              required
              options={contacts.map(contact => ({
                value: contact.Id.toString(),
                label: `${contact.name} (${contact.company})`,
              }))}
            />

            <FormField
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              error={errors.dueDate}
              required
            />

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || isLoadingContacts}
              >
                {isLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                    {task ? "Update" : "Create"} Task
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;