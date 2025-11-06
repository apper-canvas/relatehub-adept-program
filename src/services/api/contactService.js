import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts];
  }

  async getById(id) {
    await this.delay();
    const contact = this.contacts.find(contact => contact.Id === parseInt(id));
    if (!contact) {
      throw new Error(`Contact with Id ${id} not found`);
    }
    return { ...contact };
  }

  async create(contactData) {
    await this.delay();
    const maxId = this.contacts.length > 0 ? Math.max(...this.contacts.map(c => c.Id)) : 0;
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Contact with Id ${id} not found`);
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Contact with Id ${id} not found`);
    }
    
    const deletedContact = this.contacts.splice(index, 1)[0];
    return { ...deletedContact };
  }
}

export const contactService = new ContactService();