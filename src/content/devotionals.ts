// "Come As You Are": the launch devotional series (4 weeks, 28 days).
// Anchor scriptures were chosen by LIT leadership: Isaiah 1:18, John 3:3,
// Matthew 18:13, Matthew 19:26.
//
// STATUS: drafts written to get the site started. Each day must be reviewed
// and approved by the Reverend / Elders, then `approved` set to true.
// Later these move into the Supabase `devotionals` table, edited by the media team.

export type Devotional = {
  day: number;
  week: number;
  title: string;
  scripture: string;
  /** Verse text is only quoted for the four anchor verses (NKJV, within the publisher's quotation allowance). */
  verseText?: string;
  reflection: string;
  prayer: string;
  declaration: string;
  action: string;
  approved: boolean;
};

export const series = {
  title: "Come As You Are",
  subtitle: "A 28-day journey into salvation, new birth and the power of God",
  weeks: [
    { week: 1, title: "Come As You Are", anchor: "Isaiah 1:18" },
    { week: 2, title: "You Must Be Born Again", anchor: "John 3:3" },
    { week: 3, title: "Heaven Rejoices Over You", anchor: "Matthew 18:13" },
    { week: 4, title: "With God All Things Are Possible", anchor: "Matthew 19:26" },
  ],
};

export const devotionals: Devotional[] = [
  // ── Week 1: Come As You Are ─────────────────────────────────────────────
  {
    day: 1, week: 1, title: "Come Now", scripture: "Isaiah 1:18",
    verseText:
      "“Come now, and let us reason together,” Says the LORD, “Though your sins are like scarlet, They shall be as white as snow; Though they are red like crimson, They shall be as wool.”",
    reflection:
      "God does not wait for you to clean yourself up before He calls you. He says, \"Come now\": not after you fix your life, not after you feel worthy, but now. Scarlet was the deepest stain of the ancient world, the dye that could not be washed out. Yet the Lord promises that what no soap can remove, His grace will make white as snow. Whatever you are carrying today, bring it to Him as you are.",
    prayer: "Lord, I come to You just as I am. Wash me and make me white as snow. Amen.",
    declaration: "I am not too far gone. God is calling me today, and I am coming.",
    action: "Write down one thing you have been ashamed to bring to God, and pray over it honestly.",
    approved: false,
  },
  {
    day: 2, week: 1, title: "Wash Me", scripture: "Psalm 51:7-10",
    reflection:
      "David wrote this psalm after his greatest failure. He did not hide or make excuses; he asked God to wash him and create a clean heart in him. Repentance is not God punishing you. It is God restoring you. A clean heart is not something we build; it is something God creates when we open up to Him.",
    prayer: "Create in me a clean heart, O God, and renew a right spirit within me. Amen.",
    declaration: "God is creating a clean heart in me. My past does not define my future.",
    action: "Read Psalm 51 slowly, out loud if you can.",
    approved: false,
  },
  {
    day: 3, week: 1, title: "Faithful to Forgive", scripture: "1 John 1:9",
    reflection:
      "Confession is simply agreeing with God about our sin. And the promise attached is wonderful: He is faithful and just to forgive and to cleanse us from all unrighteousness. Not some. All. Forgiveness rests on God's faithfulness, not on how well you feel you have repented.",
    prayer: "Father, I confess my sins to You. Thank You that You are faithful to forgive me and cleanse me completely. Amen.",
    declaration: "I am forgiven and cleansed by the faithfulness of God.",
    action: "Take five quiet minutes to confess anything on your heart, then thank God out loud for His forgiveness.",
    approved: false,
  },
  {
    day: 4, week: 1, title: "Freely by His Grace", scripture: "Romans 3:23-24",
    reflection:
      "Everyone has fallen short: the church-goer and the stranger, the pastor and the prisoner. That levels the ground. But the same passage says we are justified freely by His grace through the redemption in Christ Jesus. Grace means you cannot earn it and you cannot lose it by being unworthy. It is a gift.",
    prayer: "Jesus, thank You for grace I could never earn. I receive Your gift today. Amen.",
    declaration: "I am justified freely by His grace. I stand righteous because of Jesus.",
    action: "Share Romans 3:23-24 with one person on WhatsApp today.",
    approved: false,
  },
  {
    day: 5, week: 1, title: "By His Stripes", scripture: "Isaiah 53:5",
    reflection:
      "Seven hundred years before the cross, Isaiah saw it: He was wounded for our transgressions, and by His stripes we are healed. The cross dealt with everything sin brought: guilt, shame, sickness, brokenness. Jesus carried what you could not carry so that you could walk in peace and healing.",
    prayer: "Lord Jesus, thank You for the price You paid. I receive Your peace and healing in my body, mind and family. Amen.",
    declaration: "By His stripes I am healed. The punishment for my peace was upon Him.",
    action: "Pray for someone you know who is sick, and send them this verse.",
    approved: false,
  },
  {
    day: 6, week: 1, title: "Rest for the Weary", scripture: "Matthew 11:28-30",
    reflection:
      "Jesus' invitation is not to the strong but to the tired: \"Come to Me, all you who labor and are heavy laden.\" Many are tired of trying, tired of pretending, tired of carrying burdens alone. Jesus does not add weight to your life. He exchanges your heavy load for His easy yoke.",
    prayer: "Jesus, I am tired of carrying this alone. I give You my burden and receive Your rest. Amen.",
    declaration: "I do not carry my burdens alone. Jesus gives me rest.",
    action: "Name your heaviest burden today and hand it to Jesus in prayer.",
    approved: false,
  },
  {
    day: 7, week: 1, title: "He Is Knocking", scripture: "Revelation 3:20",
    reflection:
      "Jesus stands at the door and knocks. He does not break the door down; He waits for you to open. This week we have heard Him say, \"Come as you are.\" Today is a day of response. If you have never opened your life to Jesus, you can do it right now.",
    prayer: "Lord Jesus, I open the door of my heart. Come in, forgive me and be my Lord and Saviour. Amen.",
    declaration: "I have opened the door. Jesus lives in me.",
    action: "If you prayed to receive Jesus this week, tell us. We would love to walk with you.",
    approved: false,
  },

  // ── Week 2: You Must Be Born Again ──────────────────────────────────────
  {
    day: 8, week: 2, title: "Unless You Are Born Again", scripture: "John 3:3",
    verseText:
      "Jesus answered and said to him, “Most assuredly, I say to you, unless one is born again, he cannot see the kingdom of God.”",
    reflection:
      "Nicodemus was a respected religious teacher, yet Jesus told him he needed a new birth. Religion can improve behaviour, but only the Spirit of God can give new life. Being born again is not joining a church; it is receiving the very life of God inside you.",
    prayer: "Lord, I do not want religion without life. Give me a new birth by Your Spirit. Amen.",
    declaration: "I am born again. I have the life of God in me.",
    action: "Ask yourself honestly: have I been born again? Talk to someone at LIT if you are unsure.",
    approved: false,
  },
  {
    day: 9, week: 2, title: "Born of Water and the Spirit", scripture: "John 3:5-6",
    reflection:
      "Jesus explained that entering the kingdom requires being born of water and the Spirit. Flesh gives birth to flesh, but the Spirit gives birth to spirit. The new birth is a work of the Holy Spirit, not of human effort. God Himself makes you new from the inside out.",
    prayer: "Holy Spirit, do Your work in me. Make me new from the inside out. Amen.",
    declaration: "What is born of the Spirit is spirit. I am a new creation from within.",
    action: "If you have not been baptised in water, ask about our next baptism.",
    approved: false,
  },
  {
    day: 10, week: 2, title: "God So Loved", scripture: "John 3:16",
    reflection:
      "The most famous verse in the Bible sits in the same conversation about new birth. Behind the call to be born again is the love of a Father who gave His only Son. You are not being pressured into salvation; you are being invited into love. Whoever believes, and that includes you, will not perish but have everlasting life.",
    prayer: "Father, thank You for loving me so much that You gave Jesus. I believe. Amen.",
    declaration: "God loves me. I believe in Jesus, and I have everlasting life.",
    action: "Write John 3:16 with your own name in it and put it where you will see it daily.",
    approved: false,
  },
  {
    day: 11, week: 2, title: "A New Creation", scripture: "2 Corinthians 5:17",
    reflection:
      "If anyone is in Christ, he is a new creation; old things have passed away and all things have become new. The enemy will try to remind you of who you were. God reminds you of who you are. Your identity is no longer your failures but your new life in Christ.",
    prayer: "Lord, help me to see myself as You see me: new, clean and loved. Amen.",
    declaration: "Old things have passed away. I am a new creation in Christ.",
    action: "List three old habits or labels you are leaving behind, and thank God for the new.",
    approved: false,
  },
  {
    day: 12, week: 2, title: "Confess and Believe", scripture: "Romans 10:9-10",
    reflection:
      "Salvation is simple and powerful: confess with your mouth that Jesus is Lord and believe in your heart that God raised Him from the dead. The resurrection is the heart of our faith. Jesus did not stay in the grave. Because He lives, everyone who believes in Him receives His life.",
    prayer: "Jesus, I confess You as my Lord. I believe God raised You from the dead. Amen.",
    declaration: "Jesus is Lord! He is risen, and I am saved.",
    action: "Say this declaration out loud to someone today: \"Jesus is my Lord.\"",
    approved: false,
  },
  {
    day: 13, week: 2, title: "Repent, Be Baptised, Receive", scripture: "Acts 2:38-39",
    reflection:
      "On the day of Pentecost, Peter gave the people a clear path: repent, be baptised in the name of Jesus Christ, and receive the gift of the Holy Spirit. And the promise is for you, your children and all who are afar off. The Holy Spirit is not only for the apostles; He is for every believer today.",
    prayer: "Lord, I turn to You fully. I ask for the gift of the Holy Spirit. Fill me, in Jesus' name. Amen.",
    declaration: "The promise is for me and my household. I receive the Holy Spirit.",
    action: "Ask for prayer to be filled with the Holy Spirit this Sunday.",
    approved: false,
  },
  {
    day: 14, week: 2, title: "You Are a Living Temple", scripture: "1 Corinthians 6:19-20",
    reflection:
      "This is the heart of our name, Living Temples Church. Your body is a temple of the Holy Spirit who lives in you. God no longer dwells in buildings made with hands; He lives in people. You were bought at a price, so glorify God in your body. Your life is now a place where God's presence is seen.",
    prayer: "Holy Spirit, make my life a temple that honours You in all I do. Amen.",
    declaration: "I am a living temple of the Holy Spirit. God's presence lives in me.",
    action: "Choose one area (words, habits, time) to dedicate to God as His temple this week.",
    approved: false,
  },

  // ── Week 3: Heaven Rejoices Over You ────────────────────────────────────
  {
    day: 15, week: 3, title: "He Rejoices Over the One", scripture: "Matthew 18:12-13",
    verseText:
      "And if he should find it, assuredly, I say to you, he rejoices more over that sheep than over the ninety-nine that did not go astray.",
    reflection:
      "The shepherd leaves the ninety-nine to look for the one. Heaven's attention is on the lost. If you have wandered, know this: God is not angry that He has to search for you. He rejoices when He finds you. You are the one He came for.",
    prayer: "Good Shepherd, thank You for coming after me. I am found in You. Amen.",
    declaration: "I am the one the Shepherd came for, and He rejoices over me.",
    action: "Think of one person who has wandered from God. Pray for them by name today.",
    approved: false,
  },
  {
    day: 16, week: 3, title: "Joy in Heaven", scripture: "Luke 15:7",
    reflection:
      "There is joy in heaven over one sinner who repents. Every salvation is a celebration in heaven. That means the street outreaches, the WhatsApp messages and the invitations to church are not small things. When one person comes home, heaven celebrates.",
    prayer: "Father, give me Your heart for the lost, and let me bring joy to heaven. Amen.",
    declaration: "My life will bring joy to heaven as I lead others to Jesus.",
    action: "Invite one person to church this Sunday.",
    approved: false,
  },
  {
    day: 17, week: 3, title: "To Seek and to Save", scripture: "Luke 19:10",
    reflection:
      "Zacchaeus was despised by his town, but Jesus stopped under his tree and called him by name. The Son of Man came to seek and to save that which was lost. Jesus went to the people others avoided. He still does, and He sends us to do the same.",
    prayer: "Lord, open my eyes to the Zacchaeus in my community. Use me to call them by name. Amen.",
    declaration: "Jesus came to seek and save the lost, and I carry His mission.",
    action: "Greet someone you usually ignore, and show them kindness in Jesus' name.",
    approved: false,
  },
  {
    day: 18, week: 3, title: "The Good Shepherd", scripture: "John 10:11",
    reflection:
      "A hired hand runs when the wolf comes, but the Good Shepherd lays down His life for the sheep. Jesus did not just teach about love; He gave His life. You are safe with Him. He knows you by name, and no one can snatch you from His hand.",
    prayer: "Jesus, You are my Good Shepherd. I trust You to lead and protect me. Amen.",
    declaration: "The Good Shepherd laid down His life for me. I am safe in His hand.",
    action: "Read John 10:1-18 and note every promise the Shepherd makes.",
    approved: false,
  },
  {
    day: 19, week: 3, title: "I Shall Not Want", scripture: "Psalm 23:1-3",
    reflection:
      "When the Lord is your Shepherd, you lack nothing you truly need. He leads you to green pastures and still waters; He restores your soul. Whatever you face this week, in school, work, family or finances, the Shepherd who found you will also provide for you.",
    prayer: "Lord, You are my Shepherd. Restore my soul and lead me in Your paths. Amen.",
    declaration: "The Lord is my Shepherd; I shall not want.",
    action: "Memorise Psalm 23:1-3 this week.",
    approved: false,
  },
  {
    day: 20, week: 3, title: "The Father Ran", scripture: "Luke 15:20",
    reflection:
      "The prodigal son rehearsed a speech, but the father did not wait to hear it. He saw him from far off, had compassion, ran, embraced and kissed him. That is how God receives those who come home. Not with a lecture, but with a robe, a ring and a feast.",
    prayer: "Father, thank You for running to me. I receive Your embrace and my place as Your child. Amen.",
    declaration: "I am not a servant trying to earn my way. I am a son or daughter, welcomed home.",
    action: "If you know someone far from God, send them a simple message: \"God has not given up on you.\"",
    approved: false,
  },
  {
    day: 21, week: 3, title: "Go and Find the One", scripture: "Acts 1:8",
    reflection:
      "Jesus promised power when the Holy Spirit comes upon us, power to be His witnesses in our Jerusalem, Judea, Samaria and to the ends of the earth. For us that is Kitwe, the Copperbelt, Zambia and the nations. The Holy Spirit does not fill us only to bless us; He fills us to send us.",
    prayer: "Holy Spirit, fill me with power to be a witness in my city. Amen.",
    declaration: "I have received power. I am a witness for Jesus in Kitwe and beyond.",
    action: "Join the next LIT street outreach, or share the Know Jesus page with three people.",
    approved: false,
  },

  // ── Week 4: With God All Things Are Possible ────────────────────────────
  {
    day: 22, week: 4, title: "All Things Are Possible", scripture: "Matthew 19:26",
    verseText:
      "But Jesus looked at them and said to them, “With men this is impossible, but with God all things are possible.”",
    reflection:
      "The disciples asked, \"Who then can be saved?\" Jesus' answer covers far more than salvation: with God, all things are possible. Salvation itself is a miracle; a dead heart becoming alive is impossible for people but easy for God. The same God who saved you is able to do the impossible in your life.",
    prayer: "Lord, I bring You the impossible situations in my life. With You all things are possible. Amen.",
    declaration: "With God, all things are possible for me.",
    action: "Write down one 'impossible' thing you are trusting God for, and pray over it daily this week.",
    approved: false,
  },
  {
    day: 23, week: 4, title: "If You Can Believe", scripture: "Mark 9:23-24",
    reflection:
      "A desperate father asked Jesus, \"If You can do anything…\" Jesus turned it around: all things are possible to him who believes. The father's honest reply, \"Lord, I believe; help my unbelief!\", was enough. Faith does not need to be perfect; it needs to be pointed at Jesus.",
    prayer: "Lord, I believe; help my unbelief. Amen.",
    declaration: "All things are possible to me because I believe.",
    action: "Pray with someone else for a need in their life this week.",
    approved: false,
  },
  {
    day: 24, week: 4, title: "Exceedingly Abundantly", scripture: "Ephesians 3:20",
    reflection:
      "God is able to do exceedingly abundantly above all that we ask or think, according to the power that works in us. Notice where the power is: in us. The Holy Spirit within you is the same power that raised Christ from the dead. Your destiny is bigger than your current situation.",
    prayer: "Father, do more than I can ask or imagine, by Your power at work in me. Amen.",
    declaration: "The power of God is at work in me, beautifying my life and destiny.",
    action: "Dream with God: write what you believe He wants to do through your life.",
    approved: false,
  },
  {
    day: 25, week: 4, title: "Poured Out on All Flesh", scripture: "Acts 2:17",
    reflection:
      "On the day of Pentecost, Peter declared Joel's prophecy fulfilled: God is pouring out His Spirit on all flesh. Sons and daughters, young and old, all receive. The Holy Spirit is not reserved for a few special people. He is God's gift to every believer, to empower ordinary people for extraordinary things.",
    prayer: "Lord, pour out Your Spirit on me, my family and our church. Amen.",
    declaration: "God's Spirit is poured out on me. I will prophesy, dream and see visions for His glory.",
    action: "Spend ten minutes in worship and prayer, asking the Holy Spirit to fill you afresh.",
    approved: false,
  },
  {
    day: 26, week: 4, title: "Greater Works", scripture: "John 14:12",
    reflection:
      "Jesus made a startling promise: whoever believes in Him will do the works He did, and greater works than these, because He was going to the Father. Through the Holy Spirit, Jesus' ministry is multiplied through millions of believers everywhere. You are part of that greater work.",
    prayer: "Lord Jesus, as I believe in You, let Your works flow through my life by the Holy Spirit. Amen.",
    declaration: "I believe in Jesus, and His works will be seen through me.",
    action: "Ask God to use you to pray for or help someone in a practical way today.",
    approved: false,
  },
  {
    day: 27, week: 4, title: "Strength for Everything", scripture: "Philippians 4:13",
    reflection:
      "Paul wrote this from prison. He had learned to be content in plenty and in need, because his strength came from Christ. This is not a promise that life will be easy; it is a promise that you will never face anything without Christ's strength.",
    prayer: "Christ, be my strength today in every situation I face. Amen.",
    declaration: "I can do all things through Christ who strengthens me.",
    action: "Encourage someone going through a hard time with this verse.",
    approved: false,
  },
  {
    day: 28, week: 4, title: "Is Anything Too Hard?", scripture: "Jeremiah 32:27",
    reflection:
      "\"Behold, I am the LORD, the God of all flesh. Is there anything too hard for Me?\" Over these 28 days we have heard God say: come as you are, be born again, you are the one I rejoice over, and with Me all things are possible. Now step forward: get baptised, join a cell group, and become a living temple who carries His presence.",
    prayer: "Lord, nothing is too hard for You. I give You my whole life. Lead me in my next step. Amen.",
    declaration: "Nothing is too hard for my God. My life and destiny are in His hands.",
    action: "Take your next step: join a cell group, sign up for baptism, or serve on the outreach team.",
    approved: false,
  },
];

/** The series launch date (Africa/Lusaka). Day 1 falls on this date, then it cycles every 28 days. */
export const SERIES_START = process.env.DEVOTIONAL_START_DATE ?? "2026-10-12";

export function devotionalForDate(isoDate: string): Devotional {
  const start = Date.parse(`${SERIES_START}T00:00:00Z`);
  const today = Date.parse(`${isoDate}T00:00:00Z`);
  const diff = Math.max(0, Math.floor((today - start) / 86_400_000)); // before launch → Day 1
  const index = ((diff % devotionals.length) + devotionals.length) % devotionals.length;
  return devotionals[index];
}

export function getDevotional(day: number) {
  return devotionals.find((d) => d.day === day);
}
