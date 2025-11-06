import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const ContactCard = ({ contact, onEdit, onDelete, onViewDetails }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="card p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-600">{contact.company}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(contact)}
            className="p-2"
          >
            <ApperIcon name="Edit2" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contact.Id)}
            className="p-2 text-error hover:text-error"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Mail" className="h-4 w-4" />
          <span>{contact.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4" />
          <span>{contact.phone}</span>
        </div>
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {contact.tags.map((tag, index) => (
            <Badge key={index} variant="primary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Added {format(new Date(contact.createdAt), "MMM d, yyyy")}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(contact)}
          className="text-primary hover:text-primary"
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};

export default ContactCard;