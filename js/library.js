// Built-in prayer library: traditional, public-domain texts.
// Wording can differ slightly between traditions; users can edit any prayer after adding it.
// cat: mantra | aarti | chalisa | stuti | other · lang: language of the text (pra = Prakrit)
export const CATEGORIES = ['mantra', 'aarti', 'chalisa', 'stuti', 'other'];

export const LIBRARY = [
  // ---------------- mantras ----------------
  { id: 'gayatri', lang: 'sa', cat: 'mantra', title: 'गायत्री मंत्र', en: 'Gayatri Mantra', deity: 'Savitr', tags: 'gayatri gayatri mantra surya sun om bhur bhuva', target: 108,
    text: `ॐ भूर्भुवः स्वः
तत्सवितुर्वरेण्यं
भर्गो देवस्य धीमहि
धियो यो नः प्रचोदयात् ॥` },
  { id: 'mahamrityunjaya', lang: 'sa', cat: 'mantra', title: 'महामृत्युंजय मंत्र', en: 'Mahamrityunjaya Mantra', deity: 'Shiva', tags: 'mahamrityunjay maha mrityunjaya tryambakam shiv shiva', target: 108,
    text: `ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।
उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥` },
  { id: 'om-namah-shivaya', lang: 'sa', cat: 'mantra', title: 'ॐ नमः शिवाय', en: 'Om Namah Shivaya', deity: 'Shiva', tags: 'om namah shivay shiva panchakshari', target: 108,
    text: 'ॐ नमः शिवाय' },
  { id: 'hare-krishna', lang: 'sa', cat: 'mantra', title: 'हरे कृष्ण महामंत्र', en: 'Hare Krishna Mahamantra', deity: 'Krishna', tags: 'hare krishna hare rama mahamantra iskcon', target: 108,
    text: `हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ।
हरे राम हरे राम राम राम हरे हरे ॥` },
  { id: 'vasudevaya', lang: 'sa', cat: 'mantra', title: 'ॐ नमो भगवते वासुदेवाय', en: 'Om Namo Bhagavate Vasudevaya', deity: 'Vishnu / Krishna', tags: 'om namo bhagavate vasudevaya vishnu krishna dwadashakshari', target: 108,
    text: 'ॐ नमो भगवते वासुदेवाय' },
  { id: 'narayanaya', lang: 'sa', cat: 'mantra', title: 'ॐ नमो नारायणाय', en: 'Om Namo Narayanaya', deity: 'Vishnu', tags: 'om namo narayanaya narayan vishnu ashtakshari', target: 108,
    text: 'ॐ नमो नारायणाय' },
  { id: 'ganapataye', lang: 'sa', cat: 'mantra', title: 'ॐ गं गणपतये नमः', en: 'Om Gam Ganapataye Namah', deity: 'Ganesha', tags: 'om gan gam ganapataye namah ganesh ganpati', target: 108,
    text: 'ॐ गं गणपतये नमः' },
  { id: 'vakratunda', lang: 'sa', cat: 'mantra', title: 'वक्रतुण्ड महाकाय', en: 'Vakratunda Mahakaya', deity: 'Ganesha', tags: 'vakratunda mahakaya ganesh ganpati shloka', target: 11,
    text: `वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ।
निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥` },
  { id: 'shri-ram-jai-ram', lang: 'hi', cat: 'mantra', title: 'श्री राम जय राम', en: 'Shri Ram Jai Ram', deity: 'Rama', tags: 'shri ram jai ram jai jai ram rama taraka mantra', target: 108,
    text: 'श्री राम जय राम जय जय राम' },
  { id: 'hanumate', lang: 'sa', cat: 'mantra', title: 'ॐ श्री हनुमते नमः', en: 'Om Shri Hanumate Namah', deity: 'Hanuman', tags: 'om shri hanumate namah hanuman bajrang', target: 108,
    text: 'ॐ श्री हनुमते नमः' },
  { id: 'chamundaye', lang: 'sa', cat: 'mantra', title: 'नवार्ण मंत्र', en: 'Navarna Mantra (Om Aim Hreem Kleem)', deity: 'Durga', tags: 'navarna om aim hreem kleem chamundaye vichche durga devi', target: 108,
    text: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे' },
  { id: 'krishna-govind', lang: 'sa', cat: 'mantra', title: 'श्री कृष्ण गोविन्द हरे मुरारे', en: 'Shri Krishna Govind Hare Murare', deity: 'Krishna', tags: 'shri krishna govind hare murare he nath narayan vasudev', target: 108,
    text: `श्री कृष्ण गोविन्द हरे मुरारे ।
हे नाथ नारायण वासुदेव ॥` },
  { id: 'guru-brahma', lang: 'sa', cat: 'mantra', title: 'गुरुर्ब्रह्मा गुरुर्विष्णुः', en: 'Guru Brahma Guru Vishnu', deity: 'Guru', tags: 'guru brahma guru vishnu gurur devo maheshwara guru mantra', target: 11,
    text: `गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।
गुरुः साक्षात् परब्रह्म तस्मै श्री गुरवे नमः ॥` },
  { id: 'karagre', lang: 'sa', cat: 'mantra', title: 'कराग्रे वसते लक्ष्मीः', en: 'Karagre Vasate Lakshmi (morning prayer)', deity: 'Lakshmi · Saraswati · Govinda', tags: 'karagre vasate lakshmi morning prayer prabhat', target: 1,
    text: `कराग्रे वसते लक्ष्मीः करमध्ये सरस्वती ।
करमूले तु गोविन्दः प्रभाते करदर्शनम् ॥` },
  { id: 'mangalam-vishnu', lang: 'sa', cat: 'mantra', title: 'मङ्गलम् भगवान विष्णुः', en: 'Mangalam Bhagwan Vishnu', deity: 'Vishnu', tags: 'mangalam bhagwan vishnu garudadhwaja', target: 11,
    text: `मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः ।
मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः ॥` },
  { id: 'asato-ma', lang: 'sa', cat: 'mantra', title: 'असतो मा सद्गमय', en: 'Asato Ma Sadgamaya', deity: 'Shanti mantra', tags: 'asato ma sadgamaya tamaso ma jyotirgamaya shanti peace', target: 1,
    text: `ॐ असतो मा सद्गमय ।
तमसो मा ज्योतिर्गमय ।
मृत्योर्मा अमृतं गमय ।
ॐ शान्तिः शान्तिः शान्तिः ॥` },
  { id: 'sahana-vavatu', lang: 'sa', cat: 'mantra', title: 'ॐ सह नाववतु', en: 'Om Saha Navavatu', deity: 'Shanti mantra', tags: 'om saha navavatu sahana vavatu shanti peace', target: 1,
    text: `ॐ सह नाववतु । सह नौ भुनक्तु ।
सह वीर्यं करवावहै ।
तेजस्वि नावधीतमस्तु मा विद्विषावहै ।
ॐ शान्तिः शान्तिः शान्तिः ॥` },
  { id: 'purnamadah', lang: 'sa', cat: 'mantra', title: 'ॐ पूर्णमदः पूर्णमिदम्', en: 'Om Purnamadah Purnamidam', deity: 'Shanti mantra', tags: 'om purnamadah purnamidam shanti peace isha upanishad', target: 1,
    text: `ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।
पूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥
ॐ शान्तिः शान्तिः शान्तिः ॥` },
  { id: 'sarve-bhavantu', lang: 'sa', cat: 'mantra', title: 'सर्वे भवन्तु सुखिनः', en: 'Sarve Bhavantu Sukhinah', deity: 'Shanti mantra', tags: 'sarve bhavantu sukhinah shanti peace', target: 1,
    text: `सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।
सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥
ॐ शान्तिः शान्तिः शान्तिः ॥` },
  { id: 'twameva-mata', lang: 'sa', cat: 'mantra', title: 'त्वमेव माता च पिता त्वमेव', en: 'Twameva Mata Cha Pita Twameva', deity: 'Vishnu', tags: 'twameva tvameva mata cha pita prayer', target: 1,
    text: `त्वमेव माता च पिता त्वमेव ।
त्वमेव बन्धुश्च सखा त्वमेव ।
त्वमेव विद्या द्रविणं त्वमेव ।
त्वमेव सर्वं मम देव देव ॥` },

  // ---------------- chalisa ----------------
  { id: 'hanuman-chalisa', lang: 'hi', cat: 'chalisa', title: 'हनुमान चालीसा', en: 'Hanuman Chalisa', deity: 'Hanuman', tags: 'hanuman chalisa bajrang bali tulsidas jai hanuman gyan gun sagar', target: 1,
    text: `श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि ।
बरनउँ रघुबर बिमल जसु जो दायकु फल चारि ॥
बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार ।
बल बुधि बिद्या देहु मोहिं हरहु कलेस बिकार ॥

जय हनुमान ज्ञान गुन सागर । जय कपीस तिहुँ लोक उजागर ॥
राम दूत अतुलित बल धामा । अंजनि-पुत्र पवनसुत नामा ॥
महाबीर बिक्रम बजरंगी । कुमति निवार सुमति के संगी ॥
कंचन बरन बिराज सुबेसा । कानन कुंडल कुंचित केसा ॥
हाथ बज्र औ ध्वजा बिराजै । काँधे मूँज जनेऊ साजै ॥
संकर सुवन केसरीनंदन । तेज प्रताप महा जग बंदन ॥
बिद्यावान गुनी अति चातुर । राम काज करिबे को आतुर ॥
प्रभु चरित्र सुनिबे को रसिया । राम लखन सीता मन बसिया ॥
सूक्ष्म रूप धरि सियहिं दिखावा । बिकट रूप धरि लंक जरावा ॥
भीम रूप धरि असुर सँहारे । रामचंद्र के काज सँवारे ॥
लाय सजीवन लखन जियाये । श्रीरघुबीर हरषि उर लाये ॥
रघुपति कीन्ही बहुत बड़ाई । तुम मम प्रिय भरतहि सम भाई ॥
सहस बदन तुम्हरो जस गावैं । अस कहि श्रीपति कंठ लगावैं ॥
सनकादिक ब्रह्मादि मुनीसा । नारद सारद सहित अहीसा ॥
जम कुबेर दिगपाल जहाँ ते । कबि कोबिद कहि सके कहाँ ते ॥
तुम उपकार सुग्रीवहिं कीन्हा । राम मिलाय राज पद दीन्हा ॥
तुम्हरो मंत्र बिभीषन माना । लंकेस्वर भए सब जग जाना ॥
जुग सहस्र जोजन पर भानू । लील्यो ताहि मधुर फल जानू ॥
प्रभु मुद्रिका मेलि मुख माहीं । जलधि लाँघि गये अचरज नाहीं ॥
दुर्गम काज जगत के जेते । सुगम अनुग्रह तुम्हरे तेते ॥
राम दुआरे तुम रखवारे । होत न आज्ञा बिनु पैसारे ॥
सब सुख लहै तुम्हारी सरना । तुम रच्छक काहू को डर ना ॥
आपन तेज सम्हारो आपै । तीनों लोक हाँक तें काँपै ॥
भूत पिसाच निकट नहिं आवै । महाबीर जब नाम सुनावै ॥
नासै रोग हरै सब पीरा । जपत निरंतर हनुमत बीरा ॥
संकट तें हनुमान छुड़ावै । मन क्रम बचन ध्यान जो लावै ॥
सब पर राम तपस्वी राजा । तिन के काज सकल तुम साजा ॥
और मनोरथ जो कोई लावै । सोइ अमित जीवन फल पावै ॥
चारों जुग परताप तुम्हारा । है परसिद्ध जगत उजियारा ॥
साधु संत के तुम रखवारे । असुर निकंदन राम दुलारे ॥
अष्ट सिद्धि नौ निधि के दाता । अस बर दीन जानकी माता ॥
राम रसायन तुम्हरे पासा । सदा रहो रघुपति के दासा ॥
तुम्हरे भजन राम को पावै । जनम जनम के दुख बिसरावै ॥
अंत काल रघुबर पुर जाई । जहाँ जन्म हरि-भक्त कहाई ॥
और देवता चित्त न धरई । हनुमत सेइ सर्ब सुख करई ॥
संकट कटै मिटै सब पीरा । जो सुमिरै हनुमत बलबीरा ॥
जै जै जै हनुमान गोसाईं । कृपा करहु गुरुदेव की नाईं ॥
जो सत बार पाठ कर कोई । छूटहि बंदि महा सुख होई ॥
जो यह पढ़ै हनुमान चालीसा । होय सिद्धि साखी गौरीसा ॥
तुलसीदास सदा हरि चेरा । कीजै नाथ हृदय महँ डेरा ॥

पवनतनय संकट हरन मंगल मूरति रूप ।
राम लखन सीता सहित हृदय बसहु सुर भूप ॥` },

  // ---------------- aartis ----------------
  { id: 'jai-jagdish', lang: 'hi', cat: 'aarti', title: 'ॐ जय जगदीश हरे', en: 'Om Jai Jagdish Hare', deity: 'Vishnu', tags: 'om jai jagdish hare aarti arti vishnu', target: 1,
    text: `ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।
भक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे ॥

जो ध्यावे फल पावे, दुःख बिनसे मन का, स्वामी दुःख बिनसे मन का ।
सुख सम्पति घर आवे, कष्ट मिटे तन का ॥

मात पिता तुम मेरे, शरण गहूँ मैं किसकी, स्वामी शरण गहूँ मैं किसकी ।
तुम बिन और न दूजा, आस करूँ मैं जिसकी ॥

तुम पूरण परमात्मा, तुम अन्तर्यामी, स्वामी तुम अन्तर्यामी ।
पारब्रह्म परमेश्वर, तुम सब के स्वामी ॥

तुम करुणा के सागर, तुम पालनकर्ता, स्वामी तुम पालनकर्ता ।
मैं मूरख फलकामी, मैं सेवक तुम स्वामी, कृपा करो भर्ता ॥

तुम हो एक अगोचर, सबके प्राणपति, स्वामी सबके प्राणपति ।
किस विधि मिलूँ दयामय, तुमको मैं कुमति ॥

दीन-बन्धु दुःख-हर्ता, ठाकुर तुम मेरे, स्वामी रक्षक तुम मेरे ।
अपने हाथ उठाओ, अपने शरण लगाओ, द्वार पड़ा तेरे ॥

विषय-विकार मिटाओ, पाप हरो देवा, स्वामी पाप हरो देवा ।
श्रद्धा भक्ति बढ़ाओ, संतन की सेवा ॥

ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे ।
भक्त जनों के संकट, दास जनों के संकट, क्षण में दूर करे ॥` },
  { id: 'jai-ganesh', lang: 'hi', cat: 'aarti', title: 'जय गणेश जय गणेश देवा', en: 'Jai Ganesh Jai Ganesh Deva', deity: 'Ganesha', tags: 'jai ganesh deva aarti arti ganpati ganesha', target: 1,
    text: `जय गणेश जय गणेश, जय गणेश देवा ।
माता जाकी पार्वती, पिता महादेवा ॥

एक दंत दयावंत, चार भुजा धारी ।
माथे पर तिलक सोहे, मूसे की सवारी ॥

पान चढ़े फूल चढ़े, और चढ़े मेवा ।
लड्डुअन का भोग लगे, संत करें सेवा ॥

अंधन को आँख देत, कोढ़िन को काया ।
बाँझन को पुत्र देत, निर्धन को माया ॥

दीनन की लाज रखो, शंभु सुतकारी ।
कामना को पूर्ण करो, जाऊँ बलिहारी ॥

जय गणेश जय गणेश, जय गणेश देवा ।
माता जाकी पार्वती, पिता महादेवा ॥` },
  { id: 'shiv-omkara', lang: 'hi', cat: 'aarti', title: 'ॐ जय शिव ओंकारा', en: 'Om Jai Shiv Omkara', deity: 'Shiva', tags: 'om jai shiv omkara aarti arti shiva mahadev', target: 1,
    text: `ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा ।
ब्रह्मा विष्णु सदाशिव, अर्द्धांगी धारा ॥

एकानन चतुरानन पंचानन राजे ।
हंसासन गरुड़ासन वृषवाहन साजे ॥

दो भुज चार चतुर्भुज दसभुज अति सोहे ।
त्रिगुण रूप निरखते त्रिभुवन जन मोहे ॥

अक्षमाला वनमाला मुण्डमाला धारी ।
चंदन मृगमद सोहै भाले शशिधारी ॥

श्वेताम्बर पीताम्बर बाघम्बर अंगे ।
सनकादिक गरुणादिक भूतादिक संगे ॥

कर के मध्य कमण्डलु चक्र त्रिशूलधारी ।
जगकर्ता जगभर्ता जगसंहारकर्ता ॥

ब्रह्मा विष्णु सदाशिव जानत अविवेका ।
प्रणवाक्षर में शोभित ये तीनों एका ॥

त्रिगुणस्वामी जी की आरती जो कोइ नर गावे ।
कहत शिवानंद स्वामी मनवांछित फल पावे ॥` },
  { id: 'jai-ambe-gauri', lang: 'hi', cat: 'aarti', title: 'जय अम्बे गौरी', en: 'Jai Ambe Gauri', deity: 'Durga', tags: 'jai ambe gauri aarti arti durga mata devi navratri', target: 1,
    text: `जय अम्बे गौरी, मैया जय श्यामा गौरी ।
तुमको निशदिन ध्यावत, हरि ब्रह्मा शिवरी ॥

मांग सिंदूर विराजत, टीको मृगमद को ।
उज्ज्वल से दोउ नैना, चंद्रवदन नीको ॥

कनक समान कलेवर, रक्ताम्बर राजै ।
रक्तपुष्प गल माला, कण्ठन पर साजै ॥

केहरि वाहन राजत, खड्ग खप्पर धारी ।
सुर-नर-मुनिजन सेवत, तिनके दुखहारी ॥

कानन कुण्डल शोभित, नासाग्रे मोती ।
कोटिक चंद्र दिवाकर, सम राजत ज्योती ॥

शुंभ-निशुंभ बिदारे, महिषासुर घाती ।
धूम्र विलोचन नैना, निशदिन मदमाती ॥

चण्ड-मुण्ड संहारे, शोणित बीज हरे ।
मधु-कैटभ दोउ मारे, सुर भयहीन करे ॥

ब्रह्माणी रूद्राणी, तुम कमला रानी ।
आगम निगम बखानी, तुम शिव पटरानी ॥

चौंसठ योगिनी गावत, नृत्य करत भैरों ।
बाजत ताल मृदंगा, अरू बाजत डमरू ॥

तुम ही जग की माता, तुम ही हो भरता ।
भक्तन की दुख हरता, सुख संपति करता ॥

भुजा चार अति शोभित, वर मुद्रा धारी ।
मनवांछित फल पावत, सेवत नर नारी ॥

कंचन थाल विराजत, अगर कपूर बाती ।
श्रीमालकेतु में राजत, कोटि रतन ज्योती ॥

श्री अम्बेजी की आरती, जो कोई नर गावै ।
कहत शिवानंद स्वामी, सुख-संपति पावै ॥` },
  { id: 'hanuman-aarti', lang: 'hi', cat: 'aarti', title: 'आरती कीजै हनुमान लला की', en: 'Aarti Kije Hanuman Lala Ki', deity: 'Hanuman', tags: 'aarti kije hanuman lala ki arti hanuman bajrang', target: 1,
    text: `आरती कीजै हनुमान लला की । दुष्ट दलन रघुनाथ कला की ॥

जाके बल से गिरिवर काँपे । रोग दोष जाके निकट न झाँके ॥
अंजनि पुत्र महा बलदाई । संतन के प्रभु सदा सहाई ॥
दे बीरा रघुनाथ पठाए । लंका जारि सिया सुधि लाए ॥
लंका सो कोट समुद्र सी खाई । जात पवनसुत बार न लाई ॥
लंका जारि असुर संहारे । सियारामजी के काज सँवारे ॥
लक्ष्मण मूर्छित पड़े सकारे । आनि सजीवन प्राण उबारे ॥
पैठि पाताल तोरि जम कारे । अहिरावण की भुजा उखारे ॥
बाएँ भुजा असुर दल मारे । दाहिने भुजा संतजन तारे ॥
सुर नर मुनि आरती उतारें । जय जय जय हनुमान उचारें ॥
कंचन थार कपूर लौ छाई । आरती करत अंजना माई ॥
जो हनुमानजी की आरती गावे । बसि बैकुण्ठ परम पद पावे ॥

आरती कीजै हनुमान लला की । दुष्ट दलन रघुनाथ कला की ॥` },
  { id: 'lakshmi-aarti', lang: 'hi', cat: 'aarti', title: 'ॐ जय लक्ष्मी माता', en: 'Om Jai Lakshmi Mata', deity: 'Lakshmi', tags: 'om jai lakshmi mata aarti arti laxmi diwali', target: 1,
    text: `ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता ।
तुमको निशदिन सेवत, हरि विष्णु विधाता ॥

उमा रमा ब्रह्माणी, तुम ही जग-माता ।
सूर्य-चन्द्रमा ध्यावत, नारद ऋषि गाता ॥

दुर्गा रूप निरंजनी, सुख सम्पत्ति दाता ।
जो कोई तुमको ध्यावत, ऋद्धि-सिद्धि धन पाता ॥

तुम पाताल-निवासिनि, तुम ही शुभदाता ।
कर्म-प्रभाव-प्रकाशिनी, भवनिधि की त्राता ॥

जिस घर में तुम रहतीं, सब सद्गुण आता ।
सब सम्भव हो जाता, मन नहीं घबराता ॥

तुम बिन यज्ञ न होते, वस्त्र न कोई पाता ।
खान-पान का वैभव, सब तुमसे आता ॥

शुभ-गुण मन्दिर सुन्दर, क्षीरोदधि-जाता ।
रत्न चतुर्दश तुम बिन, कोई नहीं पाता ॥

महालक्ष्मीजी की आरती, जो कोई जन गाता ।
उर आनन्द समाता, पाप उतर जाता ॥` },
  { id: 'kunj-bihari', lang: 'hi', cat: 'aarti', title: 'आरती कुंजबिहारी की', en: 'Aarti Kunj Bihari Ki', deity: 'Krishna', tags: 'aarti kunj bihari ki arti krishna giridhar murari', target: 1,
    text: `आरती कुंजबिहारी की, श्री गिरिधर कृष्ण मुरारी की ॥

गले में बैजंती माला, बजावै मुरली मधुर बाला ।
श्रवण में कुण्डल झलकाला, नंद के आनंद नंदलाला ।
गगन सम अंग कांति काली, राधिका चमक रही आली ।
लतन में ठाढ़े बनमाली, भ्रमर सी अलक, कस्तूरी तिलक, चंद्र सी झलक,
ललित छवि श्यामा प्यारी की ॥ आरती कुंजबिहारी की ॥

कनकमय मोर मुकुट बिलसै, देवता दरसन को तरसैं ।
गगन सों सुमन रासि बरसै, बजे मुरचंग, मधुर मिरदंग, ग्वालिन संग,
अतुल रति गोप कुमारी की ॥ आरती कुंजबिहारी की ॥

जहां ते प्रकट भई गंगा, कलुष कलि हारिणि श्रीगंगा ।
स्मरन ते होत मोह भंगा, बसी सिव सीस, जटा के बीच, हरै अघ कीच,
चरन छवि श्रीबनवारी की ॥ आरती कुंजबिहारी की ॥

चमकती उज्ज्वल तट रेनू, बज रही वृंदावन बेनू ।
चहुं दिसि गोपि ग्वाल धेनू, हंसत मृदु मंद, चांदनी चंद, कटत भव फंद,
टेर सुन दीन भिखारी की ॥ आरती कुंजबिहारी की ॥` },
  { id: 'sukhkarta', lang: 'mr', cat: 'aarti', title: 'सुखकर्ता दुःखहर्ता', en: 'Sukhkarta Dukhharta (Marathi Ganesh Aarti)', deity: 'Ganesha', tags: 'sukhkarta dukhharta sukhakarta dukhaharta marathi ganesh aarti arti jai dev jai dev mangalmurti', target: 1,
    text: `सुखकर्ता दुःखहर्ता वार्ता विघ्नाची ।
नुरवी पुरवी प्रेम कृपा जयाची ।
सर्वांगी सुंदर उटी शेंदुराची ।
कंठी झळके माळ मुक्ताफळांची ॥
जय देव जय देव जय मंगलमूर्ती ।
दर्शनमात्रे मनकामना पुरती ॥

रत्नखचित फरा तुज गौरीकुमरा ।
चंदनाची उटी कुंकुमकेशरा ।
हिरेजडित मुकुट शोभतो बरा ।
रुणझुणती नूपुरे चरणी घागरिया ॥
जय देव जय देव जय मंगलमूर्ती ।
दर्शनमात्रे मनकामना पुरती ॥

लंबोदर पीतांबर फणिवरबंधना ।
सरळ सोंड वक्रतुंड त्रिनयना ।
दास रामाचा वाट पाहे सदना ।
संकटी पावावे निर्वाणी रक्षावे सुरवरवंदना ॥
जय देव जय देव जय मंगलमूर्ती ।
दर्शनमात्रे मनकामना पुरती ॥` },
  { id: 'ghalin-lotangan', lang: 'mr', cat: 'aarti', title: 'घालीन लोटांगण', en: 'Ghalin Lotangan (Marathi, after aarti)', deity: 'Vitthal · Vishnu', tags: 'ghalin lotangan vandin charan marathi aarti arti mantra pushpanjali', target: 1,
    text: `घालीन लोटांगण वंदीन चरण ।
डोळ्यांनी पाहीन रूप तुझे ।
प्रेमे आलिंगन आनंदे पूजिन ।
भावे ओवाळीन म्हणे नामा ॥

त्वमेव माता च पिता त्वमेव ।
त्वमेव बन्धुश्च सखा त्वमेव ।
त्वमेव विद्या द्रविणं त्वमेव ।
त्वमेव सर्वं मम देव देव ॥

कायेन वाचा मनसेंद्रियैर्वा बुद्ध्यात्मना वा प्रकृतिस्वभावात् ।
करोमि यद्यत् सकलं परस्मै नारायणायेति समर्पयामि ॥

अच्युतं केशवं रामनारायणं कृष्णदामोदरं वासुदेवं हरिम् ।
श्रीधरं माधवं गोपिकावल्लभं जानकीनायकं रामचंद्रं भजे ॥

हरे राम हरे राम राम राम हरे हरे ।
हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे ॥` },

  // ---------------- stuti & stotra ----------------
  { id: 'ramchandra-kripalu', lang: 'hi', cat: 'stuti', title: 'श्रीरामचन्द्र कृपालु भजु मन', en: 'Shri Ramchandra Kripalu Bhaju Man', deity: 'Rama', tags: 'shri ramchandra kripalu bhaju man ram stuti tulsidas', target: 1,
    text: `श्रीरामचन्द्र कृपालु भजु मन हरण भवभय दारुणं ।
नवकञ्ज लोचन कञ्ज मुख कर कञ्ज पद कञ्जारुणं ॥

कन्दर्प अगणित अमित छवि नवनील नीरद सुन्दरं ।
पटपीत मानहुँ तड़ित रुचि शुचि नौमि जनक सुतावरं ॥

भजु दीनबन्धु दिनेश दानव दैत्य वंश निकन्दनं ।
रघुनन्द आनन्द कन्द कोशल चन्द दशरथ नन्दनं ॥

शिर मुकुट कुण्डल तिलक चारु उदार अङ्ग विभूषणं ।
आजानु भुज शर चाप धर संग्राम जित खरदूषणं ॥

इति वदति तुलसीदास शङ्कर शेष मुनि मन रञ्जनं ।
मम हृदय कञ्ज निवास कुरु कामादि खलदल गञ्जनं ॥` },
  { id: 'saraswati-vandana', lang: 'sa', cat: 'stuti', title: 'या कुन्देन्दु (सरस्वती वंदना)', en: 'Saraswati Vandana (Ya Kundendu)', deity: 'Saraswati', tags: 'saraswati vandana ya kundendu tushar hara dhavala vidya', target: 1,
    text: `या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता ।
या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना ॥
या ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता ।
सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा ॥` },
  { id: 'achyutam-keshavam', lang: 'sa', cat: 'stuti', title: 'अच्युतं केशवं', en: 'Achyutam Keshavam', deity: 'Vishnu / Krishna', tags: 'achyutam keshavam rama narayanam krishna damodaram', target: 11,
    text: `अच्युतं केशवं रामनारायणं कृष्णदामोदरं वासुदेवं हरिम् ।
श्रीधरं माधवं गोपिकावल्लभं जानकीनायकं रामचंद्रं भजे ॥` },

  // ---------------- other traditions ----------------
  { id: 'navkar', lang: 'pra', cat: 'other', title: 'णमोकार मंत्र', en: 'Navkar Mantra (Jain)', deity: 'Pancha Parameshthi', tags: 'navkar namokar namaskar mantra jain namo arihantanam', target: 108,
    text: `णमो अरिहंताणं ।
णमो सिद्धाणं ।
णमो आयरियाणं ।
णमो उवज्झायाणं ।
णमो लोए सव्व साहूणं ।
एसो पंच णमोक्कारो, सव्व पावप्पणासणो ।
मंगलाणं च सव्वेसिं, पढमं हवइ मंगलं ॥` },
  { id: 'mool-mantar', lang: 'pa', cat: 'other', title: 'ਮੂਲ ਮੰਤਰ', en: 'Mool Mantar (Sikh)', deity: 'Waheguru', tags: 'mool mantar mul mantra sikh ik onkar satnam waheguru gurbani', target: 108,
    text: 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥' },
];
