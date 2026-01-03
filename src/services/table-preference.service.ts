import { api } from './api';
import { API_CONFIG } from '../config/api.config';

/* ===== TYPES ===== */

export type TableStatus =
  | 'available'
  | 'occupied'
  | 'ordered'
  | 'billing'
  | 'reservation';

export interface TablePreference {
  id: number;
  sectionName: string;   // e.g. "1st floor"
  tableName: string;     // e.g. "1"
  status: TableStatus;
  timer?: string | null;
  name: string;        // ✅ ADD
  tableCount: number;  // ✅ ADD
}

/* ===== SERVICE ===== */

export const TablePreferenceService = {
  getAll(): Promise<TablePreference[]> {
  return api
    .get<TablePreference[]>(API_CONFIG.TABLE_PREFERENCES.GET_ALL)
    .then(res => {
      console.log('API /table-preferences RESPONSE:', res.data);
      return res.data;
    })
    .catch(err => {
      console.log('API /table-preferences ERROR:', err?.response || err);
      throw err;
    });
}

};
