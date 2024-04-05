import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SvgUri } from 'react-native-svg';
import { colors } from '../../../assets/colors';
import { type NativeStackHeaderProps } from '@react-navigation/native-stack';

const BackButton: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
      />
    </TouchableOpacity>
  );
};
const HomeButton: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home')}>
      <Ionicons
        name="home"
        size={24}
        color="black"
      />
    </TouchableOpacity>
  );
};
const SettingsButton: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Home-test')}>
      <Ionicons
        name="settings"
        size={24}
        color="black"
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
  return (
    <View style={styles.headerContainer}>
      {back ? (
        <BackButton navigation={navigation} />
      ) : (
        <HomeButton navigation={navigation} />
      )}
      <SvgUri
        width="50%"
        height="50%"
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
    fill: colors.lightTan, // Throws a warning, because this is an SVG property, but it is ok.
    stroke: colors.lightTan
  }
});
export default Header;
