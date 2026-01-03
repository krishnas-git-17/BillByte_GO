import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { flex: 1, paddingHorizontal: 12 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  tabsContainer: { minHeight: 50, justifyContent: 'center' },
  tab: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: { backgroundColor: '#ff7a18', borderColor: '#ff7a18' },
  tabText: { fontWeight: '700', color: '#333' },
  tabTextActive: { color: '#fff' },

  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 10,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  columnWrap: { justifyContent: 'space-between' },

  tableCard: {
    width: '31%',
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#c0c0c0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableNumber: { fontSize: 16, fontWeight: '700' },
  timer: { fontSize: 11, marginTop: 4 },
});
