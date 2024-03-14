import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView } from 'react-native';
import { colors } from '../../assets/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  ActivityIndicator,
  Button,
  SegmentedButtons
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';
import NotesTextInput from '../components/inputs/NotesTextInput';
import { createEvent } from '../utils/db';
import { useNavigation } from '@react-navigation/native';
const foodTypes = [
  { label: 'Breast Milk', value: 'breastMilk' },
  { label: 'Formula', value: 'formula' },
  { label: 'Tube Feeding', value: 'tubeFeeding' },
  { label: 'Cow Milk', value: 'cowMilk' },
  { label: 'Soy Milk', value: 'soyMilk' },
  { label: 'Other', value: 'other' }
];

const Divider = () => {
  return <View style={styles.divider} />;
};

const NumericInput: React.FC<{
  onValueChange: (newValue: any) => void;
  unit: string;
}> = ({ onValueChange, unit }) => {
  const [value, setValue] = useState('0.00');

  const handleTextChange = (newValue: string) => {
    // Ignore non-numeric input
    if (!/^\d*\.?\d*$/.test(newValue)) {
      return;
    }

    setValue(newValue);
    onValueChange(parseFloat(newValue));
  };

  const handleFocus = () => {
    setValue('');
  };

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.text}>Amount:</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            keyboardType="numeric"
            value={value}
            testID="numeric-input"
          />
          <Text style={styles.unitText}>{unit === 'oz' ? 'Oz' : 'mL'}</Text>
        </View>
      </View>
      <View style={{ height: '5%' }} />
      <Slider
        style={styles.sliderContainer}
        minimumValue={0}
        maximumValue={unit === 'oz' ? 12 : 350}
        step={unit === 'oz' ? 0.25 : 5}
        minimumTrackTintColor={colors.crimsonRed}
        maximumTrackTintColor={colors.lightTan}
        value={parseFloat(value)}
        onValueChange={(newValue) => {
          handleTextChange(newValue.toString());
        }}
      />
      <View style={styles.sliderRangeContainer}>
        <Text>0</Text>
        <Text>{unit === 'oz' ? 12 : 350}</Text>
      </View>
    </View>
  );
};

const DateTimePicker: React.FC<{
  onValueChange: (newValue: any) => void;
}> = ({ onValueChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datetime, setDatetime] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any) => {
    setDatetime(selectedDate);
    onValueChange(selectedDate.toISOString());
    hideDatePicker();
  };

  return (
    <View style={styles.dateTimePickerContainer}>
      <Text style={styles.text}>Start time:</Text>
      <Button
        onPress={showDatePicker}
        testID="date-time-picker-button">
        <Text style={styles.dateTimePickerText}>
          {datetime
            ? datetime.toLocaleTimeString() +
              ' ' +
              datetime.toLocaleDateString()
            : 'Press to select time.'}
        </Text>
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={datetime}
        testID="date-time-picker-modal"
      />
    </View>
  );
};

const FoodTypePicker: React.FC<{
  onValueChange: (newValue: any) => void;
}> = ({ onValueChange }) => {
  const [value, setValue] = useState('breastMilk');

  const handleChange = (newValue: any) => {
    onValueChange(newValue);
    setValue(newValue);
  };
  return (
    <View style={styles.foodTypePickerContainer}>
      <Text style={styles.text}>Type:</Text>
      <View testID="food-type-picker">
        <RNPickerSelect
          onValueChange={handleChange}
          items={foodTypes}
          style={pickerSelectStyles}
          value={value}
        />
      </View>
    </View>
  );
};

