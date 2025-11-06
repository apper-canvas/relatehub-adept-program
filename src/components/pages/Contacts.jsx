import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ContactModal from "@/components/organisms/ContactModal";
import ContactDetailsModal from "@/components/organisms/ContactDetailsModal";
import ContactCard from "@/components/molecules/ContactCard";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsContact, setDetailsContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm]);

  const loadContacts = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load contacts");
      console.error("Contacts error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact => {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name.toLowerCase().includes(searchLower) ||
        contact.company.toLowerCase().includes(searchLower) ||
        contact.email.toLowerCase().includes(searchLower) ||
        (contact.tags && contact.tags.some(tag => 
          tag.toLowerCase().includes(searchLower)
        ))
      );
    });

    setFilteredContacts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      await activityService.create({
        contactId,
        dealId: null,
        type: "note",
        description: "Contact deleted",
        timestamp: new Date().toISOString(),
      });
      
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact");
      console.error("Delete contact error:", error);
    }
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData);
        await activityService.create({
          contactId: selectedContact.Id,
          dealId: null,
          type: "note",
          description: `Contact updated: ${contactData.name}`,
          timestamp: new Date().toISOString(),
        });
        
        setContacts(prev =>
          prev.map(contact =>
            contact.Id === selectedContact.Id
              ? { ...contact, ...contactData, updatedAt: new Date().toISOString() }
              : contact
          )
        );
      } else {
        const newContact = await contactService.create(contactData);
        await activityService.create({
          contactId: newContact.Id,
          dealId: null,
          type: "note",
          description: `New contact added: ${contactData.name}`,
          timestamp: new Date().toISOString(),
        });
        
        setContacts(prev => [...prev, newContact]);
      }
      
      setIsModalOpen(false);
      toast.success(
        selectedContact 
          ? "Contact updated successfully!" 
          : "Contact added successfully!"
      );
    } catch (error) {
      toast.error("Failed to save contact");
      console.error("Save contact error:", error);
    }
  };

const handleViewDetails = (contact) => {
    setDetailsContact(contact);
    setDetailsModalOpen(true);
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            Contacts
          </h1>
          <p className="text-gray-600">
            Manage your customer relationships and contact information.
          </p>
        </div>
        
        <Button
          onClick={handleAddContact}
          className="flex items-center space-x-2 self-start sm:self-center"
        >
          <ApperIcon name="UserPlus" className="h-5 w-5" />
          <span>Add Contact</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search contacts by name, company, email, or tags..."
          className="max-w-md"
        />
      </div>

      {/* Results Info */}
      {searchTerm && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredContacts.length} of {contacts.length} contacts
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>
      )}

      {/* Contacts Grid */}
      {filteredContacts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
              >
                <ContactCard
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                  onViewDetails={handleViewDetails}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Empty
          icon="Users"
          title={searchTerm ? "No contacts found" : "No contacts yet"}
          description={
            searchTerm 
              ? `No contacts match "${searchTerm}". Try adjusting your search.`
              : "Add your first contact to start building relationships"
          }
          actionText="Add Contact"
          onAction={handleAddContact}
        />
      )}

      {/* Contact Modal */}
<ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
      />

      <ContactDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        contact={detailsContact}
      />
    </div>
  );
};

export default Contacts;