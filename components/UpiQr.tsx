import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

type Props = {
  upiId: string;
  amount: number;
  merchantName: string;
};

export default function UpiQr({
  upiId,
  amount,
  merchantName,
}: Props) {
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount.toFixed(2)}&cu=INR`;

  return (
    <View style={styles.container}>
      <QRCode value={upiUrl} size={220} />

      <Text style={styles.amount}>₹ {amount.toFixed(2)}</Text>
      <Text style={styles.upi}>{upiId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  amount: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '900',
  },
  upi: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },
});
