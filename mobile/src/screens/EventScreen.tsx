import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../assets/colors';
import { updateEvent } from '../utils/db';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';

const foodTypes = [
  { label: 'Breast Milk', value: 'breastMilk' },
  { label: 'Formula', value: 'formula' },
  { label: 'Tube Feeding', value: 'tubeFeeding' },
  { label: 'Cow Milk', value: 'cowMilk' },
  { label: 'Soy Milk', value: 'soyMilk' },
  { label: 'Other', value: 'other' }
];

const columnNames = {
  startTime: 'Start Time',
  endTime: 'End Time',
  type: 'Type',
  amount: 'Amount',
  foodType: 'Food Type',
  note: 'Note',
  unit: 'Unit',
  medicineType: 'Medicine Type',
  owner: 'Owner',
  cribStartTime: 'Crib Start Time',
  cribStopTime: 'Crib Stop Time'
};

const columnTypes = {
  startTime: Date,
  endTime: Date,
  type: String,
  amount: Number,
  foodType: 'foodType',
  note: String,
  unit: 'unit',
  medicineType: String,
  owner: String,
  cribStartTime: Date,
  cribStopTime: Date
};

const HIDDEN_FIELDS = ['ownerId', 'eventId', 'type'];

const Picker: React.FC<{
  onValueChange: (newValue: any) => void;
  initialValue?: string;
  items: Array<{ label: string; value: string }>;
}> = ({ onValueChange, initialValue, items }) => {
  const [value, setValue] = useState(
    initialValue?.toString() ?? items[0].value
  );

  const handleChange = (newValue: any) => {
    setValue(newValue);
  };

  return (
    <View style={styles.itemValue}>
      <View testID="picker">
        <RNPickerSelect
          onValueChange={handleChange}
          items={items}
          style={pickerSelectStyles}
          value={value}
          onClose={() => {
            onValueChange(value);
          }}
        />
      </View>
    </View>
  );
};

const DateQuestion: React.FC<{
  onValueChange: (newValue: any) => void;
  initialDate?: Date;
}> = ({ onValueChange, initialDate }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(initialDate);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any) => {
    setDate(selectedDate);
    onValueChange(selectedDate.toISOString());
    hideDatePicker();
  };

  return (
    <TouchableOpacity
      style={styles.itemValue}
      onPress={showDatePicker}>
      <Text style={{ fontSize: 20, color: colors.textGray }}>
        {date ? date.toLocaleString() : 'Press to select date'}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </TouchableOpacity>
  );
};

const SimpleNumericInput: React.FC<{
  onValueChange: (newValue: any) => void;
  initialValue?: number;
}> = ({ onValueChange, initialValue }) => {
  const [value, setValue] = useState(initialValue?.toString() ?? '0.00');

  const handleTextChange = (newValue: string) => {
    if (/^\d*\.?\d*$/.test(newValue)) {
      setValue(newValue);
    }
  };

  return (
    <View style={styles.itemValue}>
      <TextInput
        style={{ fontSize: 20 }}
        onChangeText={handleTextChange}
        keyboardType="numeric"
        value={value}
        testID="numeric-input"
        onEndEditing={() => {
          onValueChange(parseFloat(value));
        }}
      />
    </View>
  );
};

const Item = ({
  title,
  value,
  paramName,
  setEventData
}: {
  title: string;
  value: any;
  paramName: string;
  setEventData: any;
}) => {
  const questionType = columnTypes[paramName as keyof typeof columnTypes];
  const onChangeText = (value: any) => {
    setEventData((prevEventData: any) => ({
      ...prevEventData,
      [paramName]: value
    }));
  };

  const InputComponent = () => {
    if (questionType === Date) {
      return (
        <DateQuestion
          onValueChange={onChangeText}
          initialDate={new Date(value)}
        />
      );
    } else if (questionType === Number) {
      return (
        <SimpleNumericInput
          onValueChange={onChangeText}
          initialValue={value}
        />
      );
    } else if (questionType === String) {
      return (
        <TextInput
          value={value.toString()}
          onChangeText={onChangeText}
          style={styles.itemValue}
        />
      );
    } else if (questionType === 'foodType') {
      return (
        <Picker
          onValueChange={onChangeText}
          initialValue={value}
          items={foodTypes}
        />
      );
    } else if (questionType === 'unit') {
      return (
        <Picker
          onValueChange={onChangeText}
          initialValue={value}
          items={[
            { label: 'ml', value: 'ml' },
            { label: 'oz', value: 'oz' }
          ]}
        />
      );
    }
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <InputComponent />
      <Text style={styles.tapToEdit}>Tap to edit</Text>
    </View>
  );
};

const EventScreen: React.FC = ({ route, _navigation }) => {
  const { event } = route.params;
  const navigation = useNavigation();
  const [eventData, setEventData] = useState({ ...event });

  const onSave = useCallback(() => {
    const updateEventInDB = async () => {
      await updateEvent(event.eventId, eventData);
      navigation.goBack();
    };
    void updateEventInDB();
  }, [event.eventId, navigation, eventData]);

  return event ? (
    <View style={styles.container}>
      <Text style={styles.title}>
        {event.type[0].toUpperCase() + event.type.slice(1)}
      </Text>
      <ScrollView contentInset={{ top: 0, left: 0, bottom: 200, right: 0 }}>
        {Object.keys(event).map((key) => {
          if (event[key] !== null && !HIDDEN_FIELDS.includes(key)) {
            return (
              <Item
                key={key}
                paramName={key}
                title={columnNames[key as keyof typeof columnNames]}
                value={eventData[key]}
                setEventData={setEventData}
              />
            );
          } else {
            return null;
          }
        })}
      </ScrollView>
      <TouchableOpacity
        onPress={onSave}
        style={styles.editButton}>
        <Text style={styles.editButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>No event found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '7%',
    paddingHorizontal: '7%',
    backgroundColor: 'white',
    height: '100%'
  },
  title: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 32,
    letterSpacing: 2,
    marginBottom: '5%'
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 8
  },
  itemTitle: {
    fontSize: 18,
    color: colors.crimsonRed
  },
  itemValue: {
    fontSize: 20,
    color: colors.textGray,
    backgroundColor: colors.veryLightPurple,
    borderRadius: 8,
    padding: 12,
    marginVertical: 4
  },
  tapToEdit: {
    fontSize: 12,
    color: colors.textGray,
    alignSelf: 'flex-end'
  },
  editButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '6%',
    backgroundColor: colors.crimsonRed,
    width: '70%',
    height: '7%',
    borderRadius: 32
  },
  editButtonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 2
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    color: colors.textGray,
    backgroundColor: colors.veryLightPurple,
    borderRadius: 8,
    marginVertical: 4
  },
  inputAndroid: {
    fontSize: 20,
    color: colors.textGray,
    backgroundColor: colors.veryLightPurple,
    borderRadius: 8,
    marginVertical: 4
  }
});

export default EventScreen;
