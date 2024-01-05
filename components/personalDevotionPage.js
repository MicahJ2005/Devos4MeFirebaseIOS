import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import {API_KEY} from '@env';
import { collection, getDocs, query, where,  addDoc  } from "firebase/firestore";

const personalDevotionPage = (devoTypeselected) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [devotionBody, setDevotionBody] = useState('');
    const [devotionTitle, setDevotionTitle] = useState('');
    const [devotionScripture, setDevotionScripture] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {
        console.log('personalDevotionPage devoTypeselected.selected= ', devoTypeselected.selected);
        console.log('runningUser in personalDevotionPage:', devoTypeselected.runningUser[0]);
        console.log('personalDevotionPage devoTypeselected.devotionTopicText= ', devoTypeselected.devotionTopicText);
        console.log('APIKEY: ', API_KEY);
        getAIDevo(devoTypeselected)
    }, []);

    const getAIDevo = async (params) => {
    console.log('personalDevotionPage getAIDevo devoType', params);
    console.log('personalDevotionPage getAIDevo.selected= ', params.selected);
    console.log('personalDevotionPage devoTypeselected.devotionTopicText= ', params.devotionTopicText);
    console.log('runningUser in getAIDevo:', params.runningUser);
    let newDate = new Date();
    console.log('Day', newDate.getDate());
    console.log('Month', newDate.getMonth());
    console.log('Year', newDate.getFullYear());
    let thisMonth = newDate.getMonth() + 1;
    let reformattedDate = newDate.getFullYear() +'-'+ thisMonth +'-'+ newDate.getDate();

    const q = query(collection(params.db, "devotions"), where("userid", "==", params.runningUser.id), where("devodate", "==", reformattedDate));
    console.log('q check: ', q);
    const querySnapshot = await getDocs(q);
    console.log('querySnapshot check: ', querySnapshot.size);
    if(querySnapshot.size > 0){
      let userwrapped;
      querySnapshot.forEach((doc) => {
        console.log('USER signed in: ', doc.id, " => ", doc.data());
        setDevotionTitle(doc.data().title);
        setDevotionScripture(doc.data().scripture);
        setDevotionBody(doc.data().body);
        setLoading(false);
      });
    }
    else{
        console.log('no devo yet today... Generating');
    
        try {
            let contentToSend = `"Provide just a Bible verse about ${params.devotionTopicText}"`;
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{"role": "user", "content": contentToSend}],
                    max_tokens: 300,
                    temperature: 1.0,
                }),
            
            })
            const jsonScripture = await response.json(); 
                console.log("this is the result devotionScripture", jsonScripture); 
                setDevotionScripture(jsonScripture.choices[0].message.content);
                console.log("this is the result devotionScripture", jsonScripture.choices[0].message.content);
            if(jsonScripture.choices[0].message.content != null){
                console.log("MADE IT TO THE TITLE with scripture: ", jsonScripture.choices[0].message.content);
                let contentToSend = `"Provide just a devotional title based on ${jsonScripture} but don't include any scripture in this response. Try not to use any form of the word 'embrace'"`;
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: "gpt-3.5-turbo",
                        messages: [{"role": "user", "content": contentToSend}],
                        max_tokens: 300,
                        temperature: 1.0,
                    }),
                
                })
                const jsonTitle = await response.json();  
                setDevotionTitle(jsonTitle.choices[0].message.content);
                console.log("this is the result devotionTitle", jsonTitle.choices[0].message.content);
                if(jsonTitle.choices[0].message.content != null){
                    console.log("MADE IT TO THE DEVO WRITTING with title: ", jsonTitle.choices[0].message.content);
                    let contentToSend = `"Write a brief personal devotional for ${params.runningUser.firstname}, based on the title ${jsonTitle.choices[0].message.content} and scripture ${jsonScripture.choices[0].message.content}, with a relevant analogy. Try not to use any form of the word 'embrace' and do not add '[Your Name]', or any salutation, at the end"`;
                    const response = await fetch("https://api.openai.com/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            "Content-type": "application/json",
                            "Authorization": `Bearer ${API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "gpt-3.5-turbo",
                            messages: [{"role": "user", "content": contentToSend}],
                            max_tokens: 700,
                            temperature: 1.0,
                        }),
                    
                    })
                    const jsonDevotion = await response.json();  
                    setDevotionBody(jsonDevotion.choices[0].message.content);
                    console.log("this is the result devotionTitle", jsonDevotion.choices[0].message.content);
                    
                    setLoading(false);
                    console.log('devotionTitle AFTER LOAD: ', jsonTitle.choices[0].message.content);
                    console.log('devotionScripture AFTER LOAD: ', jsonScripture.choices[0].message.content);
                    console.log('devotionBOdy AFTER LOAD: ', jsonDevotion.choices[0].message.content);
                    console.log('devotion Running UserId: ', params.runningUser.id);
                    const newDevo = await addDoc(collection(params.db, "devotions"), {
                        title: jsonTitle.choices[0].message.content,
                        scripture: jsonScripture.choices[0].message.content,
                        body: jsonDevotion.choices[0].message.content,
                        userid: params.runningUser.id,
                        searchinput: params.devotionTopicText,
                        devodate: reformattedDate
                      });
                      console.log('newDevo', newDevo.id);
                      if(newDevo.id != null){
                        console.log('Devo Saved!');
                      }
                      else{
                        Alert.alert('Issue Saving Devotion');
                      }
                }
            }
                
            } catch (error) {
                console.error("this is the result", error);
            }  
        }
    }

    if(loading){
        return(
        
            <View style={[styles.devotionBodyLoadingView]}>
                {/* <Pressable style={styles.bottomButton} onPress={() => testDevoToDB()}>
                    <Text style={styles.bottomButtonText}>Test DEvo To DB</Text>
                </Pressable> */}
                <ActivityIndicator size="large" color="#C56E33" />
                
                <Text >
                    {'\n'}
                    {'\n'}
                    Writing your personal devotion... 
                    {'\n'}
                    This may take a minute or two...
                </Text>
            </View>
            
        );
    }
    else{
        return(
        
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
            
        );
    }
    
}

const styles = StyleSheet.create({
   
    devotionBodyView: {
        flex: 1,
        marginTop: 22,
        backgroundColor: '#BCA37F',
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
})

export default personalDevotionPage;
