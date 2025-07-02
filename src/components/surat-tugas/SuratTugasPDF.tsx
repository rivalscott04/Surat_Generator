import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';

// Custom font registration (optional, can use default)
// Font.register({ family: 'Arial', src: 'https://fonts.gstatic.com/s/arial.ttf' });

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    border: '1px solid #000',
    padding: 4,
    fontSize: 11,
  },
});

// Props: { data: { ... } }
const SuratTugasPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Logo & Header */}
      <View style={styles.header}>
        {/* If you want to use a logo, use <Image src={...} style={styles.logo} /> */}
        <Text style={styles.title}>KEMENTERIAN AGAMA REPUBLIK INDONESIA</Text>
        <Text>KANTOR WILAYAH KEMENTERIAN AGAMA</Text>
        <Text>PROVINSI NUSA TENGGARA BARAT</Text>
        <Text>Jl. Udayana No. 6 Mataram NTB, Telp. (0370) 625661, Fax. (0370) 625317</Text>
        <Text>Website: www.ntb.kemenag.go.id, Email: ntb@kemenag.go.id</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>SURAT TUGAS</Text>
        <Text>Nomor: {data.nomor || '-'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Menimbang:</Text>
        {(data.menimbang || []).map((item, idx) => (
          <Text key={idx}>{String.fromCharCode(97 + idx)}. {item}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Dasar:</Text>
        <Text>{data.dasar || '-'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.bold}>Memberi Tugas Kepada:</Text>
        {/* Table of people */}
        <View style={styles.table}>
          {(data.people || []).map((person, idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableCell}>{person.nama}</Text>
              <Text style={styles.tableCell}>{person.nip}</Text>
              <Text style={styles.tableCell}>{person.jabatan}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text>Untuk: {data.untuk || '-'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ marginTop: 24 }}>Mataram, {data.tanggal || '-'}</Text>
        <Text>Kepala Kantor Wilayah</Text>
        <Text style={{ marginTop: 32 }}>{data.signatureName || '-'}</Text>
      </View>
    </Page>
  </Document>
);

export default SuratTugasPDF; 