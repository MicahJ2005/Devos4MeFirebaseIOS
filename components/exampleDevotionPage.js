import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import { collection, getDocs, query, where,  addDoc  } from "firebase/firestore";

const depression = [{
    "Title": "Finding Hope in the Midst of Darkness",
    "Scripture": "Psalm 42:11 (NIV) - \"Why, my soul, are you downcast? Why so disturbed within me? Put your hope in God, for I will yet praise him, my Savior and my God.\"",
    "Devotional": "In the journey of life, we often encounter seasons of darkness and despair, moments when our souls seem downcast and our spirits troubled. Depression is a heavy burden that many people carry, and it can leave us feeling lost and disconnected from the world around us. But in these difficult times, we can find solace, hope, and healing in God's Word.\n\n Psalm 42:11 is a verse that speaks directly to those who are wrestling with depression. The psalmist asks their own soul, \"Why are you downcast? Why are you disturbed within me?\" It's a powerful reminder that even in the depths of despair, we can take a moment to reflect on our feelings and acknowledge our pain.\n\n But the psalmist doesn't stop there; they provide a solution that can be a source of encouragement for us today. They say, \"Put your hope in God, for I will yet praise him, my Savior and my God.\" In the midst of depression, we have a choice to make. We can choose to fix our gaze on the pain, or we can choose to turn our eyes toward God, the source of our hope and salvation.\n\n Putting our hope in God doesn't mean that depression will magically disappear, but it means we can find strength and comfort in His presence. We can pour out our hearts to Him, knowing that He is our Savior and our refuge. In Him, we can find the hope that sustains us through the darkest nights and leads us toward the dawn of a new day.\n\n If you're struggling with depression, remember that you are not alone. Reach out to friends, family, or a professional who can offer support. But above all, reach out to God in prayer. Pour out your heart to Him, just as the psalmist did. Share your pain, your doubts, and your fears. And as you do, know that God is ready to offer His love and grace to heal your wounded spirit.\n\n Take some time today to meditate on Psalm 42:11 and consider the state of your soul. Are you downcast, disturbed, or burdened by depression? If so, choose to put your hope in God, for He is the source of true and lasting hope. In Him, you will find the strength to endure and the promise of brighter days ahead. Remember, you are loved, and there is hope even in the midst of darkness."
 }];

 const fear = [{
    "Title": "Overcoming Fear with Faith",
    "Scripture": "2 Timothy 1:7 (NIV) - 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.'",
    "Devotional": "Fear is a powerful emotion that can paralyze us and keep us from living the life God intends for us. We all face moments of fear and uncertainty, whether it's fear of the unknown, fear of failure, or fear of what others may think. But the Bible reminds us that as believers, we are not called to live in fear.\n\n2 Timothy 1:7 tells us that the Spirit God has given us is not a spirit of fear but a spirit of power, love, and self-discipline. In other words, God empowers us to overcome our fears. Instead of allowing fear to control our lives, we can tap into the power of the Holy Spirit dwelling within us.\n\nWhen fear creeps in, we can turn to God in prayer and seek His guidance. We can ask for the strength and courage to face our fears head-on. God's love for us is a constant source of comfort and assurance. Knowing that we are loved by the Creator of the universe can cast out fear and replace it with faith.\n\nSelf-discipline is another essential tool in overcoming fear. It means controlling our thoughts, focusing on the truth of God's Word, and not allowing fear to run rampant in our minds. We can choose to dwell on God's promises, His faithfulness, and His ability to guide us through any situation.\n\nAs you face your fears today, remember that you have the Spirit of God within you. You have the power to overcome fear with faith, the love of a heavenly Father who cares for you, and the self-discipline to reject fear's grip on your life. Trust in God, and He will help you conquer your fears and lead you to a life of boldness and confidence in Him."
 }]

 const strength =[{
    "Title": "Strength in the Lord",
    "Scripture": "Isaiah 40:31 (NIV) - 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'",
    "Devotional": "Life often presents us with challenges that test our strength, both physically and spiritually. In those moments, it's easy to feel weak, weary, and burdened. But as believers, we have a promise in the Bible that reminds us where true strength comes from.\n\nIsaiah 40:31 tells us that when we place our hope in the Lord, our strength will be renewed. It's a beautiful picture of God's sustaining power. Just as eagles soar effortlessly on the wind, God enables us to rise above our difficulties and challenges. When we trust in Him, we find the strength to keep going even when the path seems long and exhausting. God's strength is not limited to extraordinary moments but is with us every day. When we run, we won't grow weary, and when we walk, we won't be faint. This means that God's strength is available in our most ordinary tasks and in our most challenging trials.\n\nSo, where do you find your strength today? Is it in your own abilities, or is it in the Lord? Take a moment to put your hope in Him. Pray for His strength to sustain you and carry you through whatever you're facing. Trust that He will provide the endurance and resilience you need.\n\nAs you go about your day, remember that true strength is found in the Lord. Rely on His power, and you will find the ability to soar above life's challenges, run the race set before you, and walk in His grace without growing faint."
 }]

 const jobLoss = [{
        "Title": "Finding Hope After Job Loss",
        "Scripture": "Jeremiah 29:11 (NIV) - 'For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.'",
        "Devotional": "Job loss can be a devastating and disheartening experience, leaving us feeling lost and uncertain about the future. In such times of distress, it's important to remember that God has a plan for each one of us, even when we face unexpected setbacks.\n\nJeremiah 29:11 provides a reassuring promise from the Lord: 'For I know the plans I have for you,' declares the Lord, 'plans to prosper you and not to harm you, plans to give you hope and a future.' Even in the midst of adversity, God's plans for our lives remain intact. He has a purpose for us that goes beyond our current circumstances.\n\nWhen you lose your job, it's easy to focus on the immediate challenges and uncertainties. But God's perspective is broader. He sees a future filled with hope and opportunities that you may not yet discern. This period of transition can be an invitation to seek God's guidance and align your path with His divine purpose.\n\nWhile the journey through job loss may be difficult, it's also a chance to lean on God's wisdom, strength, and provision. He is a faithful God who walks with you through every trial. Trust that He is at work in your life, orchestrating a future that aligns with His best intentions for you.\n\nTake this time to pray, seek His guidance, and trust in His promise. God's plans for you are filled with hope, and your future remains in His capable and caring hands. As you navigate the challenges of job loss, remember that He has a purpose and a path uniquely designed for you."
     }]

 const loss =[{
    "Title": "Finding Comfort in Times of Loss",
    "Scripture": "Psalm 34:18 (NIV) - 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.'",
    "Devotional": "Loss is an inevitable part of life. Whether it's the loss of a loved one, a job, a relationship, or something dear to your heart, it can leave you feeling broken and overwhelmed. During these difficult times, it's crucial to remember that God is near to those who are hurting.\n\nPsalm 34:18 reassures us of this truth: 'The Lord is close to the brokenhearted and saves those who are crushed in spirit.' In moments of profound loss, God draws near to us with His comforting presence. He understands our pain and offers solace to the wounded heart.\n\nWhen you experience loss, it's normal to feel a range of emotions, including grief, sadness, and even anger. These feelings are part of the healing process. God doesn't expect you to hide your pain or put on a facade. Instead, He invites you to bring your brokenness to Him.\n\nAs you grieve, pour out your heart to God in prayer. Share your sorrows, your questions, and your longing for comfort. Trust that He is with you in the midst of your pain, offering a sense of peace that surpasses understanding.\n\nWhile loss can be agonizing, it can also be an opportunity to grow closer to God. In your brokenness, you may discover a deeper reliance on His grace and a newfound understanding of His compassion. God's promise is that He saves those who are crushed in spirit. He brings healing to the wounded heart and restoration to the broken soul.\n\nMay you find comfort in the knowledge that God is near in your times of loss. As you navigate the journey of healing and recovery, let your faith be your anchor, and trust that the One who is close to the brokenhearted will mend your spirit and lead you toward a place of peace and hope."
 }]

 const sickness = [{
    "Title": "Finding Healing and Hope in Sickness",
    "Scripture": "Psalm 41:3 (NIV) - 'The Lord sustains them on their sickbed and restores them from their bed of illness.'",
    "Devotional": "Sickness can be a challenging and disheartening experience, often leaving us feeling weak and vulnerable. During such times, it's essential to remember that God offers us healing and hope, even in the midst of illness.\n\nPsalm 41:3 provides a promise of comfort and restoration: 'The Lord sustains them on their sickbed and restores them from their bed of illness.' When we are sick, God sustains us, offering the strength we need to endure and recover.\n\nIllness can be physically and emotionally draining, but it's in these moments that we can turn to God for His healing touch. He is the ultimate healer, and His power can work miracles in our lives. Our faith can be a powerful catalyst for the restoration of our health.\n\nWhile going through sickness, it's essential to draw near to God in prayer. Seek His guidance, His strength, and His comfort. Trust that He is with you, providing the care and support you need during this challenging time.\n\nRemember that healing is not always immediate, and it may not always take the form we expect. But God's promise is clear - He restores. He can bring you back to health, and He can also bring you spiritual and emotional restoration, even as you face physical challenges.\n\nAs you navigate the difficulties of sickness, maintain your hope in the Lord. Place your trust in His sustaining power, and let His love and grace fill your heart with hope. In sickness, God offers us a chance to draw closer to Him and to experience His restoration and healing, not just in our bodies but in our souls as well."
 }]

 const parenting = [{
    "Title": "Parenting with Wisdom and Love",
    "Scripture": "Proverbs 22:6 (NIV) - 'Start children off on the way they should go, and even when they are old, they will not turn from it.'",
    "Devotional": "Parenting is a remarkable journey filled with challenges and joys, and it's a role that carries great responsibility. The Bible provides guidance on raising children with wisdom and love, starting with Proverbs 22:6: 'Start children off on the way they should go, and even when they are old, they will not turn from it.'\n\nThese words from the book of Proverbs remind us of the importance of teaching our children the values and principles of a godly life. As parents, we have the privilege and duty to shape the character and faith of our children.\n\nOne of the most effective ways to do this is by setting a godly example. Children often learn more from what they see us do than from what we tell them to do. Demonstrating love, kindness, forgiveness, and faith in our own lives can be a powerful influence on our children's spiritual development.\n\nAdditionally, nurturing open communication with our children is vital. Encourage them to ask questions, express their thoughts, and share their concerns. This creates an environment where they can learn about faith, values, and life from a place of trust and understanding.\n\nIt's also crucial to pray for your children. Commit their well-being, growth, and spiritual journey to God in prayer. Seek His guidance in the decisions you make as a parent, and trust that He will provide the wisdom and strength you need.\n\nRemember, parenting is a lifelong journey, and the impact of your guidance may not always be immediately visible. But have faith that as you lead your children on the right path, teaching them about God's love and grace, you are planting seeds that will grow and bear fruit in their lives.\n\nMay you parent with wisdom and love, leaning on God's guidance and trusting in His promise that your efforts to guide your children on the path of faith will not be in vain."
 }]

 const spiritualGrowth = [{
    "Title": "Cultivating Spiritual Growth",
    "Scripture": "2 Peter 3:18 (NIV) - 'But grow in the grace and knowledge of our Lord and Savior Jesus Christ. To Him be glory both now and forever! Amen.'",
    "Devotional": "Spiritual growth is a journey, a path of continuous transformation, and an ongoing process of becoming more like Christ. In 2 Peter 3:18, we are encouraged to 'grow in the grace and knowledge of our Lord and Savior Jesus Christ.'\n\nAs believers, we are called not to remain stagnant but to actively pursue a deeper relationship with Christ. This growth involves increasing in our understanding of His grace and knowledge. The more we learn about Jesus and His teachings, the more we can emulate His character and live in alignment with His will.\n\nOne way to foster spiritual growth is through regular prayer and meditation on God's Word. Spend time in His presence, seeking His guidance, and asking for wisdom and strength. The Bible is a rich source of wisdom and knowledge, and it's through Scripture that we can better grasp the nature and purpose of our faith.\n\nAnother crucial aspect of spiritual growth is community. Engage with fellow believers, attend worship services, join small groups, and share your faith journey. Through interactions with others, we can learn from one another, provide support, and encourage growth together.\n\nEmbrace challenges and trials as opportunities for spiritual growth. God often refines us in the crucible of adversity, shaping our character and deepening our faith. In moments of difficulty, remember that God is using them to mold you into the image of His Son.\n\nIn your pursuit of spiritual growth, be patient with yourself. Growth takes time and effort. There will be seasons of rapid progress and seasons of apparent stagnation, but God is always at work in your life.\n\nAs you strive to 'grow in the grace and knowledge of our Lord and Savior Jesus Christ,' may you find joy in the journey of spiritual growth. May your life be a testament to His transforming power, bringing glory to His name now and forever. Amen."
 }]

