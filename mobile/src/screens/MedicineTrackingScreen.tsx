import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView } from 'react-native';
import { colors } from '../../assets/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  ActivityIndicator,
  Button,
  SegmentedButtons
} from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import NotesTextInput from '../components/inputs/NotesTextInput';
import { createMedicine, fetchUserData } from '../utils/db';
import { saveEvent } from '../utils/localDb';
import { localize } from '../utils/bridge';
import { addToSyncQueue, syncData } from '../utils/syncQueue';
import { useNavigation } from '@react-navigation/native';

const UPDATE_DELAY_MS = 2000;

const Divider = () => {
  return <View style={styles.divider} />;
};
const NumericInput: React.FC<{
  onValueChange: (newValue: any) => void;
  unit: string;
}> = ({ onValueChange, unit }) => {
  const [value, setValue] = useState('0.00');

  const handleTextChange = useCallback(
    (newValue: string) => {
      if (!/^\d*\.?\d*$/.test(newValue)) {
        return;
      }

      setValue(newValue);
      onValueChange(parseFloat(newValue));
    },
    [onValueChange]
  );

  const handleFocus = useCallback(() => {
    setValue('');
  }, []);

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
          <Text style={styles.unitText}>{unit}</Text>
        </View>
      </View>
    </View>
  );
};

const DateTimePicker: React.FC<{
  onValueChange: (newValue: any) => void;
}> = ({ onValueChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [datetime, setDatetime] = useState(new Date());

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const handleConfirm = useCallback(
    (selectedDate: any) => {
      setDatetime(selectedDate);
      onValueChange(selectedDate.toISOString());
      hideDatePicker();
    },
    [onValueChange, hideDatePicker]
  );

  return (
    <View style={styles.dateTimePickerContainer}>
      <Text style={styles.text}>Time:</Text>
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

const MedicineTypePicker: React.FC<{
  onValueChange: (newValue: any) => void;
  medicines: string[];
}> = ({ onValueChange, medicines }) => {
  const [value, setValue] = useState({
    label: 'Input new medicine..',
    value: null
  });
  const [wantsInput, setWantsInput] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const handleChangePicker = useCallback(
    (newValue: any) => {
      setWantsInput(newValue === null || newValue === 'null');
      onValueChange(newValue);
      setValue(newValue);
    },
    [onValueChange]
  );

  const handleChangeInput = useCallback(
    (newValue: any) => {
      onValueChange(newValue);
      setInputValue(newValue);
    },
    [onValueChange]
  );

  return (
    <View>
      <View style={styles.medicineTypePickerContainer}>
        <Text style={styles.text}>Medicine:</Text>
        <View testID="medicine-type-picker">
          <RNPickerSelect
            onValueChange={handleChangePicker}
            items={
              medicines.length === 0
                ? []
                : medicines.map((type) => ({ label: type, value: type }))
            }
            style={pickerSelectStyles}
            value={value}
            placeholder={{ label: 'New medicine', value: null }}
          />
        </View>
      </View>
      <View>
        {wantsInput && (
          <TextInput
            style={{ ...styles.textInput, marginBottom: 8 }}
            onChangeText={handleChangeInput}
            value={inputValue}
            testID="medicine-type-input"
            placeholder="Input new medicine.."
          />
        )}
      </View>
    </View>
  );
};

const UnitPicker: React.FC<{
  onValueChange: (newValue: any) => void;
  unit: string;
}> = ({ onValueChange, unit }) => {
  const [value, setValue] = useState(unit);

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue);
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <View testID="unit-picker">
      <SegmentedButtons
        value={value}
        onValueChange={handleValueChange}
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
          },
          {
            label: 'Drops',
            value: 'drops',
            style: {
              backgroundColor:
                value === 'drops' ? colors.lightTan : 'transparent'
            },
            testID: 'unit-picker-button-drops'
          },
          {
            label: 'Tsp',
            value: 'tsp',
            style: {
              backgroundColor: value === 'tsp' ? colors.lightTan : 'transparent'
            },
            testID: 'unit-picker-button-tsp'
          }
        ]}
        style={styles.segmentedButtonsContainer}
      />
    </View>
  );
};

const MedicineTrackingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [unit, setUnit] = useState('oz');
  const [isLoading, setIsLoading] = useState(false);
  const [medicineData, setMedicineData] = useState({
    type: 'medicine',
    startTime: new Date().toISOString(),
    amount: 0,
    unit: 'oz',
    medicineType: 'null',
    note: ''
  });
  const [medicineTypes, setMedicineTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchMedicineTypes = async () => {
      const user = await fetchUserData();
      setMedicineTypes(
        user.medicines.map((object: { name: string }) => object.name) ?? []
      );
    };
    void fetchMedicineTypes();
  }, []);

  const updateMedicineData = (key: string, value: any) => {
    setMedicineData((prevState) => ({ ...prevState, [key]: value }));
  };

  const checkMedicine = async () => {
    const user = await fetchUserData();

    if (!medicineTypes.includes(medicineData.medicineType)) {
      void createMedicine(
        user.userId + '_' + user.medicines.length,
        medicineData.medicineType
      );
    }
  };

  const handleSave = async () => {
    try {
      const localMedicineEvent = localize(medicineData);
      void checkMedicine();
      await saveEvent(localMedicineEvent);
      addToSyncQueue({
        id: localMedicineEvent.eventId,
        operation: 'insert',
        data: localMedicineEvent,
        status: 'pending'
      });
      await syncData();
    } catch (error) {
      console.error('Error saving event', error);
    } finally {
      setIsLoading(true);
      setTimeout(() => {
        navigation.goBack();
      }, UPDATE_DELAY_MS);
    }
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
            updateMedicineData('startTime', value);
          }}
        />
        <Divider />
        <MedicineTypePicker
          onValueChange={(value) => {
            updateMedicineData('medicineType', value);
          }}
          medicines={medicineTypes}
        />
        <Divider />
        <View style={{ height: '15%' }}></View>
        <UnitPicker
          onValueChange={(value) => {
            updateMedicineData('unit', value);
            setUnit(value);
          }}
          unit={unit}
        />
        <View style={{ height: '15%' }}></View>
        <NumericInput
          onValueChange={(value) => {
            updateMedicineData('amount', value);
          }}
          unit={unit}
        />
        <Divider />
        <NotesTextInput
          style={{ alignSelf: 'center', marginVertical: 8 }}
          onValueChange={(value) => {
            updateMedicineData('note', value);
          }}
        />
      </ScrollView>
      <Button
        mode="contained"
        onPress={() => {
          handleSave().catch((error) => {
            console.error('Error saving medicine event:', error);
          });
        }}
        style={styles.saveButtonContainer}
        labelStyle={styles.saveButtonLabel}
        testID="back-button">
        Save
      </Button>
    </View>
  );
};
MedicineTrackingScreen.propTypes = {};

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
  medicineTypePickerContainer: {
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
    paddingVertical: 16,
    paddingHorizontal: '7%'
  },
  divider: {
    marginBottom: 0,
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

export default MedicineTrackingScreen;
