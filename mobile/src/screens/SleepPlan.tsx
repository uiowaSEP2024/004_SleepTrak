import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../assets/colors';
import { fetchPlan } from '../utils/db';

function getTimeStringFromDate(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function SleepPlanScreen() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const fetchPlanObject = async () => {
      const plan = await fetchPlan();

      if (plan) {
        setReminders(plan.reminders);
      }
    };

    void fetchPlanObject();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Plan</Text>
      <Text style={{ marginBottom: 16 }}>
        {' '}
        This is your current sleep plan:{' '}
      </Text>
      <ScrollView>
        {reminders && reminders.length > 0 ? (
          reminders.map((reminder: object) => {
            return (
              <View
                key={reminder.reminderId}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 16,
                  margin: 8,
                  backgroundColor: colors.lightPurple
                }}>
                <Text style={{ fontSize: 16, color: colors.textGray }}>
                  {reminder.description}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>
                  {getTimeStringFromDate(new Date(reminder.startTime))}
                </Text>
              </View>
            );
          })
        ) : (
          <Text> No events found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingHorizontal: '7%',
    paddingVertical: '2%'
  },
  title: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 32,
    letterSpacing: 2,
    marginBottom: '5%'
  }
});
export default SleepPlanScreen;
