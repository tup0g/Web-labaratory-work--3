import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { pizzaApi } from '../api/pizzaApi';
import type { Pizza } from '../types/Pizza';

const SIZES: Array<Pizza['size']> = ['Мала', 'Середня', 'Велика'];

type Props = {
  navigation: NativeStackNavigationProp<any, 'Form'>;
  route: RouteProp<any, 'Form'>;
};

export default function PizzaFormScreen({ navigation, route }: Props) {
  const id = route.params?.id;
  const isEdit = Boolean(id);

  const [form, setForm] = useState<Pizza>({ name: '', price: 0, size: 'Середня', description: '' });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    pizzaApi.getById(id)
      .then(data => setForm(data))
      .catch(() => Alert.alert('Помилка', 'Помилка в опрацюванні запиту'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handle = (field: keyof Pizza, value: string | number) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Введіть назву піци';
    if (form.price <= 0 || isNaN(form.price)) return 'Некоректна ціна';
    if (!SIZES.includes(form.size)) return 'Оберіть розмір';
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) return Alert.alert('Помилка', err);
    
    try {
      setSaving(true);
      if (isEdit) {
        await pizzaApi.update(id, form);
      } else {
        await pizzaApi.create(form);
      }
      navigation.goBack();
    } catch {
      Alert.alert('Помилка', 'Помилка в опрацюванні запиту');
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#ff6b35" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{isEdit ? '✏️ Редагувати піцу' : '🍕 Нова піца'}</Text>

          <View style={styles.group}>
            <Text style={styles.label}>НАЗВА *</Text>
            <TextInput
              style={styles.input}
              placeholder="Наприклад: Маргарита"
              placeholderTextColor="#888899"
              value={form.name}
              onChangeText={t => handle('name', t)}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>ЦІНА (₴) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#888899"
              keyboardType="numeric"
              value={form.price ? form.price.toString() : ''}
              onChangeText={t => handle('price', parseFloat(t) || 0)}
            />
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>РОЗМІР *</Text>
            <View style={styles.sizes}>
              {SIZES.map(s => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sizeBtn, form.size === s && styles.sizeBtnActive]}
                  onPress={() => handle('size', s)}
                >
                  <Text style={[styles.sizeText, form.size === s && styles.sizeTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={styles.label}>ОПИС</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Інгредієнти..."
              placeholderTextColor="#888899"
              multiline
              numberOfLines={4}
              value={form.description}
              onChangeText={t => handle('description', t)}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnGhost} onPress={() => navigation.goBack()}>
              <Text style={styles.btnGhostText}>Скасувати</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={submit} disabled={saving}>
              <Text style={styles.btnPrimaryText}>{saving ? 'Збереження...' : 'Зберегти'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f13' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f13' },
  scroll: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#ff6b35', marginBottom: 30 },
  group: { marginBottom: 20 },
  label: { color: '#888899', fontSize: 12, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  input: { backgroundColor: '#1a1a24', color: '#fff', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#333348', fontSize: 16 },
  textarea: { height: 100, textAlignVertical: 'top' },
  sizes: { flexDirection: 'row', gap: 10 },
  sizeBtn: { flex: 1, backgroundColor: '#1a1a24', borderWidth: 1, borderColor: '#333348', padding: 14, borderRadius: 10, alignItems: 'center' },
  sizeBtnActive: { borderColor: '#ff6b35', backgroundColor: 'rgba(255,107,53,0.1)' },
  sizeText: { color: '#888899', fontWeight: 'bold' },
  sizeTextActive: { color: '#ff6b35' },
  actions: { flexDirection: 'row', gap: 15, marginTop: 20 },
  btnGhost: { flex: 1, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#333348', alignItems: 'center' },
  btnGhostText: { color: '#888899', fontWeight: 'bold', fontSize: 16 },
  btnPrimary: { flex: 2, padding: 16, borderRadius: 10, backgroundColor: '#ff6b35', alignItems: 'center' },
  btnPrimaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
