import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
  DefaultTheme
} from 'react-native-paper';
import { colors } from '../../../assets/colors';
import type { StyleProp, ViewStyle } from 'react-native';

interface NotesTextInputProps {
  style?: StyleProp<ViewStyle>;
  onValueChange?: (newValue: string) => void;
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.crimsonRed
  }
};

const NotesTextInput: React.FC<NotesTextInputProps> = ({
  style,
  onValueChange
}) => {
  const [value, setValue] = useState('');
  const onChangeTextHandler = (text: string) => {
    setValue(text);
    if (onValueChange) {
      onValueChange(text);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <View style={[styles.textInputContainer, style]}>
        <TextInput
          mode="outlined"
          label="Add Notes"
          onChangeText={onChangeTextHandler}
          multiline
          style={styles.input}
          value={value}
          testID="notesTextInput"
        />
      </View>
    </PaperProvider>
  );
};

const styles = {
  textInputContainer: {
    width: Dimensions.get('window').width * 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 0
  },
  input: {
    height: 160
  }
};

export default NotesTextInput;
