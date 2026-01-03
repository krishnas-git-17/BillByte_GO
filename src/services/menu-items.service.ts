import { api } from './api';
import { API_CONFIG } from '@/src/config/api.config';

/* ================= TYPES ================= */

export interface MenuItem {
  id: number;           // ✅ frontend numeric id (index-based)
  menuId: string;       // backend menu id
  name: string;
  type: string;
  vegType: string;
  status: string;
  price: number;
  imageUrl?: string | null;
}



/* ================= SERVICE ================= */

export const MenuItemsService = {
  async getAll(): Promise<MenuItem[]> {
    const res = await api.get<MenuItem[]>(
      API_CONFIG.MENU.GET_ALL
    );
    return res.data;
  },

  async getById(id: string): Promise<MenuItem> {
    const res = await api.get<MenuItem>(
      API_CONFIG.MENU.GET_BY_ID(id)
    );
    return res.data;
  },

  async create(data: MenuItem) {
    return api.post(
      API_CONFIG.MENU.CREATE,
      data
    );
  },

  async update(id: string, data: Partial<MenuItem>) {
    return api.put(
      API_CONFIG.MENU.UPDATE(id),
      data
    );
  },

  async delete(id: string) {
    return api.delete(
      API_CONFIG.MENU.DELETE(id)
    );
  },
};
