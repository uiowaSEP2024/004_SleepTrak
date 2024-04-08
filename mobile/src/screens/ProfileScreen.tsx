import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Divider } from '../components/misc/Divider';
import { colors } from '../../assets/colors';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserData } from '../utils/db';

const columnNames = {
  first_name: 'First Name',
  last_name: 'Last Name',
  email: 'Email',
  role: 'Role'
};

const Item = ({ title, value }: { title: string; value: string }) => {
  return (
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>{title}:</Text>
        <Text style={styles.itemValue}>{value}</Text>
      </View>
      <Divider />
    </View>
  );
};

const ProfileScreen: React.FC = () => {
  const [user, setUser] = React.useState<{
    userId: any;
    coachId: any;
    role: any;
    email: any;
    first_name: any;
    last_name: any;
    babies: any;
    events: any;
    medicines: any | undefined;
  }>();
  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const userData = await fetchUserData();
        console.log(Object.keys(userData));
        setUser(userData);
      };
      void fetchUser();
    }, [])
  );
  return user ? (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {Object.keys(user).map((key) => {
        if (
          user[key as keyof typeof user] === null ||
          key === 'userId' ||
          key === 'coachId' ||
          key === 'medicines' ||
          key === 'events' ||
          key === 'babies'
        ) {
          return <></>;
        } else if (key === 'first_name' || key === 'last_name') {
          return (
            <Item
              key={key}
              title={columnNames[key]}
              value={user[key][0].toUpperCase() + user[key].slice(1)}
            />
          );
        } else {
          return (
            <Item
              key={key}
              title={columnNames[key as keyof typeof columnNames]}
              value={user[key as keyof typeof user]}
            />
          );
        }
      })}
      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>No event found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '7%',
    paddingHorizontal: '7%',
    backgroundColor: 'white',
    height: '100%'
  },
  title: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 32,
    letterSpacing: 2,
    marginBottom: '10%'
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center'
  },
  itemTitle: {
    fontSize: 20,
    color: colors.crimsonRed
  },
  itemValue: {
    fontSize: 20,
    color: colors.textGray
  },
  editButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: '6%',
    backgroundColor: colors.crimsonRed,
    width: '70%',
    height: '7%',
    borderRadius: 32
  },
  editButtonText: {
    fontSize: 20,
    color: 'white',
    alignSelf: 'center',
    fontWeight: 'bold',
    letterSpacing: 2
  }
});

export default ProfileScreen;
