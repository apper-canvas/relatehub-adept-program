import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.deals];
  }

  async getById(id) {
    await this.delay();
    const deal = this.deals.find(deal => deal.Id === parseInt(id));
    if (!deal) {
      throw new Error(`Deal with Id ${id} not found`);
    }
    return { ...deal };
  }

  async create(dealData) {
    await this.delay();
    const maxId = this.deals.length > 0 ? Math.max(...this.deals.map(d => d.Id)) : 0;
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with Id ${id} not found`);
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    
    return { ...this.deals[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Deal with Id ${id} not found`);
    }
    
    const deletedDeal = this.deals.splice(index, 1)[0];
    return { ...deletedDeal };
  }
}

export const dealService = new DealService();