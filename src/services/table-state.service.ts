import { api } from './api';
import { API_CONFIG } from '@/src/config/api.config';
import { TableStatus, } from './table-preference.service';
import { TableStateDto } from './table-state.types';

export const TableStateService = {

  /* ===== LOAD ALL ACTIVE TABLES ===== */
  async getAll(): Promise<TableStateDto[]> {
    const res = await api.get<TableStateDto[]>(
      API_CONFIG.TABLE_STATE.GET_ALL
    );

    console.log('TABLE STATE GET_ALL:', res.data);
    return res.data;
  },

  /* ===== SET OCCUPIED ===== */
  async setOccupied(tableId: string) {
    console.log('SET OCCUPIED:', tableId);

    return api.post(
      API_CONFIG.TABLE_STATE.OCCUPIED(tableId),
      {}
    );
  },

  async setOrdered(tableId: string) {
  console.log('SET ORDERED:', tableId);

  return api.post(
    API_CONFIG.TABLE_STATE.ORDERED(tableId),
    {}
  );
},

  /* ===== SET KOT (ORDERED) ===== */
  async setKot(tableId: string) {
    console.log('SET KOT:', tableId);

    return api.post(
      API_CONFIG.TABLE_STATE.KOT(tableId),
      {}
    );
  },

  /* ===== SET BILLING ===== */
  async setBilling(tableId: string) {
    console.log('SET BILLING:', tableId);

    return api.post(
      API_CONFIG.TABLE_STATE.BILLING(tableId),
      {}
    );
  },

  /* ===== RESET TABLE ===== */
  async reset(tableId: string) {
    console.log('RESET TABLE:', tableId);

    return api.post(
      API_CONFIG.TABLE_STATE.RESET(tableId),
      {}
    );
  },
};
