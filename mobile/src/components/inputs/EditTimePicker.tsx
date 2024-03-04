import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button } from 'react-native-paper';

interface EditTimePickerProps {
  title: string;
  placeholderTime: Date;
}

const EditTimePicker: React.FC<EditTimePickerProps> = ({
  title,
  placeholderTime
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(placeholderTime);

  const showPicker = () => {
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = (date: any) => {
    console.warn('A date has been picked: ', date);
    setSelectedTime(date);
    hidePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={showPicker}>
        <Text>
          {selectedTime.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
      <Button
        onPress={() => {
          console.log(selectedTime);
        }}>
        Change Time
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    justifyContent: 'space-between',
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  },
  title: {
    fontSize: 16,
    marginRight: 10,
    marginBottom: 10
  },
  input: {
    marginBottom: 10
  }
});

export default EditTimePicker;
