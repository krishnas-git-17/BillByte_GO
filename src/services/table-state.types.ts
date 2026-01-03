export type TableStatus =
  | 'available'
  | 'occupied'
  | 'ordered'
  | 'billing'
  | 'reservation';

export type TableStateDto = {
  tableId: string;
  status: TableStatus;
  startTime?: string;
};
