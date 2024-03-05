import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Icon } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface EditTimePickerProps {
  title: string;
  placeholderTime: Date;
  style?: StyleProp<ViewStyle>;
}

const EditTimePicker: React.FC<EditTimePickerProps> = ({
  title,
  placeholderTime,
  style
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
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity
        onPress={showPicker}
        style={styles.pickerContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {selectedTime.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            source="pencil"
            size={18}
          />
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
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
  pickerContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  timeText: {
    fontSize: 15,
    marginBottom: 2
  },
  timeContainer: {
    borderBottomWidth: 1
  },
  iconContainer: {
    marginLeft: 3
  },
  titleContainer: {
    marginLeft: 2,
    marginBottom: 10
  },
  title: {
    fontSize: 16
  }
});

export default EditTimePicker;
