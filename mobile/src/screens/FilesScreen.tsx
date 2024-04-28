import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text
} from 'react-native';
import { colors } from '../../assets/colors';
import { fetchFiles } from '../utils/db';
import { useFocusEffect } from '@react-navigation/native';

const FileButton = ({ name, fileUrl }: { name: string; fileUrl: string }) => {
  //   const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // navigation.navigate('FileScreen', { name, fileUrl });
      }}>
      <Text style={styles.fileTitle}>{name}</Text>
    </TouchableOpacity>
  );
};

const FilesScreen: React.FC = ({ route, _navigation }) => {
  const { babyId } = route.params;
  const [files, setFiles] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFilesAsync = async () => {
        const files = await fetchFiles(babyId);
        if (files.length > 0) {
          setFiles(files);
        }
      };
      void fetchFilesAsync();
    }, [])
  );

  return babyId ? (
    <View style={styles.container}>
      <Text style={styles.title}>Files</Text>
      <ScrollView contentInset={{ top: 0, left: 0, bottom: 200, right: 0 }}>
        {files.map(
          (file: { fileId: string; filename: string; url: string }) => {
            return (
              <FileButton
                key={file.fileId}
                name={file.filename}
                fileUrl={file.url}
              />
            );
          }
        )}
      </ScrollView>
    </View>
  ) : (
    <View style={styles.container}>
      <Text style={styles.title}>No files found</Text>
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
  }
});

export default FilesScreen;
