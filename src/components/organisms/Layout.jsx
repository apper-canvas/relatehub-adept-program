import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import ContactModal from "@/components/organisms/ContactModal";
import DealModal from "@/components/organisms/DealModal";
import TaskModal from "@/components/organisms/TaskModal";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";
import { alertService } from "@/services/api/alertService";
const Layout = () => {
  const [modals, setModals] = useState({
    contact: { isOpen: false, data: null },
    deal: { isOpen: false, data: null },
    task: { isOpen: false, data: null },
  });

  const openModal = (type, data = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data }
    }));
  };

  const closeModal = (type) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: null }
    }));
  };

  const handleSaveContact = async (contactData) => {
    const contact = modals.contact.data;
    
    if (contact) {
      await contactService.update(contact.Id, contactData);
      await activityService.create({
        contactId: contact.Id,
        dealId: null,
        type: "note",
        description: `Contact updated: ${contactData.name}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      const newContact = await contactService.create(contactData);
      await activityService.create({
        contactId: newContact.Id,
        dealId: null,
        type: "note",
        description: `New contact added: ${contactData.name}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSaveDeal = async (dealData) => {
    const deal = modals.deal.data;
    
    if (deal) {
      await dealService.update(deal.Id, dealData);
      await activityService.create({
        contactId: parseInt(dealData.contactId),
        dealId: deal.Id,
        type: "deal",
        description: `Deal updated: ${dealData.title} - $${dealData.value}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      const newDeal = await dealService.create(dealData);
      await activityService.create({
        contactId: parseInt(dealData.contactId),
        dealId: newDeal.Id,
        type: "deal",
        description: `New deal created: ${dealData.title} - $${dealData.value}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleSaveTask = async (taskData) => {
    const task = modals.task.data;
    
    if (task) {
      await taskService.update(task.Id, taskData);
      await activityService.create({
        contactId: parseInt(taskData.contactId),
        dealId: null,
        type: "task",
        description: `Task updated: ${taskData.title}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      const newTask = await taskService.create(taskData);
      await activityService.create({
        contactId: parseInt(taskData.contactId),
        dealId: null,
        type: "task",
        description: `New task created: ${taskData.title}`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAddContact={() => openModal("contact")}
        onAddDeal={() => openModal("deal")}
        onAddTask={() => openModal("task")}
      />
      
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Modals */}
      <ContactModal
        isOpen={modals.contact.isOpen}
        onClose={() => closeModal("contact")}
        contact={modals.contact.data}
        onSave={handleSaveContact}
      />

      <DealModal
        isOpen={modals.deal.isOpen}
        onClose={() => closeModal("deal")}
        deal={modals.deal.data}
        onSave={handleSaveDeal}
      />

      <TaskModal
        isOpen={modals.task.isOpen}
        onClose={() => closeModal("task")}
        task={modals.task.data}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default Layout;