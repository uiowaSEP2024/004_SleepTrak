import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from '../screens/TestScreen';
import SleepTimer from '../screens/SleepTimerScreen';
import LoginScreen from '../screens/AuthScreen';
import EditWindowScreen from '../screens/EditWindowScreen';
import FoodTrackingScreen from '../screens/FoodTrackingScreen';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import EventScreen from '../screens/EventScreen';
import MedicineTrackingScreen from '../screens/MedicineTrackingScreen';
import Header from '../components/misc/Header';
import SettingScreen from '../screens/SettingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SleepPlanScreen from '../screens/SleepPlan';
import StatisticsScreen from '../screens/StatisticsScreen';
import ManualSleepTrackingScreen from '../screens/ManualSleepTrackingScreen';

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

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: true,
        header: Header
      }}>
      <Stack.Screen
        name="Home_test"
        component={TestScreen}
      />
      <Stack.Screen
        name="Home"
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
        name="EditWindowScreen"
        component={EditWindowScreen}
      />
      <Stack.Screen
        name="FoodTrackingScreen"
        component={FoodTrackingScreen}
      />
      <Stack.Screen
        name="Events"
        component={EventsScreen}
      />
      <Stack.Screen
        name="MedicineTrackingScreen"
        component={MedicineTrackingScreen}
      />
      <Stack.Screen
        name="EventScreen"
        component={EventScreen}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="SleepPlan"
        component={SleepPlanScreen}
      />
      <Stack.Screen
        name="ManualSleepTracking"
        component={ManualSleepTrackingScreen}
      />
      <Stack.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
