import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { fetchOnboardingQuestionsForScreen } from '../utils/db';
import { colors } from '../../assets/colors';
import { Button, ProgressBar, RadioButton } from 'react-native-paper';

const TOTAL_SCREENS = 9;
const questionAnswers: Record<string, string> = {};

interface YesNoQuestionProps {
  description: string;
  questionId: number;
  onValueChange: (newValue: string) => void;
}

const YesNoQuestion: React.FC<YesNoQuestionProps> = ({
  description,
  questionId,
  onValueChange
}) => {
  const [value, setValue] = React.useState('');

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
    date: <Text> date question</Text>,
    number: (
      <TextInput
        style={styles.input}
        placeholder="Enter number"
        keyboardType="numeric"
        onChangeText={onChangeInput}
      />
    ),
    'yes-no': (
      <YesNoQuestion
        description={description}
        questionId={questionId}
        onValueChange={onChangeInput}
      />
    )
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
  const [onboardingScreen, setOnboardingScreen] = React.useState(
    <View>
      <Text>Loading...</Text>
    </View>
  );
  const [screenNumber, setScreenNumber] = React.useState(1);

  React.useEffect(() => {
    if (screenNumber > TOTAL_SCREENS) {
      console.log('done');
      console.log(questionAnswers);
      return;
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
