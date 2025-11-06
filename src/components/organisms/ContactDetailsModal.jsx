import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const ContactDetailsModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  const formatTags = (tags) => {
    if (!tags || tags.length === 0) return "No tags";
    return tags;
  };

  const formatPhone = (phone) => {
    if (!phone) return "Not provided";
    // Simple phone formatting - you can enhance this as needed
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <ApperIcon name="User" className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-lg font-semibold text-gray-900">{contact.name}</p>
            </div>

            {/* Company */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Company</label>
              <p className="text-gray-900">{contact.company || "Not specified"}</p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:text-blue-700 transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-primary hover:text-blue-700 transition-colors"
                  >
                    {formatPhone(contact.phone)}
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2">
                {contact.tags && contact.tags.length > 0 ? (
                  contact.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags</span>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes</label>
              <div className="bg-gray-50 rounded-lg p-4 min-h-[80px]">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {contact.notes || "No notes available"}
                </p>
              </div>
            </div>

            {/* Contact Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{contact.dealsCount || 0}</p>
                  <p className="text-sm text-gray-600">Deals</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-accent">{contact.activitiesCount || 0}</p>
                  <p className="text-sm text-gray-600">Activities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactDetailsModal;