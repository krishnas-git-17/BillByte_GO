import React, { useEffect, useState , useRef} from 'react';
import { Animated, Dimensions } from 'react-native';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TableStateService } from '@/src/services/table-state.service';
import { MenuItemsService, MenuItem } from '@/src/services/menu-items.service';
import { ActiveOrdersService } from '@/src/services/active-orders.service';
import * as SecureStore from 'expo-secure-store';
import { realtimeService } from '@/src/services/realtime.service';
import { styles } from '../styles/orders.styles';
import UpiQr from '@/components/UpiQr';


/* ================= TYPES ================= */

type CartItem = MenuItem & {
  qty: number;
};

/* ================= SCREEN ================= */

export default function OrdersScreen() {
  const router = useRouter();
  const { table, section } = useLocalSearchParams<{
    table: string;
    section: string;
  }>();

  const tableId = `${section}-T${table}`;

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverCart, setServerCart] =
  useState<Record<number, number>>({});
const hasSavedItems = Object.keys(serverCart).length > 0;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const [showBilling, setShowBilling] = useState(false);
const billingAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
const [cart, setCart] = useState<Record<number, CartItem>>({});
const UPI_ID = '8886784877-2@ybl';          // 🔁 replace later from backend
const MERCHANT_NAME = 'BillByte';
const hasConfirmedItems = Object.keys(serverCart).length > 0;




  /* ================= LOAD DATA ================= */

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await Promise.all([loadMenu(), loadExistingCart()]);
    setLoading(false);
  };

const loadMenu = async () => {
  const res = await MenuItemsService.getAll();

  const mapped = res.map((item, index) => ({
    ...item,
    id: index + 1,   // ✅ SAME AS ANGULAR
  }));

  setMenu(mapped);
};

useEffect(() => {
  setCart({});
  setServerCart({});
  setLoading(true);
  init();
}, [tableId]);

const openBilling = async () => {
  // 🚫 Safety check
  if (!canBilling) {
    alert('Please save or remove pending items before billing');
    return;
  }

  // ✅ Set table status to BILLING
  await TableStateService.setBilling(tableId);

  setShowBilling(true);

  Animated.timing(billingAnim, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  }).start();
};

const closeBilling = async () => {
  Animated.timing(billingAnim, {
    toValue: SCREEN_HEIGHT,
    duration: 300,
    useNativeDriver: true,
  }).start(async () => {
    setShowBilling(false);

    // 🔄 Restore correct table status
    if (Object.keys(serverCart).length > 0) {
      await TableStateService.setOrdered(tableId);
    } else {
      await TableStateService.reset(tableId);
    }
  });
};


const loadExistingCart = async () => {
  try {
    const items = await ActiveOrdersService.getByTable(tableId);

    const restored: Record<number, CartItem> = {};
    const snapshot: Record<number, number> = {};

    items.forEach(i => {
      restored[i.itemId] = {
        id: i.itemId,
        menuId: '',
        name: i.itemName,
        price: i.price,
        qty: i.qty,
        type: '',
        vegType: '',
        status: '',
      };

      snapshot[i.itemId] = i.qty;   // 🔑 backend state
    });

    setCart(restored);
    setServerCart(snapshot);
  } catch {
    setCart({});
    setServerCart({});
  }
};



  /* ================= CART ACTIONS ================= */

const increaseQty = (item: MenuItem) => {
  setCart(prev => ({
    ...prev,
    [item.id]: {
      ...item,
      qty: (prev[item.id]?.qty || 0) + 1,
    },
  }));
};

  const decreaseQty = (item: MenuItem) => {
  setCart(prev => {
    const existing = prev[item.id];
    if (!existing) return prev;

    if (existing.qty <= 1) {
      const clone = { ...prev };
      delete clone[item.id];
      return clone;
    }

    return {
      ...prev,
      [item.id]: {        // ✅ ALWAYS id
        ...existing,
        qty: existing.qty - 1,
      },
    };
  });
};


 const getQty = (id: number) => cart[id]?.qty || 0;

const syncCartFromRealtime = (items: any[]) => {
  // table cleared
  if (!items || items.length === 0) {
    setCart({});
    setServerCart({});
    return;
  }

  const restored: Record<number, CartItem> = {};
  const snapshot: Record<number, number> = {};

  items.forEach(i => {
    restored[i.itemId] = {
      id: i.itemId,
      menuId: '',
      name: i.itemName,
      price: i.price,
      qty: i.qty,
      type: '',
      vegType: '',
      status: '',
    };

    snapshot[i.itemId] = i.qty;
  });

  setCart(restored);
  setServerCart(snapshot);
};


 useEffect(() => {
  let unsubscribe: (() => void) | undefined;

  const connectRealtime = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return;

    realtimeService.connect(token);

    unsubscribe = realtimeService.subscribe(event => {
      if (event.type === 'ACTIVE_TABLE_ITEMS_CHANGED') {
        const { tableId: eventTableId, items } = event.payload;

        // 🔒 ignore other tables
        if (eventTableId !== tableId) return;

        console.log('[Realtime] ACTIVE_TABLE_ITEMS_CHANGED', items);

        syncCartFromRealtime(items);
      }
    });
  };

  connectRealtime();

  return () => {
    unsubscribe?.();
  };
}, [tableId]);

const draftTotal = Object.values(cart).reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);


const isCartChanged = () => {
  // Check add / update
  for (const item of Object.values(cart)) {
    if (serverCart[item.id] !== item.qty) {
      return true;
    }
  }

  // Check deletes
  for (const id of Object.keys(serverCart)) {
    if (!cart[Number(id)]) {
      return true;
    }
  }

  return false;
};
const hasPendingChanges = isCartChanged();
const canBilling = hasConfirmedItems && !hasPendingChanges;
const canConfirm = isCartChanged();

const handleBack = () => {
  setCart(
    Object.keys(serverCart).length
      ? Object.fromEntries(
          Object.entries(cart).filter(
            ([id]) => serverCart[Number(id)] !== undefined
          )
        )
      : {}
  );

  router.back();
};


  /* ================= CONFIRM ================= */

const confirmOrder = async () => {
  try {
    const hasItems = Object.keys(cart).length > 0;

    // 1️⃣ ADD / UPDATE items
    for (const item of Object.values(cart)) {
      const prevQty = serverCart[item.id];

      if (prevQty === undefined) {
        await ActiveOrdersService.addItem(tableId, {
          itemId: item.id,
          itemName: item.name,
          price: item.price,
          qty: item.qty,
        });
      } else if (item.qty !== prevQty) {
        await ActiveOrdersService.updateItemQty(
          tableId,
          item.id,
          item.qty
        );
      }
    }

    // 2️⃣ DELETE removed items
    for (const id of Object.keys(serverCart)) {
      const itemId = Number(id);
      if (!cart[itemId]) {
        await ActiveOrdersService.deleteItem(tableId, itemId);
      }
    }

    // 3️⃣ TABLE STATUS LOGIC (🔥 FIX)
    if (hasItems) {
      await TableStateService.setOrdered(tableId);
    } else {
      await TableStateService.reset(tableId); // ✅ EMPTY / AVAILABLE
    }

    alert('Order saved');
    // router.back();
  } catch (err: any) {
    console.log('CONFIRM ORDER ERROR →', err?.response?.data || err);
    alert('Failed to save order');
  }
};

const confirmedTotal = Object.entries(serverCart).reduce(
  (sum, [id, qty]) => {
    const item = cart[Number(id)];
    if (!item) return sum;
    return sum + item.price * qty;
  },
  0
);

const isConfirmed = (id: number) =>
  serverCart[id] !== undefined &&
  serverCart[id] === cart[id]?.qty;





  /* ================= UI ================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading order...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
  <TouchableOpacity onPress={handleBack}>
  <Text style={styles.backText}>← Back</Text>
</TouchableOpacity>

  <Text style={styles.headerTitle}>
    {section} • Table {table}
  </Text>
</View>

      <FlatList
        data={menu}
    keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
         const qty = getQty(item.id);


          return (
            
            <View  style={[
    styles.card,
    !isConfirmed(item.id) && styles.pendingCard,
  ]}>
              <Image
                source={{
                  uri:
                    item.imageUrl ||
                    'https://via.placeholder.com/80',
                }}
                style={styles.image}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹ {item.price}</Text>
              </View>

              {qty === 0 ? (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => increaseQty(item)}
                >
                  <Text style={styles.addText}>ADD</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.qtyBox}>
                  <TouchableOpacity onPress={() => decreaseQty(item)}>
                    <Text style={styles.qtyBtn}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qty}>{qty}</Text>

                  <TouchableOpacity onPress={() => increaseQty(item)}>
                    <Text style={styles.qtyBtn}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
{showBilling && (
  <>
   <TouchableOpacity
      style={styles.backdrop}
      activeOpacity={1}
      onPress={closeBilling}
    />
  <Animated.View
    style={[
      styles.billingOverlay,
      {
        transform: [{ translateY: billingAnim }],
      },
    ]}
  >
    {/* Header */}
    <View style={styles.billingHeader}>
      <Text style={styles.billingTitle}>Billing Summary</Text>
      <TouchableOpacity onPress={closeBilling}>
        <Text style={styles.billingClose}>✕</Text>
      </TouchableOpacity>
    </View>

    {/* Items */}
    <ScrollView style={{ flex: 1 }}>
      <UpiQr
  upiId={UPI_ID}
  merchantName={MERCHANT_NAME}
  amount={confirmedTotal}
