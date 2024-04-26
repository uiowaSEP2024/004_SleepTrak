import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Divider, Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import { colors } from '../../assets/colors';
import {
  fetchUserData,
  fetchOnboardingAnswers,
  fetchOnboardingQuestions,
  updateOnboardingAnswer
} from '../utils/db';

const HIDDEN_QUESTIONS = ['4', '9', '12', '1', '2', '3'];

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const Item = ({
  title,
  value,
  answerId,
  setAnswers
}: {
  title: string;
  value: string;
  answerId: string;
  setAnswers: (answerId: string, text: string) => void;
}) => {
  const [text, setText] = useState(value);

  const onChangeText = (text: string) => {
    setText(text);
    setAnswers(answerId, text);
  };

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{title}</Text>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        style={styles.itemValue}
      />
      <Text style={styles.editText}>Tap to edit</Text>
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<any>();
  const [onboardingAnswers, setOnboardingAnswers] = useState<any>();
  const [onboardingQuestions, setOnboardingQuestions] = useState<any>();
  const [currentBaby, setCurrentBaby] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const updateAnswers = (answerId: string, text: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [answerId]: text }));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const userData = await fetchUserData();

        if (userData.babies.length > 0) {
          setCurrentBaby(userData.babies[0].babyId);
        }
        setUser(userData);
      };
      const fetchQuestions = async () => {
        setOnboardingQuestions(await fetchOnboardingQuestions());
      };

      void fetchUser();
      void fetchQuestions();
    }, [])
  );

  useEffect(() => {
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

      setAnswers({});
    };

    void fetchAnswers();
  }, [currentBaby]);

  const onSave = () => {
    const updateAnswers = async () => {
      for (const [answerId, answer] of Object.entries(answers)) {
        await updateOnboardingAnswer(answer, answerId);
      }
      setAnswers({});
    };
    void updateAnswers();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Looking for data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{`${capitalize(user.first_name)} ${capitalize(
        user.last_name
      )}`}</Text>
      <View style={styles.row}>
        <Text style={pickerSelectStyles.inputIOS}>Current Baby:</Text>
        <RNPickerSelect
          value={currentBaby}
          onValueChange={(value) => {
            setCurrentBaby(value);
          }}
          items={user.babies.map((baby: any) => ({
            label: baby.name,
            value: baby.babyId
          }))}
          style={pickerSelectStyles}
        />
      </View>
      <Divider style={styles.divider} />
      <Text style={styles.sectionTitle}>Onboarding Questions</Text>
      <ScrollView contentInset={{ top: 0, bottom: 250, left: 0, right: 0 }}>
        {onboardingAnswers?.map((answer: any) => (
          <Item
            key={answer.questionId}
            answerId={answer.answerId}
            title={
              onboardingQuestions.find(
                (question: any) => question.questionId === answer.questionId
              )?.description || ''
            }
            value={answer.answer_text}
            setAnswers={updateAnswers}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={onSave}
        style={styles.editButton}>
        <Text style={styles.editButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
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
  itemTitle: { fontSize: 18, color: colors.crimsonRed },
  itemValue: {
    fontSize: 20,
    color: colors.textGray,
    backgroundColor: colors.veryLightPurple,
    borderRadius: 8,
    padding: 12,
    marginVertical: 4
  },
  editText: { fontSize: 12, color: colors.textGray, alignSelf: 'flex-end' },
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
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  divider: { marginVertical: 8 }
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
