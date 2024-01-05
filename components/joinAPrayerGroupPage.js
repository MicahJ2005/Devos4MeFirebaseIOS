import React, {useState} from 'react';
import {View, Text, Modal,  TextInput,  StyleSheet, Pressable, Alert,FlatList,  SafeAreaView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {  collection,  getDocs, query, where,  addDoc,  } from "firebase/firestore";

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

const JoinPrayerGroup = (params) => {
  console.log('JoinPrayerGroup user: ', params)
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('');
    const [data, setData] = useState([]);
    const [showListText, setShowListText] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState([]);
    const [joinModalVisible, setJoinModalVisible] = useState(false);
    const [viewGroupTab, setViewGroupTab] = useState('Public');

    const searchGroups = async () => {
      console.log('IN searchGroups text:', text +' with user '+ params.runningUser.id)
        setData([]);
        setShowListText(false);
        searchTerm = text.toLowerCase();
        strlength = text.length;
        strFrontCode = text.slice(0, strlength-1);
        strEndCode = text.slice(strlength-1, text.length);
        // This is an important bit..
        endCode = strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);

        const q = query(collection(params.db, "prayergroups"), where("groupname", ">=", text), where("groupname", "<", endCode), where("status", "==", "active"), where("isprivategroup", "==", false));
        console.log('q check: ', q);
        const querySnapshot = await getDocs(q);
        console.log('querySnapshot check: ', querySnapshot.size);
        // let prayerGroupIds = [];
        let prayerGroups = [];
        if(querySnapshot.size > 0){
          ///Get Prayer Groups user is in///
          querySnapshot.forEach((doc) => {
            console.log('Prayer Groups Junction: ', doc.id, " => ", doc.data());
            prayerGroups.push(new prayerGroupWrapper(doc.id, doc.data()));
          })
          setData(prayerGroups);
          setShowListText(true);
        }
        else{
          Alert.alert('No groups found by this name');
        }
    }

    const searchPrivateGroups = async () => {
      setData([]);
      setShowListText(false);
      const q = query(collection(params.db, "prayergroups"), where("accesscode", "==", text), where("status", "==", "active"), where("isprivategroup", "==", true));
      console.log('q check: ', q);
      const querySnapshot = await getDocs(q);
      console.log('querySnapshot check: ', querySnapshot.size);
      // let prayerGroupIds = [];
      let prayerGroups = [];
      if(querySnapshot.size > 0){
        ///Get Prayer Groups user is in///
        querySnapshot.forEach((doc) => {
          console.log('Prayer Groups Junction: ', doc.id, " => ", doc.data());
          prayerGroups.push(new prayerGroupWrapper(doc.id, doc.data()));
        })
        setData(prayerGroups);
        setShowListText(true);
      }
      else{
        Alert.alert('No groups found with that access code');
      }
    }

    const showJoinModal = (group) => {
        console.log('showJoinModal ', group);
        setSelectedGroup(group)
        setJoinModalVisible(true);
    }

    const closeJoinModal = () => {
        console.log('closeJoinModal ', selectedGroup);
        setJoinModalVisible(false);
    }

    const joinGroup = async (group) => {
        console.log('joinGroup ', selectedGroup);
        console.log('joinGroup USER', params.runningUser.id);
        const docData2 = {
          groupid: selectedGroup.id,
          userid: params.runningUser.id,
        }
        const newJunctionRequest = await addDoc(collection(params.db, "groupstousersjunction"), docData2)
        console.log('newRequest: ', newJunctionRequest);
        console.log('new request', newJunctionRequest.id);
        if(newJunctionRequest.id != null){
          setData([]);
          setText('');
          setShowListText(false);
          Alert.alert('Joined New Prayer Group!');
          setJoinModalVisible(false);
        }
        else{
          Alert.alert('Issue in joining this group');
        }
    }

    const setPublicGroup = () => {
      console.log('PUBLIC click')
      setData([]);
      setShowListText(false);
      setViewGroupTab('Public');
    }
  
    const setPrivateGroup = () => {
      console.log('PRIVATE click')
      setData([]);
      setShowListText(false);
      setViewGroupTab('Private');
    }

    return(

        <View>
          {viewGroupTab !== "Public" ?
            <View style={styles.publicOrPrivateButtons}>
              <Pressable style={styles.publicButtonNotSelected} onPress={() => setPublicGroup()}>
                <Text style={{color: 'grey',fontSize:20}}>Public Groups</Text>
              </Pressable>
              <Pressable style={styles.privateButtonSelected} onPress={() => setPrivateGroup()}>
                <Text style={{color: '#C56E33', fontSize:20, fontWeight:'bold', marginRight:20}}>Private Groups</Text>
                <MaterialIcons name="check-circle-outline" size={25} color="green" />
              </Pressable>
            </View>
            :
            <View style={styles.publicOrPrivateButtons}>
              <Pressable style={styles.publicButtonSelected} onPress={() => setPublicGroup()}>
                <Text style={{color: '#C56E33',fontSize:20, fontWeight:'bold', marginRight:20}}>Public Groups</Text>
                <MaterialIcons name="check-circle-outline" size={25} color="green" />
              </Pressable>
              <Pressable style={styles.privateButtonNotSelected} onPress={() => setPrivateGroup()}>
                <Text style={{color: 'grey',fontSize:20}}>Private Groups</Text>
              </Pressable>
            </View>
          }
          {viewGroupTab === "Public" ? 
            <View>
              <Text style={styles.nameInputText3}>Search for a Public Prayer Group by Name</Text>
              <TextInput
                  style={{
                      borderColor: '#113946',
                      // borderWidth: 4,
                      // borderRadius: 30,
                      borderBottomWidth: 4,
                      width:'80%',
                      height: '23%',
                      // marginBottom: 40,
                      marginLeft:10
                  }}
                  textAlign='center'
                  onChangeText={newText => setText(newText)}
                  placeholder="Group Name (be specific)"
                  value={text}
              />
              <Pressable style={styles.circleSubmitNewRequest} onPress={() => searchGroups()}>
                  <MaterialIcons name="search" size={30} color="#EAD7BB" />
              </Pressable>
            </View>
             : 
             <View>
              <Text style={styles.nameInputText3}>Search for a Private Prayer Group by Group Id</Text>
              <TextInput
                  style={{
                      borderColor: '#113946',
                      // borderWidth: 4,
                      // borderRadius: 30,
                      borderBottomWidth: 4,
                      width:'80%',
                      height: '23%',
                      // marginBottom: 40,
                      marginLeft:10
                  }}
                  textAlign='center'
                  onChangeText={newText => setText(newText)}
                  placeholder="Group Access Code (Case Sensative)"
                  value={text}
              />
              <Pressable style={styles.circleSubmitNewRequest} onPress={() => searchPrivateGroups()}>
                  <MaterialIcons name="search" size={30} color="#EAD7BB" />
              </Pressable>
           </View>}  

            <SafeAreaView style={styles.flatListStyle}>
              {showListText ? 
                <Text style={styles.nameInputText4}>Click on a group to join</Text>
                :
                ''
              }
                
                <FlatList
                    data={data}
                    renderItem={({item}) => 
                    <Pressable style={[styles.buttonShowDetail]} onPress={() => showJoinModal(item)}>
                        <Text style={styles.item} key={item.id}>{item.groupname}</Text>
                    </Pressable>
                }
                />
            </SafeAreaView>

             {/* start new prayer group Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={joinModalVisible}
            onRequestClose={() => {
              setJoinModalVisible(!joinModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Pressable style={styles.circleButtonDetailCloseModal2} onPress={() => closeJoinModal()}>
                <MaterialIcons name="close" size={25} color="white" />
              </Pressable>
                <Text style={styles.nameInputText}>Join Prayer Group?</Text>
                <Text style={styles.nameInputText2}>{selectedGroup.groupname}</Text>
                  <Pressable style={styles.circleAddToGroup} onPress={() => joinGroup()} >
                    <MaterialIcons name="group-add" size={30} color="#EAD7BB" />
                  </Pressable>
              </View>
            </View>
          </Modal>
          {/* end new prayer group Modal */}
        </View>
        
    )
}

