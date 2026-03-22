import { Text, View, StyleSheet } from 'react-native';
import { InkWell } from 'react-native-ink-well';

export default function App() {
  return (
    <View style={styles.container}>
      <InkWell>
        <Text>Tap me</Text>
      </InkWell>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
