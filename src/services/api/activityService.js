import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.activities];
  }

  async getById(id) {
    await this.delay();
    const activity = this.activities.find(activity => activity.Id === parseInt(id));
    if (!activity) {
      throw new Error(`Activity with Id ${id} not found`);
    }
    return { ...activity };
  }

  async getByContactId(contactId) {
    await this.delay();
    return this.activities.filter(activity => activity.contactId === parseInt(contactId));
  }

  async getByDealId(dealId) {
    await this.delay();
    return this.activities.filter(activity => activity.dealId === parseInt(dealId));
  }

  async create(activityData) {
    await this.delay();
    const maxId = this.activities.length > 0 ? Math.max(...this.activities.map(a => a.Id)) : 0;
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
    };
    this.activities.unshift(newActivity); // Add to beginning for latest first
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with Id ${id} not found`);
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id),
    };
    
    return { ...this.activities[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.activities.findIndex(activity => activity.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Activity with Id ${id} not found`);
    }
    
    const deletedActivity = this.activities.splice(index, 1)[0];
    return { ...deletedActivity };
  }
}

export const activityService = new ActivityService();