const axios = require('axios');

const helpers = {
    randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};

const funCommands = {
    joke: {
        description: "Pata utani wa random",
        usage: ".joke",
        execute: async () => {
           const jokes = [
                "Mwanafunzi wa Dar aliambiwa alete barua ya mzazi. Akaleta vocha ya simu ya Tigo! 📱😂",
                "Mama mmoja Mbeya akamwambia mtoto: 'Ukinichezea nitakutuma kwenda kununua umeme usiku!' ⚡",
                "Bongo kuna mtu akikaa kimya muda mrefu, ujue ana bundle ya usiku tu. 🌙📶",
                "Unajua umeishi Tanzania muda mrefu ukiona mtu ana WiFi ya jirani ameandika 'Don't even try!' 😆",
                "Baba wa Kisukuma anaweza kukuambia 'usipige kelele nitakupeleka kuuza nyanya Mwanza' 😂🍅",
                "Kuna mtu Mbagala alisema ana nyumba 'mbili' kumbe ana room moja na store! 🏠 #NyumbaChap",
                "Mtanzania anayeishi Instagram kuliko kwenye nyumba yake! Watu wa NyumbaChap tunaelewa hilo! 📸",
                "Kuna dada alienda kutafuta nyumba Kigamboni, akapewa eneo la kulima mihogo. 😅",
                "Ukitaka kujua nyumba ni ndogo, angalia mtu akigeuka kulala lazima asalimie ukuta! 🛏️",
                "Dalali wa Bongo anaweza kukuambia nyumba iko 'karibu na barabara' kumbe ni njia ya panya! 🐭",
                "Mtanzania akiona bei ya nyumba NyumbaChap iko chini, anakwambia 'ngoja nijishauri na roho yangu' 😂",
                "Dalali: Nyumba ina master! Mteja: Master bedroom? Dalali: Hapana, mtaalam wa wiring! 🤣",
                "Dada mmoja ameweka picha ya nyumba ya NyumbaChap kama wallpaper, anasema 'moto wa ndoto'🔥",
                "Kijana mmoja ameweka maombi ya nyumba kwa mganga badala ya kuingia NyumbaChap. 😂",
                "Dalali: 'Nyumba iko full furnished.' Mteja akiingia anakuta meza ya plastic na stuli ya mbao! 😆",
                "Kwa Wabongo, nyumba nzuri ni yenye WiFi na mlango wa sliding — hata kama vyumba viwili tu. 🏘️",
                "Mtanzania ukimwambia nyumba ina AC, anajibu: 'hiyo ni kituo cha polisi au?' 😅",
                "Mkenya alishangaa kuona nyumba ya NyumbaChap inauzwa milioni 30... Akasema 'nitaulizia kwa loan ya SACCO' 🇰🇪😂",
                "Bongo unakodisha nyumba halafu jirani ana jiko la mkaa mlangoni kwako! 😩",
                "Kuna mtu Keko amenunua sofa kabla ya kununua godoro, anasema 'mgeni asione haya' 😆",
                "Dalali: 'Nyumba iko maeneo ya mjini.' Ukifika, unasikia jogoo na mbuzi wanalia kwa stereo! 🐓🐐",
                "Kuna demu kaulizwa anaishi wapi akasema 'nyumba yangu iko NyumbaChap, location bado nafanya browsing' 📍",
                "Mzee wa Kigogo anasema 'nyumba nzuri si dari, ni watu wanaoishi ndani yake'... lakini hata dari hana. 😂",
                "Watoto wa Bongo wakisikia nyumba ina 'ceiling board' wanajua ni ya matajiri! 🏡",
                "Mama mmoja ameweka picha ya nyumba ya NyumbaChap kwenye kabati ya sahani, anasema ni mfano wa maombi! 🙏",
                "Mtu akipewa tour ya nyumba ya NyumbaChap, atauliza: 'hii master ina choo?'... Ndiyo maana yake master! 😅",
                "Kuna kaka aliona picha ya nyumba nzuri NyumbaChap, akafunga macho kusema 'naipandisha rohoni' 😇",
                "Mwanamke wa Kiswahili akiambiwa nyumba ina tiles, atakanyaga kwa makini asiharibu! 😂",
                "Bongo mtu anakodisha nyumba ya NyumbaChap halafu anaweka bendera ya Simba nje, jirani wa Yanga anakasirika! 🏳️",
                "Kuna jamaa kaandika review: 'Nyumba nzuri lakini majirani wanaongea sana' — ni kwa NyumbaChap tu unapewa info kama hiyo! 😆",
                "Dalali wa Kariakoo: 'Hii nyumba ni self-contained.' Mteja akiingia anajikuta sharing na paka wawili! 🐱",
                "Mama mmoja kaambiwa nyumba ya NyumbaChap ina kitchen ya open plan, akasema: 'Ni kama mama lishe?' 🍛😂",
                "Mzee wa Tegeta ameweka rimoti ya TV kwenye mlango, anasema hiyo ndiyo security system ya kisasa! 😅",
                "Wabongo wanafurahia zaidi nyumba yenye choo cha ndani kuliko microwave. Hiyo ndiyo priorities! 🚽",
                "Kuna mtu ameshindwa kuhamia kwenye nyumba mpya kwa sababu 'bado hajaizoea hewa' 😂",
                "Bongo mtu anaweza kuhamia nyumba mpya lakini anatumia bafu la jirani kwa miezi mitatu! 🛁",
                "Watoto wa Bongo wakiona nyumba ina tiles wanakimbia kwenye kona kusema: 'hapa ndio tutateleza vizuri' 😂",
                "Mtu aliona nyumba NyumbaChap akasema: 'Hii ndoto ya Mungu haijawahi niota' 🙌",
                "Mama wa Tanga anaona ceiling fan anasema: 'Mbona feni ya dari haiko na waya?' 😅",
                "Jamaa mmoja aliomba nyumba ya one bedroom, akaambiwa: 'Ipo lakini bafu iko nje.' Akajibu: 'nitakuwa nikijisindikiza mwenyewe!' 😂",
                "Kuna mtu alijenga nyumba hadi akasahau kuweka mlango wa chumba — akasema ni kwa sababu ya usiri! 🧱",
                "Dalali akiona nyumba ya NyumbaChap imependeza sana, anakuambia 'hii inauzwa kwa watu maalum' 🧙‍♂️",
                "Bongo mtu anaweza kununua nyumba kabla ya kununua bafu curtain, akisema 'tutajifunika na jembe la mpira kwanza' 😂",
                "Kijana mmoja ameweka picha ya nyumba ya NyumbaChap kwenye status kila siku, watu wanadhani amehamia — kumbe ni motivation tu. 🏡",
                "Kuna mtu alichanganya bathroom na storeroom, akapiga brush kwenye stoo miezi miwili! 😳",
                "Mwalimu wa shule ya msingi alisema: 'Watoto mkiwa na ndoto nzuri, angalieni nyumba NyumbaChap.' 🎓",
                "Jamaa mmoja wa Kinondoni aliingia nyumba mpya halafu akapulizia manukato ya ubuyu — anasema ni utamaduni! 😂",
                "Dada mmoja ana nyumba ya kupanga lakini anasema: 'NyumbaChap imenifunza kupanga maisha' 🙌",
                "Watanzania wakiona nyumba ina parking ya gari mbili, wanasema: 'Hii si nyumba ni investment!' 🚗",
                "Bongo mtu anaweza kusema: 'Hii nyumba ni mbaya' kumbe anamaanisha hana hela ya kuinunua! 😅",
                "Mzee mmoja anasema: 'Hii nyumba ina mashimo ya roho safi, sio panya!' 😂",
                "Mtoto wa Bongo akiona nyumba ina ngazi za ndani, anauliza: 'Hii ndiyo nyumba za marekani?' 🇺🇸😆"
            ];

            return `😄 *UTANI WA KIBONGO*\n\n${helpers.randomChoice(jokes)}`;
        }
    },
    quote: {
        description: "Pata msemo wa kichochezi",
        usage: ".quote",
        execute: async () => {
                    const quotes = [
                { text: "Ukijituma leo, kesho utavuna matunda ya juhudi zako. Mafanikio hayaanguki kama mvua – unapaswa kuyatengeneza kwa mikono yako. Kama unatafuta sehemu ya kuanza maisha bora, jua NyumbaChap ipo kukupa mwanzo mpya.", author: "Mwalimu Nyerere" },
                { text: "Usikate tamaa unapokutana na vizingiti. Kila mafanikio makubwa yalizaliwa kupitia maumivu ya kujitahidi. Kama unahangaika na makazi, tambua NyumbaChap ni rafiki wa safari yako.", author: "Methali ya Kiswahili" },
                { text: "Kila siku mpya ni fursa ya kujijenga upya, kusahau jana, na kufungua ukurasa mpya. Kama unawaza maisha mapya mjini au kijijini, anza na NyumbaChap – watanzania wanabadilisha maisha yao pale.", author: "Unknown" },
                { text: "Jua halizuiwi na mawingu. Hata kama mambo ni magumu leo, usikubali kukata tamaa. Vumilia, songa mbele – na kama unatafuta makazi bora, NyumbaChap iko tayari kukusaidia.", author: "Methali ya Kiswahili" },
                { text: "Elimu ni silaha ya mabadiliko, lakini makazi bora ni msingi wa amani ya akili. Pata nyumba au pangisha salama kupitia NyumbaChap – kwa ajili ya kesho yako iliyo bora.", author: "Nelson Mandela" },
                { text: "Usikubali maoni ya watu wa kuvunja ndoto zako yakushinde. Thamani yako inazidi walichonacho wengine. Kama unatafuta mabadiliko, anza na mazingira yako – NyumbaChap ni hatua yako ya kwanza.", author: "Steve Jobs" },
                { text: "Ukiona mtu amefanikiwa, usione mwisho wake tu – tafuta kujua alikopitia. Na kama safari yako inahitaji nyumba nzuri au ajira Tanzania, anza kutembelea NyumbaChap.", author: "Mwl. Nyerere" },
                { text: "Wakati mwingine unahitaji kimya ili kusikia wito wa ndoto zako. Katika kimya hicho, fikiria kuhusu familia, makazi bora, na mustakabali – yote yanaweza kuanza kupitia NyumbaChap.", author: "Methali ya Afrika" },
                { text: "Fursa haiji mara mbili. Unapoiona, kamata kwa nguvu zote. Kama leo unahitaji nyumba, au kutangaza yako, NyumbaChap iko hapa kwa ajili yako – kimya kimya inakuunganisha na Watanzania wenzako.", author: "Methali" },
                { text: "Siku njema huonekana asubuhi, lakini mafanikio hujengwa kila wakati. Kama unatafuta mwanzo mpya, basi nyumba, biashara, na hata ajira vinaanzia na NyumbaChap.", author: "Methali ya Kiswahili" },
                { text: "Ukitaka kwenda haraka, nenda peke yako. Ukihitaji kwenda mbali, nenda na wengine. Ndio maana jamii ya Watanzania inatumia NyumbaChap – ni zaidi ya website, ni muunganiko wa ndoto za wengi.", author: "Methali ya Kiafrika" },
                { text: "Kila hatua unayochukua leo ni msingi wa maisha ya kesho. Usisahau, makazi ni sehemu ya mafanikio. Tembelea NyumbaChap ujionee mabadiliko yanavyoanza kwenye sakafu unayoishi.", author: "Unknown" },
                { text: "Nguzo ya familia bora ni makazi salama. Wekeza kwenye nyumba yako leo. NyumbaChap inakuletea fursa za kipekee mitandaoni – kwa bei unazoweza kumudu.", author: "Methali ya Kiswahili" },
                { text: "Usingoje hali iwe bora ndipo uanze. Anza pale ulipo, na kwa kile ulichonacho. Na kama unahitaji msaada wa kutafuta makazi au kupangisha yako, NyumbaChap ni hatua yako ya kwanza.", author: "Unknown" },
                { text: "Furaha ya kweli huanza pale unapoona ndoto zako zikitimia moja baada ya nyingine. Kama ndoto zako ni nyumba nzuri, biashara au ajira, usiache kuangalia NyumbaChap.", author: "Methali ya Kiswahili" },
                { text: "Safari ya mafanikio huanza kwa uamuzi mmoja wa kubadilika. Chukua hatua leo. Na kama ni ya makazi bora, tembelea NyumbaChap – ujionee fursa za kipekee kwa kila Mtanzania.", author: "Unknown" },
                { text: "Wewe ni taa ya maisha yako. Usiache mtu mwingine awe swichi. Chukua hatua, fanya mipango ya makazi, biashara na maisha kupitia NyumbaChap.", author: "Methali ya Kiafrika" },
                { text: "Kuwa na ndoto kubwa si kosa – kosa ni kutofanya lolote juu yake. Kama unahitaji kuanza maisha mapya na nyumba nzuri, tafuta NyumbaChap sasa.", author: "Unknown" },
                { text: "Wengine wanaanza na mtaji wa milioni, wewe unaweza kuanza na wazo sahihi. Tumia rasilimali kama NyumbaChap kubadili maisha yako bila hata kutumia hela nyingi.", author: "Methali ya Maisha" },
                { text: "Hakuna mafanikio yasiyokuwa na changamoto. Kumbuka hata kuhamia nyumba mpya kuna stress, lakini kupitia NyumbaChap, mambo yanaenda laini kabisa.", author: "Methali ya Kiswahili" },
                { text: "Ukipanda uaminifu, utavuna heshima. Hata biashara ya nyumba inahitaji imani. NyumbaChap inajenga madaraja ya imani kati ya wamiliki na wateja kila siku.", author: "Unknown" },
                { text: "Changamoto si adui, bali ni daraja la mafanikio. Kama changamoto yako ni makazi au ajira, NyumbaChap imekuandalia majibu. Fanya uamuzi leo.", author: "Methali ya Kiswahili" },
                { text: "Huwezi kufika mbali bila ramani. NyumbaChap inakuwa ramani yako ya makazi na fursa nyinginezo nchini Tanzania – fuata mwelekeo sahihi.", author: "Unknown" },
                { text: "Thamani yako haitokani na unachomiliki sasa, bali na uwezo wako wa kuona mbali. Kama unaona mbali, utajua NyumbaChap si tu tovuti – ni daraja la ndoto zako.", author: "Methali ya Afrika" },
                { text: "Kuwa mfuasi wa maendeleo, sio mtazamaji wa mafanikio ya wengine. Tangaza nyumba yako au tafuta mpya kupitia NyumbaChap – ujionee faida ya kuwa wa kwanza.", author: "Unknown" },
                { text: "Mabadiliko huanza na fikra. Kama unaamini unaweza, basi unaweza. Kama unaamini Tanzania inaweza kuwa bora zaidi, NyumbaChap ni sehemu ya suluhisho hilo.", author: "Methali ya Kiswahili" },
                { text: "Usipoteze muda kujaribu kila njia. Chagua njia inayojulikana na wengi. Watanzania wengi wanapiga hatua kupitia NyumbaChap – unaweza pia.", author: "Methali ya Maisha" },
                { text: "Ni vigumu kushinda vita bila silaha. Katika vita ya kutafuta nyumba bora, NyumbaChap ni silaha yako ya siri. Tumia ipasavyo.", author: "Unknown" },
                { text: "Kuwa na nyumba sio anasa, ni msingi wa amani ya akili. Kama unatafuta hiyo amani, usisahau kuanza na NyumbaChap.", author: "Methali" },
                { text: "Kama huwezi kuibadilisha dunia yote, anza na yako. Anza kwa kuimarisha makazi yako kupitia NyumbaChap – hatua ndogo, matokeo makubwa.", author: "Methali ya Afrika" },
                { text: "Maisha ni safari, na kila safari inahitaji mahali pa kupumzika. Jitengenezee sehemu yako kupitia NyumbaChap – wataalamu wa makazi Tanzania.", author: "Methali ya Kiswahili" },
                { text: "Wakati unapotafuta mabadiliko, tambua kuna watu tayari wameshafanikisha wanachotafuta kupitia NyumbaChap – waulize wakuambie!", author: "Methali ya Maisha" },
                { text: "Huwezi kuchagua familia uliyopangiwa, lakini unaweza kuchagua mahali pa kuishi. Chagua makazi bora kupitia NyumbaChap.", author: "Methali ya Kiswahili" },
                { text: "Usione watu wanacheka mtandaoni ukafikiri maisha ni rahisi. Wengine wamewekeza kwenye nyumba zao kupitia NyumbaChap – wewe unasubiri nini?", author: "Methali ya Sasa" },
                { text: "Nguzo kuu ya jamii bora ni makazi salama. Fanya sehemu yako kwa kuhakikisha kila familia Tanzania inajua kuhusu NyumbaChap.", author: "Unknown" },
                { text: "Wakati mwingine huwezi kubadili hali ya uchumi, lakini unaweza kudhibiti matumizi yako. Tumia NyumbaChap kupata nyumba nafuu kwa kiwango chako.", author: "Methali ya Maisha" },
                { text: "Hakuna mafanikio bila nidhamu. Tumia muda wako vizuri – hata kama ni kutafuta nyumba, anza na NyumbaChap, hakuna longolongo.", author: "Methali" },
                { text: "Siku bora haziji zenyewe, tunazijenga. Kama ndoto zako ni familia bora katika nyumba bora, NyumbaChap iko tayari kusaidia.", author: "Methali ya Kiswahili" },
                { text: "Wengine wanasema ndoto ni ndoto, lakini NyumbaChap inathibitisha kuwa kila ndoto ya makazi bora inaweza kuwa kweli.", author: "Methali ya Sasa" },
                { text: "Watu hawakumbuki kila ulilosema, lakini watakumbuka hisia. NyumbaChap inaleta faraja ya kweli kwa familia zinazotafuta nyumba nzuri.", author: "Unknown" },
                { text: "Kuwa na makazi salama ni haki ya kila Mtanzania. Ndiyo maana NyumbaChap imejikita kusaidia kila mmoja kupata sehemu ya kupaita nyumbani.", author: "Methali ya Afrika" },
                { text: "Kila jua linapochomoza ni nafasi mpya ya kuanza upya. Kama hujui pa kuanzia, chagua NyumbaChap – mwanzo mpya, maisha mapya.", author: "Methali" },
                { text: "Usingoje ufanikiwe ndio utafute nyumba. Fikiria makazi yako mapema. NyumbaChap ni jukwaa lako la kufanya mipango ya mbele mapema.", author: "Methali ya Maisha" },
                { text: "Wengi wanatafuta makazi, wachache wanajua pa kuanzia. Kwa bahati nzuri, wewe umefika NyumbaChap – usiache hii fursa.", author: "Methali ya Sasa" },
                { text: "Kuna tofauti kati ya nyumba na makazi. NyumbaChap inahakikisha haupati tu nyumba, bali unapata makazi yanayoleta utulivu wa maisha.", author: "Methali ya Kiswahili" },
                { text: "Huwezi kutimiza ndoto ukiwa huna sehemu salama ya kuota. Ndiyo maana NyumbaChap iko – kwa ajili ya Watanzania wote.", author: "Methali ya Maisha" }
                ];

            const randomQuote = helpers.randomChoice(quotes);
            return `💭 *MSEMO WA LEO*\n\n"${randomQuote.text}"\n\n_- ${randomQuote.author}_`;
        }
    },
    methali: {
        description: "Methali ya Kiswahili",
        usage: ".methali",
        execute: async () => {
                        const methali = [
                    "Samaki mkunje angali mbichi kwani ukishakauka haunyooki – malezi bora huanza mapema.",
                    "Mgeni njoo mwenyeji apone – ukarimu wa mwenyeji hupimwa kwa jinsi anavyowakaribisha wageni.",
                    "Usipoziba ufa utajenga ukuta – matatizo madogo yasipotatuliwa huzaa matatizo makubwa zaidi.",
                    "Akili ni mali – mtu mwenye busara ana utajiri usioonekana kwa macho.",
                    "Asiyesikia la mkuu huvunjika guu – kutokutii ushauri huleta maumivu au madhara.",
                    "Mtaka cha mvunguni sharti ainame – mafanikio yanahitaji juhudi na unyenyekevu.",
                    "Bandu bandu huisha gogo – hata kazi kubwa ikifanywa kidogo kidogo huisha.",
                    "Haraka haraka haina baraka – kufanya mambo kwa pupa huleta matatizo.",
                    "Chovya chovya humaliza buyu la asali – matumizi holela huharibu rasilimali.",
                    "Mpanda ngazi hushuka – aliyepata cheo leo anaweza kushuka kesho, unyenyekevu ni muhimu.",
                    "Chema chajiuza, kibaya chajitembeza – ubora wa kitu hujulikana bila kuhitaji matangazo makubwa.",
                    "Bahati haiji mara mbili – fursa ikija itumie, huenda isitokee tena.",
                    "Ukipanda mchongoma usitarajie kuvuna matunda matamu – matokeo huendana na jitihada na njia ulizochukua.",
                    "Nyani haoni kundule – ni rahisi kuona makosa ya wengine lakini si yako mwenyewe.",
                    "Kikulacho ki nguoni mwako – hatari mara nyingi hutoka kwa watu wa karibu.",
                    "Mtoto wa nyoka ni nyoka – tabia za mzazi huweza kurithiwa na mtoto.",
                    "Mgala haina mwisho, akipona huanza upya – hali ngumu si ya kudumu.",
                    "Penye nia pana njia – ukitamani kwa dhati, kila jambo linawezekana.",
                    "Lisilo budi hubidi – unapokosa njia nyingine, unalazimika kukubali hali halisi.",
                    "Maji yakimwagika hayazoleki – fursa ikipotea mara nyingine hairejei.",
                    "Usitukane mamba kabla hujavuka mto – usibeze hatari kabla hujaikwepa.",
                    "Kamba hukatikia pabovu – matatizo hujitokeza kwenye sehemu dhaifu.",
                    "Mtumbwi mmoja haulizi watu wawili waliokasirika – mshikamano ni muhimu katika safari ya pamoja.",
                    "Mgeni njoo mwenyeji apone – ujio wa mgeni huleta furaha na uponyaji wa moyo kwa mwenyeji.",
                    "Mwenye macho haambiwi tazama – ishara ya jambo huwa wazi kwa anayetaka kuelewa.",
                    "Simba mwenda pole ndiye mla nyama – subira huzaa matunda.",
                    "Ngoma huvutia waliomo – anayefurahia jambo ni yule anayehusika moja kwa moja nalo.",
                    "Penye wengi hapaharibiki neno – mshikamano huleta mafanikio.",
                    "Aliye juu mngoje chini – hata aliye na madaraka leo huenda akapoteza kesho.",
                    "Mtaka yote hukosa yote – tamaa hupoteza kila kitu.",
                    "Mkono mmoja hauchinji ng’ombe – ushirikiano ni msingi wa kazi kubwa.",
                    "Mvumilivu hula mbivu – anayesubiri kwa subira hufaidika zaidi.",
                    "Maji hufuata mkondo – mambo hutokea kulingana na mwelekeo wa asili.",
                    "Siku njema huonekana asubuhi – mwanzo wa jambo huonyesha mwisho wake.",
                    "Palipo na moshi pana moto – dalili ndogo huonyesha jambo kubwa linaendelea.",
                    "Tunda zuri liliiva mbali – mafanikio huja kwa kuvuka changamoto.",
                    "Akipenda chongo huita kengeza – mapenzi hufunika mapungufu.",
                    "Mpanda farasi wawili huanguka – jaribu kulenga jambo moja kwa mafanikio.",
                    "Jifya moja halipiki chakula – msaada kutoka kwa wengine ni muhimu.",
                    "Chombo kikielea hakina uzito – watu wasio na msimamo mara nyingi hawana uthabiti.",
                    "Usione vyaelea vimeundwa – kila mafanikio yana historia ya kazi ngumu.",
                    "Msema kweli ni mpenzi wa Mungu – ukweli huleta heshima hata kama unauma.",
                    "Maji usiyoyafika hujui kina chake – usihukumu jambo bila kulifahamu vizuri.",
                    "Dawa ya moto ni moto – tatizo linaweza kutatuliwa kwa kutumia njia ya aina yake.",
                    "Kila ndege huruka kwa mbawa zake – kila mtu ana uwezo wake wa kufanikisha maisha.",
                    "Mchumia juani hulia kivulini – kazi ngumu huzaa matunda ya raha.",
                    "Akufaaye kwa dhiki ndiye rafiki wa kweli – marafiki wa kweli hujitokeza wakati wa shida.",
                    "Mbio za sakafuni huishia ukingoni – harakati bila mwelekeo huishia kwenye matatizo.",
                    "Aliye juu mngoje chini – mamlaka ni ya muda, utulivu ni muhimu.",
                    "Meno ya mbwa hayawezi kung’ata jirani wake – hatari kutoka kwa wa karibu mara nyingi haipo.",
                    "Mkataa pema pabaya panamuita – anayekataa fursa nzuri huishia kubeba mzigo wa majuto."
                ];

            return `📜 *METHALI YA LEO*\n\n"${helpers.randomChoice(methali)}"`;
        }
    },
    tbt: {
        description: "Throwback ya Kiswahili",
        usage: ".tbt",
        execute: async () => {
            const list = [
            "Je, unakumbuka Nokia 3310? Ule ulikuwa ni mtandao wa kitaifa – betri linaweza kudumu wiki nzima na ringtone zile zilikuwa burudani ya ukweli! 📱🔥",
            "TBT ya kipindi cha Ze Comedy pale EATV – Masanja Mkandamizaji na Mpoki walitufundisha kucheka mpaka machozi! 😂🎭",
            "Kumbuka Tamthilia ya *Jino la Tembo* kwenye ITV? Pale ndipo tulipojifunza maana halisi ya drama ya Kiswahili iliyokolezwa 🔥📺",
            "Wakati TV zilikuwa na mlango wa mbao na remote ilikuwa ndoto – uliamka kwenda kubadilisha channel kwa mkono! 📺😅",
            "Enzi za kibatari na redio ya betri ya R20 – kila jioni unaskia sauti ya Mzee Majuto kwenye *Kipindi cha Jioni* 😌📻",
            "Siku za Leka Dutigite! Kipindi cha watoto kilichokuwa kinaanza saa 10 jioni pale TBC – tulifurahia vikaragosi vya Kiafrika 🧒🏽📺",
            "Enzi zile ambapo ukitaka kuingia mtandaoni, ulikuwa unasubiri saa 4 usiku pale cafe, kwa 500/= unapata dakika 30 za Yahoo! 🖥️🌐",
            "Mchezo wa kombolela, rede, na kibaba enzi za jioni – hakukuwa na PlayStation lakini burudani ilikuwa ya dhati kabisa 🏃🏾‍♂️🪀",
            "Ulipojiona una kadi ya TTCL ya shilingi 500 ulikuwa tajiri – unapiga namba kwa nguvu huku unasali isikate 🪪📞",
            "Radio Maria na 'Saa ya Huruma ya Mungu' ilivyokuwa ikiunganisha familia kila saa 9 alasiri – utulivu wa kweli 📻🙏",
            "Unakumbuka kipindi cha *Vipaji Vyetu* kwenye Channel Ten? Watu walikuwa wanacheza, kuimba, kuigiza, full vipaji vya mtaa 🕺🎤",
            "Siku za zamani ambapo ukiambiwa unaenda shule ya bweni, unalia wiki nzima! Ila sasa ndio tulipojifunzia maisha 😢🎒",
            "Mvinyo wa zabibu wa Dodoma ukiletwa kwenye harusi ulikuwa ni standard ya taifa – ukiona unawekewa ujue heshima iko juu 🍷🥂",
            "Vijana tulikuwa tunavaa 'bata' aina ya Kitope, t-shirt ya Sean John, na chain kubwa shingoni – style ya mtaa ilikuwa trademark 😎👟",
            "Siku za kusubiria gazeti la *Mzalendo*, *Mwananchi* au *Uhuru* ili ujue ratiba ya mpira wa Yanga na Simba 📰⚽",
            "Wakati redio ilikuwa ikicheza nyimbo za Z Anto, Mr Nice, na Daz Baba... hiyo ndio ilikua Tanzania yetu ya bongo fleva 🔊🇹🇿",
            "Kumbuka kipindi cha *Mama na Mwana*? Kila familia ilikuwa inakaa pamoja saa mbili usiku kuangalia drama kali za maisha ya kweli 👩‍👦🎭",
            "Siku ya Ijumaa ilikuwa ya kusikiliza *Muziki wa Pwani* kwenye redio – taarab za mwambao zilikuwa zinaleta feelings 💃🏾🎶",
            "Enzi za kuandika barua ya mpenzi na kuituma kwa posta – ukiona majibu baada ya wiki mbili, unalia na kufurahia kwa wakati mmoja 💌📬",
            "Ukitoka shule na ukakuta uji wa dona na mihogo ya kukaanga, hiyo ilikuwa paradise ya kweli – maisha ya familia za kawaida lakini yenye upendo 🥣🍠"
            ];


            return `⏳ *TBT YA LEO*\n\n${helpers.randomChoice(list)}`;
        }
    },
    bongoFact: {
        description: "Pata fact moja ya Tanzania",
        usage: ".bongofact",
        execute: async () => {
          const facts = [
                    "Tanzania ina zaidi ya lugha 120 zinazozungumzwa, kila lugha ikibeba utamaduni na historia yake ya kipekee.",
                    "Mlima Kilimanjaro ni mlima mrefu zaidi Afrika na ni kivutio kikubwa kwa watalii wanaotaka changamoto ya kupanda milima.",
                    "Ziwa Victoria ni ziwa kubwa zaidi Afrika na chanzo kikuu cha mto Nile, unaojulikana duniani kwa wingi wa samaki wake.",
                    "Dodoma ni mji mkuu wa Tanzania, lakini Dar es Salaam ndiyo jiji kubwa na kitovu cha biashara na maisha ya kisasa.",
                    "Tanzania ni nchi pekee Afrika yenye volkano hai, Ol Doinyo Lengai, unaotoa mawe ya lava ya kipekee na yenye asili ya kipekee.",
                    "NyumbaChap ni jukwaa ambalo limekuwa likisaidia maelfu kupata makazi bora na mipango ya nyumba kwa urahisi Tanzania nzima.",
                    "Watanzania wengi wanapenda utalii wa ndani, na maeneo kama Serengeti na Ngorongoro ni maarufu kwa wanyama pori na mandhari.",
                    "Mji wa Bagamoyo una historia ndefu ya utawala wa Kiislamu na biashara za watumwa, na unahifadhi urithi mkubwa wa kihistoria.",
                    "Bahari ya Hindi ina pwani ndefu ya Tanzania inayovutia watalii kwa fukwe nzuri kama Zanzibar na Mafia.",
                    "Jiji la Mwanza linapatikana kando ya Ziwa Victoria, na ni maarufu kwa uzalishaji wa samaki wa Nile perch.",
                    "Tanzania ina mfumo mzuri wa hifadhi za wanyama pori kama Selous na Ruaha, zinazotoa ajira kwa wenyeji na watalii.",
                    "Kiswahili ni lugha rasmi ya Tanzania na ni moja ya lugha zinazozungumzwa zaidi Afrika Mashariki.",
                    "NyumbaChap hutoa nafasi kwa watumiaji kupokea taarifa za nyumba mpya na makazi yenye ubora wa hali ya juu nchini Tanzania.",
                    "Wakulima wa Tanzania wanazalisha mazao mengi kama kahawa, chai, mahindi, na mpunga, ambayo ni sehemu muhimu ya uchumi.",
                    "Jiji la Arusha linajulikana kama kitovu cha safari za mlima Kilimanjaro na hifadhi za wanyama.",
                    "Tanzania ina mikoa 31 na kila moja ina utamaduni na mila tofauti zinazowafanya watu wa kipekee.",
                    "Nchi hii ina hifadhi za maumbile muhimu kama Mto Rufiji, ambayo ni chanzo kikubwa cha maji na uzalishaji wa nishati.",
                    "NyumbaChap inahakikisha taarifa za nyumba zinazopatikana ni za kweli na zenye usalama kwa watumiaji wake.",
                    "Maeneo ya pwani kama Dar es Salaam na Tanga yana mchango mkubwa katika biashara za baharini na uvuvi.",
                    "Usimamizi wa rasilimali za asili Tanzania unazingatia uhifadhi wa mazingira na maendeleo endelevu.",
                    "Serengeti ni moja ya hifadhi kubwa za wanyama Afrika, inajivunia uhamaji mkubwa wa wanyama kama pundamilia na swala.",
                    "Zanzibar ni kisiwa cha utalii chenye historia ya biashara ya viungo na maeneo mazuri ya kupumzika.",
                    "Mji wa Tabora una historia ya utawala wa kiarabu na mji wa kwanza kuunganishwa kwa reli nchini Tanzania.",
                    "Tanzania ina viwanja vya ndege vikubwa kama Julius Nyerere International, vinavyounganisha nchi na dunia.",
                    "NyumbaChap ni sehemu bora kwa wapangaji na wamiliki wa nyumba kupata mawasiliano ya moja kwa moja.",
                    "Kilimo ni sekta muhimu kwa Watanzania wengi, na hutoa ajira kwa zaidi ya nusu ya wakazi.",
                    "Mfumo wa barabara nchini Tanzania unaendelea kuboreshwa ili kurahisisha usafirishaji wa bidhaa na watu.",
                    "NyumbaChap inatoa ushauri na taarifa kwa wateja ili kuchagua nyumba zinazokidhi mahitaji yao.",
                    "Watanzania wanathamini sana utamaduni na mila zao ambazo zinadhihirika katika sherehe na ngoma za kienyeji.",
                    "Mji wa Dodoma unaendelea kukua na kuwa kitovu cha serikali na maendeleo ya kitaifa.",
                    "Jiji la Mbeya linajulikana kwa uzalishaji wa mazao ya kilimo kama kahawa na matunda.",
                    "Tanzania ina historia tajiri ya mapinduzi na uhuru, ilipata uhuru mwaka 1961 kutoka Uingereza.",
                    "Watoto wengi wanapata elimu ya msingi kupitia shule za serikali na za kibinafsi kote nchini.",
                    "NyumbaChap hutoa huduma ya mtandaoni inayorahisisha utafutaji wa nyumba kwa kutumia teknolojia ya kisasa.",
                    "Mikoa ya Kanda ya Ziwa inajivunia mazao ya samaki na maendeleo ya kilimo cha kisasa.",
                    "Miji mikubwa kama Dar es Salaam na Arusha ina miundombinu ya kisasa inayowezesha biashara na utalii.",
                    "Tanzania inajivunia maziwa mengi, ziwa Victoria, Tanganyika, na Nyasa, yenye ushawishi mkubwa katika maisha ya watu.",
                    "NyumbaChap inasaidia watu kupata makazi salama na ya bei nafuu bila usumbufu wa muda mrefu.",
                    "Makumbusho ya Taifa ya Tanzania yana hifadhi ya vitu vya kihistoria vya kipekee vinavyowakilisha utamaduni wa nchi.",
                    "Kilimo cha mazao kama mahindi na mtama ni nguzo muhimu katika lishe na uchumi wa Watanzania.",
                    "Nchi ina mbuga za wanyama kama Tarangire na Manyara ambazo ni kivutio kikubwa cha watalii.",
                    "Tanzania ni miongoni mwa nchi zinazojitahidi kuhifadhi mazingira na kuendeleza nishati mbadala.",
                    "NyumbaChap hutoa maoni na mapitio ya nyumba ili kuwasaidia wapangaji kufanya maamuzi sahihi.",
                    "Serikali inahamasisha matumizi ya teknolojia mpya katika sekta mbalimbali za uchumi.",
                    "Kisiwa cha Pemba kinajulikana kwa uzuri wa fukwe na uzalishaji wa viungo kama karafuu.",
                    "Watanzania wanapenda sana michezo ya mpira wa miguu na kusherehekea matokeo ya timu zao.",
                    "NyumbaChap ni jukwaa linaloendeshwa kwa maadili na uwazi, likiwaunganisha wanunuzi na wauzaji wa nyumba.",
                    "Sanaa za asili za Tanzania zina umuhimu mkubwa katika utamaduni na uchumi wa watu wa kienyeji.",
                    "Maeneo ya vijijini yanaendelea kuunganishwa na huduma za msingi kupitia miradi ya serikali.",
                    "NyumbaChap inatoa taarifa za mara kwa mara kuhusu nyumba mpya zinazopatikana sokoni.",
                    "Watanzania wanathamini ushirikiano na mshikamano kama msingi wa maendeleo endelevu."
                    ];

            return `🇹🇿 *FAHAMU TANZANIA*\n\n${helpers.randomChoice(facts)}`;
        }
    },
    socialVibe: {
        description: "Style ya post za Insta/TikTok",
        usage: ".vibe",
        execute: async () => {
          const vibes = [
                "💅 Vibe na mimi au kaa kando!",
                "Hakuna kulala mpaka ndoto zitimie 😤🔥",
                "Wale wa kunitamani, mtajijua 😎",
                "Sina stress, niko na blessings 💫",
                "Wanasema niko slow... kumbe nina plan ya muda mrefu 💣",
                "Niko busy nikifanya ndoto zangu ziwe reality 😌🚀",
                "Leo ni leo – kama huwezi handle moto, usikaribie jiko 🔥",
                "Napiga kazi kimyakimya, halafu success inapiga kelele 🧏‍♂️📢",
                "Kama si pesa, ni peace of mind – vyote najua kuvitafuta 💵🧘",
                "Mwaka huu ni wa mimi – na sina aibu kusema hivyo loud 🔊😤",
                "Wamejaribu kuniangusha, lakini leo nashika mkwaju!",
                "Ndio, nina shida lakini naipambana hadi mwisho!",
                "Usijaribu kunizuia, moto wangu hauzimiki!",
                "Ukitaka kusingizia, usijiunge na crew yangu!",
                "Kila siku ni chance mpya, usikubali kurudi nyuma!",
                "Maisha ni msimu, leo uko juu, kesho utashuka!",
                "Niko fresh kabisa, uko tayari kukabiliana na hii dunia?",
                "Nataka kuona mshikamano, si drama tu!",
                "Kila mtu na story yake, yangu ni ya kushinda!",
                "Bado nasubiri weekend, lakini kazi ipo!",
                "Hatutaki drama, tunataka maendeleo!",
                "Usicheze na ndoto za mtu, zina thamani sana!",
                "Kila hatua ni muhimu, hata zile ndogo ndogo!",
                "Niko mkweli, hata kama inauma kusema ukweli!",
                "Tuko pamoja, hata kama dunia inageuka!",
                "Huwezi kunizima, nikiwa na moto ndani!",
                "Nilipoanza walinidharau, leo wanatabasamu!",
                "Kila siku ni fursa mpya ya kubadilisha maisha!",
                "Usichoke kujaribu, mafanikio hayaji kwa starehe!",
                "Hakuna cha bure, kila kitu kinahitaji jitihada!",
                "Leo napiga kelele kwa ndoto zangu!",
                "Nafikiri, napanga, na kufanya – hiyo ndio njia!",
                "Niko tayari kwa changamoto yoyote!",
                "Watu wanazungumza, mimi nashughulikia!",
                "Ndio mtu wa matendo, si maneno tu!",
                "Najivunia asili yangu, hakuna wa kuniangusha!",
                "Leo ni leo, kesho ni hadithi!",
                "Kila mtu ana mapenzi, lakini si kila mtu anafanya kazi!",
                "Kuwa na attitude ni lazima, success si rahisi!",
                "Nataka kuacha alama duniani, si tu kushinda!",
                "Niko na ndoto kubwa, usinipunguze moyo!",
                "Leo naona mwanga hata kama giza liko karibu!",
                "Hakuna cha kunizuia, natembea kwa hofu ya Mungu tu!",
                "Maisha ni safari, si mchezo!",
                "Najua kidogo, lakini niko tayari kujifunza zaidi!",
                "Usimchezee mtu mwenye ndoto, ni hatari!",
                "Kila changamoto ni fursa ya kujifunza!",
                "Niko tayari kupanda ngazi za maisha!",
                "Nataka kuona dunia ikibadilika kwa nguvu zetu!",
                "Ninaamini nguvu za pamoja ni mabadiliko!",
                "Kila mtu anahitaji nafasi ya kuonyesha uwezo!",
                "Maisha ni mchanganyiko wa majaribu na mafanikio!"
                ];


            return `📸 *SOCIAL VIBE*\n\n${helpers.randomChoice(vibes)}`;
        }
    },


    mkali: {
        description: "Jiongezee mbwembwe za kuwa mkali.",
        usage: ".mkali",
        execute: async () => {
            const lines = [
                "🔥 *MKALI MODE ON!*\n\nLeo uko juu kama kawaida – hakuna wa kukugusa! 😎",
                "🚀 Upo juu kuliko mawingu leo – level ya mkali imevunjwa!",
                "😤 Hawajui una nguvu ya simba, leo unawakumbusha!",
                "⚡ Leo ni wewe na moto tu – hakuna wa kukudhibiti!",
                "🥶 Baridi ni ya kawaida, wewe ni moto wa jiji!",
                "🔥 Usiku leo unawaka kwa sababu wewe ni mkali wa kweli!",
                "🏆 Unastahili tuzo ya kuwa mkali wa mwaka!",
                "💪 Mtaani ni gumzo – jina lako linatetemesha!",
                "🧨 Leo kila hatua yako ni kama mlipuko wa ushindi!",
                "👑 Wewe ni mfalme wa leo – ukifika, watu wanasimama!"
            ];
            return helpers.randomChoice(lines);
        }
    },

    mbwembwe: {
        description: "Mbwembwe zako leo ni 🔥!",
        usage: ".mbwembwe",
        execute: async () => {
          const lines = [
                "💫 *MBWEMBWE ZA LEO*\n\nUkifika mahali, watu wanainuka. Energy yako haitoshi kuigwa! ✨",
                "🌟 Kila unachovaa kinaonekana kipekee – mbwembwe zako ni za kifalme!",
                "🕺 Unavyotembea, unaleta msisimko wa red carpet!",
                "👠 Leo viatu vyako vinaongea – step zako ni za kisanii!",
                "📸 Kamera zinakufuata kama staa wa Hollywood – una mvuto wa ajabu!",
                "🎤 Ukiingia, watu wanapiga makofi – una roho ya staa!",
                "🧥 Suti yako leo ni moto kuliko jua la mchana!",
                "💎 Leo kila hatua yako ni kama unavaa almasi – people can't ignore you!",
                "🔥 Mbwembwe zako leo zinapasua anga – hakuna mwingine kama wewe!",
                "🏁 Wamejaribu kukuiga lakini mbwembwe zako haziigiki!",
                "✨ Leo umevaa mbwembwe za hadhi ya juu – kila mtu anataka kujifunza kutoka kwako!",
                "🎩 Mbwembwe zako ni kama mkate moto, kila mtu anakila kwa hamu!",
                "🎇 Unaonekana kama umepata mvuto wa kuvutia, hakuna anayeweza kuzizuia!",
                "🦚 Kuwa na mbwembwe zako ni kama kuwa na manyoya ya paa – hakuna wa kupindukia!",
                "👑 Leo ni siku yako ya kung'ara, kila mtu anakutazama kwa heshima!",
                "🔥 Mbwembwe zako zinawaka moto kuliko jiko la mtaa!",
                "💥 Unaleta nguvu mpya kila unapojitokeza – hakuna anayeweza kusimama nawe!",
                "🌈 Mbwembwe zako ni rangi ya maisha – zinabadilisha hali ya mazingira!",
                "⚡ Leo unavuma kama radi, mbwembwe zako zinasababisha mabadiliko makubwa!",
                "🎉 Hakuna anayeweza kupinga uzuri wa mbwembwe zako – umejaa mvuto wa pekee!"
                ];

            return helpers.randomChoice(lines);
        }
    },

    simulizi: {
        description: "Pata simulizi fupi ya kusisimua.",
        usage: ".simulizi",
        execute: async () => {
           const stories = [
                        "Alianza kwa ndoto ndogo tu za kuendesha biashara yake mwenyewe akiwa kijijini. Hakuwahi kuwa na msaada wa kifedha wala mwelekeo wa wazi, lakini hakukata tamaa. Alianza kwa kuuza bidhaa ndogo za mikono kwa majirani, akitumia kila fursa ya kujifunza kutoka kwa watu waliomzunguka. Kwa miaka mingi, alikumbana na changamoto za ukosefu wa mtaji, wateja wachache, na kushindwa kufikia masoko makubwa. Lakini alizidi kufanya kazi kwa bidii, akitafuta mbinu za kuboresha huduma na bidhaa zake, akijifunza ujasiriamali kupitia mafunzo ya bure mtandaoni. Baada ya miaka 7 ya kujitahidi na kushindwa mara kadhaa, alifanikiwa kupata mkopo mdogo kutoka kwa taasisi ya mikopo ya vijijini, na kuanzisha duka la kisasa la biashara ambalo sasa linahudumia miji mitatu jirani. Leo, biashara yake ni mfano wa mafanikio ya mtu aliyebadilisha changamoto kuwa fursa na anawasaidia wengine kuanza safari zao za kimaisha.",
                        
                        "Kijana huyu alikuwa akipitia maisha magumu ya familia isiyokuwa na msaada wa kifedha. Alizaliwa katika familia ya wakulima wadogo wadogo, ambapo changamoto ya kipato na elimu ilikuwa ya kila siku. Ingawa alikumbwa na mazingira magumu, alijitahidi kuendelea na masomo na akapokea msaada kidogo kutoka kwa walimu wake waliomwona kipaji. Wakati wa shule, alikumbana na dharau kutoka kwa wenzao kwa sababu ya hali yake, lakini hakuruhusu hilo kumfanya aache ndoto zake. Alijifunza jinsi ya kutumia teknolojia ya kompyuta kupitia mafunzo ya bure mtandaoni na akaamua kuanza kufundisha watoto wengine kijijini ili kuwasaidia kufikia elimu bora. Leo, yeye ni mwalimu maarufu na mjasiriamali wa teknolojia ambaye amezindua taasisi ya kutoa elimu ya kidijitali kwa watoto vijijini Tanzania. Simulizi yake ni mfano mzuri wa jinsi bidii, uvumilivu, na moyo wa kusaidia wengine unavyoweza kubadilisha maisha ya wengi.",
                        
                        "Simulizi hii ni ya mwanamke jasiri ambaye alianza kazi yake kama mfanyakazi wa kawaida katika kiwanda cha vinywaji mkoani Mwanza. Aliishi maisha ya kawaida huku akijaribu kuokoa kidogo kila mwezi kwa ajili ya kuanzisha biashara yake binafsi. Hali ilikuwa ngumu, lakini hakuridhika na maisha ya kawaida na aliota ndoto kubwa za kuwa mjasiriamali wa mafanikio. Baada ya muda, alikumbana na changamoto kubwa ikiwemo ukosefu wa mtaji, na kuteswa na baadhi ya watu waliomshinikiza aache ndoto zake. Hata hivyo, aliamua kuendelea kwa moyo mkunjufu na kujifunza mikakati ya biashara kupitia kozi za mtandao na kushauriana na watu waliomsaidia. Aliamua kuanzisha biashara ya kuuza bidhaa za asili za afya, na kupitia ubunifu na ubora wa huduma, biashara hiyo sasa ni mojawapo ya zinazotoa ajira kwa mamia ya wanawake mkoani Mwanza. Simulizi yake ni ushahidi wa dhati wa nguvu ya mtu asiyeogopa kushinda changamoto na kufikia mafanikio.",
                        
                        "Mwanafunzi huyu alikumbwa na changamoto nyingi katika maisha yake ya awali, ikiwa ni pamoja na kukosa nafasi ya kuendelea na masomo ya juu kwa sababu ya hali ya kifamilia. Alijitahidi kufanya kazi za mkono na kuuza bidhaa ndogo ili kusaidia familia yake na kujifunza kwa bidii zaidi. Aliamua kujifunza kupitia mtandao kwa kutumia simu yake ya mkononi na akaingia kwenye kozi mbalimbali za bure. Alijifunza programu mbalimbali za kompyuta, kuandika, na ujasiriamali. Baada ya juhudi nyingi, alifanikiwa kupata nafasi ya kazi kama mtaalamu wa data katika kampuni maarufu ya teknolojia Tanzania, na sasa anahamasisha vijana wengi kupitia mafunzo ya bure na ushauri wa kazi mtandaoni. Simulizi hii inatufundisha kuwa kwa kutumia rasilimali zilizopo, mtu anaweza kufikia malengo makubwa hata akiwa na changamoto za maisha.",
                        
                        "Hii ni hadithi ya kijana aliyekuwa akitumia muda wake mwingi barabarani kama mchuuzi wa bidhaa za mikono ili kusaidia familia yake. Ingawa maisha yalikuwa magumu, alitambua kuwa elimu ndiyo njia pekee ya kuondokana na umasikini. Alijiunga na shule ya usiku na kufanya kazi kwa bidii kubwa ili kupata nafasi nzuri katika maisha. Alipokuwa na umri wa miaka 25, alifanikiwa kuingia chuo kikuu kwa msaada wa mikopo na juhudi zake mwenyewe. Katika kipindi hicho, alikumbana na changamoto za kukosa chakula, makazi na hata kujiunga na shughuli zisizo za maana kwa ajili ya kupata mahitaji ya msingi. Hata hivyo, alibaki na nia thabiti na baada ya kuhitimu alifanikiwa kupata kazi nzuri katika taasisi ya serikali na sasa ni mwezeshaji wa vijana wanaotaka kujikwamua na kuwa na maisha bora. Simulizi hii inaonesha kuwa uvumilivu na bidii huleta mafanikio hata katika hali ngumu zaidi.",
                        
                        "Mwanamume huyu aliishi maisha ya kawaida kama mfanyakazi wa ofisi jijini Dar es Salaam, lakini aliota ndoto kubwa za kuanzisha biashara yake mwenyewe. Alikumbana na changamoto za kupata mtaji na ushauri bora, lakini hakuruhusu changamoto hizo kumzuia. Aliamua kujifunza masuala ya biashara mtandaoni na kuungana na wajasiriamali wengine. Baada ya miaka michache ya kujaribu, alianza kampuni inayojishughulisha na ujenzi wa nyumba za kisasa, na sasa kampuni hiyo inatoa ajira kwa watu zaidi ya 50. Simulizi yake ni mfano wa mafanikio yanayotokana na kushikamana na malengo hata pale changamoto zikikuja.",
                        
                        "Hii ni hadithi ya mwanamke aliyepitia changamoto za maisha ya familia yenye ugumu wa kifedha na maisha ya mtaa wa mjini. Alijitahidi kuendeleza elimu yake kwa kupitia masomo ya mtandaoni na kufanya kazi za mkono ili kusaidia familia. Baada ya kupata msaada kutoka kwa shirika la misaada, aliweza kuanzisha biashara ya kuuza bidhaa za ngozi na mavazi ya kienyeji. Biashara yake imekua na sasa anatoa ajira kwa wanawake wengine wadogo wadogo wa mtaa wake. Simulizi hii inatufundisha kuwa msaada mdogo unaweza kuleta mabadiliko makubwa kwa mtu na jamii.",
                        
                        "Kijana huyu alikuwa na ndoto za kuwa muigizaji wa filamu maarufu, lakini alikumbana na ukosefu wa fursa na rasilimali. Hata hivyo, alijifunza uigizaji kupitia kozi za mtandaoni na kushirikiana na marafiki waliokuwa na nia kama yake. Baada ya muda, alifanikiwa kupata nafasi za kucheza katika filamu za ndani na sasa anajivunia kuwa mmoja wa wasanii wanaoibuka nchini. Simulizi hii inaonesha kuwa ndoto kubwa zinaweza kutimizwa kwa ubunifu na ushirikiano.",
                        
                        "Hadithi ya mzee aliyekuwa mkulima wa kawaida katika kijiji cha mkoa wa Morogoro, aliyebadilisha maisha yake kwa kutumia teknolojia ya kisasa ya kilimo. Aliamua kujifunza mbinu za kisasa za kilimo kupitia mafunzo ya serikali na kutumia simu ya mkononi kutafuta masoko ya mazao yake. Kwa bidii na uvumilivu, sasa ni mmoja wa wakulima wa kisasa mkoani humo na anatoa mafunzo kwa wakulima wengine. Simulizi yake ni mfano wa mabadiliko ya maisha yanayoweza kupatikana kwa kuishi kwa mabadiliko na kujifunza kila siku.",
                        
                        "Mwanaume huyu alianza kama mfanyakazi wa duka dogo jijini Arusha, akijitahidi kuuza bidhaa na kupata wateja waaminifu. Alijifunza mbinu za mauzo na uuzaji mtandaoni na kuanzisha biashara ya kuuza bidhaa za kielektroniki. Baada ya miaka michache, biashara yake imekua na sasa ana mtandao wa maduka mikoa mingi Tanzania. Simulizi hii inatufundisha umuhimu wa kufuata mabadiliko ya teknolojia na kujifunza mambo mapya kila siku.",
                        
                        "Mwanamke huyu alikumbwa na changamoto za afya za familia na hali ngumu ya kifedha, lakini hakukata tamaa. Aliamua kuanzisha biashara ya kuuza bidhaa za afya na chakula cha lishe kwa ajili ya watu wenye changamoto kama yeye. Biashara hiyo imekua na sasa anatoa msaada kwa jamii yake na kuwahamasisha watu wengine kuanzisha biashara zao. Simulizi hii ni mfano wa nguvu ya moyo wa mshikamano na kusaidia wengine.",
                        
                        "Hadithi hii ni ya kijana aliyekuwa akifanya kazi kama mchuuzi wa matunda katika soko kuu la jijini. Aliamua kujifunza mbinu za ujasiriamali na kuanzisha biashara ndogo ndogo za kuuza bidhaa za kilimo. Baada ya miaka michache, ana duka la kisasa na anatoa ajira kwa vijana wengine wa mtaa wake. Simulizi hii inahimiza vijana kuwa na uvumilivu na kujifunza kila wakati.",
                        
                        "Mwanamke huyu alikumbwa na changamoto za maisha ya ndoa na kuishi na watoto wakiwa chini ya umaskini. Aliamua kujifunza kazi ya ufundi wa mikono na kuanzisha biashara ya urembo. Leo, biashara yake imekua na anatoa ajira kwa wanawake wengi katika jamii yake. Simulizi hii inaonesha kuwa ujasiriamali unaweza kubadilisha maisha hata katika hali ngumu.",
                        
                        "Mwanaume huyu alikuwa mfanyakazi wa kawaida wa kampuni ya mawasiliano, lakini alitaka zaidi katika maisha. Aliamua kujifunza ujuzi wa programu na kuanzisha biashara ya huduma za mtandao. Biashara hiyo imekua na sasa ana timu kubwa ya watu wanaofanya kazi kwa mbali. Simulizi hii inatufundisha kuwa kuwekeza katika elimu na ujuzi ni njia ya mafanikio.",
                        
                        "Hadithi hii ni ya msichana aliyepitia changamoto za familia na masuala ya afya. Aliamua kujiunga na vikundi vya kijamii na kupata mafunzo ya ujasiriamali. Baada ya kupata msaada wa mikopo, aliweza kuanzisha biashara ya kuuza chakula cha haraka na sasa anajishughulisha na kuendeleza jamii yake. Simulizi hii inaonesha nguvu ya kushirikiana na kusaidiana katika jamii.",
                        
                        "Kijana huyu alikuwa na ndoto ya kuwa mwandishi maarufu wa vitabu lakini alikosa msaada wa kifedha na ushauri. Alijifunza kuandika kupitia mitandao ya kijamii na kupata mashabiki wengi. Baada ya kupata umaarufu, aliweza kuchapisha vitabu vyake na sasa anahamasisha vijana wengi kuandika. Simulizi hii ni ushahidi wa kuwa ndoto zinatimizwa kwa kutumia teknolojia na kujitahidi.",
                        
                        "Mwanamke huyu alikumbwa na changamoto za maisha ya jiji na ukosefu wa usaidizi wa familia. Aliamua kujiunga na kikundi cha wanawake na kujifunza stadi za biashara. Baada ya mafunzo, aliweza kuanzisha biashara ya kuuza bidhaa za mikono na sasa anahudumia wateja wengi. Simulizi hii inahamasisha wanawake kuwa na imani na kufuata ndoto zao.",
                        
                        "Hadithi hii ni ya mzee aliyekuwa mchungaji wa mifugo lakini aliamua kuanzisha biashara ya kuuza mazao ya kilimo kwa kutumia teknolojia mpya. Aliweza kupanua biashara yake na sasa anatoa ajira kwa watu wengi kijijini. Simulizi hii inaonesha kuwa mabadiliko na uvumilivu ni funguo za mafanikio."
                        ];

            return `📖 *SIMULIZI YA LEO*\n\n${helpers.randomChoice(stories)}`;
        }
    },

    mchongo: {
        description: "Leo kuna mchongo wa bongo!",
        usage: ".mchongo",
        execute: async () => {
           const deals = [
                    // NyumbaChap na makazi (20 kama zilivyokuwa)
                    "🏠 Nyumba mpya za kisasa ziko kwa bei za kipekee NyumbaChap – usikose ofa hii!",
                    "🔥 Punguzo la hadi 30% kwa nyumba zote za mtaa wa Kinondoni – pata info sasa!",
                    "💼 Huduma ya ushauri wa kupata mkopo wa nyumba sasa ipo bure kwa watumiaji wa NyumbaChap!",
                    "📅 Pangisha nyumba kwa urahisi na hakikisha unapata mteja haraka zaidi NyumbaChap.",
                    "🌟 Tazama nyumba za kipekee za baharini kwa bei za kushangaza – NyumbaChap inakuwezesha!",
                    "🔑 Nyumba za kulala, biashara, na viwanja vimepungua bei kwa wiki hii pekee!",
                    "📞 Piga simu sasa kwa usaidizi wa bure wa kupata nyumba unayotaka kupitia NyumbaChap!",
                    "🛠️ Huduma za ukarabati wa nyumba kwa bei nafuu kupitia watoa huduma waliothibitishwa NyumbaChap.",
                    "🏢 Nyumba za ofisi zenye muundo wa kisasa zinapatikana kwa pingu za kipekee leo!",
                    "🎉 Mpango wa kipekee wa kukupa zawadi ya furniture unapoamua kununua nyumba kupitia NyumbaChap!",
                    "📲 Pakua app ya NyumbaChap sasa na upate arifa za nyumba mpya zinazoingia sokoni.",
                    "💰 Mpango wa malipo ya awali kidogo zaidi kwa nyumba za kukodi – maelezo zaidi NyumbaChap.",
                    "🏡 Viwanja vya kipekee mikoani kwa bei rahisi – fursa ya kupoteza haitakuja tena!",
                    "🔍 Huduma ya kutafuta nyumba kulingana na bajeti yako na mahitaji yako sasa ipo NyumbaChap!",
                    "📈 Jifunze mikakati ya kuwekeza mali isiyohamishika kupitia makala za NyumbaChap blog!",
                    "🛋️ Zawadi maalumu za vifaa vya nyumbani kwa wateja wa kwanza wa nyumba za kisasa NyumbaChap.",
                    "🌍 NyumbaChap inakuletea nyumba na viwanja vya maeneo yenye usalama wa hali ya juu!",
                    "🚀 Upungufu wa bei kwa muda mfupi tu – nyumbani unayotaka kwa bei usiyowahi kuona!",
                    "📝 Huduma za usajili wa nyumba na hati za ardhi sasa zinapatikana kupitia NyumbaChap.",
                    "📢 Fursa ya kipekee ya kulipia nyumba kidogo kidogo kupitia NyumbaChap, usikose!",
                    "💸 Wanaosajili nyumba kwenye NyumbaChap hulipwa kupitia idadi ya viewers – pata kipato kwa urahisi!",

                    // Ajira Tanzania (30 mpya)
                    "📢 Ajira mpya Tanzania: Fursa ya kazi za IT kwa waombaji wenye ujuzi wa programu.",
                    "🎯 Mwajiri mwaminifu anatafuta wasaidizi wa biashara mtaa wa Kariakoo – omba leo!",
                    "🛠️ Ajira kwa mafundi wa umeme Dar es Salaam – mafunzo yanatolewa kwa wahitimu.",
                    "🏫 Walimu wa Kiingereza wanahitajika kwenye shule za msingi Dodoma – omba sasa!",
                    "🚚 Nafasi za madereva wa mabasi na Daladala mikoani – mshahara mzuri na malipo ya haraka.",
                    "💼 Ofisi kubwa jijini Mwanza inatafuta maofisa wa masoko – usikose nafasi hii!",
                    "🌾 Fursa ya kazi za kilimo cha kisasa kwa vijana vijijini – jifunze na upate mshahara.",
                    "🔧 Nafasi za mafundi wa magari katika warsha maarufu Arusha – ajira ya kudumu.",
                    "🏢 Kampuni ya ujenzi mtaa wa Sinza inatafuta mafundi wa bati na mafundi wa serami.",
                    "🧑‍💻 Ajira za wataalamu wa SEO na uuzaji mtandaoni – kazi za nyumbani pia zinapatikana.",
                    "🛒 Nafasi kwa wafanyakazi wa maduka makubwa jijini Dodoma – mshahara wa kuvutia.",
                    "🎨 Mafunzo na ajira kwa wasanii wa uchoraji wa matangazo ya ndani na nje ya nchi.",
                    "🏨 Hoteli maarufu jijini Dar es Salaam inatafuta wasaidizi wa huduma za wageni.",
                    "📊 Nafasi za wachambuzi wa data kwa kampuni za biashara Tanzania – uzoefu unahitajika.",
                    "🖥️ Programu mpya ya mafunzo na ajira kwa wahandisi wa kompyuta – jiunge sasa.",
                    "💼 Kazi za usimamizi wa miradi kwa kampuni kubwa za miji mikubwa Tanzania.",
                    "📚 Nafasi kwa wahitimu wa chuo kikuu kwa kazi za utafiti na maendeleo ya jamii.",
                    "🚜 Fursa za kazi kwa wamiliki wa mashine za kilimo – panga na upate ajira.",
                    "💡 Nafasi kwa wabunifu wa bidhaa mpya na wajasiriamali – mikutano ya bure ya kila wiki.",
                    "📞 Kazi za utawala na ofisi kwa watu wenye ujuzi wa kompyuta za msingi.",
                    "🛠️ Ajira kwa mafundi wa vifaa vya umeme na vifaa vya viwandani mikoa yote.",
                    "🌐 Nafasi za kazi za lugha za kigeni kwa watumiaji wa Kiingereza na Kifaransa.",
                    "🏭 Fursa za kazi kwenye viwanda vya chakula mikoani – mshahara wa kipekee.",
                    "🚨 Nafasi kwa wafanyakazi wa usalama na walinzi wa miji mikubwa Tanzania.",
                    "🛍️ Ajira kwa wafanyakazi wa huduma kwa wateja katika maduka makubwa jijini Tanzania.",
                    "🎤 Nafasi kwa wasanii wa muziki wa Bongo na waandishi wa nyimbo – majaribio yanapigwa.",
                    "📦 Kazi za upakiaji na usafirishaji kwa kampuni za biashara Tanzania.",
                    "🏥 Nafasi za wafanyakazi wa afya mikoani – nafasi kwa wataalamu na wafanyakazi wa msaada.",
                    "🎓 Mafunzo na ajira kwa vijana wa maeneo ya vijijini – programu ya serikali.",
                    "🖥️ Ajira za wataalamu wa IT na wataalamu wa usalama wa mtandao Tanzania."
                    ];


            return `🤑 *MCHONGO WA BONGO*\n\n${helpers.randomChoice(deals)}`;
        }
    },                                       
                             sanaa: {
    description: "Usanii mtupu!",
    usage: ".sanaa",
    execute: async () => {
        const lines = [
            "🎨 Kila hatua yako ni kama brush kwenye turubai – unachora maisha yako kwa ustadi!",
            "🎭 Usanii wako ni wa kipekee – hakuna wa kukufikia!",
            "📸 Kila picha yako ni masterpiece – umejaa ubunifu wa ajabu!",
            "🎬 Ukiwa jukwaani, kila mtu anakusikiliza kwa makini – kipaji safi!",
            "🎶 Sauti yako ni kama ala ya muziki – inaingia mioyoni mwa watu moja kwa moja!"
        ];
        return helpers.randomChoice(lines);
    }
},

mtandao: {
    description: "Leo tunaongelea nani mtandaoni?",
    usage: ".mtandao",
    execute: async () => {
        const lines = [
            "🌐 Leo kuna moto mtandaoni – nani anatrend?",
            "📲 Group gani lina gumzo kali leo?",
            "🔥 Timeline imeshika moto – twende tukasome maoni!",
            "🧠 Kichwa cha habari cha leo kimewavuruga watu mtandaoni!",
            "💬 Leo kuna vibes za ajabu kwenye mtandao – usibaki nyuma!"
        ];
        return helpers.randomChoice(lines);
    }
},

shusha: {
    description: "Shusha maneno ya maana hapa...",
    usage: ".shusha",
    execute: async () => {
        const lines = [
            "📢 Shusha ukweli bila kuogopa – watu wanahitaji kusikia!",
            "🧠 Hebu tuletee hekima yako – tunakutegemea!",
            "📖 Maneno yako yana uzito – shusha kisomi!",
            "💭 Mawazo yako ni hazina – tusikilize!",
            "🗣️ Leo ni siku ya kusema usichokisema kila siku – shusha!"
        ];
        return helpers.randomChoice(lines);
    }
},

upako: {
    description: "Leo una upako wa mafanikio 💫",
    usage: ".upako",
    execute: async () => {
        const lines = [
            "🕊️ Upako umejaa juu yako – kila unachogusa kinabarikiwa!",
            "🔥 Mafanikio yanakuandama kama kivuli – upako umechachamaa!",
            "💫 Leo una nuru isiyoelezeka – weka imani mbele!",
            "🙏 Ukitembea, milango inafunguka – baraka zimejaa!",
            "🌟 Hakuna kinachoweza kukuzuia – upako umefunguliwa!"
        ];
        return helpers.randomChoice(lines);
    }
},

fullMzuka: {
    description: "Full mzuka 🔥🔥🔥",
    usage: ".fullMzuka",
    execute: async () => {
        const lines = [
            "⚡ Leo mzuka uko juu kama umeme wa mvua ya masika!",
            "🔥 Vibe zako leo zinawaka – hakuna wa kukupinga!",
            "🎧 Mziki unacheza ndani ya roho – unakimbiza!",
            "💃 Mzuka huu hautulii – ni kama unajirusha na nyota!",
            "🕺 Full mzuka mpaka ceiling – hatari leo!"
        ];
        return helpers.randomChoice(lines);
    }
},

twisti: {
    description: "Twisti ya leo ni kali!",
    usage: ".twisti",
    execute: async () => {
        const lines = [
            "🌀 Twisti mpya imeingia – usiikose!",
            "🎲 Maisha ni mchezo, twisti ya leo imegeuza meza!",
            "😲 Umesikia? Twisti ya leo inashangaza hata wazoefu!",
            "📺 Kama vile telenovela – kila siku twisti mpya!",
            "🔁 Usikose mabadiliko ya leo – twisti za ajabu zinakuja!"
        ];
        return helpers.randomChoice(lines);
    }
},

zenji: {
    description: "Zenji vibes 🏝️",
    usage: ".zenji",
    execute: async () => {
        const lines = [
            "🌴 Zenji leo ni paradiso – upepo mwanana unavuma!",
            "🏖️ Chini ya miembe, maisha ni matamu Zenji!",
            "🌊 Bahari inakuimbia nyimbo za amani – Zenji vibes only!",
            "🐚 Leo twende Forodhani – Zenji inaita!",
            "☀️ Jua la Zenji linaangaza hadi ndani ya roho!"
        ];
        return helpers.randomChoice(lines);
    }
},

safisha: {
    description: "Safisha jina lako leo!",
    usage: ".safisha",
    execute: async () => {
        const lines = [
            "🧼 Leo ni siku ya kujiosha kutoka kwenye drama zote!",
            "🛁 Safisha jina lako – achana na watu wa maneno mengi!",
            "🧽 Hakuna kinachoweza kulichafua jina lako – wewe ni safi!",
            "🌟 Jina lako linaangaza kama mwezi – safisha na endelea kung'aa!",
            "🚿 Kuwa fresh kama mtu aliyeosha roho na moyo!"
        ];
        return helpers.randomChoice(lines);
    }
},

kipaji: {
    description: "Kipaji chako kinaweza badilisha dunia!",
    usage: ".kipaji",
    execute: async () => {
        const lines = [
            "🎤 Kipaji chako ni zawadi kwa dunia – usikifiche!",
            "💡 Wazo lako linaweza kubadilisha kizazi – endelea kulikuza!",
            "🖌️ Unachofanya kwa mikono yako ni kama uchawi – kipaji halisi!",
            "🎓 Dunia inahitaji kile unacho – kipaji chako ni nuru!",
            "🚀 Ukiamua kutumia kipaji chako vizuri, hakuna kitakachokusimamisha!"
        ];
        return helpers.randomChoice(lines);
    }
},

        husbandMaterial: {
    description: "Uko 90% husband material 🧥😂",
    usage: ".husbandMaterial",
    execute: async () => {
        const lines = [
            "🧥 Unaonekana kama vile umetengenezwa kwa maombi ya mama – full package ya husband material!",
            "🍲 Unaweza pika ugali usiungue – hiyo ni sifa ya mume wa ndoto!",
            "🧹 Unajua kufagia bila kulalamika – si ajabu watu wanakuita Mr. Perfect!",
            "💬 Mawasiliano yako ni kama ya counselor – kila mtu anataka ushauri wako!",
            "💰 Unajua kupanga bajeti hadi sabuni haishi mwezi mzima!",
            "🧠 Akili zako zinajua kuamua mambo – hata wakati wa presha!",
            "😂 Una jokes laini za kulainisha nyoyo – kama hauna chakula, angalau una kicheko!",
            "💪 Umejaa roho ya kujituma – unatafuta hata fursa zisizoonekana!",
            "🤝 Heshima yako kwa wanawake ni ya mfano – unasifiwa hadi na mashoga wa mtaa!",
            "👔 Unaonekana smart hata ukiwa na t-shirt ya kampeni ya 2015!",
            "👨‍🍳 Unajua kufurahia chakula cha bibi na si kulalamika kila siku pilau!",
            "🛠️ Unaweza kurekebisha socket bila kuzima umeme – una kipaji cha hatari!",
            "📚 Unasoma vitabu vya mahusiano kwa hiari – nani kama wewe?",
            "🚗 Ukipanga safari unawaza familia kwanza – siyo vibes na vipepeo!",
            "❤️ Umejaa mapenzi ya kweli – unajua kusikiliza, siyo tu kuzungumza!"
        ];
        return helpers.randomChoice(lines);
    }
},
          bossLady: {
    description: "Boss lady mode activated 👠",
    usage: ".bossLady",
    execute: async () => {
        const lines = [
            "👠 Ukiingia ofisini, watu wananyamaza – boss lady yupo kazini!",
            "💼 Unaweka mikutano mezani na unatoa maamuzi bila wasiwasi!",
            "👑 Style yako ni combination ya elegance na power – unawakilisha hadi mbali!",
            "🧠 Una akili ya biashara, hisia za binadamu, na moyo wa simba!",
            "📊 Unajua Excel kuliko supervisor wako – wafanyakazi wanakutegemea!",
            "💋 Unaongea kwa utulivu lakini maneno yako yana uzito wa dhahabu!",
            "👜 Bag yako ina siri nyingi – notebook, laptop, sanitizer, dreams!",
            "💪 Hauogopi changamoto – unazigeuza kuwa fursa!",
            "🎯 Malengo yako ni makali kama sindano ya daktari – na hayakosei!",
            "👩‍💼 Una command ya hali ya juu – kila mtu anataka kuwa chini ya uongozi wako!",
            "🔥 Unavaa heels lakini unakimbiza biashara kama umezaliwa kwenye Wall Street!",
            "💬 Ukiingia kwenye mazungumzo, unabadilisha flow hadi watu wakusikilize!",
            "🌟 Huna muda wa drama – kila sekunde ni hatua kuelekea mafanikio!",
            "📈 Umeamka saa 5 asubuhi na umemaliza kazi kabla wengi hawajafungua macho!",
            "💸 Wallet yako haitegemei mtu – boss lady hategemei ‘sponsa’!"
        ];
        return helpers.randomChoice(lines);
    }
},
swag: {
    description: "Swag overload 🔥😎",
    usage: ".swag",
    execute: async () => {
        const lines = [
            "😎 Swag yako inamfanya hata kivuli chako kiangalie nyuma!",
            "🕶️ Ukivaa shades, hata jua linajificha kwa aibu!",
            "👟 Kiatu chako kina step ya msanii – kila unapotembea, vumbi linaogopa kugusa!",
            "🧢 Style yako haijawahi kuharibika – kila siku ni kama fashion show!",
            "🔥 Outfit zako zinaendana hadi na mood ya anga – ulizaliwa na radar ya swag!",
            "🧼 Unakaa safi hadi watu wanauliza unatumia sabuni ya aina gani!",
            "📸 Picha zako haziitaji filter – already HD ya moyoni!",
            "💨 Harufu ya perfume yako inaandikwa kwenye upepo!",
            "🧍 Ukiwa kimya, watu wanadhani unajibu maswali ya Vogue!",
            "🎤 Unapoingia club, DJ anabadilisha beat bila kuambiwa!",
            "🪞 Kioo hakikuchoki – kila siku kinatabasamu tu kikikuona!",
            "🎩 Swag yako ni combination ya classic na futuristic – ni kama unatembea na time machine!",
            "🧊 Ubaridi wako una kiwango – unaweza kuzima moto kwa kuangalia tu!",
            "📲 Status zako WhatsApp ni kama majarida ya mitindo – kila mtu anakopi!",
            "🧍‍♂️ Swag yako ni somo – kila mtu anajifunza bila hata kutamka!"
        ];
        return helpers.randomChoice(lines);
    }
},
kicheko: {
    description: "Cheka hadi upasuke!",
    usage: ".kicheko",
    execute: async () => {
        const lines = [
            "😂 Kicheko chako kinaweza kuponya huzuni ya mwezi mzima!",
            "🤣 Ukicheka, hata viti vinacheka – ni vibration ya furaha!",
            "😹 Cheko lako lina mguso wa therapy – mtu anaweza poteza stress zote!",
            "😆 Unaweza kufanya hata jiwe lichangamke kwa kicheko chako!",
            "😄 Kicheko chako ni kama sunshine – kinachangamsha hata siku ya mvua!",
            "😛 Watu wakikusikiliza, wanajikuta wanauma mashavu kwa kucheka sana!",
            "😬 Wakati wengine wanaleta stress, wewe unaondoa stress kwa kicheko!",
            "😁 Kama ungekodishwa kwa ajili ya kicheko, ungekuwa bilionea!",
            "🤣 Unachekesha hadi mtu analia – kicheko chako kina nguvu ya sinema!",
            "😂 Ukiwa kwenye group chat, emoji za kicheko zinaisha!",
            "😹 Kicheko chako ni mashairi ya furaha – kinagusa hadi mioyo ya wabishi!",
            "😂 Ukiingia kwao kimya, ndani ya dakika mbili wote wanakimbia chooni kwa kucheka!",
            "😆 Hata ukizungumza kuhusu ugali, watu wanacheka – you got the vibe!",
            "🤣 Unaweza chekesha mtu akiwa na presha – dawa ya moyo asilia!",
            "😄 Cheka, dunia ichangamke – watu wakuige upya!"
        ];
        return helpers.randomChoice(lines);
    }
},
kituMoto: {
    description: "Kitu moto! 🔥",
    usage: ".kituMoto",
    execute: async () => {
        const lines = [
            "🔥 Umeamka leo kama kitu moto – dunia iache ijaribu kushindana!",
            "🌶️ Energy yako inawaka – mtu akikugusa anaweza pata degree ya kwanza!",
            "💥 Kitu moto si maneno tu – ni wewe ukiwa kwenye level ya juu!",
            "🔥 Unatoa moshi wa mafanikio – usiogope kuchoma madeni ya jana!",
            "🌋 Leo kila unachofanya kinaendana na moto wako wa ndani!",
            "🔥 Kitu moto siyo chakula – ni vile unavyopendeza leo!",
            "🚀 Unapaa bila wings – watu wanashangaa hiyo ni nguvu gani?",
            "🌞 Jua likikuona linauliza, 'Leo nani anang'aa zaidi yangu?'",
            "💄 Makeup yako inawaka kama fire emojis kwenye comment section!",
            "🔥 Ukiingia mtaa watu wanazima redio – wanakusikiliza wewe tu!",
            "🔥 Moto wako ni wakiroho, kimwili na kihisia – watu hawajui wakukabilie vipi!",
            "💥 Kitu moto hakifichwi – kinaonekana hata kwenye hewa unayovuta!",
            "🔥 Unang'aa kama welding – kila mtu anakodolea macho!",
            "🌟 Leo hautaji intro – mwonekano wako ni taarifa kamili!",
            "🔥 Umejipanga na umewaka – hakuna wa kuzima!"
        ];
        return helpers.randomChoice(lines);
    }
},
story: {
    description: "Niambie story yako ya jana usiku...",
    usage: ".story",
    execute: async () => {
        const lines = [
            "🌙 Jana usiku kulikuwa na vibe flani ya ajabu – sasa usituache gizani, cheka tufe!",
            "📖 Story ya jana usiku ina suspense kuliko tamthilia za Netflix – twende kazi!",
            "😲 Usituambie ulilala mapema – tunajua kuna group chat ililipuka!",
            "👀 Kuna mtu alienda ghost halafu akarudi na emoji ya 🙃 – weka wazi!",
            "😹 Kama story ina involve crush, tafadhali weka popcorn tayari!",
            "💬 Ulivyokuwa online saa 2:37am tulijua kuna gumzo linatokota!",
            "😂 Uliwahi kuwahi kudisconnect WiFi ili usitoe maelezo? Hatujakusahau!",
            "🎤 Story ya jana usiku ni ngumu – lakini sisi ndio mashahidi wa DM zako!",
            "🎭 Kulikuwa na drama ya kweli – sasa tuambie nani alilazwa?",
            "🎧 Music gani ulikuwa unasikiliza ukiandika status ya 'I’m done'?",
            "💣 Usisahau kutaja nani aliblock nani – hii ndo tunapenda!",
            "📸 Kuna screenshot moja ulikuwa nayo – twende nayo tafadhali!",
            "👣 Ulitoka saa ngapi? Na ulikutana na nani? Usikate viungo vya story!",
            "🔮 Hii story inaonekana itageuka kuwa series – part 1 tunaisubiri!",
            "🤣 Usiache kutuambia punchline ya mwisho – tutakulipia bundles ukikwama!"
        ];
        return helpers.randomChoice(lines);
    }
},
kibongo: {
    description: "Style ya kibongo tu!",
    usage: ".kibongo",
    execute: async () => {
        const lines = [
            "🇹🇿 Style ya kibongo ni unique – hakuna anayeweza kuiga kiholela!",
            "🎤 Tunatembea na beat ya Singeli, moyo wa Hip Hop na miguu ya Bongo Flava!",
            "🦁 Vibe za kibongo ni kama mchanganyiko wa mnada, baraza, na Instagram Live!",
            "🎶 Ukivaa kitenge na sneakers, hiyo ni level ya juu kabisa ya fashion ya kibongo!",
            "🍛 Mapishi yetu ni culture – wali maharage, mishkaki, na kachumbari ya moto!",
            "🛵 Bodaboda ni Uber yetu, na tunaifahamu kuliko Google Maps!",
            "📱 WhatsApp group za kibongo zina maamuzi kuliko Bunge!",
            "😎 Kila kona kuna stori – kuanzia kinyozi hadi kwa mama Ntilie!",
            "💃 Harusi za kibongo zina show kuliko red carpet ya Oscars!",
            "📻 Tunaongea slang, tunacheza na lugha hadi dictionary ipotee ramani!",
            "🎯 Style ya kibongo ni kujua ku-survive kwa ubunifu na ujanja!",
            "📸 Selfie zetu zina filter ya maisha – hata bila app!",
            "🛍️ Tunachanganya Gucci na soko la Kariakoo – fashion rules hazituhusu!",
            "🔥 Kibongo ni full creativity – hakuna boredom, kila siku ni bongo movie mpya!",
            "📣 Ukitaka kupendwa kibongo, jua kuteka nyoyo kwa vibes, si tu maneno!"
        ];
        return helpers.randomChoice(lines);
    }
},
kikiMeter: {
    description: "Kiki yako iko asilimia ngapi?",
    usage: ".kikiMeter",
    execute: async () => {
        const lines = [
            "📊 Kiki yako iko juu hadi watu wanaweka status 'Some people though…' bila kukutaja!",
            "🔥 Ukipost tu picha ya chai, watu wanakimbilia comment – that's 90% kiki!",
            "📸 Ukijipiga selfie ya kawaida, likes zinafika 300 kwa saa moja – usituzingue!",
            "👀 Kuna mtu kila siku anaongelea jina lako bila kukuita – hiyo ni kiki ya kimya kimya!",
            "💣 Kiki yako inaibua midomo ya watu waliokaa kimya kwa miaka mitatu!",
            "🎤 Watu wanakutaja kwenye spaces, bila kuku-tag – hiyo ni 85% kiki ya kutokewa!",
            "🧼 Kiki yako inafanya watu waliosema 'umepotea' wakuulizie ghafla!",
            "👑 Una trend hata bila kuwa online – watu wanakutengenezea headlines wenyewe!",
            "🚨 Ukitembea tu mtaani na hoodie, mtu anakupiga picha kisiri – kiki ya kutisha!",
            "📱 Umejibu comment moja tu, lakini screenshot yako iko kila group!",
            "🕵️ Kuna watu wanacheki profile yako kila siku lakini hawalik – hiyo ni kiki ya kiroho!",
            "🎬 Kiki yako ni kama movie – kila siku chapter mpya, hata bila premiere!",
            "🗣️ Watu wanakukosoa ili tu wakuongele – that’s influence, not hata kiki tena!",
            "🫣 Una unfollow mtu na inakuwa breaking news kwao – hiyo ni 97% kiki!",
            "😅 Usipojibu DM, mtu anapost quote za heartbreak – hiyo ni 100% certified kiki!"
        ];
        return helpers.randomChoice(lines);
    }
},
mapenzi: {
    description: "Mapenzi yamenichosha 😢",
    usage: ".mapenzi",
    execute: async () => {
                const lines = [
        "💔 Mapenzi hayaeleweki – leo unacheka, kesho unaangalia ceiling saa 9 usiku!",
        "😢 Unampenda kwa dhati, yeye anapenda mtu anaemjibu 'K' tu!",
        "📵 Ukimtext hajibu, lakini anaactive kwenye TikTok – mapenzi yanachosha!",
        "🛏️ Ulisema hutamlilia tena, lakini leo umelala na earphones zikiimba Zuchu!",
        "🧠 Kichwa chako kimejaa screenshots – umekuwa mhariri wa moyo wako!",
        "🥹 Mapenzi ni kama loan ya haraka – unapata haraka lakini refund inauma!",
        "💬 Unamwambia 'I miss you' anasema 'Aww' – ni kama kudunda ukuta kwa upole!",
        "🌧️ Mapenzi yanakufanya hata mvua ionekane kama wimbo wa huzuni!",
        "😩 Ukiwa naye mnapiga selfie, lakini moyo wake uko kwingine – full illusion!",
        "😭 Mapenzi ni giza – huoni mbele hadi ugonge feelings zako mwenyewe!",
        "🧃 Moyo umejaa na juice ya expectations – lakini container ni ya disappointment!",
        "🛑 Umejaribu kuachana mara 6, lakini bado unaandika jina lake kwenye search!",
        "📚 Mapenzi yamekufundisha somo ambalo halipo kwenye syllabus ya maisha!",
        "👻 Kuna watu ni sweet wanapokutaka, wakikupata wanakuweka pending!",
        "😶‍🌫️ Mapenzi yanaweza kukufanya uvae sweta kwenye joto – akili inakataa signal!",
        "🥀 Moyo umeharibika kidogo, lakini bado unapenda kama hapana kesho!",
        "🔥 Mpenzi anapenda drama zaidi ya romance – maisha yanageuka tamasha!",
        "🕵️‍♂️ Unachunguza story za simu, lakini hauna uhakika ni kweli au fake!",
        "🎭 Mapenzi ni kama theatre – mara wewe ni lead, mara ni backup!",
        "⚡ Vibe ya mapenzi ni kali, lakini mara nyingine ni kama power outage!",
        "😞 Unapenda mtu aliyepata siri zako, lakini anashindwa kukuheshimu!",
        "🌪️ Hisia zinatokea kwa kasi, ukijaribu kuzizima, zinaibuka zaidi!",
        "💤 Wakati mwingine unalala usingizi mzito ili usikutane na mawazo haya!",
        "🌹 Mapenzi ni maua yenye maumivu, unavuna hisia lakini kuna nyuki pia!",
        "💔 Kila sms ni lottery – hujui utakuta ‘I love you’ au ‘Sikupendi’!",
        "🌙 Usiku unapiga story kwenye akili zako, usingependa kufika asubuhi!",
        "🚦 Mapenzi yanapenda traffic light – mara nyekundu, mara kijani, mara njano!",
        "😥 Moyo unavunjika kwa taratibu lakini maumivu yanavuma kama radi!",
        "🖤 Unampenda mtu aliye na ‘ex’ na bado hawajamaliza drama zao!",
        "🤡 Unajifanya kuwa sawa, lakini ndani unalia kwa siri kila usiku!",
        "🌻 Kuna mtu anakuangalia kwa macho ya maana, lakini moyo hauuoni!",
        "🥺 Unapenda mtu aliyepotea kwa sababu ya story zisizoeleweka!",
        "💣 Mapenzi yanaweza kuwa bomu la hisia – ikipuka, kila kitu kinashuka!",
        "📉 Maumivu ya mapenzi yanafanya kila kitu kushuka chini – mood, dreams, hope!",
        "🌊 Unajaribu kuogelea katika bahari ya hisia, lakini mawimbi ni makubwa!",
        "😬 Unaumia sana lakini unajifanya huna shida mbele ya wenzako!",
        "💌 Unatuma msg nyingi, lakini majibu ni kama mawe – yanakugonga moyo!",
        "🎢 Hisia za mapenzi ni rollercoaster – leo juu, kesho chini, hakuna staha!",
        "🕰️ Unaangalia saa kila dakika – unategemea jibu ambalo haliji!",
        "🌵 Mapenzi yanapokwisha, unahisi umeachwa katika jangwani peke yako!",
        "🥀 Unaangalia picha za zamani, ukijaribu kupata sababu ya kuendelea!",
        "🛑 Unajaribu kuacha kuumizwa, lakini nyota zinaendelea kupiga kelele!",
        "🌙 Usiku unalia kwa siri – macho yanaumia lakini moyo hauwezi kuonyesha!",
        "💔 Kuishi na mtu usiyemjua kabisa – hiyo ni story ya mapenzi ya mitaani!",
        "😴 Unazima simu ili usipate ujumbe, lakini moyo unataka kusikia sauti yake!",
        "🥀 Kila mara unajaribu kupita, lakini kumbukumbu zinauma kama moto!",
        "⚡ Mapenzi ni nguvu za ajabu – zinapokuja, zinakushika kwa ushawishi!",
        "🌈 Unamuona mtu mwingine, lakini bado moyo wako uko nyuma kwa mpenzi wa zamani!",
        "💭 Unatamani kulala usingizi usiomshuhudia, lakini ndoto zinaendelea kumtaja!",
        "😞 Wakati mwingine unajikuta ukicheka huku moyo ukiangalia nyuma kwa majonzi!",
        "🌪️ Mapenzi yanapokuja kama upepo wa dhoruba – unajikuta haujui uko wapi!",
        "💔 Moyo wako ni sehemu ya sinema – leo ina furaha, kesho ina huzuni!",
        "🎭 Unacheza role tofauti kila siku ili kuonyesha kuwa uko sawa, lakini ndani ni tofauti!",
        "🕊️ Unapenda kwa upole lakini umepata majibu ya moto – hiyo ni maisha!",
        "💤 Unajikuta unalala saa za usiku ukijiuliza kwanini mambo hayakufanyi kazi!",
        "🔥 Moyo unawaka kama moto, lakini hakuna mtu anayeweza kuuzima!",
        "🧩 Mapenzi ni puzzle ngumu – unajaribu kuweka vipande lakini hakuna muafaka!",
        "😢 Unamkumbuka mpenzi wa zamani wakati watu wanacheka karibu nawe!",
        "🥀 Hali ya mapenzi ni kama maua yaliyokomaa na kuanguka – bado kuna uzuri!",
        "🌊 Hali ya hisia za vijana ni kama mawimbi – yanabadilika kila wakati!",
        "🧠 Moyo una maswali mengi ambayo akili hawezi kujibu!",
        "🔥 Leo unacheka, kesho unalia – hiyo ni story ya maisha ya mapenzi!",
        "💔 Kuishi na huzuni huku ukiwa na matumaini – hiyo ni hatari ya mapenzi!"
        ];

        return helpers.randomChoice(lines);
    }
},
mchongoWikendi: {
    description: "Mchongo wa wikendi uko hapa!",
    usage: ".mchongoWikendi",
    execute: async () => {
        const lines = [
            "🎉 Wiki hii tunavuta hewa ya beach – mchongo upo Kigamboni, vibes zipo!",
            "🎬 Movie night + vitumbua + marafiki = plan kamili ya wikendi!",
            "🍖 Mchongo ni nyama choma maeneo ya Mbezi – wacha stress ziishe na pilipili!",
            "🎶 Kuna event ya underground music – wale wa mapigo yasiyojulikana, jitokezeni!",
            "🧘 Kama uko lowkey, mchongo ni Netflix + blanketi + juice ya ukwaju!",
            "🏀 Basketball mashindano pale Gymkhana – usikose kuwasha dopest sneakers zako!",
            "🎨 Kama wewe ni mbunifu, twende karakana ya sanaa – tuache creativity ichafue nguo!",
            "🍿 Weekend hii tuna sleepover ya classic movies – snacks zipo, tuletee vibes zako!",
            "🌅 Mchongo wa sunrise picnic upo Bahari Beach – lipia na uje mapema!",
            "🧑‍🍳 Tuko kitchen party ya kujifunza mapishi ya asili – wachana na maggie weekend hii!",
            "🎤 Open mic pale Mikocheni – kuja usome mistari au ucheke hadi ujilize!",
            "🚲 Weekend ride kuzunguka jiji – from Mwenge hadi Coco Beach, ni mwendo tu!",
            "🎧 DJ amejipanga kupiga throwbacks – weekend lazima itikisike!",
            "🧩 Kama unataka utulivu, kuna board game night – chess, Ludo, monopoly inachemka!",
            "📷 Tutaenda photoshoot porini – nature + fashion = content ya mwezi!"
        ];
        return helpers.randomChoice(lines);
    }
},
bifu: {
    description: "Kuna bifu gani linawaka?",
    usage: ".bifu",
    execute: async () => {
        const lines = [
            "🔥 Leo timeline imeshika moto – nani kam-post nani bila kum-tag?",
            "👀 Kuna mtu kaweka status ya 'najua unajijua' – lakini nani anajijua kweli?",
            "📸 Kuna story imepotea lakini screenshots bado zipo mtaani!",
            "🫣 Watu wameanza kutoa receipts – WhatsApp screenshots zinaumiza!",
            "💬 Bifu ni la kimya – lakini captions zinaongea kuliko press release!",
            "📛 Kuna mtu kachomoa group, wengine wanapiga maelezo kwenye inbox!",
            "👄 Bifu ni la Insta, lakini response iko Twitter – huku mtaani kila mtu analia na emoji!",
            "🎭 Watu wanajifanya hawaguswi, lakini status zinaandika vitabu vya feelings!",
            "🥷 Kuna mtu ka-unfollow mtu mkubwa – na watu wameanza uchunguzi wa FBI!",
            "🚨 Timeline iko na red alert – bifu linaaroma ya wivu na clout combined!",
            "📣 Watu wanasema si bifu, lakini kila upande una support system yake!",
            "😶 Mapenzi yamegeuka bifu – sasa hakuna picha ya pamoja kwenye highlights!",
            "📺 Kama kuna part 2 ya drama, basi episode ya leo imeshika!",
            "🧊 Kuna mtu kaleta baridi ghafla – hapo ndipo bifu limeanza kuchemka!",
            "🧨 Kuna mtu kajibu kwa emoji tu – lakini impact yake ni kama atomic bomb!"
        ];
        return helpers.randomChoice(lines);
    }
},
trend: {
    description: "Trend za leo zinasema hivi...",
    usage: ".trend",
    execute: async () => {
        const lines = [
            "📈 Trend ya leo ni watu kupost 'My peace is expensive' – nani kampa stress?",
            "🎧 Music mpya ya wiki imetikisa – mashairi yamebeba feelings zote za 2024!",
            "💅 Fashion trend ni kurudi kwa tie-dye na baggy jeans – 2000 vibes zimerudi!",
            "📱 Kwenye TikTok watu wanadance kama hawana mifupa – challenge mpya iko moto!",
            "📸 Insta ina trend ya black & white photos with deep quotes – poetic era?",
            "🚀 App mpya imeingia – watu wanajifanya ni tech experts already!",
            "🎤 Twitter imechafuka – watu wanachambua nyimbo hadi beat!",
            "🧑‍⚖️ Kuna challenge ya kuanika red flags zako – wengine wamepoteza followers!",
            "👀 Watu wanapost ‘I’m healing’ lakini DM zao ni za kivita!",
            "🛍️ Shopping haul za mitumba zimevamia YouTube – fashion is local now!",
            "🌍 TikTok ya Nigeria imeteka Afrika Mashariki – kila mtu anacopy accent!",
            "🎭 Meme mpya imetokea – watu wana-edit hadi video za wazazi!",
            "💸 Kuna trend ya kusema ‘nilipanda bila expectations’ – lakini walia blockani!",
            "📚 BookTok ya Bongo imepamba moto – watu wanasoma na kupost kama sinema!",
            "📦 Unboxing ya emotions – watu wanatoka toxic relationships na kuandika eulogy!"
        ];
        return helpers.randomChoice(lines);
    }
},
vibeCheck: {
    description: "Vibe check: ✅ ama ❌?",
    usage: ".vibeCheck",
    execute: async () => {
        const lines = [
            "🌀 Vibe yako leo iko aligned na universe – nothing can stop you!",
            "🚫 Kuna mtu anakuchekea lakini ndani ana X – vibe fake ziko radar!",
            "✅ Ukiongea tu, vibes zinainuka – watu wanavuta nguvu yako!",
            "🎯 Leo hujibu text lakini bado unakubalika – vibe iko kwa silence!",
            "🛸 Wewe ni vibe ya kipekee – alien energy in human skin!",
            "🎧 Music unayopiga imejibu hali ya moyo wako – 100% vibe connected!",
            "☕ Ukiingia tu ofisini, watu wanatulia – unaleta utulivu wa bahari!",
            "📴 Ukijificha wiki nzima, watu wanakumiss – hiyo ndiyo vibe ya kweli!",
            "🫶 Vibe yako ni therapy – ukikaa na mtu, huzuni inapotea!",
            "❌ Leo vibe haipo kabisa – hata WiFi inakataa kuconnect!",
            "⚡ Unapoamka tu, unaleta mood ya kujenga taifa!",
            "🎨 Vibe yako ina rangi ya matumaini – hata watu wa blue tick wanatulia!",
            "🔥 Ukiwa room moja na mtu mwenye stress, anaondoka akiwa na smile!",
            "💌 Leo unapea moyo watu kimya kimya – vibe ya upole yenye nguvu!",
            "💢 Kuna mtu vibe yake ni kama betri ya remote – hupigi mbali!"
        ];
        return helpers.randomChoice(lines);
    }
},
followBack: {
    description: "Follow back basi, usijifiche! 😅",
    usage: ".followBack",
    execute: async () => {
        const lines = [
            "👣 Ulinifuata tangu 2023 – na bado hunijafollow back? Tuwe na utu kidogo!",
            "📸 Nimelike picha zako 14 mfululizo – hata DM sikutuma – follow back basi!",
            "😅 Sina crush, sina time – nataka tu hiyo follow back ya heshima!",
            "📲 Upo active kila siku lakini hunioni? Follow back ni free!",
            "🥺 Hii ni follow back request ya mwisho kabla sijaanza kuku dream!",
            "👀 Najua unaniona kwenye stories – basi follow back na iwe official!",
            "🎯 Sina makosa – hata bio yangu ni safi – fanya kitu basi!",
            "💌 Kama ulikuwa hujui, nimekuwa nikikufuatilia kimya kimya – leo naomba rasmi!",
            "🌐 Hata UN wanataka amani – na sisi tusameheane, unifollow!",
            "💡 Follow back sio ndoa – ni upendo wa kidigitali!",
            "🔁 Tukishafollowiana, tutengeneze reels pamoja – na iwe show!",
            "📤 Usiwe mtu wa vibes tu – pia kuwa na reciprocation!",
            "🚀 Tukianza follow, tutapaa pamoja – inawezekana!",
            "💬 Naomba follow back kwa lugha ya kiswahili fasaha – fanya jambo!",
            "🔥 Mwingine akifollow back, hata hotuba ya Rais ina mute – wewe je?"
        ];
        return helpers.randomChoice(lines);
    }
},
maneno: {
    description: "Cheki maneno ya mitaani!",
    usage: ".maneno",
    execute: async () => {
        const lines = [
            "🗣️ Maneno ya mitaani yana nguvu kubwa kuliko kalamu za waandishi!",
            "🔥 Leo mitaa inasema ‘Kuwa mkweli ni kazi, usiogope kusema ukweli!’",
            "🎤 ‘Hapana bro, mambo ni mengi’ ni maneno ya leo kwenye corners!",
            "💬 ‘Usiseme kila unachojua, usikosee pia’ – hekima ya mtaa!",
            "📢 Leo kuna usemi mpya: ‘Mbio za mbio, nyuma ya nyuma kuna story!’",
            "📣 ‘Mtu wa maneno ni kama mtu wa fedha – achukue tahadhari!’",
            "🗯️ ‘Kila mtu ana kiki yake, usije ukakosa tuhuma!’",
            "🧠 ‘Ukipiga story, hakikisha una ushahidi, usiende kwa maneno!’",
            "💡 ‘Mtaa ni shule ya maisha, maneno hapa ni masomo!’",
            "🎭 ‘Maneno ya mitaani hayazuiwi, ni sehemu ya utamaduni wetu!’",
            "📢 ‘Mambo si rahisi, lakini maneno huweza kufanya tofauti!’",
            "💥 ‘Kila kona kuna maneno yanayovuma kama upepo wa msimu!’",
            "🧨 ‘Kuwa na maneno mazito, lakini pia fanya mambo mazito!’",
            "🎤 ‘Leo maneno ya mitaani yanatokea kwa kasi ya mtihani!’",
            "⚡ ‘Maneno ya leo ni kama risasi, yanachoma na kuacha athari!’"
        ];
        return helpers.randomChoice(lines);
    }
},
tanzia: {
    description: "RIP... lakini kwa joke 😂",
    usage: ".tanzia",
    execute: async () => {
        const lines = [
            "😂 RIP kwa mababu waliopotea kwenye ‘group chat’ ya wazee!",
            "🤣 Hii ni RIP ya mtu aliyekosa ‘WiFi’ kwa zaidi ya saa 24!",
            "😹 RIP kwa ile drone ya majirani – ilipata majeraha ya ‘crash’!",
            "😂 Mbona tuomba tuje kuangalia funeral ya ‘data bundles’ zetu!",
            "🤣 RIP kwa friend aliyepoteza charger siku ya mwisho ya mtihani!",
            "😆 Hii ni RIP ya ‘phone’ aliyepatwa na ‘battery drain’ kwa haraka!",
            "😂 RIP kwa story za ‘ex’ ambazo hazijatulia kabisa!",
            "🤣 Mtu alikufa kwa kucheka ‘meme’ kali – RIP vibes za mtaa!",
            "😹 RIP kwa amka kasema ‘Tafadhali nipe sugar’ na akaachwa!",
            "😂 RIP kwa vibes zenye kuonekana kwenye ‘status’ lakini zikipotea!",
            "🤣 RIP kwa mtu aliyepoteza ‘password’ ya Instagram – drama kali!",
            "😆 RIP kwa ile ‘video call’ iliyokatika ghafla – story haijaisha!",
            "😂 RIP kwa ‘headphones’ zilizopotea – hatujui walipo!",
            "🤣 RIP kwa ile ‘plan ya weekend’ iliyopotea kwa sababu ya mvua!",
            "😹 RIP kwa ‘haters’ waliokosa story ya hii joke – hamna forgiveness!"
        ];
        return helpers.randomChoice(lines);
    }
},
kiki: {
    description: "Mambo ya kiki, mtu au brand?",
    usage: ".kiki",
    execute: async () => {
        const lines = [
            "🕵️ Kiki ni kama moto usiozimika, leo watu wanachambua kila kitu!",
            "🔥 Kiki ya mtu au brand – lakini kila mtu anataka kujua zaidi!",
            "👀 Kuna mtu anashushwa na video, na leo kiki imefikia mtaa mzima!",
            "💬 ‘Usiache mtu akizungumza, kiki ni sehemu ya maisha!’",
            "📸 Kiki mpya imetokea – screenshot ziko tayari!",
            "🗣️ Kiki si za kupendeza, lakini ni maongezi yanayotufanya tuishi!",
            "😅 Kiki za mitandaoni zina nguvu zaidi kuliko vyombo vya habari!",
            "💣 Kuna ‘bifu’ ndani ya kiki hii, jua wote wana ‘team’ zao!",
            "🎤 Kiki inaweza kuleta wasiwasi lakini pia burudani isiyoisha!",
            "🧩 Kiki ni part ya mtaa – lakini usiache iburudishe!",
            "⚡ Kiki ni kama umeme, inapotokea watu wanashangaa!",
            "🕊️ Kiki nzuri ni ile inayoleta amani na sio ugomvi!",
            "📢 Kiki leo inahusu watu wenye style – je, uko kwenye list?",
            "💥 Kiki si za kugombea, bali za kufahamu ukweli!",
            "🌟 Kiki yako ina nguvu zaidi unaposhiriki kwa hekima!"
        ];
        return helpers.randomChoice(lines);
    }
},
uzushi: {
    description: "Uzushi wa mtaani leo ni huu...",
    usage: ".uzushi",
    execute: async () => {
        const lines = [
            "📰 Uzushi wa leo unaibua maajabu – watu wanavunja rekodi za mtaa!",
            "💬 Kuna uzushi wa ‘relationship drama’ zinazoendelea mtaani!",
            "👀 Uzushi mpya umeibuka kuhusu project ya siri ya mtalii!",
            "🔥 Uzushi wa watu waliopata promotion bila taarifa!",
            "🕵️ Uzushi wa mpango wa siri wa biashara unaendelea kuongezeka!",
            "⚡ Uzushi wa maneno ambayo hayajatangazwa rasmi – twende tunasikiliza!",
            "📢 Uzushi wa walimu wa shule za mitaani kuhusu mabadiliko ya ratiba!",
            "🧩 Uzushi unaoleta mshangao mkubwa kwa watu wa maeneo ya chini!",
            "💥 Uzushi wa mitandao unavuma zaidi kuliko habari za mtaani!",
            "📸 Uzushi wa picha zilizopostwa bila idhini umeshika kasi!",
            "🎭 Uzushi wa watu waliovunja maelewano kati ya marafiki!",
            "🧨 Uzushi wa matumizi ya fedha zisizoeleweka umekuwa maarufu!",
            "🔮 Uzushi unaoonyesha mabadiliko makubwa ya kijamii mtaani!",
            "📣 Uzushi wa watu waliopata mateso kutokana na uongozi mpya!",
            "🌟 Uzushi wa mabalozi wapya katika maeneo ya mtaa!"
        ];
        return helpers.randomChoice(lines);
    }
},
cheka: {
    description: "Ukipenda kucheka... tazama hii!",
    usage: ".cheka",
    execute: async () => {
        const lines = [
            "😂 Cheka hadi moyo wako ufurahie, maisha ni safari ya kicheko!",
            "🤣 Kicheko chako ni chanzo cha furaha kwa kila mtu unayemjua!",
            "😆 Cheka bila kuogopa maoni ya wengine – furaha yako ni muhimu!",
            "😹 Kicheko kinaongeza uzito wa urafiki na kuondoa huzuni!",
            "😄 Ukiwa na tabasamu, dunia inaonekana nzuri zaidi!",
            "😁 Cheka na wenzako, hata jua linacheka pamoja nawe!",
            "🤣 Usiruhusu shida zikufanye kutocheka – kicheko ni dawa!",
            "😂 Cheka hata kama maisha ni magumu – usikubali huzuni ikushinde!",
            "😛 Kicheko kinaweza kuleta upendo na marafiki wapya!",
            "😆 Cheka na roho yako, sio kwa sababu ya watu!",
            "😂 Kicheko ni silaha ya nguvu katika maisha ya kila siku!",
            "🤣 Usisahau kucheka hata wakati wa magumu!",
            "😄 Kicheko kinahamasisha watu kuwa na mtazamo chanya!",
            "😁 Cheka, dunia iwe mahali pa furaha zaidi!",
            "😹 Kicheko kinaweza kuponya majeraha ya moyo!"
        ];
        return helpers.randomChoice(lines);
    }
},
naniMkali: {
    description: "Nani mkali zaidi? Diamond vs Harmonize?",
    usage: ".naniMkali",
    execute: async () => {
                  const lines = [
            "🎤 Diamond Platnumz ni shujaa wa Bongo, alianzisha nyimbo za kimataifa, legacy yake haiko na mwisho.",
            "🔥 Harmonize ni mvuto wa mtaa, alikua na msimamo thabiti wa Bongo Flava mpya na flow kali ya kisasa.",
            "🎶 Rayvanny ana sauti ya kipekee, anajulikana kwa hits zinazoleta furaha na story zenye maana.",
            "👑 Ali Kiba ni mfalme wa romantic tunes, amekuwa ikoni ya muziki wa mapenzi Tanzania.",
            "🎧 Vanessa Mdee ni diva wa muziki wa Kiswahili, anapiga fusion ya R&B na Afrobeat kwa mtindo wa kipekee.",
            "💥 Nandy anafanya kazi kwa bidii sana, na ana midundo inayokufanya utake kucheza bila kukoma.",
            "🎤 Mbosso ni msanii wa hisia kali, sauti yake inagusa mioyo ya wengi, hasa kwa nyimbo za mapenzi.",
            "🔥 Zuchu ni msichana wa nguvu, ana ushawishi mkubwa wa muziki wa kizazi kipya Tanzania.",
            "🎶 Diamond alizindua hits nyingi zinazotamba kimataifa kama 'Jeje' na 'Waah'.",
            "👑 Harmonize amekuwa nguzo kubwa ya wasanii wapya, akiwa mentor kwa wingi wa vijana.",
            "🎧 Rayvanny anapenda kuleta mchanganyiko wa styles tofauti, akifanya kila wimbo uwe wa kipekee.",
            "💥 Ali Kiba ana mashabiki wengi duniani, na nyimbo zake zimevuma hata nje ya Afrika.",
            "🎤 Vanessa Mdee ameshinda tuzo nyingi za kimataifa, na ni mmoja wa mastaa wa Afrika Mashariki.",
            "🔥 Nandy ni msanii mwenye mvuto mkubwa kwenye soko la muziki wa kike, na anamiliki staili ya kipekee.",
            "🎶 Mbosso amejijengea jina kwa hits za mapenzi na midundo ya kizazi kipya.",
            "👑 Zuchu ni msanii wa kike wa kasi sana, kwa sasa ni mmoja wa walioko mstari wa mbele Tanzania.",
            "🎧 Diamond ana uwezo wa kuimba kwa lugha mbalimbali na kuunganisha muziki wa kienyeji na wa kimataifa.",
            "💥 Harmonize ni msanii wa kuonyesha utofauti wa mtindo wake na wengine, na anajivunia asili yake.",
            "🎤 Rayvanny ni msanii wa kuleta burudani na nyimbo zinazowashirikisha watu kila wakati.",
            "🔥 Ali Kiba anapenda kufanya kazi na wasanii wa kimataifa na kuleta mtindo wa fusion mpya.",
            "🎶 Vanessa Mdee ana mtindo wa kipekee wa kuimba, akichanganya muziki wa Kiswahili na R&B.",
            "👑 Nandy anajulikana kwa kuleta ujumbe mzito kupitia nyimbo zake za mapenzi na maisha.",
            "🎧 Mbosso ni mwimbaji ambaye ana uwezo wa kuleta hisia kali katika kila wimbo anapouimba.",
            "💥 Zuchu anavutia vijana kwa sauti yake safi na mashairi mazuri yanayogusa moyo.",
            "🎤 Diamond ni mwekezaji mkubwa wa muziki Tanzania, akisaidia kukuza wasanii wengine.",
            "🔥 Harmonize ni msanii wa nguvu, mwenye uwezo wa kufanya nyimbo kali za dance na mapenzi.",
            "🎶 Rayvanny anapenda kuwashirikisha mashabiki wake kupitia live na mitandao ya kijamii.",
            "👑 Ali Kiba ni 'King of love songs' Tanzania, na anashikilia rekodi za mauzo ya nyimbo.",
            "🎧 Vanessa Mdee ana sifa za kuleta mvuto mkubwa kwenye tamasha kubwa Afrika Mashariki.",
            "💥 Nandy anajivunia kuwa na sauti ya kipekee inayowafanya watu waelewe ujumbe wake.",
            "🎤 Mbosso ni msanii wa kuleta vibes nzuri za mtaa na kike, anapendwa sana kwa sauti yake.",
            "🔥 Zuchu ni mfano mzuri wa msanii wa kizazi kipya mwenye mafanikio makubwa ndani ya miaka michache.",
            "🎶 Diamond amekuwa msanii wa kuleta mabadiliko ya muziki wa Bongo Flava kwa miaka mingi.",
            "👑 Harmonize anajulikana kwa nyimbo kama 'Uno' na 'Narudi', zinazoendelea kutamba.",
            "🎧 Rayvanny ni msanii wa kuwa na mvuto wa kimataifa, akijaribu kufanikisha safari yake ya dunia.",
            "💥 Ali Kiba anapenda kuimba kwa mtindo wa kisasa na kuunganisha miziki ya Kiafrika.",
            "🎤 Vanessa Mdee amewahi kushirikiana na mastaa wa dunia kama Patoranking na Rema.",
            "🔥 Nandy ni msanii aliyepata umaarufu mkubwa kupitia nyimbo kama 'Ninogeshe'.",
            "🎶 Mbosso ana ushawishi mkubwa kwenye muziki wa kike na wa mtaa, akivutia mashabiki wengi.",
            "👑 Zuchu ana midundo ya Afrobeat na taarab ambayo imefanikiwa kutia moyo soko la muziki.",
            "🎧 Diamond ni msanii ambaye huleta burudani na nyimbo za hisia kwa kiwango cha juu.",
            "💥 Harmonize ni mmoja wa wasanii walioko mstari wa mbele wa Bongo Flava ya sasa.",
            "🎤 Rayvanny anapenda kuleta vibes za mtaa na kuunda nyimbo zenye mashairi mazito.",
            "🔥 Ali Kiba ni msanii ambaye amepata tuzo nyingi za kimataifa, akiunganisha mtindo wa Afrika.",
            "🎶 Vanessa Mdee ni mmoja wa wanawake wenye sauti nzuri na mtindo wa kipekee.",
            "👑 Nandy ni msanii wa kuonyesha nguvu kupitia nyimbo zake za kipekee na ubunifu.",
            "🎧 Mbosso ana ushawishi mkubwa kwenye mitandao na nyimbo zake hutazamwa kwa wingi.",
            "💥 Zuchu ni msanii aliyeibuka haraka na kuleta sauti mpya kwenye soko la muziki wa Tanzania.",
            "🎤 Diamond amekuwa msanii wa kuleta umaarufu wa kimataifa kwa Bongo Flava.",
            "🔥 Harmonize ana mtindo wa kuleta nyimbo za kuigwa na mvuto wa wasanii wa kizazi kipya.",
            "🎶 Rayvanny ni mmoja wa wasanii waliopata mafanikio makubwa kwa miaka michache.",
            "👑 Ali Kiba ni msanii aliyejijengea sifa kubwa kwenye muziki wa mapenzi Afrika.",
            "🎧 Vanessa Mdee anajulikana kwa kuleta umoja kupitia muziki na mitandao ya kijamii.",
            "💥 Nandy anaendelea kuimarisha nafasi yake kama mmoja wa wasanii wakike wa Tanzania.",
            "🎤 Mbosso anajivunia kuwa na mashabiki wapenzi wa muziki wa kipekee na mchanganyiko.",
            "🔥 Zuchu anaonekana kama moja ya nyota wa muziki wa kizazi kipya barani Afrika."
            ];

        return helpers.randomChoice(lines);
    }
},
uswazi: {
    description: "Vibe ya uswahilini leo ni 🔥",
    usage: ".uswazi",
    execute: async () => {
        const lines = [
            "🔥 Uswazi ni mahali ambapo vibe ni halisi na watu wana joto!",
            "🎉 Leo kuna party kubwa Uswahilini, kila mtu ana dance moves za kipekee!",
            "🌴 Uswazi ni rasilimali ya utamaduni wa Bongo – tamu na ya kuvutia!",
            "🎶 Leo beat za Uswazi zinaingia kwenye mdundo wa moyo wako!",
            "👟 Sneakers na styles za uswahili zimeshika mtaa, vibe ni kali!",
            "🍢 Chakula cha mitaani kinapikwa kwa upendo – na hii ni Uswazi!",
            "🗣️ Maneno ya mitaani yanapita mdomoni kwa kasi – usipite bila kusikia!",
            "🔥 Kila kona kuna msisimko wa Uswazi, kutoka Mikocheni hadi Temeke!",
            "📢 Leo Uswazi unatoa inspiration kwa wasanii wapya wa Bongo!",
            "🎤 Kuna mchongo mkubwa wa Uswazi – watu wanakusudia kuwa stars!",
            "🌟 Vibe ya Uswazi ni tofauti – ni kama moto usiozimika usiku!",
            "🎵 Uswahili beat zina nguvu – zinakusukuma uanze kucheza mara moja!",
            "💃 Uswazi ni mahali pa kuungana, kucheza na kuungumza kwa furaha!",
            "🕺 Hapa vibe ni halisi, hakuna fake – tuweke Uswazi kwenye ramani!",
            "🌍 Uswazi ni moyo wa Bongo – na kila mtu anahitaji kidogo ya hii vibe!"
        ];
        return helpers.randomChoice(lines);
    }
},
twende: {
    description: "Twendeee na wewe!",
    usage: ".twende",
    execute: async () => {
        const lines = [
            "🚀 Twende safarini pamoja, tukionyesha uzuri wa Tanzania!",
            "🎉 Twende kwa party ya mtaa, msisimko usiokoma!",
            "🌄 Twende safari ya morning hike, kupumua hewa safi!",
            "🛥️ Twende baharini, kuogelea na mawingu ya bluu!",
            "🏞️ Twende porini, kuona wanyama wa porini kwa macho yetu!",
            "🚴 Twende kwa bike ride kuzunguka mtaa, tuendelee active!",
            "🌅 Twende kwenye picnic ya jua la machweo – vibes za hali ya juu!",
            "🎶 Twende kusikiliza muziki mzuri – kama ni live concert au DJ set!",
            "🍢 Twende tukala street food, na kuonja ladha za mtaa!",
            "🎤 Twende kwenye open mic, tushiriki talent zetu!",
            "🛤️ Twende kwa train safari, kuona mandhari tofauti!",
            "🏕️ Twende kwenye campfire, kushirikiana hadithi za usiku!",
            "🌌 Twende kutazama nyota na kuota ndoto kubwa!",
            "🏄 Twende kujaribu michezo ya maji – adrenaline inahitaji!",
            "🎈 Twende tukafurahie maisha – hakuna stress, tu vibe!"
        ];
        return helpers.randomChoice(lines);
    }
},
kiburi: {
    description: "Kiburi level gani leo?",
    usage: ".kiburi",
    execute: async () => {
        const lines = [
            "👑 Kiburi ni kama taji la mtu mwenye mafanikio – lakini ukizidi, inakupiga nyuma!",
            "🔥 Leo kiburi chako kinawaka moto – lakini hakikisha haupatii maadui nguvu!",
            "🦚 Watu wenye kiburi wanapenda kuonyesha mafanikio yao kila wakati!",
            "⚡ Kiburi kinaweza kukupeleka juu, lakini pia chini haraka!",
            "🎭 Usikubali kiburi kibadili tabia zako – kuwa na heshima daima!",
            "💥 Wakati mwingine kiburi ni silaha ya kujilinda dhidi ya maumivu!",
            "🧠 Kiburi chenye busara kinasaidia kujenga imani binafsi!",
            "🛑 Lakini kiburi kisicho na mipaka kinaweza kuharibika uhusiano!",
            "👊 Jua wakati wa kuonyesha kiburi na wakati wa kuwa na unyenyekevu!",
            "🔥 Leo una vibe ya mtu asiye na kiburi – hiyo ni nguvu ya kweli!",
            "🌟 Watu wanakushangaa kwa sababu unajua kuficha kiburi kwa heshima!",
            "🤫 Kiburi kinapotumika kwa busara, watu wanakufuata kwa hofu na heshima!",
            "💫 Usiruhusu kiburi chakuumize, badala yake kitumie kukuinua!",
            "🦅 Kiburi chenye akili kinakupa maono makubwa ya maisha!",
            "🎯 Leo ni siku ya kukusanya nguvu na kudhibiti kiburi chako!"
        ];
        return helpers.randomChoice(lines);
    }
},






};



module.exports = funCommands;
