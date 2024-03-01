import * as React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';

const SleepTypeSelector = () => {
  const [value, setValue] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'nap',
            label: 'Nap'
          },
          {
            value: 'nightSleep',
            label: 'Night Sleep'
          }
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 30
  }
});

export default SleepTypeSelector;
