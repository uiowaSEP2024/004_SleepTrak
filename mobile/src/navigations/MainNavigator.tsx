import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import { colors } from '../../assets/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ChatScreen from '../screens/ChatScreen';
import EventsScreen from '../screens/EventsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

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
        name="HomeStack"
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
        component={StatisticsScreen}
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
        component={ChatScreen}
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
