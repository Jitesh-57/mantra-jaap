// Stories and wallpapers.
// Images live in img/wallpapers/ and img/stories/. An entry whose `src`/`img` is empty shows a
// placeholder in the deity's colours until the real picture is added.

export const DEITIES = {
  krishna:      { hi: 'कृष्ण जी',     mr: 'कृष्ण',        en: 'Krishna Ji',    sym: 'कृ', c: ['#1d4ed8', '#60a5fa'] },
  radhakrishna: { hi: 'राधे कृष्ण',  mr: 'राधे कृष्ण',   en: 'Radhe Krishna', sym: 'रा', c: ['#be185d', '#f9a8d4'] },
  shiv:         { hi: 'शिव जी',       mr: 'शिव',          en: 'Shiv Ji',       sym: 'ॐ', c: ['#1e293b', '#64748b'] },
  ganesh:       { hi: 'गणेश जी',      mr: 'गणपती बाप्पा', en: 'Ganesh Ji',     sym: 'ग', c: ['#c2410c', '#fdba74'] },
  hanuman:      { hi: 'हनुमान जी',    mr: 'हनुमान',       en: 'Hanuman Ji',    sym: 'ह', c: ['#b91c1c', '#fb923c'] },
  ram:          { hi: 'श्री राम',     mr: 'श्रीराम',      en: 'Shri Ram',      sym: 'रा', c: ['#047857', '#6ee7b7'] },
  durga:        { hi: 'दुर्गा माँ',    mr: 'दुर्गा माता',   en: 'Durga Maa',     sym: 'दु', c: ['#9f1239', '#fda4af'] },
  vitthal:      { hi: 'विठ्ठल',       mr: 'विठ्ठल',       en: 'Vitthal',       sym: 'वि', c: ['#3730a3', '#a5b4fc'] },
};

// `added` (YYYY-MM-DD) marks pictures as NEW for 30 days; `likes` orders the "Most liked" row.
export const GALLERY = [
  { id: 'krishna-1', deity: 'krishna', src: '', added: '2026-10-13', likes: 9 },
  { id: 'krishna-2', deity: 'krishna', src: '', added: '2026-10-13', likes: 4 },
  { id: 'krishna-3', deity: 'krishna', src: '', added: '2026-10-13', likes: 2 },
  { id: 'radhakrishna-1', deity: 'radhakrishna', src: '', added: '2026-10-13', likes: 8 },
  { id: 'radhakrishna-2', deity: 'radhakrishna', src: '', added: '2026-10-13', likes: 5 },
  { id: 'radhakrishna-3', deity: 'radhakrishna', src: '', added: '2026-10-13', likes: 1 },
  { id: 'shiv-1', deity: 'shiv', src: '', added: '2026-10-13', likes: 7 },
  { id: 'shiv-2', deity: 'shiv', src: '', added: '2026-10-13', likes: 3 },
  { id: 'shiv-3', deity: 'shiv', src: '', added: '2026-10-13', likes: 1 },
  { id: 'ganesh-1', deity: 'ganesh', src: '', added: '2026-10-13', likes: 6 },
  { id: 'ganesh-2', deity: 'ganesh', src: '', added: '2026-10-13', likes: 2 },
  { id: 'ganesh-3', deity: 'ganesh', src: '', added: '2026-10-13', likes: 1 },
  { id: 'hanuman-1', deity: 'hanuman', src: '', added: '2026-10-13', likes: 6 },
  { id: 'hanuman-2', deity: 'hanuman', src: '', added: '2026-10-13', likes: 2 },
  { id: 'ram-1', deity: 'ram', src: '', added: '2026-10-13', likes: 5 },
  { id: 'ram-2', deity: 'ram', src: '', added: '2026-10-13', likes: 1 },
  { id: 'durga-1', deity: 'durga', src: '', added: '2026-10-13', likes: 4 },
  { id: 'durga-2', deity: 'durga', src: '', added: '2026-10-13', likes: 1 },
  { id: 'vitthal-1', deity: 'vitthal', src: '', added: '2026-10-13', likes: 3 },
  { id: 'vitthal-2', deity: 'vitthal', src: '', added: '2026-10-13', likes: 1 },
];

