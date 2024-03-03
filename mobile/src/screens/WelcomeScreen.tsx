import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoginButton } from '../components/buttons/AuthButtons';
import { useNavigation } from '@react-navigation/native';
import { hasOnboarded, hasValidCredentials } from '../utils/auth';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../../common_styles/colors';
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
          navigation.navigate('Home');
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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <SvgUri
          style={styles.logo}
          uri={
            'https://camilasleep.com/wp-content/uploads/2021/05/Logo-Camila.svg'
          }
        />
      </View>
      <View style={styles.buttonContainer}>
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
    backgroundColor: colors.crimsonRed,
    height: '25%',
    width: '75%'
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 8,
    height: '35%'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 48,
    color: colors.crimsonRed,
    marginTop: '20%',
    marginBottom: '30%'
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    fill: 'white', // Throws a warning, because this is an SVG property, but it is ok.
    stroke: 'white'
  },
  LoginButton: {
    backgroundColor: colors.crimsonRed,
    fontSize: 24,
    color: 'white',
    width: '100%',
    flex: 2
  }
});

export default WelcomeScreen;
