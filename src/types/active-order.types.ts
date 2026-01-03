export interface ActiveOrderItemDto {
  itemId: number;   // ✅ MUST be number
  itemName: string;
  price: number;
  qty: number;
}

/* ===== RESPONSE ===== */
export interface ActiveOrderItem {
  restaurantId: number;
  tableId: string;
  itemId: number;
  itemName: string;
  price: number;
  qty: number;
}
