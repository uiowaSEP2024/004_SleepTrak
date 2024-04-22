import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { colors } from '../../assets/colors';
import { useFocusEffect } from '@react-navigation/native';
import {
  fetchUserData,
  fetchOnboardingAnswers,
  fetchOnboardingQuestions,
  updateOnboardingAnswer
} from '../utils/db';
import RNPickerSelect from 'react-native-picker-select';

const ANSWERS: Record<string, string> = {};
const HIDDEN_QUESTIONS = ['4', '9', '12', '1', '2', '3'];

const capitalize = (s: string) => {
  return s.charAt(0).toLocaleUpperCase() + s.slice(1).toLocaleLowerCase();
};

const Item = ({
  title,
  value,
  answerId
}: {
  title: string;
  value: string;
  answerId: string;
}) => {
  const [text, setText] = React.useState(value);

  const onChangeText = (text: string) => {
    setText(text);
    ANSWERS[answerId] = text;
  };

  return (
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <TextInput
          value={text}
          onChangeText={onChangeText}
          style={styles.itemValue}
        />
        <Text
          style={{
            fontSize: 12,
            color: colors.textGray,
            alignSelf: 'flex-end'
          }}>
          Tap to edit
        </Text>
      </View>
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  const [user, setUser] = React.useState<{
    userId: any;
    coachId: any;
    role: any;
    email: any;
    first_name: any;
    last_name: any;
    babies: any;
    events: any;
    medicines: any | undefined;
  }>();
  const [onboardingAnswers, setOnboardingAnswers] = React.useState<any>();
  const [onboardingQuestions, setOnboardingQuestions] = React.useState<any>();
  const [currentBaby, setCurrentBaby] = React.useState<any>(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const userData = await fetchUserData();
        setCurrentBaby(userData.babies[0].babyId);
        setUser(userData);
      };
      const fetchQuestions = async () => {
        const onboardingQuestions = await fetchOnboardingQuestions();
        setOnboardingQuestions(onboardingQuestions);
      };

      void fetchUser();
      void fetchQuestions();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchAnswers = async () => {
        if (!currentBaby) return;

        let onboardingAnswers = await fetchOnboardingAnswers(currentBaby);
        onboardingAnswers = onboardingAnswers.filter(
          (answer: any) => !HIDDEN_QUESTIONS.includes(answer.questionId)
        );
        setOnboardingAnswers(
          onboardingAnswers.sort(
            (a: any, b: any) => parseInt(a.questionId) - parseInt(b.questionId)
          )
        );
      };

      void fetchAnswers();
    }, [currentBaby])
  );

  const onSave = () => {
    const updateAnswers = async () => {
      const tempAnswers = ANSWERS;
      console.log(tempAnswers);
      for (const [answerId, answer] of Object.entries(tempAnswers)) {
        console.log(answerId, answer);
        await updateOnboardingAnswer(answer, answerId);
        delete ANSWERS.answerId;
      }
    };
    void updateAnswers();
  };

  return user ? (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {' '}
        {capitalize(user.first_name)} {capitalize(user.last_name)}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text
          style={{ ...pickerSelectStyles.inputIOS, color: colors.textGray }}>
          Current Baby:
        </Text>
        <RNPickerSelect
          value={currentBaby}
          onValueChange={(value) => {
            setCurrentBaby(value);
          }}
          items={user.babies.map((baby: any) => {
            return {
              label: baby.name,
              value: baby.babyId
            };
          })}
          style={pickerSelectStyles}
        />
      </View>
      <Divider style={{ marginVertical: 8 }} />
      <Text style={styles.sectionTitle}>Onboarding Questions</Text>
      <ScrollView contentInset={{ top: 0, bottom: 250, left: 0, right: 0 }}>
        {onboardingAnswers
          ? onboardingAnswers.map((answer: any) => {
              return (
                <Item
                  key={answer.questionId}
                  answerId={answer.answerId}
                  title={
                    onboardingQuestions.find(
                      (question: any) =>
                        question.questionId === answer.questionId
                    )?.description || ''
                  }
                  value={answer.answer_text}
                />
              );
            })
          : null}
      </ScrollView>

      <TouchableOpacity
        onPress={onSave}
        style={styles.editButton}>
        <Text style={styles.editButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>Looking for data...</Text>
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
    marginBottom: '2%'
    // marginTop: '5%'
  },
  sectionTitle: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 24,
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
    fontSize: 18,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 10,
    color: colors.crimsonRed,
    fontWeight: '500'
  },
  inputAndroid: {
    fontSize: 18,
    paddingLeft: 10,
    paddingTop: 12,
    paddingBottom: 12,
    color: colors.crimsonRed,
    fontWeight: '500'
  }
});
export default ProfileScreen;
