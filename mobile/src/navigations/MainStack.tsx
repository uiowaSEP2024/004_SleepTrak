import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import BottomTabs from './MainNavigator';
import OnboardingScreen from '../screens/OnboardingScreen';

export interface RootStackParamList {
  Home: undefined;
  SleepTimerScreen: undefined;
  EditWindowScreen: {
    id: string;
    startTime: Date;
    stopTime: Date;
    isSleep: boolean;
    onWindowEdit: (window: {
      id: string;
      startTime: Date;
      stopTime: Date;
      isSleep: boolean;
      note: string;
    }) => void;
    onWindowDelete: (id: string) => void;
  };
  [key: string]:
    | {
        id: string;
        startTime: Date;
        stopTime: Date;
        isSleep: boolean;
        onWindowEdit: (window: {
          id: string;
          startTime: Date;
          stopTime: Date;
          isSleep: boolean;
          note: string;
        }) => void;
        onWindowDelete: (id: string) => void;
      }
    | undefined;
}

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs} // Add the BottomTabs component as a screen
        options={{ headerShown: false }} // Hide the header for the BottomTabs screen
      />
    </Stack.Navigator>
  );
};

export default MainStack;