// Stories are retold in our own words. `mr` falls back to `hi` when it is missing.
export const STORIES = [
  {
    id: 'ganesh-parikrama', deity: 'ganesh', img: '',
    title: { hi: 'गणेश जी की परिक्रमा', en: 'Ganesha Goes Around the World' },
    sub: { hi: 'माता-पिता ही संसार हैं', en: 'Parents are the whole world' },
    text: {
      hi: `एक दिन देवताओं ने शिव जी और माता पार्वती को एक दिव्य फल भेंट किया। कार्तिकेय और गणेश, दोनों उसे पाना चाहते थे। माता-पिता ने कहा, "जो सबसे पहले पूरे संसार की परिक्रमा करके लौटेगा, फल उसी का होगा।"

कार्तिकेय तुरंत अपने मोर पर बैठकर उड़ चले। गणेश जी का वाहन तो छोटा-सा मूषक था। वे थोड़ी देर शांत बैठे, फिर उठे और प्रेम से माता-पिता के चारों ओर तीन बार परिक्रमा करके हाथ जोड़कर खड़े हो गए।

शिव जी ने पूछा, "तुमने संसार की परिक्रमा क्यों नहीं की?" गणेश जी बोले, "मेरे लिए आप दोनों ही पूरा संसार हैं।"

माता-पिता प्रसन्न हुए और फल गणेश जी को मिला। तभी से कहा जाता है कि बुद्धि और भक्ति, शक्ति से भी बड़ी है।`,
      en: `One day the gods offered Lord Shiva and Mother Parvati a divine fruit. Both their sons, Kartikeya and Ganesha, wanted it. Their parents said, "Whoever goes around the whole world and returns first shall have the fruit."

Kartikeya flew off at once on his peacock. Ganesha's mount was only a little mouse. He sat quietly for a moment, then rose, walked lovingly around his parents three times and stood before them with folded hands.

"Why did you not go around the world?" asked Shiva. Ganesha replied, "For me, the two of you are the whole world."

His parents were delighted and the fruit was his. Ever since, it is said that wisdom and devotion are greater than strength.`,
    },
  },
  {
    id: 'govardhan', deity: 'krishna', img: '',
    title: { hi: 'जब कृष्ण ने गोवर्धन उठाया', en: 'When Krishna Lifted Govardhan' },
    sub: { hi: 'भक्ति और विश्वास की कथा', en: 'A story of faith and protection' },
    text: {
      hi: `ब्रज के लोग हर वर्ष इंद्र देव की पूजा करते थे। बालक कृष्ण ने कहा, "हमें तो गोवर्धन पर्वत, हमारी गायें और यह धरती पालते हैं, आओ इन्हीं का आदर करें।" सबने गोवर्धन पूजा की।

इंद्र क्रोधित हो गए और ब्रज पर मूसलाधार वर्षा कर दी। चारों ओर पानी भर गया, लोग और गायें डर से काँपने लगे।

तब कृष्ण ने मुस्कुराकर अपनी छोटी उँगली पर पूरा गोवर्धन पर्वत उठा लिया। सात दिन और सात रात सारे ब्रजवासी और गायें उसके नीचे सुरक्षित रहे।

अंत में इंद्र को अपनी भूल समझ आई और उन्होंने कृष्ण से क्षमा माँगी। यह कथा सिखाती है कि जो भगवान की शरण में आता है, उसकी रक्षा वे स्वयं करते हैं।`,
      en: `Every year the people of Braj worshipped Indra, the king of the heavens. Young Krishna said, "It is Govardhan hill, our cows and this land that feed us. Let us honour them." So everyone worshipped Govardhan.

Indra grew angry and sent a terrible storm over Braj. Water rose everywhere and the people and cows trembled with fear.

Smiling, Krishna lifted the whole of Govardhan hill on the little finger of his hand. For seven days and seven nights all of Braj and its cows sheltered safely beneath it.

At last Indra saw his mistake and asked Krishna's forgiveness. The story teaches that whoever takes refuge in the Lord is protected by Him.`,
    },
  },
  {
    id: 'prahlad', deity: 'krishna', img: '',
    title: { hi: 'भक्त प्रह्लाद', en: 'Prahlad the Devotee' },
    sub: { hi: 'अटूट भक्ति की जीत', en: 'Unshakable devotion wins' },
    text: {
      hi: `असुर राजा हिरण्यकशिपु स्वयं को भगवान मानता था, पर उसका पुत्र प्रह्लाद हर पल "नारायण, नारायण" जपता था। राजा ने उसे रोकने के अनेक प्रयास किए, पर प्रह्लाद का जप नहीं रुका।

उसे ऊँचे पर्वत से गिराया गया, हाथियों के आगे डाला गया, होलिका की गोद में बिठाकर आग में बैठाया गया, पर हर बार प्रह्लाद सुरक्षित बच गया और होलिका स्वयं जल गई। इसी की याद में हम होली मनाते हैं।

अंत में राजा ने गरजकर पूछा, "कहाँ है तेरा भगवान? क्या इस खंभे में है?" प्रह्लाद बोले, "वे हर जगह हैं।" उसी क्षण खंभा फटा और भगवान नरसिंह प्रकट होकर भक्त की रक्षा की।

सच्चे मन से किया गया नाम जप कभी व्यर्थ नहीं जाता।`,
      en: `The demon king Hiranyakashipu believed he himself was God, yet his son Prahlad chanted "Narayana, Narayana" at every moment. The king tried many ways to stop him, but Prahlad's chanting never stopped.

He was thrown from a high cliff, placed before wild elephants, and seated in a fire on the lap of Holika, but each time Prahlad was safe and Holika herself burned. We remember this when we celebrate Holi.

At last the king roared, "Where is your God? Is He in this pillar?" Prahlad answered, "He is everywhere." At that moment the pillar burst open and Lord Narasimha appeared to protect His devotee.

Naam jap chanted with a true heart is never in vain.`,
    },
  },
  {
    id: 'dhruv', deity: 'krishna', img: '',
    title: { hi: 'ध्रुव की तपस्या', en: 'The Devotion of Dhruva' },
    sub: { hi: '"ॐ नमो भगवते वासुदेवाय"', en: '"Om Namo Bhagavate Vasudevaya"' },
    text: {
      hi: `बालक ध्रुव को एक दिन उसके पिता की गोद से उतार दिया गया। दुखी होकर वह माँ के पास गया। माँ ने कहा, "बेटा, सच्चा प्रेम और सहारा केवल भगवान देते हैं।"

पाँच वर्ष का ध्रुव वन की ओर चल पड़ा। रास्ते में देवर्षि नारद मिले और उन्होंने उसे मंत्र दिया — "ॐ नमो भगवते वासुदेवाय"। ध्रुव ने पूरे मन से इस मंत्र का जप किया। न भूख की चिंता, न सर्दी-गर्मी की।

उसकी अटल भक्ति से प्रसन्न होकर भगवान विष्णु स्वयं प्रकट हुए और उसे आशीर्वाद दिया। आज भी आकाश में चमकता अटल ध्रुव तारा उसी बालक की भक्ति की याद दिलाता है।

मन लगाकर किया गया जप सबसे बड़ा सहारा बन जाता है।`,
      en: `One day little Dhruva was pushed off his father's lap. Hurt, he ran to his mother, who told him, "My son, true love and shelter come only from God."

Only five years old, Dhruva set off for the forest. On the way the sage Narada met him and gave him a mantra: "Om Namo Bhagavate Vasudevaya." Dhruva chanted it with his whole heart, without a thought for hunger, cold or heat.

Pleased by his steady devotion, Lord Vishnu Himself appeared and blessed him. Even today the unmoving Pole Star, Dhruva Tara, shining in the sky reminds us of that child's devotion.

Jaap done with a focused heart becomes the greatest support.`,
    },
  },
  {
    id: 'sudama', deity: 'krishna', img: '',
    title: { hi: 'कृष्ण और सुदामा', en: 'Krishna and Sudama' },
    sub: { hi: 'सच्ची मित्रता', en: 'True friendship' },
    text: {
      hi: `सुदामा और कृष्ण बचपन में एक ही गुरुकुल में पढ़े थे। बड़े होकर कृष्ण द्वारका के राजा बने और सुदामा बहुत गरीब रह गए। पत्नी के कहने पर सुदामा अपने मित्र से मिलने चले, भेंट में बस थोड़े-से चावल लेकर।

महल के द्वार पर पहुँचते ही कृष्ण नंगे पाँव दौड़कर आए और मित्र को गले लगा लिया। अपने हाथों से उनके पैर धोए और प्रेम से वही चावल खाए।

सुदामा संकोच में कुछ माँग न सके और खाली हाथ घर लौटे। पर घर पहुँचकर देखा कि उनकी झोपड़ी सुंदर घर बन चुकी थी।

भगवान भेंट नहीं, भाव देखते हैं। प्रेम से दिया गया छोटा-सा अर्पण भी उन्हें सबसे प्रिय है।`,
      en: `Sudama and Krishna studied together at the same school as boys. Krishna grew up to be the king of Dwarka, while Sudama remained very poor. At his wife's urging, Sudama set out to visit his friend, carrying only a handful of rice as a gift.

As soon as he reached the palace gate, Krishna came running barefoot and embraced him. He washed Sudama's feet with his own hands and lovingly ate that same rice.

Too shy to ask for anything, Sudama went home empty-handed. But when he arrived, he found that his hut had become a beautiful home.

God looks not at the gift but at the feeling. Even a small offering made with love is dearest to Him.`,
    },
  },
  {
    id: 'sanjeevani', deity: 'hanuman', img: '',
    title: { hi: 'हनुमान जी और संजीवनी', en: 'Hanuman and the Sanjeevani Herb' },
    sub: { hi: 'सेवा और साहस', en: 'Service and courage' },
    text: {
      hi: `लंका के युद्ध में लक्ष्मण जी गंभीर रूप से घायल होकर मूर्छित हो गए। वैद्य सुषेण ने कहा, "सूर्योदय से पहले हिमालय की संजीवनी बूटी आ जाए, तभी इनके प्राण बचेंगे।"

हनुमान जी एक क्षण भी नहीं रुके और "जय श्री राम" कहकर उड़ चले। पर्वत पर पहुँचकर वे बूटी पहचान नहीं पाए, तो पूरा पर्वत ही उठाकर ले आए।

समय रहते संजीवनी मिल गई और लक्ष्मण जी स्वस्थ हो गए। श्री राम ने हनुमान जी को गले लगाकर कहा, "तुम मुझे भरत के समान प्रिय हो।"

राम नाम लेकर किया गया कोई भी काम असंभव नहीं रहता।`,
      en: `In the battle of Lanka, Lakshmana was badly wounded and fell unconscious. The physician Sushena said, "Only if the Sanjeevani herb from the Himalayas arrives before sunrise can his life be saved."

Without a moment's delay, Hanuman cried "Jai Shri Ram" and flew. On the mountain he could not tell which herb it was, so he lifted the whole mountain and brought it back.

The Sanjeevani arrived in time and Lakshmana recovered. Lord Rama embraced Hanuman and said, "You are as dear to me as my brother Bharata."

No task remains impossible when it is begun with Rama's name.`,
    },
  },
];
