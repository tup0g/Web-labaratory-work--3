import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { pizzaApi } from '../api/pizzaApi';
import type { Pizza } from '../types/Pizza';

const SIZES: Record<string, string> = { 'Мала': '🍕 Мала', 'Середня': '🍕🍕 Середня', 'Велика': '🍕🍕🍕 Велика' };
const EMOJI = ['🍕', '🫓', '🧀', '🌶️', '🍖'];

function hashEmoji(name: string) {
  let h = 0;
  for (const c of name) h = (h + c.charCodeAt(0)) % EMOJI.length;
  return EMOJI[h];
}

type Props = {
  navigation: NativeStackNavigationProp<any, 'List'>;
};

export default function PizzaListScreen({ navigation }: Props) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const data = await pizzaApi.getAll();
      setPizzas(data);
    } catch {
      Alert.alert('Помилка', 'Помилка в опрацюванні запиту');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const confirmDelete = (id: number, name: string) => {
    Alert.alert('Видалити піцу?', `«${name}» буде видалено назавжди.`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: async () => {
          try {
            await pizzaApi.delete(id);
            await load();
          } catch {
            Alert.alert('Помилка', 'Помилка в опрацюванні запиту');
          }
        },
      },
    ]);
  };

  const q = search.toLowerCase();
  const filtered = pizzas.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.size.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>PizzaCRUD</Text>
          <Text style={styles.headerSubtitle}>Меню піцерії</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('Form')}>
          <Text style={styles.addBtnText}>＋ Додати</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Пошук..."
          placeholderTextColor="#888899"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff6b35" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>Нічого не знайдено</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id!.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Form', { id: item.id })}>
              <View style={styles.cardHeader}>
                <Text style={styles.emoji}>{hashEmoji(item.name)}</Text>
                <View style={styles.badge}><Text style={styles.badgeText}>{SIZES[item.size]}</Text></View>
              </View>
              <Text style={styles.pizzaName}>{item.name}</Text>
              <Text style={styles.pizzaDesc} numberOfLines={2}>{item.description || 'Без опису'}</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.price}>{item.price.toFixed(0)} ₴</Text>
                <TouchableOpacity style={styles.delBtn} onPress={() => confirmDelete(item.id!, item.name)}>
                  <Text style={styles.delBtnText}>Видалити</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f13' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#ff6b35' },
  headerSubtitle: { fontSize: 14, color: '#888899' },
  addBtn: { backgroundColor: '#ff6b35', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 10 },
  searchInput: { backgroundColor: '#1a1a24', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333348' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyTitle: { color: '#f1f1f8', fontSize: 18, fontWeight: 'bold' },
  list: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#1a1a24', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#333348' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  emoji: { fontSize: 32 },
  badge: { backgroundColor: 'rgba(255,107,53,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { color: '#ff8c5a', fontSize: 12, fontWeight: 'bold' },
  pizzaName: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  pizzaDesc: { color: '#888899', fontSize: 14, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#333348', paddingTop: 16 },
  price: { color: '#ff6b35', fontSize: 22, fontWeight: '900' },
  delBtn: { borderColor: '#ef4444', borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  delBtnText: { color: '#ef4444', fontWeight: 'bold' }
});
