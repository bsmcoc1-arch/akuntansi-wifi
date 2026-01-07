import React, { useState } from 'react';
// Hapus SafeAreaView dari react-native
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';

// Tambahkan import ini di bawahnya
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WifiCard from '../components/WifiCard';
// Pastikan file DaftarHarga.js ada di folder components
import { LIST_PAKET } from '../components/DaftarHarga';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const [sortBy, setSortBy] = useState('TERBARU'); // Default: Berdasarkan input terbaru  // State Form
  const [formNama, setFormNama] = useState('');
  const [formHarga, setFormHarga] = useState('');
  const [formDurasi, setFormDurasi] = useState('');
  const [satuan, setSatuan] = useState('HARI');

  // FUNGSI 1: Hitung Jatuh Tempo
  const hitungJatuhTempo = (tglMulai, durasi, tipe) => {
    let date = new Date(tglMulai);
    if (tipe === 'JAM') {
      date.setHours(date.getHours() + parseInt(durasi || 0));
      return date.toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } else {
      date.setDate(date.getDate() + parseInt(durasi || 0));
      return date.toISOString().split('T')[0];
    }
  };

  // FUNGSI 2: Tambah Pelanggan
  const tambahPelanggan = () => {
    const baru = {
      id: Date.now(), // ID Unik untuk hapus
      name: formNama,
      harga: parseInt(formHarga) || 0,
      tglBeli: new Date().toISOString(),
      masaAktif: formDurasi,
      tipeSatuan: satuan,
      active: true,
    };
    setDevices([...devices, baru]);
    setModalVisible(false);
    setFormNama('');
    setFormHarga('');
    setFormDurasi('');
  };

  // FUNGSI 3: Hapus Pelanggan (INI YANG TADI HILANG)
  const hapusPelanggan = (id) => {
    setDevices(devices.filter((device) => device.id !== id));
  };

  // FUNGSI LOGIKA SORTIR
  const getSortedDevices = () => {
    let sorted = [...devices];

    if (sortBy === 'JATUH_TEMPO') {
      // Sortir berdasarkan siapa yang paling cepat habis
      sorted.sort((a, b) => {
        const dateA = new Date(
          hitungJatuhTempo(a.tglBeli, a.masaAktif, a.tipeSatuan)
        );
        const dateB = new Date(
          hitungJatuhTempo(b.tglBeli, b.masaAktif, b.tipeSatuan)
        );
        return dateA - dateB;
      });
    } else {
      // Sortir berdasarkan input terakhir (ID adalah Date.now, jadi yang besar berarti terbaru)
      sorted.sort((a, b) => b.id - a.id);
    }
    return sorted;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>WiFi Manager</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Pelanggan</Text>
          </TouchableOpacity>
        </View>

        {/* TOMBOL PILIHAN SORTIR */}
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Urutkan:</Text>
          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortBy === 'TERBARU' && styles.sortBtnActive,
            ]}
            onPress={() => setSortBy('TERBARU')}>
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'TERBARU' && styles.sortBtnTextActive,
              ]}>
              Input Terbaru
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortBtn,
              sortBy === 'JATUH_TEMPO' && styles.sortBtnActive,
            ]}
            onPress={() => setSortBy('JATUH_TEMPO')}>
            <Text
              style={[
                styles.sortBtnText,
                sortBy === 'JATUH_TEMPO' && styles.sortBtnTextActive,
              ]}>
              Jatuh Tempo
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.list}>
          {/* PANGGIL FUNGSI SORTIR DI SINI */}
          {getSortedDevices().map((device) => (
            <WifiCard
              key={device.id}
              name={device.name}
              harga={device.harga}
              tglBeli={new Date(device.tglBeli).toLocaleString('id-ID', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
              tglSelesai={hitungJatuhTempo(
                device.tglBeli,
                device.masaAktif,
                device.tipeSatuan
              )}
              status={device.active}
              onDelete={() => hapusPelanggan(device.id)}
            />
          ))}
        </ScrollView>

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Tambah Pelanggan</Text>

              <TextInput
                style={styles.input}
                placeholder="Nama Pelanggan"
                value={formNama}
                onChangeText={setFormNama}
              />

              <Text style={styles.labelGroup}>Pilih Satuan:</Text>
              <View style={styles.segmentContainer}>
                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    satuan === 'HARI' ? styles.activeBtn : styles.inactiveBtn,
                  ]}
                  onPress={() => setSatuan('HARI')}>
                  <Text
                    style={
                      satuan === 'HARI'
                        ? styles.activeText
                        : styles.inactiveText
                    }>
                    HARI
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.segmentBtn,
                    satuan === 'JAM' ? styles.activeBtn : styles.inactiveBtn,
                  ]}
                  onPress={() => setSatuan('JAM')}>
                  <Text
                    style={
                      satuan === 'JAM' ? styles.activeText : styles.inactiveText
                    }>
                    JAM
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.input}
                placeholder={satuan === 'HARI' ? 'Jumlah Hari' : 'Jumlah Jam'}
                keyboardType="numeric"
                value={formDurasi}
                onChangeText={setFormDurasi}
              />

              <TextInput
                style={styles.input}
                placeholder="Harga (Rp)"
                keyboardType="numeric"
                value={formHarga}
                onChangeText={setFormHarga}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}>
                  <Text>Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={tambahPelanggan}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    Simpan
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ... styles tetap sama seperti kode kamu ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6' },
  header: {
    padding: 20,
    backgroundColor: '#2c3e50',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 15 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 20 },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  labelGroup: { fontSize: 12, color: '#7f8c8d', marginBottom: 8 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 20,
    padding: 10,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeBtn: { backgroundColor: '#3498db', elevation: 2 },
  inactiveBtn: { backgroundColor: 'transparent' },
  activeText: { color: '#fff', fontWeight: 'bold' },
  inactiveText: { color: '#7f8c8d' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: { flex: 0.45, padding: 15, alignItems: 'center' },
  saveBtn: {
    flex: 0.45,
    padding: 15,
    backgroundColor: '#2ecc71',
    borderRadius: 10,
    alignItems: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginRight: 10,
  },
  sortBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  sortBtnActive: { backgroundColor: '#3498db' },
  sortBtnText: { fontSize: 11, color: '#7f8c8d' },
  sortBtnTextActive: { color: '#fff', fontWeight: 'bold' },
});
