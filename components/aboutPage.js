import React, {useState} from 'react';
import {View, Text,  ScrollView,  StyleSheet, Modal, Pressable, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AboutPage = (devoTypeselected) => {
    console.log(devoTypeselected)
    return(
      <ScrollView style={styles.scrollView}>
        <View style={styles.homeContentView}>
            <Text >
              <Text style={styles.homeText}>
                And this is eternal life, that they know You, the only true God, and Jesus Christ whom you have sent. John 17:3
              </Text>
              {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
              <Text style={styles.homeText2}>
                  Devos4Me is designed with you in mind. God desires you to know Him personally. May each day's devotional be a time where God meets you where you are, as you walk this life together
              </Text>
              {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
              <Text style={styles.homeText2}>
                  Devos4Me offers Daily Personal and Family Devotional options based on a topic you select. 
              </Text>
              {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
              <Text style={styles.homeText2}>
                  Additionally, Devos4Me offers a robust prayer request platform where you can manage your own Prayer List, Start a public or private Prayer Group, and join another public or private Prayer Group.
              </Text>
              {'\n'}
              {'\n'}
              {'\n'}
              {'\n'}
              <Text style={styles.homeText2}>
                  Our prayer is that this tool helps you grow in your walk with Christ as you enjoy daily devotions and praying for others.  
              </Text>
            </Text>
          </View>
          
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#BCA37F',
    marginBottom:60
  },
  homeContentView: {
    fontSize:25,
    fontStyle:'italic',
    color: '#113946',
    margin: 5,
    marginTop: 25,
    borderStyle: 'solid',
    borderColor: '#113946',
    borderWidth:4,
    backgroundColor: '#BCA37F',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
  },
  homeText: {
    fontSize:17,
    fontStyle:'italic',
    color: '#C56E33',
    margin: 20,
    backgroundColor: '#BCA37F',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  },
  homeText2: {
    fontSize:17,
    fontStyle:'italic',
    color: '#113946',
    margin: 20,
    backgroundColor: '#BCA37F',
    borderRadius: 20,
    padding: 35,
    marginTop: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
  }
});

export default AboutPage;