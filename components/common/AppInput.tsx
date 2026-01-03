import { View, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export default function AppInput(props: any) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.text,
  },
});
