import React, {useState, useEffect} from 'react';
import {View, Text, Modal, SafeAreaView, ScrollView,  StyleSheet, Pressable,FlatList, Platform} from 'react-native';
import { collection, getDocs, query, where,  orderBy } from "firebase/firestore";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

class prayerRequestDataWrapper {
  constructor (id, data) {
      this.id = id;
      this.answerednote = data.answerednote;
      this.createdat = data.createdat;
      this.details = data.details;
      this.name = data.name;
      this.status = data.status;
      this.submittedbyuserid = data.submittedbyuserid;
      this.timesprayed = data.timesprayed;
      this.updateat = data.updateat;
  }
}

const PrayerHistoryPage = (params) => {
    console.log('runningUser in newPrayerRequest:', params.runningUser);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [details, setDetails] = useState('');
    const [detailsDate, setDetailsDate] = useState('');

    useEffect(() => {
        loadData();
      }, []);
    
    const loadData = async () => {
    // fetch(`${BASE_URL_DEV}/data/prayerhistory?userId=${runningUser.runningUser[0].id}`)
    //     .then((resp) => resp.json())
    //     .then((json) => setData(json))
    //     .catch((error) => console.error(error))
    //     .finally(() => setLoading(false));
    //     console.log('PrayerHistoryPage data', data);
    const q = query(collection(params.db, "prayerrequests"), where("submittedbyuserid", "==", params.runningUser.id), where("status", "==", "Answered") , orderBy("name", "asc"));
          console.log('q check: ', q);
          const querySnapshot = await getDocs(q);
          console.log('querySnapshot check: ', querySnapshot);
          console.log('querySnapshot.size' , querySnapshot.size);
          let prayerRequestList = [];
          if(querySnapshot.size > 0){
            querySnapshot.forEach((doc) => {
              console.log('request doc: ', doc.id, " => ", doc.data());
              let prayerRequest = new prayerRequestDataWrapper(doc.id, doc.data());
              console.log('prayerRequest: ', prayerRequest);
              prayerRequestList.push(prayerRequest);
            });
            setData(prayerRequestList);
          }else{
            console.log('No Requests currently. Click "New Prayer Request" to add a request.');
          }
        
    }

    const showDetails = (item) => {
        console.log('showDetails item', item);
        setDetails(item);
        console.log('item updatedat.', item.updateat);
        // setTimesPrayed(item.timesprayed);
        setDetailsDate(item.updateat)
        setDetailsModalVisible(true)
      }

      const closeDetails = () => {
        console.log('closeDetails');
        // setDetails('');
        setDetailsModalVisible(false)
      }


    return(
        <View style={styles.answeredPrayerPageView}>
         {/* start prayer request details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => {
          setDetailsModalVisible(!detailsModalVisible);
        }}>
        <View style={styles.centeredViewRequestDetails}>
          
          <View style={styles.modalViewDetails}>
          <Pressable style={styles.circleButtonDetailCloseModal} onPress={() => closeDetails()}>
            <MaterialIcons name="close" size={25} color="white" />
          </Pressable>
            <Text style={[styles.requestNameText]}>
              {details.name}
            </Text>
            
            <SafeAreaView style={styles.safeAreaContainer}>
              <ScrollView style={styles.requestDetailsScrollView}>
              <Text style={[styles.prayingForText]}>Prayed for...</Text>
                <Text style={[styles.requestDetailsText]}>
                  {details.details}
                </Text>
                <Text style={[styles.requestAnsweredNoteText]}>Answered Note:</Text>
                <Text style={[styles.requestAnsweredNote]}>
                   {details.answerednote}
                </Text>
              </ScrollView>
            </SafeAreaView>
              <View style={[styles.prayerSummaryView]}>
                <Text style={[styles.requestDetailsText2]}>
                  You prayed for {details.name} {details.timesprayed} time(s) and God answered this prayer on {detailsDate}
                </Text>
              </View>
          </View>
        </View>
      </Modal>
      {/* end prayer request details Modal */}
      
      <Text style={styles.helpText}>click each prayer request to view details</Text>
      
      <FlatList
        style={styles.flatListStyle}
        data={data}
        renderItem={({item}) => 
          <Pressable style={[styles.buttonShowDetail]} 
                                  onPress={() => showDetails(item)}>
                <View>
                    <Text style={[styles.timesPrayedBubble]}>{item.timesprayed}
                    <View>
                      <Text style={[styles.timesPrayedBubbleText]}>Answered</Text>
                    </View>
                    </Text>
                </View>
                <Text style={styles.item} key={item.id}>{item.name}</Text>
          </Pressable>
        }
      />
        </View>
        
    );
};

