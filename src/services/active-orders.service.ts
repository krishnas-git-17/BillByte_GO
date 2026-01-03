import { api } from './api';
import { API_CONFIG } from '@/src/config/api.config';

/* ================= DTOs (REQUEST) ================= */

export interface ActiveOrderItemDto {
  itemId: number;   // ✅ REQUIRED by backend
  itemName: string;
  price: number;
  qty: number;
}

/* ================= MODELS (RESPONSE) ================= */

export interface ActiveOrderItem {
  restaurantId: number;
  tableId: string;
  itemId: number;   // ✅ FIXED (INT, not string)
  itemName: string;
  price: number;
  qty: number;
}

/* ================= SERVICE ================= */

export const ActiveOrdersService = {
  /* ===== GET BY TABLE ===== */
  async getByTable(tableId: string): Promise<ActiveOrderItem[]> {
    const res = await api.get<ActiveOrderItem[]>(
      API_CONFIG.ACTIVE_TABLE_ITEMS.GET_BY_TABLE(tableId)
    );
    return res.data;
  },

  /* ===== ADD ITEM ===== */
  async addItem(tableId: string, item: ActiveOrderItemDto) {
    return api.post(
      API_CONFIG.ACTIVE_TABLE_ITEMS.ADD_ITEM(tableId),
      item
    );
  },

  /* ===== UPDATE ITEM QTY ===== */
  async updateItemQty(
    tableId: string,
    itemId: number,
    qty: number
  ) {
    return api.put(
      API_CONFIG.ACTIVE_TABLE_ITEMS.UPDATE_ITEM(tableId, itemId),
      { qty }
    );
  },

  /* ===== DELETE ITEM ===== */
  async deleteItem(tableId: string, itemId: number) {
    return api.delete(
      API_CONFIG.ACTIVE_TABLE_ITEMS.DELETE_ITEM(tableId, itemId)
    );
  },

  /* ===== CLEAR TABLE ===== */
  async clearTable(tableId: string) {
    return api.delete(
      API_CONFIG.ACTIVE_TABLE_ITEMS.CLEAR_TABLE(tableId)
    );
  },
};
