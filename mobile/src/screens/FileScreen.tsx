import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { colors } from '../../assets/colors';
import Pdf from 'react-native-pdf';

const FileScreen: React.FC = ({ route, _navigation }) => {
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
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: '5%'
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});

export default FileScreen;
