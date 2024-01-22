import React, {useState, useEffect} from 'react';
import {View, Text,  ScrollView, StyleSheet, Pressable, Alert,FlatList, ActivityIndicator, Platform} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import {collection,  getDocs, query, where } from "firebase/firestore";

class devoWrapper {
  constructor (id, data) {
      this.id = id;
      this.title = data.title;
      this.scripture = data.scripture;
      this.body = data.body;
      this.userid = data.userid;
      this.devodate = data.devodate;
      this.searchinput = data.searchinput;
  }
}

const DevotionHistoryPage = (params) => {
    console.log('runningUser in newPrayerRequest:', params);
    const [data, setData] = useState([]);
    const [personalDevoData, setPersonalDevoData] = useState([]);
    const [familyDevoData, setFamilyDevoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsModalVisible, setDetailsModalVisible] = useState(false);
    const [details, setDetails] = useState('');
    const [detailsDate, setDetailsDate] = useState('');
    const [devotionBody, setDevotionBody] = useState('');
    const [devotionTitle, setDevotionTitle] = useState('');
    const [devotionScripture, setDevotionScripture] = useState('');
    const [page, setPage] = useState('showList');
    const [viewGroupTab, setViewGroupTab] = useState('Personal');

    useEffect(() => {
        loadPersonalDevoData();
      }, []);
    
    const loadPersonalDevoData = async () => {
      setData([]);
      setPage('');
      console.log('personalDevoData.length: ', personalDevoData.length );
      if(personalDevoData.length > 0){
        console.log('personalDevoData:', personalDevoData);
        setData(personalDevoData);
        setViewGroupTab('Personal');
        setLoading(false);
      }
      else{
        const q = query(collection(params.db, "devotions"), where("userid", "==", params.runningUser.id));
        console.log('q check: ', q);
        const querySnapshot = await getDocs(q);
        console.log('querySnapshot check: ', querySnapshot.size);
        if(querySnapshot.size > 0){
          let devoRecord = [];
          querySnapshot.forEach((doc) => {
            console.log('PErsonal Devo: ', doc.id, " => ", doc.data());
            devoRecord.push(new devoWrapper(doc.id, doc.data()))
            
          });
          setPersonalDevoData(devoRecord);
          setData(devoRecord);
          setViewGroupTab('Personal');
          setLoading(false);
        }
        else{
          console.log('error getting devo')
          Alert.alert('Issue getting devo list')
        }
      }
    }

    const loadFamilyDevoData = async () => {
      setData([]);

      if(familyDevoData.length > 0){
        console.log('familyDevoData:', familyDevoData);
        setData(familyDevoData);
        setViewGroupTab('Family');
        setLoading(false);
      }
      else{
        const q = query(collection(params.db, "familydevotions"), where("userid", "==", params.runningUser.id));
        console.log('q check: ', q);
        const querySnapshot = await getDocs(q);
        console.log('querySnapshot check: ', querySnapshot.size);
        if(querySnapshot.size > 0){
          let devoRecord = [];
          querySnapshot.forEach((doc) => {
            console.log('Family Devo: ', doc.id, " => ", doc.data());
            devoRecord.push(new devoWrapper(doc.id, doc.data()))
            
          });
          setFamilyDevoData(devoRecord);
          setData(devoRecord);
          setViewGroupTab('Family');
          setLoading(false)
        }
        else{
          console.log('error getting devo')
          Alert.alert('Issue getting devo list')
        }
      }
    }

    const setPublicGroup = () => {
      console.log('PUBLIC click');
      loadPersonalDevoData();
      setViewGroupTab('Personal');
    }
  
    const setPrivateGroup = () => {
      console.log('PRIVATE click');
      loadFamilyDevoData();
      setViewGroupTab('Family');
    }

    const showDetails = async (item) => {
      console.log('showDetails item', item);
      setDevotionTitle(item.title);
      setDevotionScripture(item.scripture);
      setDevotionBody(item.body);
      setDetailsModalVisible(true);
      setPage('viewDevo');
        
    }
      

    const closeDetails = () => {
      console.log('closeDetails');
      setPage('showList');
      setDetailsModalVisible(false)
    }


    if(loading){
        return(
        
            <View style={[styles.devotionBodyLoadingView]}>
                <ActivityIndicator size="large" color="#C56E33" />
                
                <Text >
                    {'\n'}
                    {'\n'}
                    Gathering your list of Devotions
                    {'\n'}
                    This may take a minute or two...
                </Text>
            </View>
            
        );
    }
    else{
        return(
            <View>
                {page == 'viewDevo' ?
                    ''
                    :
                    <View>
                    {viewGroupTab !== 'Personal' ?
                        <View style={styles.publicOrPrivateButtons}>
                            <Pressable style={styles.publicButtonNotSelected} onPress={() => setPublicGroup()}>
                                <Text style={{color: 'grey',fontSize:20}}>Personal</Text>
                            </Pressable>
                            <Pressable style={styles.privateButtonSelected} onPress={() => setPrivateGroup()}>
                                <Text style={{color: '#C56E33', fontSize:20, fontWeight:'bold', marginRight:20}}>Family</Text>
                                <MaterialIcons name="check-circle-outline" size={25} color="green" />
                            </Pressable>
                        </View>
                            :
                        <View style={styles.publicOrPrivateButtons}>
                            <Pressable style={styles.publicButtonSelected} onPress={() => setPublicGroup()}>
                                <Text style={{color: '#C56E33',fontSize:20, fontWeight:'bold', marginRight:20}}>Personal</Text>
                                <MaterialIcons name="check-circle-outline" size={25} color="green" />
                            </Pressable>
                            <Pressable style={styles.privateButtonNotSelected} onPress={() => setPrivateGroup()}>
                                <Text style={{color: 'grey',fontSize:20}}>Family</Text>
                            </Pressable>
                        </View>
                    }
                    </View>
                }
                {page == 'viewDevo' ?
           
                    <View>
                        <ScrollView style={[styles.devotionBodyView]}>
                            <Text style={[styles.devotionTitleText]}>
                                {devotionTitle}
                                {'\n'}
                            </Text>
                            <Text style={[styles.devotionScriptureText]}>
                                {devotionScripture}
                                {'\n'}
                            </Text>
                            
                            <Text style={[styles.devotionBodyText]}>
                                {devotionBody}
                            </Text>
                            <Text></Text>
                            
                            <Text>
                            {'\n'}
                            {'\n'}
                            </Text>
                            
                        </ScrollView>
                        <View>
                            <Pressable style={[styles.returnIcon]} onPress={() => closeDetails()}>
                                <Ionicons name="md-return-up-back" size={40} color="#C56E33" />
                            </Pressable>
                        </View>
                    </View>
              :
                    <View >
                        <Text style={styles.helpText}>click the date to view past devotions</Text>
                        
                        <FlatList
                            style={styles.flatListStyle}
                            data={data}
                            renderItem={({item}) => 
                            <Pressable style={[styles.buttonShowDetail]} 
                                                onPress={() => showDetails(item)}>
                                
                                
                                <Text style={styles.item} key={item.id}>{item.devodate}</Text>
                            
                            </Pressable>
                        }
                    />
                    </View>
                }
            </View>
        )
    }
};

