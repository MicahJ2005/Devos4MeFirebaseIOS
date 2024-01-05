import React, {useState, useEffect} from 'react';
import {View, Text, Modal, SafeAreaView, ScrollView,  StyleSheet, Pressable, Alert,FlatList} from 'react-native';
import { collection,  getDocs, query, where, orderBy, documentId } from "firebase/firestore";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';

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

class prayerGroupWrapper {
  constructor (id, data) {
      this.id = id;
      this.accesscode = data.accesscode;
      this.groupname = data.groupname;
      this.isprivategroup = data.isprivategroup;
      this.createdbyid = data.createdbyid;
      this.status = data.status;
  }
}

const GroupPrayerHistoryPage = (params) => {
    console.log('runningUser in GroupPrayerHistoryPage:', params.runningUser);
    const [data, setData] = useState([]);
    const [page, setPage] = useState('prayergroups');
    const [loading, setLoading] = useState(true);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [details, setDetails] = useState('');
    const [detailsDate, setDetailsDate] = useState('');
    const [groupData, setGroupData] = useState('');
    const [groupId, setGroupId] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupCreatedBy, setGroupCreatedBy] = useState('');
    const [groupIsPrivate, setGroupIsPrivate] = useState(false);

    useEffect(() => {
        loadData();
      }, []);
    
    const loadData = async () => {
      console.log('params.runningUser.id: ',params.runningUser.id)
      const q = query(collection(params.db, "groupstousersjunction"), where("userid", "==", params.runningUser.id));
      console.log('q check: ', q);
      const querySnapshot = await getDocs(q);
      console.log('querySnapshot check: ', querySnapshot.size);
      let prayerGroupIds = [];
      let requestIds = [];
      if(querySnapshot.size > 0){
        ///Get Prayer Groups user is in///
        querySnapshot.forEach((doc) => {
          console.log('Prayer Groups Junction: ', doc.id, " => ", doc.data());
          prayerGroupIds.push(doc.data().groupid);
          console.log('prayerGroupIds: ', prayerGroupIds);  
          // const q = query(collection(params.db, "prayerrequests"), where("submittedbyuserid", "==", params.runningUser.id), where("status", "==", "Answered") , orderBy("name", "asc"));
          // console.log('q check: ', q);
          // const querySnapshot = await getDocs(q);
          // console.log('querySnapshot check: ', querySnapshot);
          // console.log('querySnapshot.size' , querySnapshot.size);
          // let prayerRequestList = [];
          // if(querySnapshot.size > 0){
          //   querySnapshot.forEach((doc) => {
          //     console.log('request doc: ', doc.id, " => ", doc.data());
          //     let prayerRequest = new prayerRequestDataWrapper(doc.id, doc.data());
          //     console.log('prayerRequest: ', prayerRequest);
          //     prayerRequestList.push(prayerRequest);
          //   });
          //   setData(prayerRequestList);
          // }else{
          //   console.log('No Requests currently. Click "New Prayer Request" to add a request.');
          // }
        })
      }
      if(prayerGroupIds.length > 0){
        let q3 = {};
        const q2 = query(collection(params.db, "prayergroups"), where(documentId(), "in", prayerGroupIds), where("status", "==", "active") , orderBy("__name__", "asc"));
        console.log('q check: ', q2); 
        const querySnapshot2 = await getDocs(q2);
        console.log('querySnapshot check: ', querySnapshot2);
        console.log('querySnapshot.size' , querySnapshot2.size);
        let prayerGroups = []; 
        if(querySnapshot2.size > 0){
          querySnapshot2.forEach((doc3) => {
            console.log('request doc3: ', doc3.id, " => ", doc3.data()); 
            prayerGroups.push(new prayerGroupWrapper(doc3.id, doc3.data()))
          })
        }
        setGroupData(prayerGroups);
        console.log('prayerGroups',prayerGroups)
      }
        //     q3 = query(collection(params.db, "groupprayerrequests"), where("groupid", "==", doc3.id), where("status", "==", "Answered") , orderBy("name", "asc"));
        //     console.log('q3 check: ', q3);
        //     const queryRequestSnapshot = getDocs(q3);
        //     console.log('queryRequestSnapshot check: ', queryRequestSnapshot);
        //     console.log('queryRequestSnapshot.size' , queryRequestSnapshot.size);
        //     // let prayerRequestList = [];
        //     // if(queryRequestSnapshot.size > 0){
        //     //   queryRequestSnapshot.forEach((doc4) => {
        //     //     console.log('request doc: ', doc4.id, " => ", doc4.data());
        //     //     let prayerRequest = new prayerRequestDataWrapper(doc4.id, doc4.data(), doc3.data());
        //     //     console.log('prayerRequest: ', prayerRequest);
        //     //     prayerRequestList.push(prayerRequest);
        //     //   });
        //     //   setData(prayerRequestList);
        //     // }else{
        //     //   console.log('No Requests currently. Click "New Prayer Request" to add a request.');
        //     // }
        //     // let prayerRequest = new groupPrayerRequestDataWrapper(doc2.id, doc2.data(), doc2.data());
        //     // console.log('prayerRequest: ', prayerRequest); 
        //     // prayerRequestList.push(prayerRequest);
        //   });
          // setData(prayerRequestList);
        // }else{
        //   console.log('No Requests currently. Click "New Prayer Request" to add a request.');
      //     }
      //   }
      // }
      // else{
      //   Alert.alert('No prayer group history')
      // }
      
    // fetch(`${BASE_URL_DEV}/data/groupPrayerhistory?userId=${runningUser.runningUser[0].id}`)
    //     .then((resp) => resp.json())
    //     .then((json) => setData(json))
    //     .catch((error) => console.error(error))
    //     .finally(() => setLoading(false));
    //     console.log('PrayerHistoryPage data', data);
    // console.log('params.runningUser.id: ',params.runningUser.id)
    // const q = query(collection(params.db, "groupprayerrequests"), where("submittedbyuserid", "==", params.runningUser.id), where("status", "==", "Answered") , orderBy("name", "asc"));
    // console.log('q check: ', q);
    // const querySnapshot = await getDocs(q);
    // console.log('querySnapshot check: ', querySnapshot);
    // console.log('querySnapshot.size' , querySnapshot.size);
    // let prayerRequestList = [];
    // if(querySnapshot.size > 0){
    //   querySnapshot.forEach((doc) => {
    //     console.log('request doc: ', doc.id, " => ", doc.data());
    //     let prayerRequest = new prayerRequestDataWrapper(doc.id, doc.data());
    //     console.log('prayerRequest: ', prayerRequest);
    //     prayerRequestList.push(prayerRequest);
    //   });
    //   setData(prayerRequestList);
    // }else{
    //   console.log('No Requests currently. Click "New Prayer Request" to add a request.');
        // }
    }

    const returnToGroups = () => {
      setPage('groupList');
    }

    const showGroupPrayerList = async (group) => {
      console.log('showGroupPrayerList groupId', group);
      setGroupId(group.id);
      setGroupName(group.groupname);
      setGroupCreatedBy(group.createdbyid)
      const q = query(collection(params.db, "groupprayerrequests"), where("groupid", "==", group.id), where("status", "==", "Answered"));
      console.log('q check: ', q);
      const querySnapshot = await getDocs(q);
      console.log('querySnapshot check: ', querySnapshot.size);
      // let prayerGroupIds = [];
      let prayerList = [];
      if(querySnapshot.size > 0){
        ///Get Prayer Groups user is in///
        querySnapshot.forEach((doc) => {
          console.log('Prayer Groups Junction: ', doc.id, " => ", doc.data());
          prayerList.push(new prayerRequestDataWrapper(doc.id, doc.data()));
        })
        setData(prayerList);
        setPage('prayerList');
      }
      else{
        setData(prayerList);
        // setPage('groupRequests');
        Alert.alert('No answered prayer requests in this group')
      }
      
    }

    const showDetails = (item) => {
        console.log('showDetails item', item);
        setDetails(item);
        console.log('item updatedat.', item.updatedat);
        // setTimesPrayed(item.timesprayed);
        setDetailsDate(item.updatedat)
        setDetailsModalVisible(true)
      }

      const closeDetails = () => {
        console.log('closeDetails');
        // setDetails('');
        setDetailsModalVisible(false)
      }


    return(
        <View>
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
          {/* <Pressable style={styles.circleButtonDetailEditModal} onPress={() => openEditDetail(details)}>
            <MaterialIcons name="edit" size={25} color="black" />
          </Pressable> */}
          <Pressable style={styles.circleButtonDetailCloseModal} onPress={() => closeDetails()}>
            <MaterialIcons name="close" size={25} color="white" />
          </Pressable>
          {/* <Pressable style={styles.circleButtonDetailDeleteModal} onPress={() => deleteFunction(details)}>
            <MaterialIcons name="delete" size={25} color="white" />
          </Pressable> */}
            <Text style={[styles.requestNameText]}>
              {details.nama}
            </Text>
            {/* <Text style={[styles.requestGroupText]}>
              Prayer Group: {details.groupname}
            </Text> */}
            {/* <Text style={[styles.prayingForText]}>Prayed for...</Text> */}
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

            {/* <Text style={[styles.prayingForText2]}></Text> */}
            {/* <SafeAreaView style={styles.safeAreaContainer2}> */}
              {/* <ScrollView style={styles.requestDetailsScrollView2}> */}
              <View style={[styles.prayerSummaryView]}>
                <Text style={[styles.requestDetailsText2]}>
                  You prayed for {details.name} {details.timesprayed} time(s) and God answered this prayer on {detailsDate}
                </Text>
              </View>
                
              {/* </ScrollView>
            </SafeAreaView> */}
            {/* <View style={styles.detailButtonGroup}> */}
              
              {/* <Pressable
                style={[styles.answeredPrayer]}
                onPress={() => answeredPrayer()}>
                <MaterialCommunityIcons name="human-handsup" size={30} color="#BCA37F" />
                <Text style={styles.textStylePrayerRequest}>Answered</Text>
              </Pressable> */}

            {/* <Pressable
                style={[styles.prayedCircleButton]}
                onPress={() => incermentTimesPrayed()}>
                
                <FontAwesome5 name="pray" size={34} color="#BCA37F" />
                <Text style={styles.textStylePrayed}>Prayed</Text>
              </Pressable> */}
          </View>
        </View>
      </Modal>
      {/* end prayer request details Modal */}

      {page == 'prayerList' ? 
      <View>
        <Pressable onPress={() => returnToGroups()}>
            <Text style={styles.backburger}>
                <Ionicons name="md-return-up-back" size={50} color="#BCA37F" />
            </Text>
            <Text style={styles.groupText}>
                
                <Text>
                    Group: {groupName} 
                </Text>
                
            </Text>
            
          </Pressable>
        <Text style={styles.helpText}>click each prayer request to view details</Text>
      
        <FlatList
          style={styles.flatlistStyle}
          data={data}
          renderItem={({item}) => 
            <Pressable style={[styles.buttonShowDetail]} 
                                    onPress={() => showDetails(item)}>
              {/* <View style={[styles.nameView]}> */}
                  <View>
                      <Text style={[styles.timesPrayedBubble]}>{item.timesprayed}
                      <View>
                        <Text style={[styles.timesPrayedBubbleText]}>Answered</Text>
                      </View>
                      </Text>
                      
                  </View>
                  
                  
                  <Text style={styles.item} key={item.id}>{item.name}
      
                  </Text>
                  {/* <Text style={styles.groupItem}>Group: {groupName}</Text> */}
                  
                  
              {/* </View> */}
              
            </Pressable>
          }
        />
        </View>
      : 
          <View>
            <Text style={styles.helpText}>select group to view group prayer request details</Text>
          <SafeAreaView style={styles.flatListStyle}>
            <FlatList
              data={groupData}
              renderItem={({item}) => 
                <Pressable style={[styles.buttonShowDetail]} onPress={() => showGroupPrayerList(item)}>
                  {/* <Pressable style={styles.circleButtonRemoveFromGroup} onPress={() => askToRemoveGroup(item)}>
                    <MaterialIcons name="close" size={25} color="white" />
                  </Pressable> */}
                    <Text style={styles.item} key={item.id}>{item.groupname}
                    </Text>
                    {item.isprivategroup ? 
                      <Text style={styles.accessCode}>Access Code: {item.accesscode}</Text>
                      :
                      ''
                    }
                    {item.isprivategroup ? 
                      <View style={styles.lockIcon}>
                        <MaterialIcons name="lock" size={25} color="#C56E33" />
                        
                      </View>
                      
                    :
                    ''}
                  
                </Pressable>
              }
            />
          </SafeAreaView>
          </View>
      }
      
      
        </View>
        
    );
};

