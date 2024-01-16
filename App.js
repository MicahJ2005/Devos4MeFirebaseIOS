import {Platform, View, Alert, Text, Image, ScrollView, Modal, Pressable, StyleSheet, SafeAreaView, ActivityIndicator, Linking, TouchableOpacity} from 'react-native';
import NewPrayerRequest from './components/newPrayerRequest';
import PersonalDevotionPage from './components/personalDevotionPage';
import FamilyDevotionPage from './components/familyDevotionPage';
import PrayerHistoryPage from './components/prayerHistoryPage';
import GroupPrayerHistoryPage from './components/groupPrayerHistoryPage';
import AboutPage from './components/aboutPage';
import ResourcesPage from './components/resourcesPage';
import PrayerGroup from './components/prayerGroups';
import JoinAPrayerGroup from './components/joinAPrayerGroupPage';
import DevotionHistoryPage from './components/devotionHistoryPage';
import React, {useState, useEffect} from 'react';
import logo from './assets/logo-no-background.png';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {TextInput} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { sendEmail } from './components/sendEmail';
import {  collection, doc, getDocs, query, where, addDoc, updateDoc  } from "firebase/firestore";
import db from './db/firebase';

class userDataWrapper {
  constructor (id, data) {
      this.id = id;
      this.username = data.username;
      this.firstname = data.firstname;
      this.lastname = data.lastname;
      this.birthday = data.birthday;
      this.phone = data.phone;
      this.password = data.password;
      this.securityquestion = data.securityquestion;
      this.securityanswer = data.securityanswer;
      this.createddate = data.createddate;
      this.active = data.active;
  }
}

