import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";


const SCREEN_HEIGHT = Dimensions.get('window').height;
export const styles = StyleSheet.create({
  header: {
  height: 48,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  borderBottomWidth: 1,
  borderColor: '#eee',
  backgroundColor: '#fff',
},
backText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#ff7a18',
},
headerTitle: {
  flex: 1,
  textAlign: 'center',
  fontSize: 16,
  fontWeight: '800',
  marginRight: 50, // to balance back button
},

  container: { flex: 1, backgroundColor: '#f9fafb' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },

  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 15, fontWeight: '700' },
  price: { marginTop: 4, color: '#666' },

  addBtn: {
    borderWidth: 1,
    borderColor: '#ff7a18',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  addText: { color: '#ff7a18', fontWeight: '800' },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff7a18',
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  qtyBtn: { fontSize: 18, paddingHorizontal: 8, color: '#ff7a18' },
  qty: { fontWeight: '700', minWidth: 20, textAlign: 'center' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cartCount: { fontWeight: '700' },
  totalText: {
  marginTop: 2,
  fontSize: 14,
  fontWeight: '800',
  color: '#111',
},

pendingCard: {
  borderWidth: 1,
  borderColor: '#f59e0b',
  backgroundColor: '#fffbeb',
},

  confirmBtn: {
    backgroundColor: '#ff7a18',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 8,
  },
  confirmText: { color: '#fff', fontWeight: '800' },
 billingOverlay: {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,

  height: SCREEN_HEIGHT * 0.75,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,

  backgroundColor: '#fff',
  paddingTop: 12,
  paddingHorizontal: 12,

  // 🔥 THIS FIXES BEHIND ISSUE
  zIndex: 100,
  elevation: 20,
},
backdrop: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.35)',
  zIndex: 50,
},


billingBtn: {
  backgroundColor: '#2563eb',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 8,
},

billingBtnText: {
  color: '#fff',
  fontWeight: '800',
},
billingHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 10,
  marginTop: 38,   // ⬅️ pushes content down
},


billingTitle: {
  fontSize: 16,
  fontWeight: '900',
},

billingClose: {
  fontSize: 20,
  fontWeight: '800',
},

billingRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderColor: '#f1f1f1',
},

billingName: {
  flex: 1,
  fontWeight: '600',
},

billingQty: {
  width: 90,
  textAlign: 'center',
  color: '#555',
},

billingAmount: {
  width: 70,
  textAlign: 'right',
  fontWeight: '700',
},

billingFooter: {
  padding: 14,
  borderTopWidth: 1,
  borderColor: '#eee',
},

billingTotalRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 10,
},

billingTotalText: {
  fontSize: 16,
  fontWeight: '800',
},

billingTotalAmount: {
  fontSize: 16,
  fontWeight: '900',
},

paymentBtn: {
  backgroundColor: '#16a34a',
  paddingVertical: 14,
  borderRadius: 10,
  alignItems: 'center',
},

paymentText: {
  color: '#fff',
  fontWeight: '900',
  fontSize: 15,
},

});