const styles = StyleSheet.create({
  buttonShowDetail: {
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
        color: '#BCA37F',
        backgroundColor: '#113946',
        elevation: 4,
          shadowColor: '#000',
          shadowOffset: {
            width: 2,
            height: 2,
          },
        shadowOpacity: 1,
        shadowRadius: 5,
      },
      android:{
      }
    }),
    
  },
  item: {
    ...Platform.select({
      ios: {
        textAlign: 'center',
        color: '#BCA37F',
        backgroundColor: '#113946',
        fontSize: 30,
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
      },
    })
  },
  flatListStyle:{
    height: '80%',
  },
  timesPrayedBubbleText:{
    ...Platform.select({
    ios: {
      fontSize: 12,
      color: '#C56E33',
      marginTop: 15,
      position: 'absolute',
      right:-10,
      zIndex:1,
    },
    android:{
      
      fontSize: 12,
      color: '#C56E33',
      marginTop: 15,
      position: 'absolute',
      right:-10,
      zIndex:1,
    },
  }),
  },
  timesPrayedBubble: {
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
  },
  prayingForText:{
    marginTop: 20,
    color: '#113946',
    fontSize:20,
  },
  requestAnsweredNoteText:{
    marginTop: 20,
    color: '#113946',
    fontSize:20,
    textAlign:'center'
  },
  requestAnsweredNote:{
    fontSize: 30,
    color: '#C56E33',
    marginTop: 30,
    textAlign:'center'
  },
  requestDetailsText:{
    fontSize: 30,
    color: '#C56E33',
  },
  requestDetailsText2:{
    borderColor: '#113946',
    fontSize: 20,
    color: '#C56E33',
    fontStyle:'italic'
  },
  prayerSummaryView:{
      borderColor: '#113946',
      borderWidth: 4,
      color: '#C56E33',
      padding:20,
      width:'100%',
      position: 'absolute',
      bottom:30
  },
  modalViewDetails: {
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
  },
  helpText:{
    textAlign: 'center',
    color: '#C56E33',
    fontStyle: 'italic',
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
  flatListStyle:{
    height:'85%'
  },
  safeAreaContainer:{
    height: 360,
  },
  requestNameText:{
    justifyContent:'center',
    textAlign:'center',
    marginTop: 20,
    fontSize: 40,
    color: '#C56E33',
  },
  backburger:{
    position:'absolute',
    left:20,
    top:5,
  },
  groupText:{
    color: '#C56E33',
    fontStyle: 'italic',
    fontSize:20,
    padding: 15,
    borderRadius: 50,
    marginRight: 10,
    marginLeft: 10,
    height: 60,
    zIndex:-1,
    textAlign: 'center',
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
  lockIcon:{
    ...Platform.select({
      ios: {
        color:"#BCA37F",
        // marginLeft:55,
        position: 'absolute',
        right:0,
        top: 5,
      },
      android:{
        color:"#BCA37F",
        // marginLeft:55,
        position: 'absolute',
        right:30,
        top: 5,
      },
    })
    
  },
  accessCode:{
    ...Platform.select({
      ios: {
        color:"#C56E33",
        // position: 'absolute',
        bottom: 0,
        textAlign:'center',
        alignContent:'center'
      },
      android:{
        color:"#C56E33",
        // position: 'absolute',
        bottom: 35,
        textAlign:'center',
        alignContent:'center'
      },
    })
    
  },
});

export default GroupPrayerHistoryPage;