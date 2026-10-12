// The LIT gospel flow. The same steps power the web page and, later, the
// street-evangelism presentation mode. Bemba translations go in `bem`
// (media team), and pages fall back to English until they are filled in.

export type GospelStep = {
  /** Short street-sign line shown on the chapter's Signboard. */
  sign: { text: string; ref: string };
  title: string;
  body: string;
  refs: string[];
  bem?: { title: string; body: string };
};

export const gospelSteps: GospelStep[] = [
  {
    sign: { text: "God so loved you", ref: "John 3:16" },
    title: "God loves you and made you for Himself",
    body: "You were created to know God and to be His dwelling place, a living temple filled with His presence.",
    refs: ["John 3:16", "1 Corinthians 6:19"],
  },
  {
    sign: { text: "All have sinned", ref: "Romans 3:23" },
    title: "Sin separated us from God",
    body: "Every one of us has fallen short. Sin brings guilt, shame and separation from the life God intended, and no amount of good works can wash it away.",
    refs: ["Romans 3:23", "Isaiah 59:2"],
  },
  {
    sign: { text: "White as snow", ref: "Isaiah 1:18" },
    title: "Jesus died for you",
    body: "Jesus, the Son of God, took our sin upon Himself on the cross. He paid the price we could not pay, so that our scarlet sins could be made white as snow.",
    refs: ["1 Corinthians 15:3", "Isaiah 1:18"],
  },
  {
    sign: { text: "He is risen", ref: "Matthew 28:6" },
    title: "Jesus rose again, and He is alive",
    body: "On the third day God raised Jesus from the dead. He defeated sin, death and every power of darkness. Because He lives, you can have new life.",
    refs: ["1 Corinthians 15:4", "Romans 10:9"],
  },
  {
    sign: { text: "You must be born again", ref: "John 3:3" },
    title: "Repent, believe and be born again",
    body: "Turn from sin and put your trust in Jesus as Lord. Unless one is born again, he cannot see the kingdom of God. Follow Him in water baptism.",
    refs: ["John 3:3", "Acts 2:38"],
  },
  {
    sign: { text: "Receive the Holy Spirit", ref: "Acts 2:38" },
    title: "Receive the Holy Spirit",
    body: "God promised to pour out His Spirit on all flesh. The gift of the Holy Spirit is for you, your children and all who believe: power to live a new life.",
    refs: ["Acts 2:17", "Acts 2:39", "Joel 2:28"],
  },
  {
    sign: { text: "All things are possible", ref: "Matthew 19:26" },
    title: "Live empowered for greater works",
    body: "Filled with the Spirit, you become His witness. Jesus promised that those who believe in Him would do the works He did, and greater works, because He went to the Father. With God all things are possible.",
    refs: ["John 14:12", "Acts 1:8", "Matthew 19:26"],
  },
];

export const salvationPrayer =
  "Lord Jesus, I come to You as I am. I believe You died for my sins and that God raised You from the dead. I turn from my sin and receive You as my Lord and Saviour. Wash me and make me new. Fill me with Your Holy Spirit, and make my life a living temple for Your glory. In Jesus' name, Amen.";
