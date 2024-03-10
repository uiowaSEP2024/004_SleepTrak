import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { fetchOnboardingQuestionsForScreen } from '../utils/db';
import { colors } from '../../assets/colors';
import { Button, ProgressBar, RadioButton } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const TOTAL_SCREENS: number = 9;
const questionAnswers: Record<string, string> = {};

const YesNoQuestion: React.FC<{
  onValueChange: (newValue: string) => void;
}> = ({ onValueChange }) => {
  const [value, setValue] = useState('');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <View style={styles.inputContainer}>
      <RadioButton.Group
        onValueChange={handleChange}
        value={value}>
        <View>
          <Text>Yes</Text>
          <RadioButton value="yes" />
        </View>
        <View>
          <Text>No</Text>
          <RadioButton value="no" />
        </View>
      </RadioButton.Group>
    </View>
  );
};

const DateQuestion: React.FC<{
  onValueChange: (newValue: any) => void;
}> = ({ onValueChange }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: any) => {
    setDate(selectedDate);
    selectedDate.setHours(0, 0, 0, 0);
    onValueChange(selectedDate.toISOString());
    hideDatePicker();
  };

  return (
    <View style={styles.inputContainer}>
      <Button onPress={showDatePicker}>
        <Text>{date ? date.toDateString() : 'Press to select date'}</Text>
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const questionFactory = (
  description: string,
  type: string,
  questionId: number
) => {
  const onChangeInput = (inputString: string) => {
    questionAnswers[questionId.toString()] = inputString;
  };

  const questionTypeToComponentMap: Record<string, React.ReactNode> = {
    'large-text': (
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        onChangeText={onChangeInput}
      />
    ),
    'small-text': (
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        onChangeText={onChangeInput}
      />
    ),
    date: <DateQuestion onValueChange={onChangeInput} />,
    number: (
      <TextInput
        style={styles.input}
        placeholder="Enter number"
        keyboardType="numeric"
        onChangeText={onChangeInput}
      />
    ),
    'yes-no': <YesNoQuestion onValueChange={onChangeInput} />
  };

  return (
    <View
      key={questionId.toString()}
      style={{ marginBottom: 16 }}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{description}</Text>
      </View>
      <View style={styles.inputContainer}>
        {questionTypeToComponentMap[type]}
      </View>
    </View>
  );
};

const onboardingScreenFactory = async (screenNumber: number) => {
  const screenQuestions = await fetchOnboardingQuestionsForScreen(screenNumber);
  const questionComponents = await Promise.all(
    screenQuestions.map(
      async (question: {
        description: string;
        type: string;
        questionId: number;
      }) =>
        questionFactory(
          question.description,
          question.type,
          question.questionId
        )
    )
  );
  return <View style={styles.topQuestionContainer}>{questionComponents}</View>;
};

const OnboardingScreen: React.FC = () => {
  const [onboardingScreen, setOnboardingScreen] = useState(
    <View>
      <Text>Loading...</Text>
    </View>
  );
  const [screenNumber, setScreenNumber] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    if (screenNumber > TOTAL_SCREENS) {
      navigation.navigate('Home');
    }

    const onboardingScreenFetcher = async () => {
      const screen = await onboardingScreenFactory(screenNumber);
      setOnboardingScreen(screen);
    };
    void onboardingScreenFetcher();
    console.log(questionAnswers);
  }, [screenNumber]);

  return (
    <View style={styles.topContainer}>
      <ProgressBar
        progress={(screenNumber - 1) / TOTAL_SCREENS}
        color={colors.crimsonRed}
        style={styles.progressBar}
      />
      {onboardingScreen}
      <Button
        style={styles.nextButton}
        disabled={false}
        onPress={() => {
          setScreenNumber(screenNumber + 1);
        }}>
        <Text style={styles.nextText}>Next</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  questionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimsonRed,
    width: '90%',
    padding: 8
  },
  questionText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 20
  },
  inputContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  input: {
    marginTop: 8,
    fontSize: 16
  },
  topQuestionContainer: {
    marginBottom: '5%',
    width: '100%',
    marginHorizontal: 8
  },
  progressBar: {
    width: '100%',
    height: 10,
    marginBottom: 8
  },
  nextButton: {
    width: '90%',
    backgroundColor: colors.crimsonRed,
    marginTop: 8,
    color: 'white',
    alignSelf: 'center',
    position: 'absolute',
    bottom: '3%',
    padding: 8
  },
  nextText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default OnboardingScreen;
