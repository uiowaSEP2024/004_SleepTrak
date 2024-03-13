import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from '../screens/TestScreen';
import SleepTimer from '../screens/SleepTimerScreen';
import LoginScreen from '../screens/AuthScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import EditWindowScreen from '../screens/EditWindowScreen';
import FoodTrackingScreen from '../screens/FoodTrackingScreen';
import HomeScreen from '../screens/HomeScreen';

export interface RootStackParamList {
  Home: undefined;
  SleepTimerScreen: undefined;
  EditWindowScreen: { startTime: Date; stopTime: Date; isSleep: boolean };
  [key: string]:
    | { startTime: Date; stopTime: Date; isSleep: boolean }
    | undefined;
}

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={TestScreen}
      />
      <Stack.Screen
        name="Home_actual"
        component={HomeScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="SleepTimer"
        component={SleepTimer}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />
      <Stack.Screen
        name="EditWindowScreen"
        component={EditWindowScreen}
      />
      <Stack.Screen
        name="FoodTrackingScreen"
        component={FoodTrackingScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
