import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LoginButton } from '../components/buttons/AuthButtons';
import { useNavigation } from '@react-navigation/native';
import { hasOnboarded, hasValidCredentials } from '../utils/auth';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../assets/colors';
import { useAuth0 } from 'react-native-auth0';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuth0();

  useEffect(() => {
    // Redirects users to the appropriate screen
    const userRedirect = async () => {
      try {
        const onboarded = await hasOnboarded();

        if (onboarded) {
          navigation.navigate('BottomTabs');
        } else {
          navigation.navigate('Onboarding');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    // Checks if user is logged in and calls the userRedirect function if they are
    const checkCredentials = async () => {
      try {
        if (await hasValidCredentials()) {
          await userRedirect();
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    void checkCredentials();
  }, [user]);

  return (
    <View
      style={styles.container}
      testID="welcome-screen">
      <View style={styles.logoContainer}>
        <SvgUri
          style={styles.logo}
          uri={
            'https://camilasleep.com/wp-content/uploads/2021/05/Logo-Camila.svg'
          }
        />
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hello! </Text>
          <Text style={styles.title}>Please log in to begin</Text>
        </View>
        <LoginButton />
      </View>
    </View>
  );
};

WelcomeScreen.propTypes = {};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white'
  },
  logoContainer: {
    alignSelf: 'center',
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
    backgroundColor: 'white',
    height: '25%',
    width: '85%'
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    height: '35%'
  },
  title: {
    letterSpacing: 2,
    fontSize: 18,
    alignSelf: 'center'
  },
  titleContainer: {
    marginBottom: '25%',
    alignContent: 'center'
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    fill: colors.crimsonRed, // Throws a warning, because this is an SVG property, but it is ok.
    stroke: colors.crimsonRed
  }
});

export default WelcomeScreen;