export default function App() {
  const [page, setPage] = useState('login');
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [devoSelectorVisible, setDevoSelectorVisible] = useState(false);
  const [familyDevoSelectorVisible, setFamilyDevoSelectorVisible] = useState(false);
  const [selected, setSelected] = React.useState("");
  const [submitDevoButtonDisabled, setSubmitDevoButtonDisabled] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [runningUser, setRunningUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [devotionTopicText, setDevotionTopicText] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailAddressValidated, setEmailAddressValidated] = useState(false);
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [date, setDate] = useState('09-10-2021');
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [text, setText] = useState('');

  ///FOR NEW ACCOUNTS
  const [registerEmailAddress, setRegisterEmailAddress] = useState('');
  const [registerFirstName, setRegisterFirstName] = useState('');
  const [registerLastName, setRegisterLastName] = useState('');
  const [registerBirthdate, setRegisterBirthdate] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerSecurityQuestion, setRegisterSecurityQuestion] = useState('');
  const [registerSecurityAnswer, setRegisterSecurityAnswer] = useState('');
  const [openCalendarBoolean, setOpenCalendarBoolean] = useState(false);

  const [securityAnswerValidation, setSecurityAnswerValidation] = useState('');
  const [currentSecurityAnswer, setCurrentSecurityAnswer] = useState('');
  const [currentSecurityQuestion, setCurrentSecurityQuestion] = useState('');

 


  useEffect(() => {
    console.log('page: ', page);
    console.log('Platform: ', Platform.OS);
  }, [])


  const openDevoTypeSelector = async () => {
    console.log('IN openDevoTypeSelector ');
    console.log('runningUser ', runningUser);
    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
    setLoading(true);
    
    const q = query(collection(db, "devotions"), where("userid", "==", runningUser.id), where("devodate", "==", reformattedDate));
    console.log('q check: ', q);
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot check IN openDevoTypeSelector: ', querySnapshot.size);
    if(querySnapshot.size > 0){
      let userwrapped;
      querySnapshot.forEach((doc) => {
        console.log('Devo in openDevoTypeSelector: ', doc.id, " => ", doc.data());
        setPage('devotion');
        setLoading(false);
        setDevoSelectorVisible(false);
      });
    }
    else{
      console.log('IN NO DEVO YET TODAY')
      setLoading(false);
      setPage('home');
      setDevoSelectorVisible(true);
    }
  }

  const openFamilyDevoTypeSelector = async () => {
    console.log('IN openFamilyDevoTypeSelector ');
    console.log('runningUser ', runningUser);
    console.log('IN openDevoTypeSelector ');
    console.log('runningUser ', runningUser);
    setLoading(true);

    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();

    const q = query(collection(db, "familydevotions"), where("userid", "==", runningUser.id), where("devodate", "==", reformattedDate));
    console.log('q check: ', q);
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot check IN openDevoTypeSelector: ', querySnapshot.size);
    if(querySnapshot.size > 0){
      querySnapshot.forEach((doc) => {
        console.log('USER signed in: ', doc.id, " => ", doc.data());
        setPage('familyDevotions');
        setLoading(false);
        setFamilyDevoSelectorVisible(false);
      });
    }
    else{
      setLoading(false);
      setPage('home');
      setFamilyDevoSelectorVisible(true);
    }
  }

  const navigateToPrayerList = () => {
    console.log('navigateToPrayerList click', );
    setPage('prayerList');
  }

  const navigateToPrayerGroups = () => {
    console.log('navigateToPrayerGroups click', );
    setPage('prayerGroup');
  }

  const navigateToJoinPrayerGroups = () => {
    console.log('navigateToPrayerGroups click', );
    setPage('joinPrayerGroup');
  }
  

  const navigateHome = () => {
    console.log('navigateHome click', );
    setMenuModalVisible(false);
    setSubmitDevoButtonDisabled(true);
    setSelected('');
    setDevoSelectorVisible(false);
    setFamilyDevoSelectorVisible(false);
    setLoading(false);
    setPage('home');
  }

  const openMenu = async () => {
    console.log('openMenu click', );
    //check if there is already a daily devo
    setPage('navigation');
    setMenuModalVisible(true);
  }

  const navigateHistory = () => {
    console.log('navigateHistory click', );
    setPage('navigateHistory');
  }

  const navigateToDevotionHistory = () => {
    setPage('navigateDevotionHistory');
  }

  const navigateGroupHistory = () => {
    console.log('navigateGroupHistory click', );
    setPage('navigateGroupHistory');
  }

  const navigateAbout = () => {
    console.log('navigateAbout click', );
    setPage('about');
  }

  const setDevoType = () => {
    console.log('setDevoType click', selected);
    setSubmitDevoButtonDisabled(false);
  }

  const getDevo = () => {
    // this will initiate the callout to get a new devo based on the "selected" devot type
    console.log('getDevo click', selected);
    console.log('getDevo click devotionTopicText', devotionTopicText);
    setPage('devotion');
  }

  const getFamilyDevo = () => {
    // this will initiate the callout to get a new devo based on the "selected" devot type
    console.log('getFamilyDevo click', selected);
    console.log('getFamilyDevo click devotionTopicText', devotionTopicText);
    setPage('familyDevotions');
  }

  const devoSelectorModalclose = () => {
    console.log('devoSelectorModalclose click');
    setSubmitDevoButtonDisabled(true);
    setSelected('');
    setDevoSelectorVisible(false);
  }

  const familyDevoSelectorModalclose = () => {
    console.log('devoSelectorModalclose click');
    setSubmitDevoButtonDisabled(true);
    setSelected('');
    setFamilyDevoSelectorVisible(false);
  }

  const navigateResources = () =>{
    console.log('navigateResources click');
    setPage('resources');
  }

  const signIn = async () =>{
    console.log('username ', username);
    console.log('password ', password);
    
    /////FOR FIREBASE
    const q = query(collection(db, "users"), where("username", "==", username), where("password", "==", password) , where("active", "==", true));
    console.log('q check: ', q);
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot check: ', querySnapshot.size);
    if(querySnapshot.size > 0){
      let userwrapped;
      querySnapshot.forEach((doc) => {
        console.log('USER signed in: ', doc.id, " => ", doc.data());
        userwrapped = new userDataWrapper(doc.id, doc.data());
        setRunningUser(userwrapped);
        setPage('home');
      });
    }else{
      Alert.alert('Login issue. Please try again.')
      setPage('login');
    }
    
    ///END FIREBASE
    }

    const logout = () => {
      setUsername('');
      setPassword('');
      setPage('login');
      setEmailAddressValidated(false);
      setEmailAddress('')
      setOpenCalendarBoolean(false);
      setRegisterBirthdate('');
    }

    const forgotPassword = () => {
      console.log('In forgotPassword');
      setPage('forgotPassword');
    }

    const register = () => {
      console.log('In register');
      setPage('register');
    }

    const validateEmail = async () => {
      console.log('IN Validate Email Click')
      console.log('IN Validate Email address', emailAddress);
      const q = query(collection(db, "users"), where("username", "==", emailAddress), where("active", "==", true));
      console.log('q check: ', q);
      const querySnapshot = await getDocs(q);
      console.log('querySnapshot check: ', querySnapshot.size);
      if(querySnapshot.size > 0){
        let userwrapped;
        querySnapshot.forEach((doc) => {
          console.log('USER signed in: ', doc.id, " => ", doc.data());
          userwrapped = new userDataWrapper(doc.id, doc.data());
          setRunningUser(userwrapped);
          setCurrentSecurityQuestion(userwrapped.securityquestion);
          setCurrentSecurityAnswer(userwrapped.securityanswer);
          setEmailAddressValidated(true);
        });
      }else{
        setEmailAddressValidated(false);
        Alert.alert('Your email is not tied to a registered user. Please register as a new user!');
      }
    }

  const setNewPassword = async () => {
    console.log('In setNewPassword');
    console.log('In password1', newPassword1);
    console.log('In password2', newPassword2);
    if(currentSecurityAnswer == securityAnswerValidation){
      console.log('Matching Answers!')
    

      if(newPassword1 == newPassword2){
        console.log('Matching Passwords!');
        const docData = {
          password: newPassword1
        };
      const pwResetRecord = await updateDoc(doc(db, "users", runningUser.id), docData, { merge: true })
        console.log('pwResetRecord', pwResetRecord);
        Alert.alert('Password Successfully Changed!');
        logout();
      }else{
        console.log(' Passwords Don\'t match!');
        Alert.alert('Passwords Don\'t Match!');
      }
    }
    else{
      Alert.alert('Security Answer Incorrect!');
    }
  }

  const createNewAccount = async () => {
    console.log('register email', registerEmailAddress);
    console.log('register Fname', registerFirstName);
    console.log('register Lname', registerLastName);
    console.log('register BDay', registerBirthdate);
    console.log('register Phone', registerPhone);
    console.log('register PW', registerPassword);
    console.log('register Security Q', registerSecurityQuestion);
    console.log('register Security A', registerSecurityAnswer);

    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();

    if(registerEmailAddress != '' && 
        registerFirstName != '' &&
        registerLastName != '' &&
        registerBirthdate != '' &&
        registerPhone != '' &&
        registerPassword != '' &&
        registerSecurityQuestion != '' &&
        registerSecurityAnswer != ''
        ){

          //check if email address is already used//
          const checkEmailQ = query(collection(db, "users"), where("username", "==", registerEmailAddress));
          console.log('q check: ', checkEmailQ);
          const queryCheckEmail = await getDocs(checkEmailQ);
          console.log('querySnapshot check: ', queryCheckEmail.size);
          if(queryCheckEmail.size > 0){
            Alert.alert('This email address is already registered!');
            
          }else{
            const newUser = await addDoc(collection(db, "users"), {
              username: registerEmailAddress,
              firstname: registerFirstName,
              lastname: registerLastName,
              birthday: registerBirthdate,
              phone: registerPhone,
              password: registerPassword,
              securityquestion: registerSecurityQuestion,
              securityanswer: registerSecurityAnswer,
              createddate: reformattedDate,
              active: true
            });
            console.log('newUser', newUser.id);
            if(newUser.id != null){
              Alert.alert('Your New Account is Ready!');
              logout();
            }
          }
        }
        else{
          console.log('All field are required!');
          Alert.alert('All field are required!');
        }
  }

  const openCalendar = () => {
    console.log('openCalendar click');
    setOpenCalendarBoolean(true);
  }

  const setBirthdate = (event, date) => {
    console.log('setBirthdate event', event);
    console.log('setBirthdate Date', date);
    let newDate = new Date(date);
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();
    console.log('reformattedDate', reformattedDate);
    if(event.type == 'set'){
      setOpenCalendarBoolean(false);
      setRegisterBirthdate(reformattedDate);
    }
    else{
      console.log('type: ', event.type);
    }
  }

  const navigateToChurchMap = () => {
    console.log('navigateToChurchMap click');
    Linking.openURL(iframeString)
    // setPage('churchmap');
  }

  const openFeedbackRequest = () => {
    console.log('IN openFeedbackRequest');
    setText('');
    setFeedbackModalVisible(true);
  }

  const closeFeedbackRequest = () => {
    setFeedbackModalVisible(false);
  }

  const sendFeedback = () => {
    console.log('IN sendFeedback');
    console.log('Feedback text: ', text);
    console.log('Feedback user: ', runningUser);
    sendEmail(
      'micahj2005@hotmail.com',
      `User Feedback from User ${runningUser.firstname} ${runningUser.lastname} , email: ${runningUser.username}  `,
      text,
      { }
  ).then(() => {
      console.log('Your message was successfully sent!');
      
      setText('');
      setFeedbackModalVisible(false);
      Alert.alert('Feedback Sent!');
  })
  .catch(error => {
    console.log('Your message was successfully sent!');
    Alert.alert('Issue Sending Feedback');
  });
  }

  if(loading){
    return(
    
      <View style={[styles.devotionBodyLoadingView]}>
        <View style={[styles.registerHeaderIconsLoading]}>
          <Pressable onPress={() => navigateHome()}>
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoRegister}
                source={logo}
              />
            </Pressable>
          </View>
          <ActivityIndicator size="large" color="#C56E33" />
          
          <Text >
              {'\n'}
              {'\n'}
              Checking your personal devotion...
          </Text>
      </View>
        
    );
  }
  else{
  
    if(page === 'login'){
      return (
        
        <View style={styles.scrollViewLogin}>
          <View style={[styles.homeHeaderIcons]}>
            
          </View>
          <Pressable >
            <Image
              style={styles.tinyLogo}
              source={logo}
            />
          </Pressable>
          <ScrollView style={styles.homeContentView2}>
          <Text style={styles.nameInputText}>User Email</Text>
              <TextInput
                  style={{
                      borderColor: '#113946',
                      borderBottomWidth: 4,
                      width:'95%',
                      height: '15%',
                      marginBottom: 40,
                      alignContent:'center'
                  }}
                  textAlign='center'
                  onChangeText={newUsernameText => setUsername(newUsernameText)}
                  placeholder="someone@blessings.com"
              />
              <Text style={styles.nameInputText} >Password</Text>
              <TextInput
                  style={{
                      borderColor: '#113946',
                      borderBottomWidth: 4,
                      width:'95%',
                      height: '15%',
                      marginBottom: 40,
                      
                  }}
                  textAlign='center'
                  onChangeText={newPasswordText => setPassword(newPasswordText)}
                  placeholder="******"
                  secureTextEntry={true}
              />
              <Pressable style={styles.LoginPressable} onPress={() => signIn()}>
                <Text style={styles.myPrayerListPressableText}>Login</Text>
              </Pressable>
          </ScrollView>
          <View style={styles.loginPageLoginButtons}>
            <Pressable style={styles.forgotPasswordPressable} onPress={() => forgotPassword()}>
              <Text style={styles.forgotPasswordPressableText}>Forgot Password?</Text>
            </Pressable>
            <Pressable style={styles.registerPressable} onPress={() => register()}>
              <Text style={styles.registerPressableText}>New Account</Text>
            </Pressable>
          </View> 
        </View>
        
      );
    
    }
    else if(page === 'register'){
      return (
        <View style={[styles.registerPageHeader]}>
          <View style={[styles.registerHeaderIcons]}>
          <Pressable onPress={() => logout()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => logout()}>
              <Image
                style={styles.tinyLogoRegister}
                source={logo}
              />
            </Pressable>
          </View>
          <ScrollView style={[styles.registerScreenBody]}>
              
              <Text style={[styles.forgotPasswordEmailText]}>Please complete all information for your new account</Text>
              <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }}
                          textAlign='center'
                          onChangeText={newEmailText => setRegisterEmailAddress(newEmailText)}
                          
                          placeholder="Email Address"
                      />
              <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }}
                          textAlign='center'
                          onChangeText={newFirstNameText => setRegisterFirstName(newFirstNameText)}
                          placeholder="First Name"
                      />

                      <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }}
                          textAlign='center'
                          onChangeText={newLastNameText => setRegisterLastName(newLastNameText)}
                          placeholder="Last Name"
                      />
                      
                      <Pressable style={{
                              borderBottomColor: '#113946',
                              borderTopColor: 'white',
                              borderLeftColor: 'white',
                              borderRightColor: 'white',
                              borderWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }} onPress={() => openCalendar()}>
                        <Text style={{
                              textAlign:'center',
                              padding:10,
                              color:'grey'
                          }}>
                    
                          {registerBirthdate.toString() !== '' ?
                            
                            <Text>{registerBirthdate}</Text>
                            :
                            'Birthdate'
                          }
                            
                          </Text>
                      </Pressable>
                      
                     
                      {openCalendarBoolean ? 
                        <DateTimePicker
                          style={{
                            borderColor: '#113946',
                            borderWidth: 4,
                            borderRadius: 30,
                            width:'80%',
                            height: 50,
                            marginLeft:'10%',
                            marginBottom: 10,
                        }}
                          value={new Date()}
                          mode='date'
                          placeholder="select date"
                          minimumDate={new Date(1950, 0, 1)}
                        // format="DD/MM/YYYY"
                        // minDate="01-01-1900"
                        // maxDate="01-01-2000"
                        // confirmBtnText="Confirm"
                        // cancelBtnText="Cancel"
                        // customStyles={{
                        //   dateIcon: {
                        //     position: 'absolute',
                        //     right: -5,
                        //     top: 4,
                        //     marginLeft: 0,
                        //   },
                        //   dateInput: {
                        //     borderColor : "gray",
                        //     alignItems: "flex-start",
                        //     borderWidth: 0,
                        //     // borderBottomWidth: 1,
                        //   },
                        //   placeholderText: {
                        //     fontSize: 17,
                        //     color: "gray"
                        //   },
                        //   dateText: {
                        //     fontSize: 17,
                        //   }
                        // }}
                        onChange={(event, date) => {
                          setBirthdate(event, date);
                        }}
                      />
                      :
                      ''
                    }
                      
                      <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }}
                          textAlign='center'
                          keyboardType="number-pad"
                          onChangeText={newPhoneText => setRegisterPhone(newPhoneText)}
                          placeholder="Phone #"
                      />
                      <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }}
                          textAlign='center'
                          onChangeText={newPasswordText => setRegisterPassword(newPasswordText)}
                          placeholder="Password"
                          secureTextEntry={true}
                      />
                      <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 10,
                          }}
                          textAlign='center'
                          onChangeText={newSecurityQuestionText => setRegisterSecurityQuestion(newSecurityQuestionText)}
                          placeholder="Security Question"
                      />
                      <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: 50,
                              marginLeft:'10%',
                              marginBottom: 30,
                          }}
                          textAlign='center'
                          onChangeText={newSecurityAnswerText => setRegisterSecurityAnswer(newSecurityAnswerText)}
                          placeholder="Security Answer"
                      />
              <Pressable style={[styles.registerPressable2]} onPress={() => createNewAccount()}>
                <Text style={[styles.registerPressableText2]}>Create Account</Text>
              </Pressable>
            </ScrollView>
      </View>
    
      );
    
    }
    else if(page === 'forgotPassword'){
      
      return (
        <View style={[styles.forgotPasswordScreen]}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => logout()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
          </View>
            <Pressable onPress={() => logout()}>
              <Image
                style={styles.tinyLogo}
                source={logo}
              />
            </Pressable>
          <View >
          {!emailAddressValidated ? 
            <ScrollView style={[styles.forgotPasswordScreenBody]}>
              
              <Text style={[styles.forgotPasswordEmailText]}>Please enter the email address for your account</Text>
              <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: '15%',
                              marginLeft:'10%'
                          }}
                          textAlign='center'
                          onChangeText={newUsernameText => setEmailAddress(newUsernameText)}
                          placeholder="someone@blessings.com"
                      />

              <Pressable style={[styles.validateEmailPressable]} onPress={() => validateEmail()}>
                <Text style={[styles.validateEmailPressableText]}>Validate Email</Text>
              </Pressable>
            </ScrollView>
            :
            <ScrollView style={[styles.forgotPasswordScreenBody]}>
              
              <Text style={[styles.forgotPasswordEmailText]}>Email {emailAddress} Validated!</Text>

              <Text style={[styles.forgotPasswordEmailText]}>Security Question: {currentSecurityQuestion}</Text>
              <TextInput
                    style={{
                        borderColor: '#113946',
                        borderBottomWidth: 4,
                        width:'80%',
                        height: '12%',
                        marginLeft:'10%'
                    }}
                    textAlign='center'
                    onChangeText={newUsernameText => setSecurityAnswerValidation(newUsernameText)}
                    placeholder="Security Question Answer"
                />
              <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              width:'80%',
                              height: '12%',
                              marginLeft:'10%',
                              marginTop:10,
                          }}
                          textAlign='center'
                          onChangeText={newUsernameText => setNewPassword1(newUsernameText)}
                          placeholder="New Password"
                          secureTextEntry={true}
                      />
              <TextInput
                          style={{
                              borderColor: '#113946',
                              borderBottomWidth: 4,
                              marginTop:10,
                              width:'80%',
                              height: '12%',
                              marginLeft:'10%'
                          }}
                          textAlign='center'
                          onChangeText={newUsernameText => setNewPassword2(newUsernameText)}
                          placeholder="Confirm New Password"
                          secureTextEntry={true}
                      />
              <Pressable style={[styles.setNewPasswordPressable]} onPress={() => setNewPassword()}>
                <Text style={[styles.validateEmailPressableText]}>Set New Password</Text>
              </Pressable>
            </ScrollView>
            }
        </View>
      </View>
    
      );
    
    }
    else if(page === 'home'){
      return (
        
        <View style={styles.scrollViewHome}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <Pressable onPress={() => navigateHome()}>
            <Image
              style={styles.tinyLogo}
              source={logo}
            />
          </Pressable>
          
          <View style={styles.homeContentView}>
            <Text style={{fontSize:30, marginBottom:30, fontStyle:'italic', color:'#113946'}}>Welcome {runningUser.firstname} </Text>
            <Text >
              <Text style={styles.homeText}>
                And this is eternal life, that they know You, the only true God, and Jesus Christ whom you have sent. John 17:3
              </Text>
              {'\n'}
              {'\n'}
              {'\n'}
              <Text style={styles.homeText2}>
                {runningUser.firstname}, may God richly bless you as you grow in your walk with Him
              </Text>
              {'\n'}
            </Text>
          </View>
          <View style={styles.homeButtonContainer}>
            <Pressable style={styles.myDailyDevotionPressable} onPress={() => openDevoTypeSelector()}>
              <Text style={styles.myDailyDevotionPressableText}>My Daily Devotion</Text>
            </Pressable>
            <Pressable style={styles.myPrayerListPressable} onPress={() => navigateToPrayerList()}>
              <Text style={styles.myPrayerListPressableText}>My Prayer List</Text>
            </Pressable>
          </View>
          
              <View style={styles.centeredViewFamilyDevo}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={devoSelectorVisible}
                  onRequestClose={() => {
                    setDevoSelectorVisible(!devoSelectorVisible);
                  }}>
                <View style={styles.centeredViewFamilyDevo2}>
                  <View style={styles.modalViewFamilyDevo}>
                    <Text style={styles.modalText}>Enter a devotion topic for today</Text>
                    <SafeAreaView style={styles.container}>
                      <TextInput
                        style={{
                            borderColor: '#113946',
                            borderBottomWidth: 4,
                            width:250,
                            height: '55%',
                        }}
                        textAlign='center'
                        onChangeText={newUsernameText => setDevotionTopicText(newUsernameText)}
                        onEndEditing={() => setDevoType()}
                        placeholder="Devotion Topic"
                    />
                    </SafeAreaView>
                    <Pressable
                      style={[styles.circleButtonDetailCloseModal]}
                      onPress={() => devoSelectorModalclose()}>
                      <MaterialIcons name="close" size={25} color="white" />
                    </Pressable>

                      {submitDevoButtonDisabled ?
                        ''
                        : 
                        <Pressable
                          style={[styles.circleSubmitNewRequest]}
                          onPress={() => getDevo()}
                          disabled={submitDevoButtonDisabled}
                        >
                        <MaterialIcons name="send" size={30} color="#EAD7BB" />
                      </Pressable>}
                    
                  </View>
                </View>
              </Modal>

              {/* Family Devo Modal */}
              <Modal
                  animationType="slide"
                  transparent={true}
                  visible={familyDevoSelectorVisible}
                  onRequestClose={() => {
                    setFamilyDevoSelectorVisible(!familyDevoSelectorVisible);
                  }}>
                <View style={styles.centeredViewFamilyDevo}>
                  <View style={styles.modalViewFamilyDevo}>
                    <Text style={styles.modalText}>Enter a topic for family devotions</Text>
                    <SafeAreaView style={styles.container}>
                      <TextInput
                        style={{
                            borderColor: '#113946',
                            borderBottomWidth: 4,
                            width:250,
                            height: '55%',
                        }}
                        textAlign='center'
                        onChangeText={newUsernameText => setDevotionTopicText(newUsernameText)}
                        onEndEditing={() => setDevoType()}
                        placeholder="Family Devotion Topic"
                    />
                    </SafeAreaView>
                    <Pressable
                      style={[styles.circleButtonDetailCloseModal]}
                      onPress={() => familyDevoSelectorModalclose()}>
                      <MaterialIcons name="close" size={25} color="white" />
                    </Pressable>

                      {submitDevoButtonDisabled ?
                        ''
                        : 
                        <Pressable
                          style={[styles.circleSubmitNewRequest]}
                          onPress={() => getFamilyDevo()}
                          disabled={submitDevoButtonDisabled}
                        >
                        <MaterialIcons name="send" size={30} color="#EAD7BB" />
                      </Pressable>}
                    
                  </View>
                </View>
              </Modal>
              {/* <View style={styles.homeButtonContainer}>
              <Pressable style={styles.myDailyDevotionPressable} onPress={() => openDevoTypeSelector()}>
                <Text style={styles.myDailyDevotionPressableText}>My Daily Devotion</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressable} onPress={() => navigateToPrayerList()}>
                <Text style={styles.myPrayerListPressableText}>My Prayer List</Text>
              </Pressable>
          </View> */}
            </View>
            
        </View>
    
      );
    
    }
    else if(page === 'devotion'){
      return (
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoDevotions}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myPrayerClosetText]}>My Daily Bread</Text>
          </View>
          <PersonalDevotionPage selected={selected} runningUser={runningUser} devotionTopicText={devotionTopicText} db={db}></PersonalDevotionPage>
        </View>
      );
    }
    else if(page === 'familyDevotions'){
      return (
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoDevotions}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myPrayerClosetText]}>Family Devotions</Text>
          </View>
          <FamilyDevotionPage selected={selected} runningUser={runningUser} devotionTopicText={devotionTopicText} db={db}></FamilyDevotionPage>
        </View>
      );
    }
    else if(page === 'prayerList'){
      return (
        <View style={styles.scrollViewPrayerList}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myPrayerClosetText]}>My Prayer Closet
              
            </Text>
          </View>
          <NewPrayerRequest runningUser={runningUser} db={db}></NewPrayerRequest> 
        </View>
      )
    }
    
    else if(page === 'joinPrayerGroup'){
      return(
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myPrayerClosetText]}>Join A Prayer Group
              
            </Text>
          </View>
          <JoinAPrayerGroup runningUser={runningUser} db={db}></JoinAPrayerGroup> 
        </View>
      )
      
    }
    else if(page === 'prayerGroup'){
      return (
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myPrayerClosetText]}>My Prayer Groups
              
            </Text>
          </View>
          <PrayerGroup runningUser={runningUser} db={db}></PrayerGroup> 
        </View>
      )
    }
    else if(page === 'navigation'){
      return (
            <View style={styles.scrollView}>
              <View style={[styles.homeHeaderIcons]}>
                <Pressable onPress={() => navigateHome()} >
                    <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
                </Pressable>
              </View>
              <View style={styles.prayerListHeader}>
                <Pressable onPress={() => navigateHome()}>
                  <Image
                    style={styles.tinyLogoPrayerList}
                    source={logo}
                  />
                </Pressable>
                <Text style={[styles.myNavigationMenuText]}>Navigation Menu
                  
                </Text>
              
              </View>
            
            <ScrollView style={styles.scrollViewNavigation}>
              <Pressable style={styles.myDailyDevotionPressableNavigation} onPress={() => navigateHome()}>
                <Text style={styles.myDailyDevotionPressableTextNavigation}>Home</Text>
              </Pressable>
              <Pressable style={styles.myDailyDevotionPressableNavigation} onPress={() => openDevoTypeSelector()}>
                <Text style={styles.myDailyDevotionPressableTextNavigation}>My Daily Devotion</Text>
              </Pressable>
              <Pressable style={styles.myDailyDevotionPressableNavigation} onPress={() => openFamilyDevoTypeSelector()}>
                <Text style={styles.myDailyDevotionPressableTextNavigation}>Family Devotion</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateToDevotionHistory()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>Previous Devotions</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateToPrayerList()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>My Prayer List</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateHistory()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>My Answered Prayers</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateToPrayerGroups()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>My Prayer Groups</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateGroupHistory()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>Group Answered Prayers</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateToJoinPrayerGroups()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>Join A Prayer Group</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateResources()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>Resources</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => navigateAbout()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>About/Contact</Text>
              </Pressable>
              <Pressable style={styles.myPrayerListPressableNavigation} onPress={() => logout()}>
                <Text style={styles.myPrayerListPressableTextNavigation}>Logout</Text>
              </Pressable>
            </ScrollView>
          </View>
          
        
      )
    }
    else if(page === 'navigateHistory'){

      return(
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myNavigationMenuText]}>Answered Prayers
              
            </Text>
          
          </View>
          <PrayerHistoryPage runningUser={runningUser} db={db}></PrayerHistoryPage>
        </View>
      )
    }
    else if(page === 'navigateDevotionHistory'){

      return(
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myNavigationMenuText]}>Devotions History
              
            </Text>
          
          </View>
          <DevotionHistoryPage runningUser={runningUser} db={db}></DevotionHistoryPage>
        </View>
      )
    }
    else if(page === 'navigateGroupHistory'){

      return(
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myNavigationMenuText2]}>Group Prayers Answered
              
            </Text>
          </View>
          <GroupPrayerHistoryPage runningUser={runningUser} db={db}></GroupPrayerHistoryPage>
        </View>
      )
    }
    // else if(page === 'churchmap'){

    //   return(
    //     <View style={styles.scrollView}>
    //         <View style={[styles.homeHeaderIcons]}>
    //           <Pressable onPress={() => navigateHome()} >
    //               <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
    //           </Pressable>
    //           <Pressable onPress={() => openMenu()} >
    //               <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
    //           </Pressable>
    //         </View>
    //       <Pressable onPress={() => navigateHome()}>
    //         <Image
    //           style={styles.tinyLogo}
    //           source={logo}
    //         />
    //       </Pressable>
    //     <ChurchMaps runningUser={runningUser}></ChurchMaps>
    //     </View>
    //   )
    // }
    else if(page === 'resources'){
      return(
        <View style={styles.scrollView}>
          <View style={[styles.homeHeaderIcons]}>
            <Pressable onPress={() => navigateHome()} >
                <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
            </Pressable>
            <Pressable onPress={() => openMenu()} >
                <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
            </Pressable>
          </View>
          
          <View style={styles.prayerListHeader}>
            <Pressable onPress={() => navigateHome()}>
              <Image
                style={styles.tinyLogoPrayerList}
                source={logo}
              />
            </Pressable>
            <Text style={[styles.myResourceMenuText]}>Resources
              
            </Text>
          </View>
          <ResourcesPage></ResourcesPage>
        </View>
      )
    }
    else if(page === 'about'){

      return(
        <View style={styles.scrollView}>
            <View style={[styles.homeHeaderIcons]}>
              <Pressable onPress={() => navigateHome()} >
                  <MaterialIcons style={[styles.homeIcon]} name="home" size={30} color="black" />
              </Pressable>
              <Pressable onPress={() => openMenu()} >
                  <MaterialIcons style={[styles.homeMenuIcon]} name="menu" size={0} color="black" />
              </Pressable>
            </View>
          <Pressable onPress={() => navigateHome()}>
            <Image
              style={styles.tinyLogo}
              source={logo}
            />
          </Pressable>
        <AboutPage runningUser={runningUser} ></AboutPage>
        <Pressable style={styles.bottomButton} onPress={() => openFeedbackRequest()}>
          <Text style={styles.bottomButtonText}>Send Feedback</Text>
        </Pressable>
        <Modal
            animationType="slide"
            transparent={true}
            visible={feedbackModalVisible}
            onRequestClose={() => {
              setFeedbackModalVisible(!feedbackModalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Pressable style={styles.circleButtonDetailCloseModal2} onPress={() => closeFeedbackRequest()}>
                <MaterialIcons name="close" size={25} color="white" />
              </Pressable>
                <Text style={styles.nameInputText}>Feedback/Comment/Issue</Text>
                <TextInput
                    style={{
                        borderColor: '#113946',
                        // borderWidth: 4,
                        // borderRadius: 30,
                        borderBottomWidth: 4,
                        width:'95%',
                        height: '65%',
                        marginBottom: 40,
                    }}
                    textAlign='center'
                    onChangeText={newText => setText(newText)}
                    placeholder="Write feedback and click below to send"
                    value={text}
                />
                <Pressable style={styles.circleSubmitNewRequest} onPress={() => sendFeedback()}>
                    <MaterialIcons name="send" size={30} color="#EAD7BB" />
                </Pressable>
                {/* <Text style={styles.requestInputText}>What is the request?</Text>
                <TextInput
                    style={{
                        // height: 100,
                        borderColor: '#113946',
                        // borderWidth: 4,
                        // borderRadius: 30,
                        borderBottomWidth: 4,
                        width:'95%',
                        height: '64%',
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
                  <Pressable style={styles.circleSubmitNewRequest} onPress={() => editDetails(id)} visible={showEditButton}>
                    <MaterialIcons name="update" size={30} color="#EAD7BB" />
                  </Pressable>
                } */}
              
              
              </View>
            </View>
          </Modal>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
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
  circleButtonDetailCloseModal: {
    width:40,
    height: 40,
    margin:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 42,
    backgroundColor: '#fff',
    position: 'absolute',
    right:-20,
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
  centeredViewFamilyDevo:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    height: '80%',
  },
  centeredViewFamilyDevo2:{
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalViewFamilyDevo:{
    width: '80%',
    height: '60%',
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
  modalText: {
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
    fontSize: 20,
    color:'#113946'
  },
  myDailyDevotionPressableNavigation:{
    width: '90%',
    borderRadius: 42,
    backgroundColor: '#113946',
    padding: 20,
    elevation: 2,
    marginLeft: '5%',
    marginBottom:10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  myDailyDevotionPressableTextNavigation:{
    color: '#EAD7BB',
    backgroundColor: '#113946',
    textAlign: 'center',
    fontSize: 25,
  },
  myPrayerListPressableNavigation:{
    width: '90%',
    borderRadius: 42,
    backgroundColor: '#113946',
    padding: 20,
    elevation: 2,
    marginBottom:10,
    marginLeft: '5%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  myPrayerListPressableTextNavigation:{
    color: '#EAD7BB',
    backgroundColor: '#113946',
    textAlign: 'center',
    fontSize: 25,
  },
  scrollView: {
    flex: 2,
    backgroundColor: '#BCA37F',
  },
  scrollViewHome:{
    backgroundColor: '#BCA37F',
    height: '100%',
  },
  scrollViewLogin: {
    height: '100%',
    backgroundColor: '#BCA37F',
  },
  scrollViewPrayerList:{
    flex: 2,
    backgroundColor: '#BCA37F',
  },
  scrollViewNavigation:{
    marginTop: 5,
    backgroundColor: '#BCA37F',
    height:'77%'
  },
  tinyLogo: {
    ...Platform.select({
      ios: {
        width: 380,
        height: 170,
        marginTop: 15,
        marginLeft: 5,
      },
      android:{
        width: 400,
        height: 170,
        marginTop: 15,
        marginLeft: 5,
      }
    }),
   
  },
  tinyLogoRegister: {
    width: 400,
    height: 170,
    marginTop: 55,
    marginLeft: 5,
  },
  tinyLogoDevotions: {
    width: 120,
    height: 50,
    marginTop: 15,
    marginLeft: 5,
  },
  tinyLogoPrayerList: {
    width: 120,
    height: 50,
    marginTop: 15,
    marginLeft: 5,
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
  },
  myDailyDevotionPressable: {
    borderRadius: 10,
    backgroundColor: '#113946',
    padding: 20,
    elevation: 2,
    width:'45%',
    marginEnd: '10%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  myPrayerListPressable: {
    ...Platform.select({
      ios: {
        borderRadius: 10,
        backgroundColor: '#113946',
        width:'45%',
        padding: 20,
        elevation: 2,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      },
      android:{
        borderRadius: 10,
        backgroundColor: '#113946',
        width:'45%',
        padding: 20,
        elevation: 2,
        shadowOffset: {
          width: 0,
          height: 2,
        },
      }
    }),
    
  },
  myDailyDevotionPressableText: {
    color: '#EAD7BB',
    backgroundColor: '#113946',
    textAlign: 'center',
    fontSize: 15,
    
  },
  myPrayerListPressableText: {
    ...Platform.select({
      ios: {
        color: '#EAD7BB',
        backgroundColor: '#113946',
        textAlign: 'center',
        fontSize: 15,
      },
      android:{
         color: '#EAD7BB',
        backgroundColor: '#113946',
        textAlign: 'center',
        fontSize: 15,
      }
    }),
   
  },
  LoginPressable:{
    borderRadius: 10,
    backgroundColor: '#113946',
    width:'50%',
    padding: 20,
    marginLeft: '25%',
    elevation: 2,
    margin: 10,
    marginBottom: 30,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  homeButtonContainer: {
    ...Platform.select({
      ios: {
        // position: 'absolute',
        // bottom:35,
        display: 'inline',
        flexDirection: 'row',
        margin: 10,
      },
      android:{
        position: 'absolute',
        bottom:5,
        display: 'inline',
        flexDirection: 'row',
        margin: 10,
      }
    }),
    
  },
  homeContentView: {
    fontSize:25,
    fontStyle:'italic',
    color: '#113946',
    margin: 5,
    backgroundColor: '#BCA37F',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
  },
  homeContentView2: {
    fontSize:25,
    fontStyle:'italic',
    color: '#113946',
    margin: 5,
    backgroundColor: '#BCA37F',
    borderRadius: 0,
    padding: 35,
    height: '60%'
  },
  nameInputText:{
    textAlign:'center'
  },
  myPrayerClosetText:{
    fontSize:30,
    textAlign:'right',
    marginLeft:10,
    marginRight:10,
    color: '#C56E33',
    paddingTop: 20,
  },
  myNavigationMenuText:{
    fontSize:30,
    textAlign:'right',
    marginLeft:10,
    marginRight:10,
    color: '#C56E33',
    paddingTop: 20,
    marginBottom: 40
  },
  myResourceMenuText:{
    fontSize:30,
    textAlign:'right',
    marginLeft:50,
    marginRight:10,
    color: '#C56E33',
    paddingTop: 20,
    marginBottom: 40
  },
  myNavigationMenuText2:{
    fontSize:22,
    textAlign:'right',
    marginLeft:15,
    color: '#C56E33',
    paddingTop: 25,
    marginBottom: 40
  },
  prayerListHeader:{
    display: 'inline',
    flexDirection: 'row',
  },
  homeHeaderIcons:{
    ...Platform.select({
      ios: {
        marginTop:50
      },
    }),
    // marginTop:30,
    backgroundColor: '#113946',
    height: 50,
    padding:5,
    width:'100%'
  },
  registerHeaderIcons:{
    backgroundColor: '#113946',
    height: 50,
    width:'100%'
  },
  registerHeaderIconsLoading:{
    backgroundColor: '#113946',
    height: 50,
    width:'100%',
    position:'absolute',
    top:0
  },
  homeIcon: {
    fontSize: 40,
    backgroundColor: '#113946',
    color: '#BCA37F',
    textAlign:'right',
    position: 'absolute',
    left: 1,
    top:1
  },
  homeMenuIcon:{
    fontSize: 40,
    backgroundColor: '#113946',
    color: '#BCA37F',
    position: 'absolute',
    right: 1,
    top:1
  },
  devotionBodyLoadingView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: '#BCA37F',
  },
  loginPageLoginButtons:{
    display: 'inline',
    flexDirection: 'row',
    marginBottom:60,
  },
  registerPressable: {
    ...Platform.select({
      ios: {
        backgroundColor: '#113946',
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        right:15,
        padding:10,
        bottom:-30,
        borderRadius:30,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      android:{
        backgroundColor: '#113946',
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        right:5,
        padding:10,
        bottom:-50,
        borderRadius:30,
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
  registerPressableText: {
    color: '#BCA37F',
  },
  registerPressableText2: {
    color: '#C56E33',
    fontSize:25,
  },
  forgotPasswordPressable: {
     ...Platform.select({
      ios: {
        backgroundColor: '#113946',
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        borderRadius:30,
        left:15,
        padding:10,
        bottom:-30,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      android:{
        backgroundColor: '#113946',
        alignItems: 'center',
        justifyContent: 'center',
        position:'absolute',
        borderRadius:30,
        left:5,
        padding:10,
        bottom:-50,
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
  forgotPasswordPressableText: {
    color: '#BCA37F'
  },
  forgotPasswordScreen:{
    backgroundColor:'#BCA37F',
    height:'100%',
  },
  forgotPasswordScreenScroll:{
    backgroundColor:'#BCA37F',
    height:'100%',
  },
  forgotPasswordScreenBody:{
    height:'100%',
  },
  forgotPasswordEmailText:{
    marginTop: 20,
    marginBottom: 20,
    textAlign:"center",
    color: '#C56E33',
    fontSize:15
  },
  setNewPasswordPressable:{
    marginLeft:'25%',
    height: '12%',
    width: '50%',
    marginTop:'5%',
    backgroundColor:'#113946',
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom:60,
  },
  validateEmailPressable:{
    marginLeft:'25%',
    height: '20%',
    width: '50%',
    marginTop:'5%',
    backgroundColor:'#113946',
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom:100,
  },
  validateEmailPressableText:{
    color: '#C56E33'
  },
  registerPressable2:{
    height: '10%',
    width: '80%',
    marginLeft: '10%',
    marginBottom:60,
    backgroundColor:'#113946',
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  registerScreenBody:{
    marginTop:'45%',
    marginBottom:10,
    height:'65%',
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
});