const styles = StyleSheet.create({
  buttonShowDetail:{
    ...Platform.select({
      ios: {
        justifyContent: 'center',
      },
      android:{
      
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
            padding: 15,
            overflow:'hidden',
            borderRadius: 35,
            marginBottom: 10,
            marginTop: 5,
            marginRight: 30,
            marginLeft: 30,
            fontSize: 30,
            height: 70,
            zIndex:-1,
            textAlign: 'center',
            // justifyContent:'center',
            color: '#BCA37F',
            backgroundColor: '#113946',
            // justifyContent: 'center',
            // alignItems: 'center',
            // elevation: 4,
            //   shadowColor: '#000',
            //   shadowOffset: {
            //     width: 10,
            //     height: 2,
            //   },
            //   shadowOpacity: 1,
            //   shadowRadius: 10,
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
      devotionBodyView: {
        height:'88%',
        backgroundColor: '#BCA37F',
      },
      returnIcon:{
        width:50,
        height: 50,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 42,
        backgroundColor: '#113946',
        position: 'absolute',
        left:10,
        bottom: 10,
        shadowOpacity: 0.25,
        shadowRadius: 4,
        color: '#C56E33'
      },
      flatListStyle:{
        height: '80%',
      },
      publicOrPrivateButtons:{
        display: 'inline',
        flexDirection: 'row',
        width:'100%',
        marginTop: -35,
        marginBottom:10,
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
      },
      devotionBodyLoadingView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: '#BCA37F',
      },
      devotionTitleText: {
        fontSize:25,
        textAlign: 'center'
      },
      devotionScriptureText: {
        fontSize:20,
        textAlign: 'center',
        color: '#C56E33',
        fontStyle: 'italic',
        marginLeft: 15,
        marginRight: 15
      },
      devotionBodyText:{
        fontSize:20,
        marginLeft: 15,
        marginRight: 5
    }
});

export default DevotionHistoryPage;