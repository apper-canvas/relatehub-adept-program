import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const ContactModal = ({ isOpen, onClose, contact, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    tags: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || "",
        company: contact.company || "",
        email: contact.email || "",
        phone: contact.phone || "",
        tags: contact.tags ? contact.tags.join(", ") : "",
        notes: contact.notes || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        tags: "",
        notes: "",
      });
    }
    setErrors({});
  }, [contact, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
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
      const contactData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(tag => tag.length > 0),
      };

      await onSave(contactData);
      toast.success(contact ? "Contact updated successfully!" : "Contact created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save contact. Please try again.");
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
              {contact ? "Edit Contact" : "Add New Contact"}
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
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={errors.name}
              required
              placeholder="Enter contact name"
            />

            <FormField
              label="Company"
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              error={errors.company}
              placeholder="Enter company name"
            />

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={errors.email}
              required
              placeholder="Enter email address"
            />

            <FormField
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              error={errors.phone}
              required
              placeholder="Enter phone number"
            />

            <FormField
              label="Tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              error={errors.tags}
              placeholder="Enter tags separated by commas"
            />

            <FormField
              label="Notes"
              type="textarea"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              error={errors.notes}
              placeholder="Enter any additional notes"
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                    {contact ? "Update" : "Create"} Contact
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

export default ContactModal;