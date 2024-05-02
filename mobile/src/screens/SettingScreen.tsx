import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Linking
} from 'react-native';
import { colors } from '../../assets/colors';
import { LogoutButton } from '../components/buttons/AuthButtons';
import { useNavigation } from '@react-navigation/native';
import { fetchUserData } from '../utils/db';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const OptionButton = ({
  name,
  screenName,
  args,
  iconName
}: {
  name: string;
  screenName: string;
  args: object | undefined;
  iconName: string | undefined;
}) => {
  const navigation = useNavigation();

  return (
    <TouchableHighlight
      underlayColor="#DDDDDD"
      style={styles.optionContainer}
      onPress={() => {
        navigation.navigate(screenName, args);
      }}>
      <>
        {iconName && (
          <MaterialCommunityIcons
            name={'file-document-outline'}
            size={24}
            color={colors.crimsonRed}
            style={{ marginRight: 10 }}
          />
        )}

        <Text style={styles.optionTitle}>{name}</Text>
      </>
    </TouchableHighlight>
  );
};

const LinkButton = ({
  name,
  onPress
}: {
  name: string;
  onPress: () => void;
}) => {
  return (
    <TouchableHighlight
      underlayColor="#DDDDDD"
      style={styles.optionContainer}
      onPress={onPress}>
      <>
        <MaterialCommunityIcons
          name={'link'}
          size={24}
          color={colors.crimsonRed}
          style={{ marginRight: 10 }}
        />
        <Text style={styles.optionTitle}>{name}</Text>
      </>
    </TouchableHighlight>
  );
};

function Setting() {
  const [baby, setBaby] = useState(null);

  useEffect(() => {
    const fetchBabyId = async () => {
      const user = await fetchUserData();
      setBaby(user.babies[0]);
    };
    void fetchBabyId();
  }, []);

  const handleOpenURL = async () => {
    const url =
      'https://team4wiki.notion.site/User-Manual-for-Mobile-434e715c87bb4194b10d0fd9d812a47d?pvs=74';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Cannot open URL:', url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <ScrollView>
        {baby && (
          <OptionButton
            name="View Documents"
            screenName="FilesScreen"
            args={{ babyId: baby.babyId }}
            iconName="file-document-outline"></OptionButton>
        )}
        <LinkButton
          name="User Manual"
          onPress={() => {
            void handleOpenURL();
          }}></LinkButton>
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 2,
    padding: 8,
    borderRadius: 8
  },
  optionTitle: {
    fontSize: 20,
    color: colors.crimsonRed
  }
});

export default Setting;