const styles = StyleSheet.create({
    
    flatListStyle:{
      height:'75%'
    },
    timesPrayedBubbleText:{
      ...Platform.select({
        ios: {
          overflow:'hidden',
          fontSize: 12,
          color: '#C56E33',
          marginTop: 30,
          position: 'absolute',
          right:-15,
          zIndex:1,
        },
        android:{
          fontSize: 12,
          color: '#C56E33',
          marginTop: 10,
          position: 'absolute',
          right:-15,
          zIndex:1,
        }
      }),
      
    },
    timesPrayedBubble: {
      ...Platform.select({
        ios: {
          overflow:'hidden',
          backgroundColor: 'grey',
          fontSize: 20,
          width:80,
          height: 30,
          marginRight:10,
          marginBottom: -60,
          zIndex:1,
          left:'75%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
          textAlign:'center',
          // overflow:'hidden',
        },
        android:{
          backgroundColor: 'grey',
          fontSize: 20,
          width:80,
          height: 30,
          marginRight:10,
          marginBottom: -60,
          zIndex:1,
          left:'75%',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 60,
          textAlign:'center'
        }
      }),
      
    },
    safeAreaContainer:{
      height: 375,
    },
    prayingForText:{
      marginTop: 20,
      color: '#113946',
      fontSize:20,
      textAlign:'center'
    },
    requestAnsweredNoteText:{
      marginTop: 20,
      color: '#113946',
      fontSize:20,
      textAlign:'center'
    },
    requestNameText:{
      marginTop: 20,
      fontSize: 40,
      color: '#113946',
    },
    requestDetailsText:{
      textAlign:'center',
      fontSize: 30,
      color: '#C56E33',
    },
    requestAnsweredNote:{
      fontSize: 30,
      color: '#C56E33',
      marginTop: 30,
      textAlign:'center'
    },
    requestDetailsText2:{
      borderColor: '#113946',
      fontSize: 20,
      color: '#C56E33',
      fontStyle:'italic'
    },
    prayerSummaryView:{
      ...Platform.select({
        ios: {
          borderRadius:20,
          borderColor: '#113946',
          borderWidth: 4,
          color: '#C56E33',
          padding:20,
          width:'100%',
          position: 'absolute',
          bottom:30
        },
        android:{
          borderColor: '#113946',
          borderWidth: 4,
          color: '#C56E33',
          padding:20,
          width:'100%',
          position: 'absolute',
          bottom:30
        }
      }),
      
    },
    modalViewDetails: {
      ...Platform.select({
        ios: {
          margin: 0,
          marginTop:'10%',
          height:'90%',
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
          elevation: 5,
        },
        android:{
          margin: 0,
          height:'100%',
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
          elevation: 5,
        }
      }),
      
    },
    helpText:{
      textAlign: 'center',
      color: '#C56E33',
      fontStyle: 'italic',
    },
    item: {
      ...Platform.select({
        ios: {
          overflow:'hidden',
          padding: 15,
          borderRadius: 40,
          marginBottom: 10,
          marginTop: 10,
          marginRight: 30,
          marginLeft: 30,
          fontSize: 30,
          height: 80,
          zIndex:-1,
          textAlign: 'center',
          color: '#BCA37F',
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
          color: '#BCA37F',
          backgroundColor: '#113946',
          elevation: 4,
            shadowColor: '#000',
            shadowOffset: {
              width: 10,
              height: 2,
            },
          shadowOpacity: 1,
          shadowRadius: 10,
        }
      }),
    },
    circleButtonDetailCloseModal: {
      width:40,
      height: 40,
      margin:10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 42,
      backgroundColor: '#fff',
      position: 'absolute',
      left:10,
      top: 10,
      backgroundColor:'grey',
      color: 'white',
      elevation: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
});

export default PrayerHistoryPage;