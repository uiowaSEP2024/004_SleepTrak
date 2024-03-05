import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme
} from 'react-native-paper';
import { colors } from '../../../assets/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.crimsonRed
  }
};

const NotesTextInput = () => {
  const [value, setValue] = useState('');
  const onChangeTextHandler = (text: React.SetStateAction<string>) => {
    setValue(text);
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.textInputContainer}>
        <TextInput
          mode="outlined"
          label="Add Notes"
          onChangeText={onChangeTextHandler}
          multiline
          dense
          style={styles.input}
          value={value}
        />
      </View>
    </PaperProvider>
  );
};

const styles = {
  textInputContainer: {
    width: Dimensions.get('window').width * 0.8
  },
  input: {
    height: 160
  }
};

export default NotesTextInput;
