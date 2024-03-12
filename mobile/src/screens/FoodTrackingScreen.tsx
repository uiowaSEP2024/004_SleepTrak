import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { colors } from '../../assets/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Button, SegmentedButtons } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import Slider from '@react-native-community/slider';

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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        <Text style={{ fontSize: 20, fontWeight: '500' }}>Amount:</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginRight: '5%'
          }}>
          <TextInput
            style={{
              color: colors.crimsonRed,
              width: 'auto',
              fontSize: 20,
              fontWeight: '500',
              minWidth: 'auto'
            }}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            keyboardType="numeric"
            value={value}
          />
          <Text
            style={{
              marginLeft: 5,
              color: colors.crimsonRed,
              fontWeight: 'bold',
              fontSize: 20
            }}>
            {unit === 'oz' ? 'Oz' : 'mL'}
          </Text>
        </View>
      </View>
      <View style={{ height: '5%' }} />
      <Slider
        style={{ width: '90%', alignSelf: 'center' }}
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '90%',
          alignSelf: 'center'
        }}>
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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <Text style={{ fontSize: 20, fontWeight: '500' }}>Start time:</Text>
      <Button onPress={showDatePicker}>
        <Text style={{ color: colors.crimsonRed, fontSize: 20 }}>
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
      />
    </View>
  );
};

const FoodTypePicker: React.FC<{
  onValueChange: (newValue: any) => void;
}> = ({ onValueChange }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <Text style={{ fontSize: 20, fontWeight: '500' }}>Type:</Text>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={foodTypes}
        placeholder={{ label: 'Set type', value: null }}
        style={pickerSelectStyles}
      />
    </View>
  );
};

const UnitPicker: React.FC<{
  onValueChange: (newValue: any) => void;
  unit: string;
}> = ({ onValueChange, unit }) => {
  const [value, setValue] = useState(unit);

  return (
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
          }
        },
        {
          label: 'Oz',
          value: 'oz',
          style: {
            backgroundColor: value === 'oz' ? colors.lightTan : 'transparent'
          }
        }
      ]}
      style={{
        alignItems: 'center',
        marginHorizontal: '20%',
        marginVertical: 8
      }}
    />
  );
};
const FoodTrackingScreen: React.FC = () => {
  const [unit, setUnit] = useState('oz');
  const feedData: Record<string, any> = {
    type: 'feed',
    timestamp: new Date(),
    amount: 0,
    unit: 'oz'
  };
  return (
    <View style={styles.container}>
      <DateTimePicker
        onValueChange={(value) => {
          feedData.timestamp = value;
        }}
      />
      <Divider />
      <FoodTypePicker
        onValueChange={(value) => {
          feedData.foodType = value;
        }}
      />
      <Divider />
      <View style={{ height: '5%' }}></View>
      <UnitPicker
        onValueChange={(value) => {
          feedData.unit = value;
          setUnit(value);
        }}
        unit={unit}
      />
      <View style={{ height: '5%' }}></View>
      <NumericInput
        onValueChange={(value) => {
          feedData.amount = value;
          console.log(value);
        }}
        unit={unit}
      />
      <Divider />
    </View>
  );
};

FoodTrackingScreen.propTypes = {};

const styles = StyleSheet.create({
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
    paddingRight: 30 // to ensure the text is not cut off
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: colors.crimsonRed,
    fontWeight: '500',
    paddingRight: 30 // to ensure the text is not cut off
  }
});

export default FoodTrackingScreen;
