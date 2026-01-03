import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { styles } from '../styles/dashboard.styles';
import { TablePreferenceService } from '@/src/services/table-preference.service';
import { TableStateService } from '@/src/services/table-state.service';
import { realtimeService } from '@/src/services/realtime.service';
import { TableStatus } from '@/src/services/table-state.types';

/* ================= TYPES ================= */

type TableItem = {
  id: number;
  name: string;
};

type Section = {
  name: string;
  tables: TableItem[];
};

/* ================= STATUS COLORS ================= */

const STATUS_STYLES: Record<TableStatus, any> = {
  available: {},
  occupied: { backgroundColor: '#fff7cc' },
  ordered: { backgroundColor: '#ffe3e3' },
  billing: { backgroundColor: '#e6f0ff' },
  reservation: { backgroundColor: '#dcfce7' },
};

/* ================= SCREEN ================= */

export default function DashboardScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [loading, setLoading] = useState(true);

  /* ===== TABLE STATE (LIVE) ===== */
  const [tableStates, setTableStates] = useState<Map<string, TableStatus>>(
    new Map()
  );

  const [timers, setTimers] = useState<Record<string, string>>({});
  const liveTimersRef = useRef<Record<string, number>>({});

  /* ================= LOAD ONCE ================= */

  useEffect(() => {
    loadTablePreferences();
    loadActiveTables();
    connectRealtime();
  }, []);

  /* ================= LOAD TABLE STRUCTURE ================= */

  const loadTablePreferences = async () => {
    try {
      setLoading(true);
      const res = await TablePreferenceService.getAll();

      const built: Section[] = res.map(sec => ({
        name: sec.name,
        tables: Array.from({ length: sec.tableCount }, (_, i) => ({
          id: i + 1,
          name: String(i + 1),
        })),
      }));

      setSections(built);
    } catch (err) {
      console.log('LOAD TABLE PREF FAILED:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ACTIVE TABLE STATES ================= */

  const loadActiveTables = async () => {
    try {
      const states = await TableStateService.getAll();
      const map = new Map<string, TableStatus>();

      states.forEach(s => {
        map.set(s.tableId, s.status);
        if (s.startTime) initTimer(s.tableId, s.startTime);
      });

      setTableStates(map);
    } catch (e) {
      console.log('LOAD TABLE STATE FAILED', e);
    }
  };

  /* ================= REALTIME ================= */

  const connectRealtime = async () => {
    const token = await SecureStore.getItemAsync('token');
    if (!token) return;

    realtimeService.connect(token);

    realtimeService.subscribe(event => {
      if (event.type === 'TABLE_STATUS_CHANGED') {
        const { tableId, status, startTime } = event.payload;

        setTableStates(prev => {
          const map = new Map(prev);
          map.set(tableId, status);
          return map;
        });

        if (startTime) initTimer(tableId, startTime);
      }
    });
  };

  /* ================= TIMER ================= */

  const initTimer = (tableId: string, startTime: string) => {
    const diff =
      Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
    liveTimersRef.current[tableId] = diff;
    setTimers(prev => ({ ...prev, [tableId]: formatTime(diff) }));
  };

  const formatTime = (sec: number) => {
    const totalMinutes = Math.floor(sec / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updated: Record<string, string> = {};
      let changed = false;

      Object.keys(liveTimersRef.current).forEach(id => {
        liveTimersRef.current[id]++;
        updated[id] = formatTime(liveTimersRef.current[id]);
        changed = true;
      });

      if (changed) {
        setTimers(prev => ({ ...prev, ...updated }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FILTER ================= */

  const filteredSections = useMemo(() => {
    if (selectedSection === 'ALL') return sections;
    return sections.filter(s => s.name === selectedSection);
  }, [selectedSection, sections]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading tables...</Text>
      </View>
    );
  }

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* FILTER */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['ALL', ...sections.map(s => s.name)].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  selectedSection === tab && styles.tabActive,
                ]}
                onPress={() => {
                  setSelectedSection(tab);
                  scrollRef.current?.scrollTo({ y: 0, animated: false });
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedSection === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* TABLES */}
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          {filteredSections.map(section => (
            <View key={section.name} style={styles.sectionBox}>
              <Text style={styles.sectionTitle}>{section.name}</Text>

              <FlatList
                data={section.tables}
                keyExtractor={item => item.id.toString()}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.columnWrap}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                  const tableId = `${section.name}-T${item.id}`;
                  const status =
                    tableStates.get(tableId) || 'available';
                  const timer = timers[tableId];

                  return (
                    <TouchableOpacity
                      style={[
                        styles.tableCard,
                        STATUS_STYLES[status],
                      ]}
                      onPress={async () => {
                        try {
                          await TableStateService.setOccupied(tableId);
                          router.push({
                            pathname: '/orders',
                            params: {
                              table: item.name,
                              section: section.name,
                            },
                          });
                        } catch {
                          alert('Failed to occupy table');
                        }
                      }}
                    >
                      <Text style={styles.tableNumber}>{item.name}</Text>
                      {status !== 'available' && timer && (
                        <Text style={styles.timer}>⏱ {timer}</Text>
                      )}

                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
//   safeArea: { flex: 1, backgroundColor: '#f9fafb' },
//   container: { flex: 1, paddingHorizontal: 12 },
//   loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

//   tabsContainer: { minHeight: 50, justifyContent: 'center' },
//   tab: {
//     height: 36,
//     paddingHorizontal: 16,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginRight: 8,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabActive: { backgroundColor: '#ff7a18', borderColor: '#ff7a18' },
//   tabText: { fontWeight: '700', color: '#333' },
//   tabTextActive: { color: '#fff' },

//   sectionBox: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e5e5e5',
//     padding: 10,
//     marginBottom: 14,
//   },
//   sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
//   columnWrap: { justifyContent: 'space-between' },

//   tableCard: {
//     width: '31%',
//     height: 70,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderStyle: 'dashed',
//     borderColor: '#c0c0c0',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tableNumber: { fontSize: 16, fontWeight: '700' },
//   timer: { fontSize: 11, marginTop: 4 },
// });
