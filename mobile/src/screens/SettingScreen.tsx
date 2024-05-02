import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { colors } from '../../assets/colors';
import { LogoutButton } from '../components/buttons/AuthButtons';
import { useNavigation } from '@react-navigation/native';
import { fetchUserData } from '../utils/db';

function Setting() {
  const navigation = useNavigation();
  const [baby, setBaby] = useState(null);

  useEffect(() => {
    const fetchBabyId = async () => {
      const user = await fetchUserData();
      setBaby(user.babies[0]);
    };
    void fetchBabyId();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView>
        {baby && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FilesScreen', { babyId: baby.babyId });
            }}
            style={styles.optionContainer}>
            <Text style={styles.optionTitle}>View Documents</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <LogoutButton style={styles.logoutButton} />
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
  },
  logoutButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '6%',
    backgroundColor: colors.crimsonRed,
    width: '70%',
    height: '7%',
    fontSize: 20,
    color: 'white',
    borderRadius: 32
  },
  optionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 8,
    paddingVertical: 8,
    borderTopColor: colors.textGray,
    borderTopWidth: 0.25,
    borderBottomColor: colors.textGray,
    borderBottomWidth: 0.25
  },
  optionTitle: {
    marginLeft: 8,
    fontSize: 18,
    color: colors.textGray
  }
});

export default Setting;
