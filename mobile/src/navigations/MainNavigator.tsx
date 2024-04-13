import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import { colors } from '../../assets/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TestScreen from '../screens/TestScreen';
import StatisticStack from './StatisticStack';
import EventsScreen from '../screens/EventsScreen';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.tan,
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: colors.crimsonRed,
          height: 60
        }
      }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={36}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="calendar-outline"
              size={36}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={36}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen
        name="Chat"
        component={TestScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="chat-outline"
              size={36}
              color={color}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
