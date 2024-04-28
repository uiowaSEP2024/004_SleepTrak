import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { colors } from '../../assets/colors';
import Pdf from 'react-native-pdf';

const FilesScreen: React.FC = ({ route, _navigation }) => {
  const { name, fileUrl } = route.params;
  const source = { uri: fileUrl, cache: true };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: '7%',
    paddingHorizontal: '7%',
    backgroundColor: 'white',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  title: {
    color: colors.textGray,
    alignSelf: 'flex-start',
    fontSize: 32,
    letterSpacing: 2,
    marginBottom: '5%'
  },
  itemContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    alignSelf: 'center',
    marginVertical: 8
  },
  fileTitle: {
    fontSize: 18,
    color: colors.crimsonRed
  },
  itemValue: {
    fontSize: 20,
    color: colors.textGray,
    backgroundColor: colors.veryLightPurple,
    borderRadius: 8,
    padding: 12,
    marginVertical: 4
  },
  tapToEdit: {
    fontSize: 12,
    color: colors.textGray,
    alignSelf: 'flex-end'
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
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});

export default FilesScreen;
