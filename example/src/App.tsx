import { Text, View, StyleSheet } from 'react-native';
import { InkResponse } from 'react-native-ink-response';

export default function App() {
  return (
    <View style={styles.container}>
      <InkResponse>
        <Text>Tap me</Text>
      </InkResponse>
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
