import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../../assets/colors';
import { type NativeStackHeaderProps } from '@react-navigation/native-stack';

const BackButton: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableOpacity
      testID="back-button"
      onPress={() => navigation.goBack()}>
      <Ionicons
        name="arrow-back"
        size={32}
        color="grey"
      />
    </TouchableOpacity>
  );
};
const ProfileButton: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableOpacity
      testID="profile-button"
      onPress={() => navigation.navigate('Profile')}>
      <MaterialCommunityIcons
        name="account-outline"
        size={32}
        color="grey"
      />
    </TouchableOpacity>
  );
};
const SettingsButton: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableOpacity
      testID="settings-button"
      onPress={() => navigation.navigate('Setting')}>
      <Ionicons
        name="settings-outline"
        size={32}
        color="grey"
      />
    </TouchableOpacity>
  );
};

const Header: React.FC<NativeStackHeaderProps> = ({
  navigation,
  route,
  options,
  back
}) => {
  const routeName = route.name;
  return (
    <View
      testID="header-container"
      style={styles.headerContainer}>
      {back && routeName !== 'Home' && routeName !== 'StatisticsScreen' ? (
        <BackButton navigation={navigation} />
      ) : (
        <ProfileButton navigation={navigation} />
      )}
      <SvgUri
        width="70%"
        height="70%"
        style={styles.logo}
        uri={
          'https://camilasleep.com/wp-content/uploads/2021/05/Group-194-1.svg'
        }
      />
      <SettingsButton navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: '3%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3',
    flex: 0
  },
  logo: {
    alignSelf: 'center',
    justifyContent: 'center',
    fill: colors.tan, // Throws a warning, because this is an SVG property, but it is ok.
    stroke: colors.tan
  }
});

export default Header;
