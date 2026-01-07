import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WifiCard({ name, harga, tglBeli, tglSelesai, status, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>Rp {harga ? harga.toLocaleString() : '0'}</Text>
        </View>

        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Hapus</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View>
          <Text style={styles.label}>Tanggal Beli</Text>
          <Text style={styles.date}>{tglBeli}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.label, { color: '#e74c3c' }]}>Jatuh Tempo</Text>
          <Text style={[styles.date, { fontWeight: 'bold' }]}>{tglSelesai}</Text>
        </View>
      </View>

      <View style={status ? styles.statusActive : styles.statusOff}>
        <Text style={styles.statusText}>{status ? 'AKTIF' : 'NON-AKTIF'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Agar teks nama dan tombol sejajar tengah
    marginBottom: 10,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#27ae60', fontWeight: 'bold' },
  deleteBtn: {
    backgroundColor: '#fdeaea',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  deleteText: { color: 'red', fontWeight: 'bold', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 10, color: '#95a5a6', textTransform: 'uppercase' },
  date: { fontSize: 13, color: '#2c3e50' },
  statusActive: {
    marginTop: 10,
    backgroundColor: '#e8f6ef',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusOff: {
    marginTop: 10,
    backgroundColor: '#fdeaea',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusText: { fontSize: 10, fontWeight: 'bold' },
});
