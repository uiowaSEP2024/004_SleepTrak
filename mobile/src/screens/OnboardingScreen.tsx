import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  TouchableWithoutFeedback,
  Keyboard
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
import { SvgUri } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
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
  initialValue?: string;
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
      style={{
        ...styles.answerInput,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
      }}>
      <Text style={{ color, fontWeight, fontSize: 20 }}>
        {value[0].toUpperCase() + value.slice(1)}
      </Text>
      <RadioButton
        value={value}
        status={isSelected ? 'checked' : 'unchecked'}
        color={color}
        disabled={true}
      />
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
    <View style={{ width: '100%' }}>
      <RadioButton.Group
        onValueChange={handleChange}
        value={value}>
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
    <TouchableOpacity
      style={{ ...styles.answerInput, flexDirection: 'row' }}
      onPress={showDatePicker}>
      <Text style={{ color: colors.crimsonRed }}>
        {date ? date.toDateString() : 'Press to select date'}
      </Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </TouchableOpacity>
  );
};

const TextInputQuestion: React.FC<{
  onValueChange: (newValue: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | undefined;
  initialValue?: string;
}> = ({
  onValueChange,
  placeholder,
  keyboardType = 'default',
  initialValue = ''
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <TextInput
      value={value}
      style={styles.answerInput}
      placeholder={placeholder}
      keyboardType={keyboardType}
      onChangeText={handleChange}
      testID="question-input"
    />
  );
};

const LargeTextInputQuestion: React.FC<{
  onValueChange: (newValue: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | undefined;
  initialValue?: string;
}> = ({
  onValueChange,
  placeholder,
  keyboardType = 'default',
  initialValue = ''
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  return (
    <TextInput
      value={value}
      style={{ ...styles.answerInput, height: 80 }}
      placeholder={placeholder}
      keyboardType={keyboardType}
      onChangeText={handleChange}
      multiline={true}
      testID="question-input"
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
    keyboardType: type === 'number' ? 'numeric' : undefined,
    initialValue: questionAnswers[questionId.toString()]
  };

  return (
    <View
      key={questionId.toString()}
      style={{ marginBottom: '10%', marginTop: '25%' }}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionNumberText}>
          {'Question ' + questionId}
        </Text>
        <Text style={styles.questionText}>{description}</Text>
      </View>
      <View style={styles.inputContainer}>
        {questionId >= 1 && questionId <= 4 && (
          <Text style={styles.requiredText}> *This field is required</Text>
        )}
        <QuestionComponent {...questionProps} />
      </View>
    </View>
  );
};

const onboardingScreenFactory = async (screenNumber: number) => {
  const screenQuestions = await fetchOnboardingQuestionsForScreen(screenNumber);

  const questionComponents = await Promise.all(
    (screenQuestions || []).map(({ description, type, questionId }: Question) =>
      questionFactory(description, type, questionId)
    )
  );

  return <View style={styles.topQuestionContainer}>{questionComponents}</View>;
};

const PageButtons: React.FC<{ screenNumber: number; setScreenNumber: any }> = ({
  screenNumber,
  setScreenNumber
}) => {
  return (
    screenNumber <= TOTAL_SCREENS && (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          position: 'absolute',
          bottom: '3%',
          left: 0,
          right: 0,
          justifyContent: 'space-between',
          paddingHorizontal: '30%'
        }}>
        <TouchableOpacity
          testID="back-button"
          disabled={screenNumber === 1}
          onPress={() => {
            setScreenNumber(screenNumber - 1);
          }}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={screenNumber === 1 ? 'gray' : 'black'}
          />
        </TouchableOpacity>
        <Text>
          {' '}
          {screenNumber} of {TOTAL_SCREENS}{' '}
        </Text>
        <TouchableOpacity
          testID="next-button"
          disabled={screenNumber === TOTAL_SCREENS}
          onPress={() => {
            const answer = questionAnswers[screenNumber.toString()];
            if (
              screenNumber >= 1 &&
              screenNumber <= 4 &&
              typeof answer === 'undefined'
            ) {
              Alert.alert('', 'This field is required');
            } else if (
              screenNumber === 9 &&
              answer &&
              answer.trim() !== '' &&
              !/^\d+$/.test(answer)
            ) {
              Alert.alert('', 'Enter a number');
            } else {
              setScreenNumber(screenNumber + 1);
            }
          }}>
          <Ionicons
            name="chevron-forward"
            size={32}
            color={screenNumber === TOTAL_SCREENS ? 'gray' : 'black'}
          />
        </TouchableOpacity>
      </View>
    )
  );
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
        }, 1000); // Delay for 1 second to allow database to update
      });
    }
    void onboardingScreenFetcher();
  }, [screenNumber, onboardingWrapUp, onboardingScreenFetcher, navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.topContainer}>
        <ProgressBar
          progress={(screenNumber - 1) / TOTAL_SCREENS}
          color={colors.crimsonRed}
          style={styles.progressBar}
          testID="progress-bar"
        />
        <SvgUri
          style={styles.logo}
          uri={
            'https://camilasleep.com/wp-content/uploads/2021/05/Logo-Camila.svg'
          }
        />
        {onboardingScreen}
        {screenNumber === TOTAL_SCREENS && (
          <Button
            testID="submit-button"
            onPress={() => {
              setScreenNumber(screenNumber + 1);
            }}
            style={styles.submitButton}>
            <Text style={{ color: 'white', fontSize: 20 }}> Submit </Text>
          </Button>
        )}
        <PageButtons
          screenNumber={screenNumber}
          setScreenNumber={setScreenNumber}
        />
      </View>
    </TouchableWithoutFeedback>
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
    backgroundColor: 'white',
    width: 'auto',
    padding: 8
  },
  questionText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',
    fontSize: 24
  },
  questionNumberText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textGray,
    fontSize: 12,
    marginBottom: 6
  },
  inputContainer: {
    alignSelf: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: '10%',
    width: '80%'
  },
  requiredText: {
    color: 'red',
    marginBottom: 5,
    marginLeft: 16
  },
  answerInput: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 32,
    padding: 24,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8
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
  nextText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  activityIndicator: {
    height: '100%',
    justifyContent: 'center'
  },
  logo: {
    marginTop: '20%',
    alignSelf: 'center',
    justifyContent: 'center',
    fill: colors.crimsonRed, // Throws a warning, because this is an SVG property, but it is ok.
    stroke: colors.crimsonRed
  },
  submitButton: {
    width: '40%',
    alignSelf: 'center',
    borderRadius: 32,
    padding: 8,
    backgroundColor: colors.crimsonRed
  }
});

export default OnboardingScreen;
