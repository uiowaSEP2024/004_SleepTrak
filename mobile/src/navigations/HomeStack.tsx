import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../screens/HomeScreen';
import SleepTimer from '../screens/SleepTimerScreen';
import LoginScreen from '../screens/AuthScreen';
import EditWindowScreen from '../screens/EditWindowScreen';

export interface RootStackParamList {
  Home: undefined;
  SleepTimerScreen: undefined;
  EditWindowScreen: { startTime: string; stopTime: string; isSleep: boolean };
  [key: string]:
    | undefined
    | { startTime: string; stopTime: string; isSleep: boolean };
}

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={Home}
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
        name="EditWindowScreen"
        component={EditWindowScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
