import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const DateTimePickerModal = jest
  .fn()
  .mockImplementation(({ isVisible, onConfirm, onCancel }) => {
    return isVisible ? (
      <View>
        <Text>Mock DateTimePickerModal</Text>
        <TouchableOpacity
          onPress={() => onConfirm(new Date(2022, 1, 1, 11, 0))}>
          <Text>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    ) : (
      <></>
    );
  });

export default DateTimePickerModal;
