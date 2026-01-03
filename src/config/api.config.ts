// const BASE_URL = 'http://192.168.1.25:7117/api';
const BASE_URL = 'https://billbyte-be-4.onrender.com/api';

export const API_CONFIG = {
  BASE_URL,

  AUTH: {
    LOGIN: '/auth/login'
  },
   TABLE_PREFERENCES: {
    GET_ALL: '/table-preferences',
  },
    TABLE_STATE: {
    GET_ALL: '/table-state',

    OCCUPIED: (tableId: string) =>
      `/table-state/occupied/${tableId}`,

     ORDERED: (tableId: string) =>
    `/table-state/ordered/${tableId}`,

    KOT: (tableId: string) =>
      `/kot/${tableId}`,

    BILLING: (tableId: string) =>
      `/table-state/billing/${tableId}`,

    RESET: (tableId: string) =>
      `/table-state/reset/${tableId}`,
  },
 
MENU: {
    GET_ALL: '/menu-items',
    CREATE: '/menu-items',
    UPDATE: (id: string) => `/menu-items/${id}`,
    DELETE: (id: string) => `/menu-items/${id}`,
    GET_BY_ID: (id: string) => `/menu-items/${id}`,
  },

  ACTIVE_TABLE_ITEMS: {
    GET_BY_TABLE: (tableId: string) =>
      `/active-table-items/${tableId}`,

    ADD_ITEM: (tableId: string) =>
      `/active-table-items/${tableId}`,

    UPDATE_ITEM: (tableId: string, itemId: number) =>
      `/active-table-items/${tableId}/${itemId}`,

    DELETE_ITEM: (tableId: string, itemId: number) =>
      `/active-table-items/${tableId}/${itemId}`,

    CLEAR_TABLE: (tableId: string) =>
      `/active-table-items/clear/${tableId}`,
  },

};