const styles = StyleSheet.create({
  item: {
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
    flatListStyle:{
      height:'55%',
      marginTop:-65
    },
    modalView: {
      margin: 20,
      backgroundColor: '#FFF2D8',
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
    circleButtonDetailCloseModal2: {
      width:40,
      height: 40,
      margin:10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 42,
      backgroundColor: '#fff',
      position: 'absolute',
      left:-20,
      top: -20,
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
    nameInputText:{
      textAlign: 'left',
      color: '#C56E33',
      fontSize: 25,
      margin:10,
    },
    nameInputText2:{
      color: '#113946',
      fontSize: 30,
      margin:20,
      fontStyle:'italic',
    },
    nameInputText3:{
      color: '#C56E33',
      fontSize: 15,
      margin:20,
    },
    nameInputText4:{
      color: '#C56E33',
      fontSize: 15,
      textAlign:'center'
    },
    circleSubmitNewRequest: {
      width:50,
      height: 50,
      margin:10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 42,
      backgroundColor: '#113946',
      position: 'absolute',
      right:5,
      top: 50,
      elevation: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    circleAddToGroup: {
      width:70,
      height: 70,
      margin:10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 42,
      backgroundColor: '#113946',
      // position: 'absolute',
      right:-140,
      bottom: -30,
      elevation: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    publicOrPrivateButtons:{
      display: 'inline',
      flexDirection: 'row',
      width:'100%',
    },
    publicButtonSelected:{
      display: 'inline',
      flexDirection: 'row',
      backgroundColor: '#113946',
      marginTop: 20,
      marginRight:0,
      padding: 15,
      borderColor:'#113946',
      borderWidth: 1,
      width:'50%',
      elevation: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    publicButtonNotSelected:{
      display: 'inline',
      flexDirection: 'row',
      backgroundColor: '#EAD7BB',
      marginTop: 20,
      marginRight:0,
      padding: 15,
      borderColor:'#113946',
      borderWidth: 1,
      width:'50%',
      fontSize:20,
      color:'grey'
    },
    privateButtonSelected:{
      display: 'inline',
      flexDirection: 'row',
      backgroundColor: '#113946',
      marginTop: 20,
      marginLeft:0,
      padding: 15,
      borderColor:'#113946',
      borderWidth: 1,
      color: '#C56E33',
      width:'50%',
      elevation: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 4,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    privateButtonNotSelected:{
      display: 'inline',
      flexDirection: 'row',
      backgroundColor: '#EAD7BB',
      marginTop: 20,
      marginLeft:0,
      padding: 15,
      borderColor:'#113946',
      borderWidth: 1,
      width:'50%',
      fontSize:20,
      color:'grey'
    }
})



export default JoinPrayerGroup;