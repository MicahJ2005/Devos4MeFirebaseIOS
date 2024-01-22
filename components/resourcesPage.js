import React from 'react';
import { Linking, StyleSheet, View, Text, ScrollView, Pressable} from 'react-native';

const BibleGatewayURL = 'https://www.biblegateway.com/';
const TheGospelCoalitionURL = 'https://www.thegospelcoalition.org/';
const TheBibleProjectURL = 'https://bibleproject.com/';
const FocusOnTheFamilyURL = 'https://www.focusonthefamily.com/';
const findAChurchNearMe = `https://www.google.com/maps/search/churches+near+me/`;
const LigonierURL = `https://www.ligonier.org/`;


const ResourcesPage = () => {
    return(
        <ScrollView>  
            <View style={styles.item} >
                <Pressable  onPress={() => Linking.openURL(findAChurchNearMe)}>
                    <Text style={styles.itemText} >Find A Church</Text>
                </Pressable>
            </View>
            <View style={styles.item} >
                <Pressable  onPress={() => Linking.openURL(BibleGatewayURL)}>
                    <Text style={styles.itemText} >Read The Bible</Text>
                </Pressable>
            </View>
            <View style={styles.item} >
                <Pressable  onPress={() => Linking.openURL(TheGospelCoalitionURL)}>
                    <Text style={styles.itemText} >The Gospel Coalition</Text>
                </Pressable>
            </View>
            <View style={styles.item} >
                <Pressable  onPress={() => Linking.openURL(TheBibleProjectURL)}>
                    <Text style={styles.itemText} >Bible Project</Text>
                </Pressable>
            </View>
            <View style={styles.item} >
                <Pressable  onPress={() => Linking.openURL(LigonierURL)}>
                    <Text style={styles.itemText} >Ligonier Ministries</Text>
                </Pressable>
            </View>
            <View style={styles.item} >
                <Pressable  onPress={() => Linking.openURL(FocusOnTheFamilyURL)}>
                    <Text style={styles.itemText} >Focus On The Family</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    item: {
        ...Platform.select({
            ios: {
                padding: 15,
                borderRadius: 50,
                marginBottom: 10,
                marginTop: 10,
                marginRight: 30,
                marginLeft: 30,
                fontSize: 30,
                height: 80,
                zIndex:-1,
                textAlign: 'center',
                color: 'black',
                backgroundColor: '#113946',
                // elevation: 4,
                //   shadowColor: '#000',
                //   shadowOffset: {
                //     width: 2,
                //     height: 2,
                //   },
                //   shadowOpacity: 1,
                //   shadowRadius: 5,
            },
            android:{
                padding: 15,
                borderRadius: 50,
                marginBottom: 10,
                marginTop: 10,
                marginRight: 30,
                marginLeft: 30,
                fontSize: 30,
                height: 80,
                zIndex:-1,
                textAlign: 'center',
                color: 'black',
                backgroundColor: '#113946',
                elevation: 4,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 10,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 10,
            },
          }),
        
      },
      itemText:{
        color:'#BCA37F',
        fontSize:30,
        textAlign:'center',
        marginTop:3
      }
  });

export default ResourcesPage;