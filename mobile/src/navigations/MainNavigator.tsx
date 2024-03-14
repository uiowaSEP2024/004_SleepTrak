import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from '../screens/SettingScreen';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home_test"
        component={HomeStack}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
      />
    </Tab.Navigator>
  );
}

export default BottomTabs;
