import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";

const DealModal = ({ isOpen, onClose, deal, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    value: "",
    stage: "Lead",
    probability: "",
    expectedCloseDate: "",
  });

  const [contacts, setContacts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const stages = [
    { value: "Lead", label: "Lead" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal", label: "Proposal" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Won", label: "Won" },
    { value: "Lost", label: "Lost" },
  ];

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        probability: deal.probability?.toString() || "",
        expectedCloseDate: deal.expectedCloseDate || "",
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "Lead",
        probability: "",
        expectedCloseDate: "",
      });
    }
    setErrors({});
  }, [deal, isOpen]);

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
      newErrors.title = "Deal title is required";
    }

    if (!formData.contactId) {
      newErrors.contactId = "Contact is required";
    }

    if (!formData.value.trim()) {
      newErrors.value = "Deal value is required";
    } else if (isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = "Deal value must be a positive number";
    }

    if (!formData.probability.trim()) {
      newErrors.probability = "Probability is required";
    } else if (isNaN(formData.probability) || parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
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
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
      };

      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully!" : "Deal created successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
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
              {deal ? "Edit Deal" : "Add New Deal"}
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
              label="Deal Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              error={errors.title}
              required
              placeholder="Enter deal title"
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
              label="Deal Value ($)"
              type="number"
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              error={errors.value}
              required
              placeholder="Enter deal value"
              min="0"
              step="0.01"
            />

            <FormField
              label="Stage"
              type="select"
              value={formData.stage}
              onChange={(e) => handleChange("stage", e.target.value)}
              error={errors.stage}
              required
              options={stages}
            />

            <FormField
              label="Probability (%)"
              type="number"
              value={formData.probability}
              onChange={(e) => handleChange("probability", e.target.value)}
              error={errors.probability}
              required
              placeholder="Enter probability (0-100)"
              min="0"
              max="100"
            />

            <FormField
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => handleChange("expectedCloseDate", e.target.value)}
              error={errors.expectedCloseDate}
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
                    {deal ? "Update" : "Create"} Deal
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

export default DealModal;