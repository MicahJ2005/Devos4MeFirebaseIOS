import React, {useState, useEffect} from 'react';
import {View, Text, Modal, SafeAreaView, ScrollView, TextInput, StyleSheet, Pressable, Alert,FlatList, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { collection, doc,  getDocs, query, where,  addDoc, updateDoc,  documentId, deleteDoc } from "firebase/firestore";

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
      this.groupid = data.groupid;
  }
}


const prayerGroups = (params) => {
  console.log('runningUser in prayerGroups:', params.runningUser);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteGroupModalVisible, setDeleteGroupModalVisible] = useState(false);
  const [deletePrayerRequestModalVisible, setDeletePrayerRequestModalVisible] = useState(false);
  const [text, setText] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [count, setCount] = useState(-1);
  const [data, setData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [details, setDetails] = useState('');
  const [showEditButton, setShowEditButton] = useState(false);
  const [id, setId] = useState('');
  const [timesPrayed, setTimesPrayed] = useState('');
  const [answeredPrayerInputModalOpen, setAnsweredPrayerInputModalOpen] = useState(false);
  const [answeredPrayerText, setAnsweredPrayerText] = useState('');
  const [page, setPage] = useState('');
  const [groupId, setGroupId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupCreatedBy, setGroupCreatedBy] = useState('');
  const [groupIsPrivate, setGroupIsPrivate] = useState(false);
  const [newPrayerGroupModalVisible, setNewPrayerGroupModalVisible] = useState(false);
  const [removeFromGroupModalVisible, setRemoveFromGroupModalVisible] = useState(false);
  
  

  useEffect(() => {
    loadData();
    setPage('groupList');
  }, []);

  const loadData = async () => {
    console.log('IN loadData prayerGroups');
    console.log('IN loadData runningUser.runningUser[0].id', params.runningUser.id);
    const q = query(collection(params.db, "groupstousersjunction"), where("userid", "==", params.runningUser.id));
    console.log('q check: ', q);
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot check: ', querySnapshot.size);
    let prayerGroupIds = [];
    let prayerGroups = [];
    if(querySnapshot.size > 0){
      ///Get Prayer Groups user is in///
      querySnapshot.forEach((doc) => {
        console.log('Prayer Groups Junction: ', doc.id, " => ", doc.data());
        prayerGroupIds.push(doc.data().groupid);
        console.log('prayerGroupIds: ', prayerGroupIds);
      })
      ///Get Prayer Groups details, based on joined user///
      const q2 = query(collection(params.db, "prayergroups"), where(documentId(), "in", prayerGroupIds), where("status", "==", "active"));
      console.log('q2 check: ', q2);
      const queryGroupSnapshot = await getDocs(q2);
      console.log('queryGroupSnapshot check: ', queryGroupSnapshot.size);
      if(queryGroupSnapshot.size > 0){
        // let prayerGroupIds = [];
        queryGroupSnapshot.forEach((doc2) => {
          console.log('Prayer Groups HERE: ', doc2.id, " => ", doc2.data());
          prayerGroups.push(new prayerGroupWrapper(doc2.id, doc2.data()))
        });
      }
      setData(prayerGroups);
    }
    else{
      console.log('Issue getting prayer groups')
      Alert.alert('Issue getting prayer groups')
    }
  }

  const addNewPrayerRequest = () => {
    console.log('in addNewPrayerRequest');
    setDetails('');
    setText('');
    setShowEditButton(false);
    setDetailsModalVisible(false);
    setModalVisible(true);
  }

  const addNewPrayerGroup = () => {
    console.log('in addNewPrayerGroup');
    console.log('in addNewPrayerGroup as user: ', params.runningUser.id);
    setNewPrayerGroupModalVisible(true);
    setGroupIsPrivate(false);
  }


  const addName = async () => {
    if(details != '' && text != '' ){
      let newDate = new Date();
      console.log('Day', newDate.getDate());
      console.log('Month', newDate.getMonth());
      console.log('Year', newDate.getFullYear());
      let thisMonth = newDate.getMonth() + 1;
      let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
      const docData = {
        answerednote: '',
        createdat: reformattedDate,
        details: details,
        name: text,
        status: 'Praying',
        submittedbyuserid: params.runningUser.id,
        timesprayed: 0,
        groupid: groupId,
        updateat: reformattedDate
      }
      console.log('docData ', docData)
      const newRequest = await addDoc(collection(params.db, "groupprayerrequests"), docData)
      console.log('newRequest: ', newRequest);
      console.log('new request', newRequest.id);
        if(newRequest.id != null){
          Alert.alert('Let\'s Pray!');
          refreshGroupPrayerList(groupId)
          setModalVisible(false);
        }  
      }
      else{
        console.log('All field are required!');
        Alert.alert('All field are required!');
      }  
  }

  const openDeleteRequestModal = (item) => {
    console.log('openDeleteRequestModal item', item);
    if(Platform.OS == 'ios'){
      setDetailsModalVisible(false);
    }
    setDeletePrayerRequestModalVisible(true);
  }

  const closeDeleteRequestModal = () => {
    setDeletePrayerRequestModalVisible(false);
  }

  const deleteFunction = async () => {
    console.log('deleteFunction details id', details);
    console.log('deleteFunction groupId', groupId);
    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
    const docData = {
      status: 'Inactive',
      updateat: reformattedDate
    };
    const prayerRequestDeactivateRecord = await updateDoc(doc(params.db, "groupprayerrequests", details.id), docData, { merge: true })
    console.log('prayerRequestDeactivateRecord: ', prayerRequestDeactivateRecord);
    
    Alert.alert('Prayer Request Removed');
    setDeletePrayerRequestModalVisible(false);
    refreshGroupPrayerList(details.groupid)
    setDetailsModalVisible(false);

    // refreshGroupPrayerList(groupId);
    
    // setModalVisible(false);
  }

  const openEditDetail = (details) => {
    console.log('openEditDetail: ', details);
    setId(details.id);
    setDetails(details.details);
    setText(details.name);
    setGroupId(details.groupid);
    setTimesPrayed(details.timesprayed);
    setShowEditButton(true);
    setDetailsModalVisible(false);
    setModalVisible(true);
  }

  const editDetails = async () => {
    console.log('editDetails Id', id);
    console.log('editDetails details', details);
    console.log('editDetails text', text);
    console.log('editDetails groupId', groupId);
    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
    const docData = {
      name: text,
      details: details,
      updateat: reformattedDate
    };
    const prayerRequestUpdateRecord = await updateDoc(doc(params.db, "groupprayerrequests", id), docData, { merge: true })
    console.log('prayerRequestUpdateRecord: ', prayerRequestUpdateRecord);
        
    refreshGroupPrayerList(groupId);
    Alert.alert('Prayer Request Updated!');
    setModalVisible(false);
  }

  incermentTimesPrayed = async () => {
    console.log('details timesprayed', details.timesprayed);
    console.log('incermentTimesPrayed id', details.id);
    console.log('timesPrayed ', timesPrayed);
    let tempTimes = parseInt(timesPrayed);
    console.log('tempTimes ', tempTimes);
    let newtimesPrayed = tempTimes+1;
    setTimesPrayed(newtimesPrayed);
    console.log('newtimesPrayed ', newtimesPrayed);
    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
    const docData = {
      timesprayed: newtimesPrayed,
      updateat: reformattedDate
    };
    const prayerRequestUpdateRecord = await updateDoc(doc(params.db, "groupprayerrequests", details.id), docData, { merge: true })
    console.log('prayerRequestUpdateRecord: ', prayerRequestUpdateRecord);
    
    details.timesprayed = newtimesPrayed;
    setDetails(details);
    loadData();
    
    Alert.alert('Thank you for Praying!');
    setModalVisible(false);
    setDetailsModalVisible(false)
  }

  const showGroupPrayerList = async (group) => {
    console.log('showGroupPrayerList groupId', group);
    setGroupId(group.id);
    setGroupName(group.groupname);
    setGroupCreatedBy(group.createdbyid)
    const q = query(collection(params.db, "groupprayerrequests"), where("groupid", "==", group.id), where("status", "==", "Praying"));
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
      setRequestData(prayerList);
      setPage('groupRequests');
    }
    else{
      setRequestData(prayerList);
      setPage('groupRequests');
      Alert.alert('Be the first one to share a request with the group!')
    }
    
  }

  const refreshGroupPrayerList = async (groupid) => {
    console.log('showGroupPrayerList groupId', groupid);
    const q = query(collection(params.db, "groupprayerrequests"), where("groupid", "==", groupid), where("status", "==", "Praying"));
    console.log('q check: ', q);
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot check: ', querySnapshot.size);
    let prayerList = [];
    if(querySnapshot.size > 0){
      querySnapshot.forEach((doc) => {
        console.log('Prayer Groups Junction: ', doc.id, " => ", doc.data());
        prayerList.push(new prayerRequestDataWrapper(doc.id, doc.data()));
      })
      setRequestData(prayerList);
      setPage('groupRequests');
    }
    else{
      setRequestData(prayerList);
      setPage('groupRequests');
      Alert.alert('Be the first one to share a request with the group!')
    }
  }

  const showDetails = (item) => {
    console.log('showDetails item', item);
    setDetails(item);
    setTimesPrayed(item.timesprayed);
    setDetailsModalVisible(true)
  }

  const closeDetails = () => {
    console.log('closeDetails');
    setDetails('');
    setDetailsModalVisible(false)
  }

  const answeredPrayer = () => {
    console.log('answeredPrayer', details);
    setDetails(details);
    console.log(Platform.OS);
    if(Platform.OS == 'ios'){
      setDetailsModalVisible(false)
    }
    setAnsweredPrayerInputModalOpen(true);
  }

  const closeNewRequest = () => {
    setModalVisible(false);
  }

  const closeAnsweredPrayer = () => {
    setAnsweredPrayerInputModalOpen(false)
  }

  const updateAnsweredPrayer = async () => {
    console.log('updateAnsweredPrayer details', details);
    console.log('updateAnsweredPrayer answeredPrayerText', answeredPrayerText);
    console.log('updateAnsweredPrayer details', details);
    console.log('updateAnsweredPrayer answeredPrayerText', answeredPrayerText);

    console.log('incermentTimesPrayed id', details.id);
    console.log('timesPrayed ', timesPrayed);
    console.log('timesPrayed HERE',);
    let tempTimes = parseInt(timesPrayed);
    console.log('tempTimes ', tempTimes);
    let newtimesPrayed = tempTimes+1;
    console.log('newtimesPrayed ', newtimesPrayed);
    console.log('editDetails Id', id);
    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
    const docData = {
      status: 'Answered',
      answerednote: answeredPrayerText,
      updateat: reformattedDate
    };
    const prayerRequestUpdateRecord = await updateDoc(doc(params.db, "groupprayerrequests", details.id), docData, { merge: true })
    console.log('prayerRequestUpdateRecord: ', prayerRequestUpdateRecord);

    setModalVisible(false);
    setDetailsModalVisible(false);
    setAnsweredPrayerInputModalOpen(false);
    setDetails('');
    loadData();
    refreshGroupPrayerList(details.groupid);
    Alert.alert('Praise the Lord!');
  }

  const deleteGroup = (group) => {
    console.log('In GROUP DELETE', group);
    console.log('In GROUP DELETE', groupId);
    setDeleteGroupModalVisible(true);
  }

  const closeDeleteModal = () => {
    setDeleteGroupModalVisible(false);
  }

  const closeNewGroupRequest = () => {
    setNewPrayerGroupModalVisible(false);
  }

  const addGroup = async () => {
    console.log('In addGroup text', text);
    console.log('In addGroup user', params.runningUser.id);
    console.log('In addGroup groupIsPrivate', groupIsPrivate);
    if(text != null){
      let newDate = new Date();
      console.log('Day', newDate.getDate());
      console.log('Month', newDate.getMonth());
      console.log('Year', newDate.getFullYear());
      let thisMonth = newDate.getMonth() + 1;
      let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
      let docData ='';
      if(groupIsPrivate != true){
        docData = {
          groupname: text,
          status: 'active',
          createdbyid: params.runningUser.id,
          isprivategroup: false,
          accesscode:''
        }
      }
      else if(groupIsPrivate == true && accessCode != null){
        docData = {
          groupname: text,
          status: 'active',
          createdbyid: params.runningUser.id,
          isprivategroup: true,
          accesscode: accessCode
        }
      }
      else{
        Alert.alert('Issue creating prayer group. Please confirm all information is filled out')
      }
      
      console.log('docData ', docData)
      ///Create the new Prayer group
      const newRequest = await addDoc(collection(params.db, "prayergroups"), docData)
      console.log('newRequest: ', newRequest);
      console.log('new request', newRequest.id);
      
      if(newRequest.id != null){
        console.log('newRequest: ', newRequest);
        console.log('new request', newRequest.id);
        const docData2 = {
          groupid: newRequest.id,
          userid: params.runningUser.id,
        }
        ///Create the parayer group to user junction
        const newJunctionRequest = await addDoc(collection(params.db, "groupstousersjunction"), docData2)
        console.log('newRequest: ', newJunctionRequest);
        console.log('new request', newJunctionRequest.id);
        if(newJunctionRequest.id != null){
          loadData();
          setNewPrayerGroupModalVisible(false);
          setText('');
          setAccessCode('');
          Alert.alert('Enjoy your new Group!');
          setModalVisible(false);
        }
      }  
    }
      
  }

  const deactivateGroup = async () => {
    console.log('In deactivateGroup Deactivate', groupId);
    const docData = {
      status: 'Inactive',
    };
    const prayerGroupUpdateRecord = await updateDoc(doc(params.db, "prayergroups", groupId), docData, { merge: true })
    console.log('prayerRequestUpdateRecord: ', prayerGroupUpdateRecord);
    setModalVisible(false);
    setDetailsModalVisible(false);
    setAnsweredPrayerInputModalOpen(false);
    setDeleteGroupModalVisible(false)
    setDetails('');
    loadData();
    setDeleteGroupModalVisible(false)
    setPage('groupList');
    Alert.alert('Prayer Group is removed!');
  }

  const returnToGroups = () => {
    setPage('groupList');
  }

  const askToRemoveGroup = (group) => {
    console.log('IN askToRemoveGroup with group', group);
    setGroupId(group.id)
    setGroupName(group.groupname)
    setRemoveFromGroupModalVisible(true);
  }

  const removeFromGroup = async (group) => {
    console.log('IN removeFromGroup with group', groupId);
    console.log('IN removeFromGroup with userId', params.runningUser.id);
    const prayerGroupJunctionRemove = await query(collection(params.db, "groupstousersjunction"), where("groupid", "==", groupId), where("userid", "==", params.runningUser.id))
    console.log('prayerGroupJunctionRemove: ', prayerGroupJunctionRemove);
    const querySnapshot = await getDocs(prayerGroupJunctionRemove);
    console.log('querySnapshot check: ', querySnapshot.size);
    if(querySnapshot.size > 0){
      querySnapshot.forEach((doc1) => {
        console.log('Prayer Groups Junction: ', doc1.id, " => ", doc1.data());
        deleteDoc(doc(params.db, "groupstousersjunction", doc1.id));

      })
      
      setModalVisible(false);
      setDetailsModalVisible(false);
      setRemoveFromGroupModalVisible(false);
      setDetails('');
      setPage('groupList');
      Alert.alert('Done!');
      loadData();
    }
    else{
      Alert.alert('Issue removing you from group');
    }
  }

  const deleteRecord = async () => {

  }

  const cancelRemoveFromGroup = () => {
    console.log('IN cancelRemoveFromGroup');
    setRemoveFromGroupModalVisible(false);
  }

  const setPublicGroup = () => {
    console.log('PUBLIC click')
    setGroupIsPrivate(false);
  }

  const setPrivateGroup = () => {
    console.log('PRIVATE click')
    setGroupIsPrivate(true);
  }

  if(page == 'groupList'){
    return (
        <View style={styles.centeredViewPrayerList}>
          {/* Start Leave Group Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={removeFromGroupModalVisible}
            onRequestClose={() => {
              setRemoveFromGroupModalVisible(!removeFromGroupModalVisible);
            }}>
              
              <View style={styles.modalViewDetails}>
                <View style={[styles.messageCenter]}>
                  <Text style={[styles.requestNameText]}>
                    Do you want to leave {groupName} Prayer Group?
                  </Text>
                  <Text style={[styles.requestNameText2]}>
                    Note: you may need to refresh your screen after confirmation
                  </Text>
                </View>
                
                   <Pressable
                    style={[styles.closeDeleteModal]}
                    onPress={() => cancelRemoveFromGroup()}>
                    <Text style={styles.textStylePrayerRequest}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.deactivateGroupButton]}
                    onPress={() => removeFromGroup()}>
                    <Text style={styles.textStylePrayerRequest}>Leave</Text>
                  </Pressable>
            </View>
          </Modal> 
          {/* end Leave Group Modal */}

           {/* start new prayer group Modal */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={newPrayerGroupModalVisible}
            onRequestClose={() => {
              setNewPrayerGroupModalVisible(!newPrayerGroupModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Pressable style={styles.circleButtonDetailCloseModal2} onPress={() => closeNewGroupRequest()}>
                <MaterialIcons name="close" size={25} color="white" />
              </Pressable>
                <Text style={styles.groupNameHeaderText}>Name Your Group</Text>
                <TextInput
                    style={{
                        borderColor: '#113946',
                        // borderWidth: 4,
                        // borderRadius: 30,
                        borderBottomWidth: 4,
                        width:'95%',
                        height: '30%',
                        marginBottom: 5,
                    }}
                    textAlign='center'
                    onChangeText={newText => setText(newText)}
                    placeholder="New Group Name"
                    value={text}
                />
                {groupIsPrivate ? 
                <TextInput
                style={{
                    borderColor: '#113946',
                    // borderWidth: 4,
                    // borderRadius: 30,
                    borderBottomWidth: 4,
                    width:'95%',
                    height: '30%',
                    marginBottom: 5,
                }}
                textAlign='center'
                onChangeText={newText => setAccessCode(newText)}
                placeholder="New Access Code (required)"
                value={accessCode}
            />
                :
                ''
                }
                {groupIsPrivate ?
                  <View style={styles.publicOrPrivateButtons}>
                    <Pressable style={styles.publicButtonNotSelected} onPress={() => setPublicGroup()}>
                      <Text >Public</Text>
                    </Pressable>
                    <Pressable style={styles.privateButtonSelected} onPress={() => setPrivateGroup()}>
                      <Text style={{color: '#C56E33', marginRight:20}}>Private</Text>
                      <MaterialIcons name="check-circle-outline" size={20} color="green" />
                    </Pressable>
                  </View>
                  :
                  <View style={styles.publicOrPrivateButtons}>
                    <Pressable style={styles.publicButtonSelected} onPress={() => setPublicGroup()}>
                      <Text style={{color: '#C56E33',marginRight:20}}>Public</Text>
                      <MaterialIcons name="check-circle-outline" size={20} color="green" />
                    </Pressable>
                    <Pressable style={styles.privateButtonNotSelected} onPress={() => setPrivateGroup()}>
                      <Text>Private</Text>
                    </Pressable>
                  </View>
                }
                  
                  <Pressable style={styles.circleSubmitNewRequest} onPress={() => addGroup()} visible={!showEditButton}>
                    <MaterialIcons name="send" size={30} color="#EAD7BB" />
                  </Pressable>
              </View>
            </View>
          </Modal>
          {/* end new prayer group Modal */}
          
          <Text style={styles.helpText}>select group to view group prayer request details</Text>
          <SafeAreaView style={styles.flatListStyle}>
            <FlatList
              data={data}
              renderItem={({item}) => 
                <Pressable style={[styles.buttonShowDetail]} onPress={() => showGroupPrayerList(item)}>
                  <Pressable style={styles.circleButtonRemoveFromGroup} onPress={() => askToRemoveGroup(item)}>
                    <MaterialIcons name="close" size={25} color="white" />
                  </Pressable>
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
          <Pressable style={styles.bottomButton} onPress={() => addNewPrayerGroup()}>
            <Text style={styles.bottomButtonText}>New Prayer Group</Text>
          </Pressable>
        </View>
      );
  }
  else if(page == 'groupRequests'){
    return (
        <View style={styles.centeredViewPrayerList}>
          {/* START validate Delete Prayer Request Modal */}
          {Platform == 'ios' && deletePrayerRequestModalVisible == true ?
            <View style={styles.centeredView}>
            <View style={styles.modalDeleteRequestView}>
            <Pressable style={styles.circleButtonAnsweredPrayerCloseModal} onPress={() => closeDeleteRequestModal()}>
              <MaterialIcons name="close" size={25} color="white" />
            </Pressable>
              <Text style={styles.answeredPrayerText}>Are you sure you want to remove this Prayer Request?</Text>
              
              <Pressable style={styles.circleSubmitNewRequest} onPress={() => deleteFunction()} >
                <MaterialIcons name="delete" size={30} color="#EAD7BB" />
              </Pressable>
            </View>
          </View>
          :
          <Modal
            animationType="slide"
            transparent={true}
            visible={deletePrayerRequestModalVisible}
            onRequestClose={() => {
              setDeletePrayerRequestModalVisible(!deletePrayerRequestModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalDeleteRequestView}>
              <Pressable style={styles.circleButtonAnsweredPrayerCloseModal} onPress={() => closeDeleteRequestModal()}>
                <MaterialIcons name="close" size={25} color="white" />
              </Pressable>
                <Text style={styles.answeredPrayerText}>Are you sure you want to remove this Prayer Request?</Text>
                
                <Pressable style={styles.circleSubmitNewRequest} onPress={() => deleteFunction()} >
                  <MaterialIcons name="delete" size={30} color="#EAD7BB" />
                </Pressable>
              </View>
            </View>
          </Modal>
          }
          {/* END validate Delete Prayer Request Modal */}

              {/* start Delete Group Modal */}
          {Platform == 'ios' && deleteGroupModalVisible == true ?
            <View style={styles.modalViewDetails}>
              <View style={[styles.messageCenter]}>
                <Text style={[styles.requestNameText]}>
                  Do you want to remove this Prayer Group and all the Prayer Requests tied to it?
                </Text>
                <Text style={[styles.requestNameText2]}>
                  Note: All users will no longer have visibility to this group
                </Text>
              </View>
                <Pressable
                  style={[styles.closeDeleteModal]}
                  onPress={() => closeDeleteModal()}>
                  <Text style={styles.textStylePrayerRequest}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.deactivateGroupButton]}
                  onPress={() => deactivateGroup()}>
                  <Text style={styles.textStylePrayerRequest}>Remove</Text>
                </Pressable>
              </View>
            :
            <Modal
              animationType="slide"
              transparent={true}
              visible={deleteGroupModalVisible}
              onRequestClose={() => {
                setDeleteGroupModalVisible(!deleteGroupModalVisible);
              }}>
                <View style={styles.modalViewDetails}>
                  <View style={[styles.messageCenter]}>
                    <Text style={[styles.requestNameText]}>
                      Do you want to remove this Prayer Group and all the Prayer Requests tied to it?
                    </Text>
                    <Text style={[styles.requestNameText2]}>
                      Note: All users will no longer have visibility to this group
                    </Text>
                  </View>
                    <Pressable
                      style={[styles.closeDeleteModal]}
                      onPress={() => closeDeleteModal()}>
                      <Text style={styles.textStylePrayerRequest}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.deactivateGroupButton]}
                      onPress={() => deactivateGroup()}>
                      <Text style={styles.textStylePrayerRequest}>Remove</Text>
                    </Pressable>
              </View>
            </Modal> 
          }
          {/* end Delete Group Modal */}

          

          {/* start new prayer request Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Pressable style={styles.circleButtonDetailCloseModal2} onPress={() => closeNewRequest()}>
                <MaterialIcons name="close" size={25} color="white" />
              </Pressable>
                <Text style={styles.nameInputText}>Who/What am I praying for?</Text>
                <TextInput
                    style={{
                        borderColor: '#113946',
                        backgroundColor: '#FFF8DC',
                        // borderWidth: 4,
                        borderRadius: 20,
                        borderBottomWidth: 4,
                        width:'95%',
                        height: '15%',
                        marginBottom: 40,
                    }}
                    textAlign='center'
                    onChangeText={newText => setText(newText)}
                    placeholder="Subject"
                    value={text}
                />
                <Text style={styles.requestInputText}>What is the request?</Text>
                <TextInput
                    style={{
                        // height: 100,
                        borderColor: '#113946',
                        backgroundColor: '#FFF8DC',
                        // borderWidth: 4,
                        borderRadius: 20,
                        borderBottomWidth: 4,
                        width:'95%',
                        height: '55%',
                        marginBottom: 40,
                        
                    }}
                    textAlign='center'
                    onChangeText={newDetailText => setDetails(newDetailText)}
                    placeholder="Prayer Request"
                    value={details}
                />
                {!showEditButton ? 
                  <Pressable style={styles.circleSubmitNewRequest} onPress={() => addName()} visible={!showEditButton}>
                    <MaterialIcons name="send" size={30} color="#EAD7BB" />
                  </Pressable>
                  :
                  <Pressable style={styles.circleSubmitNewRequest} onPress={() => editDetails()} visible={showEditButton}>
                    <MaterialIcons name="update" size={30} color="#EAD7BB" />
                  </Pressable>
                }
              </View>
            </View>
          </Modal>
          {/* end new prayer request Modal */}
    
           {/* start Answered Prayer Input Modal */}
           {Platform == 'ios' && answeredPrayerInputModalOpen == true ?
           <View style={styles.centeredView}>
            <View style={styles.modalAnsweredPrayerView}>
            <Pressable style={styles.circleButtonAnsweredPrayerCloseModal} onPress={() => closeAnsweredPrayer()}>
              <MaterialIcons name="close" size={25} color="white" />
            </Pressable>
              <Text style={styles.answeredPrayerText}>Prayer Request</Text>
              <View style={styles.answeredPrayerBox}>
                <Text style={styles.answeredPrayerDetailText}>Request: </Text>
                <Text style={styles.answeredPrayerNameText}> {details.name}</Text>
                <Text style={styles.answeredPrayerDetailText}>Details: </Text>
                <Text style={styles.answeredPrayerDetailText2}>{details.details}</Text>
              </View>
              <Text style={styles.requestInputText}>How has God answered your prayers?</Text>
              <TextInput
                  style={{
                      // height: 100,
                      borderColor: '#113946',
                      // borderWidth: 4,
                      // borderRadius: 30,
                      borderBottomWidth: 4,
                      width:'95%',
                      height: '30%',
                      marginBottom: 40,
                      
                  }}
                  textAlign='center'
                  onChangeText={newAnswerText => setAnsweredPrayerText(newAnswerText)}
                  placeholder="Answer..."
              />
              
                <Pressable style={styles.circleSubmitNewRequest} onPress={() => updateAnsweredPrayer()} >
                  <MaterialIcons name="send" size={30} color="#EAD7BB" />
                </Pressable>
            </View>
          </View>
           :
            <Modal
                animationType="slide"
                transparent={true}
                visible={answeredPrayerInputModalOpen}
                onRequestClose={() => {
                  setAnsweredPrayerInputModalOpen(!answeredPrayerInputModalOpen);
                }}>
                <View style={styles.centeredView}>
                  <View style={styles.modalAnsweredPrayerView}>
                  <Pressable style={styles.circleButtonAnsweredPrayerCloseModal} onPress={() => closeAnsweredPrayer()}>
                    <MaterialIcons name="close" size={25} color="white" />
                  </Pressable>
                    <Text style={styles.answeredPrayerText}>Prayer Request</Text>
                    <View style={styles.answeredPrayerBox}>
                      <Text style={styles.answeredPrayerDetailText}>Request: </Text>
                      <Text style={styles.answeredPrayerNameText}> {details.name}</Text>
                      <Text style={styles.answeredPrayerDetailText}>Details: </Text>
                      <Text style={styles.answeredPrayerDetailText2}>{details.details}</Text>
                    </View>
                    <Text style={styles.requestInputText}>How has God answered your prayers?</Text>
                    <TextInput
                        style={{
                            // height: 100,
                            borderColor: '#113946',
                            backgroundColor: '#FFF8DC',
                            // borderWidth: 4,
                            // borderRadius: 30,
                            borderBottomWidth: 4,
                            width:'95%',
                            height: '30%',
                            marginBottom: 40,
                            
                        }}
                        textAlign='center'
                        onChangeText={newAnswerText => setAnsweredPrayerText(newAnswerText)}
                        placeholder="Answer..."
                    />
                    
                      <Pressable style={styles.circleSubmitNewRequest} onPress={() => updateAnsweredPrayer()} >
                        <MaterialIcons name="send" size={30} color="#EAD7BB" />
                      </Pressable>
                  </View>
                </View>
              </Modal>
           }
           
          {/* end Answered Prayer Input Modal */}
    
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
              
            {params.runningUser.id == details.submittedbyuserid ? 
                 <Pressable style={styles.circleButtonDetailEditModal} onPress={() => openEditDetail(details)}>
                    <MaterialIcons name="edit" size={25} color="black" />
               </Pressable>
               :
               ''
            }
              <Pressable style={styles.circleButtonDetailCloseModal} onPress={() => closeDetails()}>
                <MaterialIcons name="close" size={25} color="white" />
              </Pressable>
            {params.runningUser.id == details.submittedbyuserid ? 
                 <Pressable style={styles.circleButtonDetailDeleteModal} onPress={() => openDeleteRequestModal(details)}>
                 <MaterialIcons name="delete" size={25} color="white" />
               </Pressable> 
               :
               ''
            }
             
                <Text style={[styles.requestNameText]}>
                  {details.name}
                </Text>
                <Text style={[styles.prayingForText]}>Praying for...</Text>
                <SafeAreaView style={styles.safeAreaContainer}>
                  <ScrollView style={styles.requestDetailsScrollView}>
                    <Text style={[styles.requestDetailsText]}>
                      {details.details}
                    </Text>
                  </ScrollView>
                </SafeAreaView>
                {params.runningUser.id == details.submittedbyuserid ? 
                    <Pressable
                        style={[styles.answeredPrayer]}
                        onPress={() => answeredPrayer()}>
                        <MaterialCommunityIcons name="human-handsup" size={30} color="#BCA37F" />
                        <Text style={styles.textStylePrayerRequest}>Answered</Text>
                    </Pressable>
                    :
                    ''
                }
                  
                <Pressable
                    style={[styles.prayedCircleButton]}
                    onPress={() => incermentTimesPrayed()}>
                    
                    <FontAwesome5 name="pray" size={34} color="#BCA37F" />
                    <Text style={styles.textStylePrayed}>Prayed</Text>
                  </Pressable>
              </View>
            </View>
          </Modal>
          {/* end prayer request details Modal */}
          
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
          {params.runningUser.id == groupCreatedBy ? 
                <Pressable style={styles.circleButtonGroupDeleteModal} onPress={() => deleteGroup(details)}>
                    <MaterialIcons name="delete" size={25} color="#113946" />
                </Pressable> 
               :
               ''
            }
            
          <Text style={styles.helpText}>click each prayer request to view details</Text>
          <SafeAreaView style={styles.flatListStyle}>
            <FlatList
              data={requestData}
              renderItem={({item}) => 
                <Pressable style={[styles.buttonShowDetail]} 
                                        onPress={() => showDetails(item)}>
                  <View style={[styles.nameView]}> 
                    <View>
                        <Text style={[styles.timesPrayedBubble]}>{item.timesprayed}
                        <View>
                        <Text style={[styles.timesPrayedBubbleText]}>Prayed</Text>
                        </View>
                        </Text>
                    </View>
                      
                      
                      <Text style={styles.item} key={item.Id}>{item.name}
                        
                      </Text>
                  </View>
                </Pressable>
              }
            />
          </SafeAreaView>
          <Pressable style={styles.bottomButton} onPress={() => addNewPrayerRequest()}>
            <Text style={styles.bottomButtonText}>New Prayer Request</Text>
          </Pressable>
        </View>
        
      );
  }
  
};

const styles = StyleSheet.create({
  buttonShowDetail:{
    ...Platform.select({
      ios: {
        width:400,
        justifyContent: 'center',
      },
      android:{
      }
    }),
  },
  bottomButtonText:{
    color:"#BCA37F",
    fontSize:20
  },
  bottomButton:{
    width:'100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    backgroundColor:'#113946',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  flatListStyle:{
    
    ...Platform.select({
      ios: {
        height:'85%',
        // marginLeft:50,
      },
      android:{
        height:'85%'
      }
    }),
  },
  answeredPrayerBox:{
    ...Platform.select({
      ios: {
        marginTop: 10,
        width:'100%',
        borderColor: '#113946',
        borderWidth: 4,
        marginBottom: 20,
        borderRadius:20,
        backgroundColor:'#FFF8DC'
      },
      android:{
        marginTop: 10,
        width:'100%',
        borderColor: '#113946',
        borderWidth: 4,
        marginBottom: 20,
        borderRadius:20
      }
    }),
    
  },
  answeredPrayerDetailText:{
    fontSize:15,
    marginTop: 20,
    marginLeft:5,
    color: '#C56E33',
    textAlign: 'left'
  },
  answeredPrayerDetailText2:{
    fontSize:20,
    marginLeft: 5,
    marginBottom: 20,
    textAlign: 'left',
    fontStyle: 'italic',
  },
  answeredPrayerText:{
    fontSize: 30,
    color: '#C56E33',
    marginTop: -20
  },
  answeredPrayerNameText:{
    fontSize:20,
    marginLeft: 5,
    textAlign: 'left'
  },
  timesPrayedBubbleText:{
    ...Platform.select({
      ios: {
        // overflow:'hidden',
        fontSize: 12,
        color: '#C56E33',
        marginLeft:10,
        // marginTop: 15,
        // position: 'absolute',
        // right:-10,
        zIndex:1,
      },
      android:{
        
        fontSize: 12,
        color: '#C56E33',
        marginTop: 15,
        position: 'absolute',
        right:0,
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
        borderRadius: 20,
        textAlign:'center'
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
    height: 360,
  },
  prayingForText:{
    marginTop: 20,
    color: '#113946',
    fontSize:20,
  },
  requestNameText:{
    justifyContent:'center',
    textAlign:'center',
    marginTop: 20,
    fontSize: 40,
    color: '#C56E33',
  },
  requestNameText2:{
    marginTop: 20,
    fontSize: 20,
    color: '#C56E33',
  },
  messageCenter:{
    justifyContent:'center',
    alignItems: 'center',
    marginTop:'40%'
  },
  requestDetailsText:{
    fontSize: 30,
    color: '#C56E33',
  },
  textStylePrayed: {
    color: '#BCA37F',
  },
  closeDeleteModal:{
    width:120,
    height: 80,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    left:10,
    backgroundColor:'#113946',
    color: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  deactivateGroupButton:{
    width:120,
    height: 80,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    right:10,
    backgroundColor:'#113946',
    color: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  prayedCircleButton:{
    width:120,
    height: 120,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 60,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 10,
    backgroundColor:'#113946',
    color: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  centeredViewPrayerList: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    marginTop: 22,
    backgroundColor: '#BCA37F',
  },
  modalView: {
    ...Platform.select({
      ios: {
        marginTop:'15%',
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
      android:{
        
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
      }
    }),
   
  },
  modalAnsweredPrayerView: {
    ...Platform.select({
      ios: {
        marginTop:'15%',
        height: '85%',
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
      },
      android:{
        height: '93%',
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
      }
    }),
    
  },
  modalDeleteRequestView: {
    ...Platform.select({
      ios: {
        marginTop: '30%',
        height: '45%',
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
      android:{
        height: '45%',
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
      }
    }),
    
  },
  modalViewDetails: {
    ...Platform.select({
      ios: {
        marginTop: '10%',
        height:'95%',
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
    ...Platform.select({
      ios: {
        marginLeft:'10%',
        textAlign: 'center',
        color: '#C56E33',
        fontStyle: 'italic',
      },
      android:{
        textAlign: 'center',
        color: '#C56E33',
        fontStyle: 'italic',
      }
    }),
  },
  backburger:{
    position:'absolute',
    left:20,
    top:5,
  },
  
  groupText:{
    ...Platform.select({
      ios: {
        overflow:'hidden',
        width:370,
        color: '#C56E33',
        fontStyle: 'italic',
        fontSize:20,
        padding: 15,
        borderRadius: 30,
        marginRight: 10,
        marginLeft: 10,
        height: 60,
        zIndex:-1,
        textAlign: 'center',
        backgroundColor: '#113946',
        marginBottom:20,
      },
      android:{
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
      }
    }),
    
  },
  textStylePrayerRequest: {
    color: '#BCA37F',
    textAlign: 'center',
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
        color:"#BCA37F",
        backgroundColor: '#113946',
        justifyContent: 'center',
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
        color:"#BCA37F",
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
  lockIcon:{
    color:"#BCA37F",
    // marginLeft:55,
    position: 'absolute',
    right:30,
    top: 5,
  },
  answeredPrayer:{
    width:100,
    height: 100,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: '#fff',
    position: 'absolute',
    right:2,
    bottom: 2,
    backgroundColor:'#113946',
    color: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 10,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
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
  circleButtonRemoveFromGroup:{
    width:40,
    height: 40,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
    position: 'absolute',
    left:10,
    top: -10,
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
  circleButtonAnsweredPrayerCloseModal: {
    width:40,
    height: 40,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
    position: 'absolute',
    left:-15,
    top: -15,
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
  circleButtonDetailEditModal: {
    width:40,
    height: 40,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#EAD7BB',
    position: 'absolute',
    right:10,
    top: 10,
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  circleButtonDetailDeleteModal: {
    width:40,
    height: 40,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
    position: 'absolute',
    left:10,
    bottom: 10,
    backgroundColor:'red',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  circleButtonGroupDeleteModal: {
    width:60,
    height: 60,
    marginTop:0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#EAD7BB',
    position: 'absolute',
    right:10,
  },
  nameInputText:{
    textAlign: 'left',
    color: '#C56E33',
    height:50
  },
  groupNameHeaderText:{
    textAlign: 'left',
    color: '#C56E33',
    fontSize:30,
    height:50
  },
  requestInputText:{
    textAlign: 'left',
    color: '#C56E33'
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
    right:10,
    bottom: 10,
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
  },
  publicButtonSelected:{
    display: 'inline',
    flexDirection: 'row',
    backgroundColor: '#113946',
    margin: 20,
    marginRight:0,
    padding: 15,
    width: '40%',
    borderColor:'#113946',
    borderWidth: 1,
  },
  publicButtonNotSelected:{
    display: 'inline',
    flexDirection: 'row',
    backgroundColor: '#EAD7BB',
    margin: 20,
    marginRight:0,
    padding: 15,
    width: '40%',
    borderColor:'#113946',
    borderWidth: 1,
  },
  privateButtonSelected:{
    display: 'inline',
    flexDirection: 'row',
    backgroundColor: '#113946',
    margin: 20,
    marginLeft:0,
    padding: 15,
    width: '40%',
    borderColor:'#113946',
    borderWidth: 1,
    color: '#C56E33',
  },
  accessCode:{
    color:"#C56E33",
    bottom: 35,
    textAlign:'center',
    alignContent:'center'
  },
  privateButtonNotSelected:{
    display: 'inline',
    flexDirection: 'row',
    backgroundColor: '#EAD7BB',
    margin: 20,
    marginLeft:0,
    padding: 15,
    width: '40%',
    borderColor:'#113946',
    borderWidth: 1,
  }
});

export default prayerGroups;