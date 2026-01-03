import { api } from './api';
import { API_CONFIG } from '../config/api.config';

export type ActiveTableItemPayload = {
  itemId: number;
  itemName: string;
  price: number;
  qty: number;
};

export const ActiveTableItemsService = {
  async getByTable(tableId: string) {
    const res = await api.get(
      API_CONFIG.ACTIVE_TABLE_ITEMS.GET_BY_TABLE(tableId)
    );
    return res.data;
  },

  async clearTable(tableId: string) {
    await api.delete(
      API_CONFIG.ACTIVE_TABLE_ITEMS.CLEAR_TABLE(tableId)
    );
  },

  async addItem(tableId: string, payload: ActiveTableItemPayload) {
    await api.post(
      API_CONFIG.ACTIVE_TABLE_ITEMS.ADD_ITEM(tableId),
      payload
    );
  },
};
