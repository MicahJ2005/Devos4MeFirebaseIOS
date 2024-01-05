import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const FlatListBasics = (newdata) => {
  console.log('newRequest data PrayerList Component: ', newdata);

  return (
    <View style={styles.container}>

      <Text style={{fontSize: 30}}>Prayer List:</Text>
      <FlatList
        data={newdata.newdata}
          renderItem={({item}) => <Text style={styles.item} key={item.id}>{item.name} 
        </Text>
        }
      />
    </View>
  );
};

export default FlatListBasics;