/>
      {Object.entries(serverCart).map(([id, qty]) => {
  const item = cart[Number(id)];
  if (!item) return null;

  return (
    <View key={id} style={styles.billingRow}>
      <Text style={styles.billingName}>{item.name}</Text>
      <Text style={styles.billingQty}>
        {qty} × ₹{item.price}
      </Text>
      <Text style={styles.billingAmount}>
        ₹{qty * item.price}
      </Text>
    </View>
  );
})}


    </ScrollView>

    {/* Total */}
    <View style={styles.billingFooter}>
      <View style={styles.billingTotalRow}>
        <Text style={styles.billingTotalText}>Grand Total</Text>
        <Text style={styles.billingTotalAmount}>
          ₹ {confirmedTotal}
        </Text>
      </View>

      <TouchableOpacity
  style={[
    styles.paymentBtn,
    confirmedTotal === 0 && { opacity: 0.5 },
  ]}
  disabled={confirmedTotal === 0}
>
  <Text style={styles.paymentText}>CONFIRM PAYMENT</Text>
</TouchableOpacity>

    </View>
  </Animated.View>
  </>
)}



      {/* CONFIRM BAR */}
     <View style={styles.footer}>
  <View>
    <Text style={styles.cartCount}>
      Items: {Object.keys(cart).length}
    </Text>
    <Text style={styles.totalText}>
  ₹ {draftTotal}
</Text>

  </View>

  <View style={{ flexDirection: 'row', gap: 8 }}>
    {hasConfirmedItems && (
  <TouchableOpacity
    style={[
      styles.billingBtn,
      !canBilling && { opacity: 0.4 },
    ]}
    disabled={!canBilling}
    onPress={() => {
      if (!canBilling) {
        alert('Please save or remove pending items before billing');
        return;
      }
      openBilling();
    }}
  >
    <Text style={styles.billingBtnText}>BILLING</Text>
  </TouchableOpacity>
)}

    <TouchableOpacity
      style={[
        styles.confirmBtn,
        !canConfirm && { opacity: 0.5 },
      ]}
      disabled={!canConfirm}
      onPress={confirmOrder}
    >
      <Text style={styles.confirmText}>CONFIRM</Text>
    </TouchableOpacity>
  </View>
</View>

    </SafeAreaView>
  );
  
}

//   header: {
//   height: 48,
//   flexDirection: 'row',
//   alignItems: 'center',
//   paddingHorizontal: 12,
//   borderBottomWidth: 1,
//   borderColor: '#eee',
//   backgroundColor: '#fff',
// },
// backText: {
//   fontSize: 16,
//   fontWeight: '700',
//   color: '#ff7a18',
// },
// headerTitle: {
//   flex: 1,
//   textAlign: 'center',
//   fontSize: 16,
//   fontWeight: '800',
//   marginRight: 30, // to balance back button
// },

//   container: { flex: 1, backgroundColor: '#f9fafb' },
//   loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     marginHorizontal: 12,
//     marginVertical: 6,
//     padding: 10,
//     borderRadius: 10,
//     elevation: 2,
//   },

//   image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
//   name: { fontSize: 15, fontWeight: '700' },
//   price: { marginTop: 4, color: '#666' },

//   addBtn: {
//     borderWidth: 1,
//     borderColor: '#ff7a18',
//     borderRadius: 6,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//   },
//   addText: { color: '#ff7a18', fontWeight: '800' },

//   qtyBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ff7a18',
//     borderRadius: 6,
//     paddingHorizontal: 8,
//   },
//   qtyBtn: { fontSize: 18, paddingHorizontal: 8, color: '#ff7a18' },
//   qty: { fontWeight: '700', minWidth: 20, textAlign: 'center' },

//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     padding: 12,
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   cartCount: { fontWeight: '700' },
//   totalText: {
//   marginTop: 2,
//   fontSize: 14,
//   fontWeight: '800',
//   color: '#111',
// },

//   confirmBtn: {
//     backgroundColor: '#ff7a18',
//     paddingHorizontal: 22,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   confirmText: { color: '#fff', fontWeight: '800' },
// });
