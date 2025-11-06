import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with Id ${id} not found`);
    }
    return { ...task };
  }

  async getByContactId(contactId) {
    await this.delay();
    return this.tasks.filter(task => task.contactId === parseInt(contactId));
  }

  async create(taskData) {
    await this.delay();
    const maxId = this.tasks.length > 0 ? Math.max(...this.tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`);
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...taskData,
      Id: parseInt(id),
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with Id ${id} not found`);
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }
}

export const taskService = new TaskService();