const UnitPicker: React.FC<{
  onValueChange: (newValue: any) => void;
  unit: string;
}> = ({ onValueChange, unit }) => {
  const [value, setValue] = useState(unit);

  return (
    <View testID="unit-picker">
      <SegmentedButtons
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          onValueChange(newValue);
        }}
        buttons={[
          {
            label: 'mL',
            value: 'ml',
            style: {
              backgroundColor: value === 'ml' ? colors.lightTan : 'transparent'
            },
            testID: 'unit-picker-button-ml'
          },
          {
            label: 'Oz',
            value: 'oz',
            style: {
              backgroundColor: value === 'oz' ? colors.lightTan : 'transparent'
            },
            testID: 'unit-picker-button-oz'
          }
        ]}
        style={styles.segmentedButtonsContainer}
      />
    </View>
  );
};

const FoodTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [unit, setUnit] = useState('oz');
  const [isLoading, setIsLoading] = useState(false);
  const [feedData, setFeedData] = useState({
    type: 'feed',
    startTime: new Date().toISOString(),
    amount: 0,
    unit: 'oz',
    foodType: 'breastMilk',
    note: ''
  });

  const handleSave = () => {
    void createEvent(feedData);
    setIsLoading(true);
    setTimeout(() => {
      navigation.navigate('Home');
    }, 2000);
  };

  return isLoading ? (
    <View style={styles.activityIndicator}>
      <ActivityIndicator
        animating={true}
        color={colors.crimsonRed}
        testID="activity-indicator"
      />
    </View>
  ) : (
    <View>
      <ScrollView style={styles.container}>
        <DateTimePicker
          onValueChange={(value) => {
            setFeedData((prevState) => ({ ...prevState, startTime: value }));
          }}
        />
        <Divider />
        <FoodTypePicker
          onValueChange={(value) => {
            setFeedData((prevState) => ({ ...prevState, foodType: value }));
          }}
        />
        <Divider />
        <View style={{ height: '15%' }}></View>
        <UnitPicker
          onValueChange={(value) => {
            setFeedData((prevState) => ({ ...prevState, unit: value }));
            setUnit(value);
          }}
          unit={unit}
        />
        <View style={{ height: '15%' }}></View>
        <NumericInput
          onValueChange={(value) => {
            setFeedData((prevState) => ({ ...prevState, amount: value }));
          }}
          unit={unit}
        />
        <Divider />
        <NotesTextInput
          style={{ alignSelf: 'center', marginVertical: 8 }}
          onValueChange={(value) => {
            setFeedData((prevState) => ({ ...prevState, note: value }));
          }}
        />
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => {
          handleSave();
        }}
        style={styles.saveButtonContainer}
        labelStyle={styles.saveButtonLabel}>
        Save
      </Button>
    </View>
  );
};

FoodTrackingScreen.propTypes = {};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: '500'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginRight: '5%'
  },
  textInput: {
    color: colors.crimsonRed,
    width: 'auto',
    fontSize: 20,
    fontWeight: '500',
    minWidth: 'auto'
  },
  unitText: {
    marginLeft: 5,
    color: colors.crimsonRed,
    fontWeight: 'bold',
    fontSize: 20
  },
  sliderContainer: {
    width: '90%',
    alignSelf: 'center'
  },
  sliderRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center'
  },
  dateTimePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dateTimePickerText: {
    color: colors.crimsonRed,
    fontSize: 20
  },
  foodTypePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  activityIndicator: {
    height: '100%',
    justifyContent: 'center'
  },
  segmentedButtonsContainer: {
    alignItems: 'center',
    marginHorizontal: '20%',
    marginVertical: 8
  },
  saveButtonContainer: {
    width: '90%',
    height: '8%',
    position: 'absolute',
    bottom: '2%',
    borderRadius: 25,
    justifyContent: 'center',
    backgroundColor: colors.crimsonRed,
    alignSelf: 'center'
  },
  saveButtonLabel: {
    color: 'white',
    fontSize: 20
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    padding: 16
  },
  divider: {
    marginVertical: 8,
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: colors.crimsonRed,
    fontWeight: '500',
    paddingRight: 30
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.crimsonRed,
    fontWeight: '500',
    paddingRight: 30
  }
});

export default FoodTrackingScreen;
