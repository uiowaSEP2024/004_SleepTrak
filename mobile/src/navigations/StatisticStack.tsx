import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StatisticsScreen from '../screens/StatisticsScreen';
import StatisticScreen from '../screens/StatisticScreen';
import Header from '../components/misc/Header';
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
