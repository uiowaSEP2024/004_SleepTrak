import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StatisticsScreen from '../screens/StatisticsScreen';
import StatisticScreen from '../screens/StatisticScreen';
import Header from '../components/misc/Header';
import type { RemoteEvent } from '../utils/interfaces';

export interface StatisticStackParamList {
  StatisticsScreen: undefined;
  StatisticScreen: { eventType: string; events: RemoteEvent[] };
  [key: string]: undefined | { eventType: string; events: RemoteEvent[] };
}

const Stack = createNativeStackNavigator();

const StatisticStack = () => (
  <Stack.Navigator
    initialRouteName="StatisticsScreen"
    screenOptions={{
      headerShown: true,
      header: (props) => <Header {...props} />
    }}>
    <Stack.Screen
      name="StatisticsScreen"
      component={StatisticsScreen}
    />
    <Stack.Screen
      name="StatisticScreen"
      component={StatisticScreen}
    />
  </Stack.Navigator>
);

export default StatisticStack;