const exampleDevotionPage = (devoTypeselected) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [devotionBody, setDevotionBody] = useState('');
    const [devotionTitle, setDevotionTitle] = useState('');
    const [devotionScripture, setDevotionScripture] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {
        console.log('runningUser in exampleDevotionPage:', devoTypeselected);
        runRandomDevotion();
    }, []);

    const runRandomDevotion = () => {
        console.log('in runRandomDevotion');
        let randomInt = Math.floor(Math.random() * (8 - 1 + 1)) + 1;
        // let randomInt = 3;
        console.log('randomInt: ', randomInt);
        switch(randomInt){
            case 1:
                setDevotionTitle(depression[0].Title)
                setDevotionScripture(depression[0].Scripture);
                setDevotionBody(depression[0].Devotional);
                break;
            case 2:
                setDevotionTitle(fear[0].Title)
                setDevotionScripture(fear[0].Scripture);
                setDevotionBody(fear[0].Devotional);
                break;
            case 3:
                setDevotionTitle(strength[0].Title)
                setDevotionScripture(strength[0].Scripture);
                setDevotionBody(strength[0].Devotional);
                break;
            case 4:
                setDevotionTitle(jobLoss[0].Title)
                setDevotionScripture(jobLoss[0].Scripture);
                setDevotionBody(jobLoss[0].Devotional);
                break;
            case 5:
                setDevotionTitle(loss[0].Title)
                setDevotionScripture(loss[0].Scripture);
                setDevotionBody(loss[0].Devotional);
                break;
            case 6:
                setDevotionTitle(sickness[0].Title)
                setDevotionScripture(sickness[0].Scripture);
                setDevotionBody(sickness[0].Devotional);
                break;
            case 7:
                setDevotionTitle(parenting[0].Title)
                setDevotionScripture(parenting[0].Scripture);
                setDevotionBody(parenting[0].Devotional);
                break;
            case 8:
                setDevotionTitle(spiritualGrowth[0].Title)
                setDevotionScripture(spiritualGrowth[0].Scripture);
                setDevotionBody(spiritualGrowth[0].Devotional);
                break;
        }
        setLoading(false);
            
    }

    if(loading){
        return(
        
            <View style={[styles.devotionBodyLoadingView]}>
                {/* <Pressable style={styles.bottomButton} onPress={() => testDevoToDB()}>
                    <Text style={styles.bottomButtonText}>Test DEvo To DB</Text>
                </Pressable> */}
                <ActivityIndicator size="large" color="#C56E33" />
                
                <Text >
                    {'\n\n'}
                    {'\n\n'}
                    Loading your example devotion... 
                    {'\n\n'}
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
                    {'\n\n'}
                </Text>
                <Text style={[styles.devotionScriptureText]}>
                    {devotionScripture}
                    {'\n\n'}
                </Text>
                
                <Text style={[styles.devotionBodyText]}>
                    {devotionBody}
                </Text>
                <Text></Text>
                
                <Text>
                {'\n\n'}
                {'\n\n'}
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

export default exampleDevotionPage;
