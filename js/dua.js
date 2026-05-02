// ============================================================
// dua.js – Common Daily Duas (Essential Collection)
// ============================================================

const commonDuas = [
    // ---------- Morning & Evening ----------
    { ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ", translit: "Aṣbaḥnā wa aṣbaḥal-mulku lillāhi wal-ḥamdu lillāh", translation: "We have entered the morning and the entire kingdom belongs to Allah; all praise is for Allah.", source: "hadith", ref: "Muslim", category: "morning-evening" },
    { ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", translit: "Allāhumma bika aṣbaḥnā wa bika amsaynā wa bika naḥyā wa bika namūtu wa ilaykan-nushūr", translation: "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.", source: "hadith", ref: "Tirmidhī", category: "morning-evening" },
    { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", translit: "Allāhumma innī as'alukal-ʿafwa wal-ʿāfiyata fid-dunyā wal-ākhirah", translation: "O Allah, I ask You for pardon and well-being in this world and the Hereafter.", source: "hadith", ref: "Ibn Mājah", category: "morning-evening" },
    { ar: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا", translit: "Raḍītu billāhi rabbā wa bil-islāmi dīnā wa bi-muḥammadin nabiyyā", translation: "I am content with Allah as my Lord, with Islam as my religion, and with Muhammad as my Prophet.", source: "hadith", ref: "Abū Dāwūd", category: "morning-evening" },

    // ---------- Daily Activities ----------
    { ar: "بِسْمِ اللَّهِ", translit: "Bismillāh", translation: "In the name of Allah (before eating).", source: "hadith", ref: "Bukhārī", category: "daily" },
    { ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ", translit: "Alḥamdulillāhi alladhī aṭʿamanī hādhā wa razaqanīhi min ghayri ḥawlin minnī wa lā quwwah", translation: "Praise be to Allah who fed me this and provided it without any power or strength from myself.", source: "hadith", ref: "Abū Dāwūd", category: "daily" },
    { ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", translit: "Bismika Allāhumma amūtu wa aḥyā", translation: "In Your name, O Allah, I die and live (before sleep).", source: "hadith", ref: "Bukhārī", category: "daily" },
    { ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", translit: "Alḥamdulillāhi alladhī aḥyānā baʿda mā amātanā wa ilayhin-nushūr", translation: "Praise be to Allah who gave us life after death, and to Him is the resurrection (upon waking).", source: "hadith", ref: "Bukhārī", category: "daily" },
    { ar: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", translit: "Bismillāhi tawakkaltu ʿalallāhi lā ḥawla wa lā quwwata illā billāh", translation: "In the name of Allah, I put my trust in Allah; there is no power nor strength except with Allah (leaving home).", source: "hadith", ref: "Abū Dāwūd", category: "daily" },
    { ar: "بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا", translit: "Bismillāhi walajnā wa bismillāhi kharajnā wa ʿalallāhi rabbinā tawakkalnā", translation: "In the name of Allah we enter, and in His name we leave; upon our Lord we rely (entering home).", source: "hadith", ref: "Abū Dāwūd", category: "daily" },
    { ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", translit: "Allāhumma iftaḥ lī abwāba raḥmatik", translation: "O Allah, open for me the doors of Your mercy (entering mosque).", source: "hadith", ref: "Muslim", category: "daily" },
    { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", translit: "Allāhumma innī as'aluka min faḍlik", translation: "O Allah, I ask You of Your bounty (leaving mosque).", source: "hadith", ref: "Muslim", category: "daily" },
    { ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ", translit: "Allāhumma innī aʿūdhu bika minal-khubthi wal-khabā’ith", translation: "O Allah, I seek refuge in You from male and female devils (entering bathroom).", source: "hadith", ref: "Bukhārī", category: "daily" },
    { ar: "غُفْرَانَكَ", translit: "Ghufrānaka", translation: "I seek Your forgiveness (leaving bathroom).", source: "hadith", ref: "Abū Dāwūd", category: "daily" },

    // ---------- Protection & Refuge ----------
    { ar: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", translit: "Aʿūdhu bikalimātillāhit-tāmmāti min sharri mā khalaq", translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.", source: "hadith", ref: "Muslim", category: "protection" },
    { ar: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", translit: "Bismillāhi alladhī lā yaḍurru maʿa smihi shay'un fil-arḍi wa lā fis-samā'i wa huwas-samīʿul-ʿalīm", translation: "In the name of Allah, with whose name nothing in the earth or heaven can cause harm, and He is the All-Hearing, the All-Knowing.", source: "hadith", ref: "Abū Dāwūd", category: "protection" },
    { ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ", translit: "Allāhumma innī aʿūdhu bika minal-hammi wal-ḥazan", translation: "O Allah, I seek refuge in You from anxiety and grief.", source: "hadith", ref: "Bukhārī", category: "hardship" },
    { ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْفَقْرِ وَالْكُفْرِ وَعَذَابِ الْقَبْرِ", translit: "Allāhumma innī aʿūdhu bika minal-faqri wal-kufri wa ʿadhābil-qabr", translation: "O Allah, I seek refuge in You from poverty, disbelief, and the punishment of the grave.", source: "hadith", ref: "Nasā'ī", category: "protection" },

    // ---------- Travel & Riding ----------
    { ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ", translit: "Subḥāna alladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn", translation: "Glory be to the One who subjected this to us, for we could not have done it by ourselves.", source: "quran", ref: "43:13", category: "travel" },
    { ar: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى", translit: "Allāhumma innā nas'aluka fī safarinā hādhā al-birra wat-taqwā", translation: "O Allah, we ask You for righteousness and piety on this journey.", source: "hadith", ref: "Muslim", category: "travel" },

    // ---------- Parents, Children, Spouse ----------
    { ar: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا", translit: "Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā", translation: "My Lord, have mercy on them as they raised me when I was small.", source: "quran", ref: "17:24", category: "family" },
    { ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ", translit: "Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata aʿyun", translation: "Our Lord, grant us from our spouses and offspring comfort to our eyes.", source: "quran", ref: "25:74", category: "family" },
    { ar: "اللَّهُمَّ بَارِكْ لِي فِي أَهْلِي وَبَارِكْ لَهُمْ فِيَّ", translit: "Allāhumma bārik lī fī ahlī wa bārik lahum fiyya", translation: "O Allah, bless me in my family and bless them in me.", source: "personal", ref: "Recommended", category: "family" },

    // ---------- Knowledge & Success ----------
    { ar: "رَبِّ زِدْنِي عِلْمًا", translit: "Rabbi zidnī ʿilmā", translation: "My Lord, increase me in knowledge.", source: "quran", ref: "20:114", category: "studies" },
    { ar: "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا", translit: "Allāhumma lā sahla illā mā jaʿaltahu sahlā, wa anta tajʿalul-ḥazna idhā shi'ta sahlā", translation: "O Allah, nothing is easy except what You make easy, and You make the difficult easy if You will.", source: "hadith", ref: "Ibn Ḥibbān", category: "studies" },

    // ---------- Forgiveness & Repentance ----------
    { ar: "أَسْتَغْفِرُ اللَّهَ رَبِّي مِنْ كُلِّ ذَنْبٍ وَأَتُوبُ إِلَيْهِ", translit: "Astaghfirullāha rabbī min kulli dhanbin wa atūbu ilayh", translation: "I seek forgiveness from Allah, my Lord, for every sin and I repent to Him.", source: "hadith", ref: "Common", category: "forgiveness" },
    { ar: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ", translit: "Rabbanā ghfir lī wa liwālidayya wa lil-mu'minīna yawma yaqūmul-ḥisāb", translation: "Our Lord, forgive me, my parents, and the believers on the Day when the account will be established.", source: "quran", ref: "14:41", category: "forgiveness" },

    // ---------- Health & Visiting the Sick ----------
    { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", translit: "Allāhumma innī as'alukal-ʿāfiyata fid-dunyā wal-ākhirah", translation: "O Allah, I ask You for well-being in this world and the Hereafter.", source: "hadith", ref: "Abū Dāwūd", category: "health" },
    { ar: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ", translit: "As'alullāhal-ʿaẓīma rabbal-ʿarshil-ʿaẓīmi an yashfiyak", translation: "I ask Allah, the Mighty, the Lord of the Mighty Throne, to heal you.", source: "hadith", ref: "Tirmidhī", category: "health" },

    // ---------- General Comprehensive Duas ----------
    { ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", translit: "Allāhumma innī as'alukal-hudā wat-tuqā wal-ʿafāfa wal-ghinā", translation: "O Allah, I ask You for guidance, piety, chastity, and self‑sufficiency.", source: "hadith", ref: "Muslim", category: "general" },
    { ar: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ", translit: "Allāhumma innī ẓalamtu nafsī ẓulman kathīran wa lā yaghfirudh-dhunūba illā anta faghfir lī maghfiratan min ʿindika warḥamnī innaka antal-Ghafūrur-Raḥīm", translation: "O Allah, I have greatly wronged myself, and none forgives sins but You. So forgive me and have mercy on me, for You are the Oft-Forgiving, the Most Merciful.", source: "hadith", ref: "Bukhārī, Muslim", category: "general" }
];

// For use in browser:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = commonDuas;
}