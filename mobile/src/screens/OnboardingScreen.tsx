import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {
  createBaby,
  createOnboardingAnswers,
  createUser,
  fetchOnboardingQuestionsForScreen
} from '../utils/db';
import { colors } from '../../assets/colors';
import {
  ActivityIndicator,
  Button,
  ProgressBar,
  RadioButton
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

const TOTAL_SCREENS: number = 13;
const questionAnswers: Record<string, string> = {};

type Question = {
  description: string;
  type: string;
  questionId: number;
};

type QuestionProps = {
  placeholder?: string;
  keyboardType?: string;
  onValueChange: (input: string) => void;
};

const RadioButtonOption: React.FC<{
  value: string;
  selectedValue: string;
  onValueChange: (newValue: string) => void;
}> = ({ value, selectedValue, onValueChange }) => {
  const isSelected = value === selectedValue;
  const color = isSelected ? colors.crimsonRed : 'lightgrey';
  const fontWeight = isSelected ? 'bold' : 'normal';

  return (
    <TouchableOpacity
      onPress={() => {
        onValueChange(value);
      }}
      style={styles.optionContainer}>
      <RadioButton
        value={value}
        status={isSelected ? 'checked' : 'unchecked'}
        color={color}
        disabled={true}
      />
      <Text style={{ color, fontWeight, fontSize: 20 }}>{value}</Text>
    </TouchableOpacity>
  );
};
const YesNoQuestion: React.FC<{
  onValueChange: (newValue: string) => void;
}> = ({ onValueChange }) => {
  const [value, setValue] = useState('no');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <View style={styles.inputContainer}>
      <RadioButton.Group
        onValueChange={handleChange}
        value={value}>
        <View style={styles.groupContainer}>
          <RadioButtonOption
            value="yes"
            selectedValue={value}
            onValueChange={handleChange}
          />
          <RadioButtonOption
            value="no"
            selectedValue={value}
            onValueChange={handleChange}
          />
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
    <View style={{ ...styles.inputContainer, flexDirection: 'row' }}>
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
const TextInputQuestion: React.FC<{
  onValueChange: (newValue: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | undefined;
}> = ({ onValueChange, placeholder, keyboardType = 'default' }) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      keyboardType={keyboardType}
      onChangeText={handleChange}
    />
  );
};

const LargeTextInputQuestion: React.FC<{
  onValueChange: (newValue: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | undefined;
}> = ({ onValueChange, placeholder, keyboardType = 'default' }) => {
  const handleChange = (newValue: string) => {
    onValueChange(newValue);
  };

  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      keyboardType={keyboardType}
      onChangeText={handleChange}
      multiline={true}
    />
  );
};

const questionComponents: Record<string, React.FC<QuestionProps>> = {
  'large-text': LargeTextInputQuestion as React.FC<QuestionProps>,
  'small-text': TextInputQuestion as React.FC<QuestionProps>,
  date: DateQuestion,
  number: TextInputQuestion as React.FC<QuestionProps>,
  'yes-no': YesNoQuestion
};

const questionFactory = (
  description: string,
  type: string,
  questionId: number
) => {
  const onChangeInput = (inputString: string) => {
    questionAnswers[questionId.toString()] = inputString;
  };

  const QuestionComponent = questionComponents[type];

  const questionProps: QuestionProps = {
    onValueChange: onChangeInput,
    placeholder: type === 'number' ? 'Enter number' : 'Enter text',
    keyboardType: type === 'number' ? 'numeric' : undefined
  };

  return (
    <View
      key={questionId.toString()}
      style={{ marginBottom: '10%' }}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{description}</Text>
      </View>
      <View style={styles.inputContainer}>
        <QuestionComponent {...questionProps} />
      </View>
    </View>
  );
};

const onboardingScreenFactory = async (screenNumber: number) => {
  const screenQuestions = await fetchOnboardingQuestionsForScreen(screenNumber);

  const questionComponents = await Promise.all(
    screenQuestions.map(({ description, type, questionId }: Question) =>
      questionFactory(description, type, questionId)
    )
  );

  return <View style={styles.topQuestionContainer}>{questionComponents}</View>;
};

const OnboardingScreen: React.FC = () => {
  const [screenNumber, setScreenNumber] = useState(1);
  const [onboardingScreen, setOnboardingScreen] =
    useState<React.ReactNode | null>(null);
  const navigation = useNavigation();

  const onboardingScreenFetcher = useCallback(async () => {
    if (screenNumber > TOTAL_SCREENS) {
      setOnboardingScreen(
        <View style={styles.activityIndicator}>
          <ActivityIndicator
            animating={true}
            color={colors.crimsonRed}
            testID="activity-indicator"
          />
        </View>
      );
    } else {
      const screen = await onboardingScreenFactory(screenNumber);
      setOnboardingScreen(screen);
    }
  }, [screenNumber]);

  const onboardingWrapUp = useCallback(async () => {
    const userFirstName = questionAnswers['1'];
    const userLastName = questionAnswers['2'];
    const userBabyName = questionAnswers['3'];
    const userBabyDOB = questionAnswers['4'];

    await createUser(userFirstName, userLastName, 'client');
    const babyId = await createBaby(userBabyName, userBabyDOB);
    await createOnboardingAnswers(questionAnswers, babyId ?? '');
  }, []);

  useEffect(() => {
    if (screenNumber > TOTAL_SCREENS) {
      void onboardingWrapUp().then(() => {
        setTimeout(() => {
          navigation.navigate('BottomTabs');
        }, 2000); // Delay for 2 seconds to allow database to update
      });
    }
    void onboardingScreenFetcher();
  }, [screenNumber, onboardingWrapUp, onboardingScreenFetcher, navigation]);

  return (
    <View style={styles.topContainer}>
      <ProgressBar
        progress={(screenNumber - 1) / TOTAL_SCREENS}
        color={colors.crimsonRed}
        style={styles.progressBar}
        testID="progress-bar"
      />
      {onboardingScreen}
      {screenNumber <= TOTAL_SCREENS && (
        <Button
          style={styles.nextButton}
          disabled={false}
          onPress={() => {
            setScreenNumber(screenNumber + 1);
          }}>
          <Text style={styles.nextText}>Next</Text>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'white'
  },
  questionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.crimsonRed,
    width: 'auto',
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
    width: 'auto',
    marginHorizontal: 8,
    alignContent: 'center',
    alignItems: 'stretch'
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
  },
  activityIndicator: {
    height: '100%',
    justifyContent: 'center'
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '85%',
    marginTop: '10%'
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default OnboardingScreen;
