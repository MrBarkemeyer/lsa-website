/**
 * Newest first. One folder per post in public/instagram/<id>/:
 * - cover.jpg — grid thumbnail
 * - 2.jpg, 3.jpg, ... — extra carousel slides, in order
 * - reel.mp4 — only for a reel
 *
 * {
 *   id: "welcome-back",
 *   handle: "lsaboard2030", // omit for @lowellhs
 *   date: "Oct 1, 2026",
 *   caption: "Full post text.",
 *   cover: "/instagram/welcome-back/cover.jpg",
 *   slides: ["/instagram/welcome-back/cover.jpg", "/instagram/welcome-back/2.jpg"],
 *   video: "/instagram/welcome-back/reel.mp4", // omit unless it is a reel
 * }
 *
 * Omit slides for a single photo. Omit video unless it is a reel.
 */
const posts = [
    {
        "id": "DetQJ6em1A9",
        "date": "Oct 20, 2026",
        "caption": "Freshmen, you showed up! 💚📣 Thank you, Class of 2030, for bringing THE ENERGY AND SPIRIT to Fall Rally and a huge shoutout to everyone who performed! 🔥\n\nThank you all for participating in cardinalympics! It was a close one, but we'll get 'em next time! 💪💚\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#LowellHS #LSA2030 #Lowell2030 #ClassOf2030 #LowellHighSchool #FallRally #LowellCardinals #FreshmanYear",
        "cover": "/instagram/DetQJ6em1A9/cover.jpg",
        "slides": [
            "/instagram/DetQJ6em1A9/cover.jpg",
            "/instagram/DetQJ6em1A9/2.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/DetQJ6em1A9/",
        "handle": "lsaboard2030"
    },
    {
        "id": "DeuxbvzEtPI",
        "date": "Oct 20, 2026",
        "caption": "Homecoming Recap 26-27: Fly Me to the Moon 🌙 \n\nphotography by Jordan Chin\n\n#graphicdesign #canva #studentcouncil #evangelion #graphics",
        "cover": "/instagram/DeuxbvzEtPI/cover.jpg",
        "slides": [
            "/instagram/DeuxbvzEtPI/cover.jpg",
            "/instagram/DeuxbvzEtPI/2.jpg",
            "/instagram/DeuxbvzEtPI/3.jpg",
            "/instagram/DeuxbvzEtPI/4.jpg",
            "/instagram/DeuxbvzEtPI/5.jpg",
            "/instagram/DeuxbvzEtPI/6.jpg",
            "/instagram/DeuxbvzEtPI/7.jpg",
            "/instagram/DeuxbvzEtPI/8.jpg",
            "/instagram/DeuxbvzEtPI/9.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DeuxbvzEtPI/"
    },
    {
        "id": "DerrGEiGrhc",
        "date": "Oct 19, 2026",
        "caption": "CLASS OF 2030!!! 🗳️\n\nIt’s time to vote! From TODAY 10/19 @ 10:20 AM during registry to 3:40 PM on Friday voting for the CLASS OF 2030 FRESHMAN BOARD will commence. \n\nWe highly encourage you all to place a vote! If you want to learn more about the candidates, check out the Lowell Student Association elections page.\n\nCheck google classroom for the voting form!\n\nHappy voting! 🍀\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#lowellhs #clasof2030 #lsa2030 #freshmanelections",
        "cover": "/instagram/DerrGEiGrhc/cover.jpg",
        "slides": [
            "/instagram/DerrGEiGrhc/cover.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/DerrGEiGrhc/",
        "handle": "lsaboard2030"
    },
    {
        "id": "DeieAWvmw44",
        "date": "Oct 15, 2026",
        "caption": "We’ve found a place… Dare to enter the Haunted House at Carol Channing Theater from 3:50-5:00 PM and hang out at our Spooktacular Carnival in the courtyard on October 30th! Test your skills with ring toss, basketball, axe throwing, and more—plus, tons of trick-or-treat candy! 👀\n\n#backrooms #a24 #horror #graphicdesign #canva",
        "cover": "/instagram/DeieAWvmw44/cover.jpg",
        "slides": [
            "/instagram/DeieAWvmw44/cover.jpg",
            "/instagram/DeieAWvmw44/2.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DeieAWvmw44/"
    },
    {
        "id": "DeQhXkllDwc",
        "date": "Oct 8, 2026",
        "caption": "📆 HEY CARDINALS!!!\n\nReminder that Friday (10/9) has a special RALLY SCHEDULE 📚⏰\n\nDON’T FORGET TO WEAR YOUR CLASS COLORS FOR A CHANCE TO WIN MERCH 😆💚💜💙❤️📣📣",
        "cover": "/instagram/DeQhXkllDwc/cover.jpg",
        "slides": [
            "/instagram/DeQhXkllDwc/cover.jpg",
            "/instagram/DeQhXkllDwc/2.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DeQhXkllDwc/"
    },
    {
        "id": "DeLRd-YFCyj",
        "date": "Oct 6, 2026",
        "caption": "Thank you to everyone who attended 2026 Fall Late Night and helped decorate our hallway! We hope you all had an amazing time! 🍯🌈💚\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#lsaboard2030 #latenight #recap #wizardofoz",
        "cover": "/instagram/DeLRd-YFCyj/cover.jpg",
        "slides": [
            "/instagram/DeLRd-YFCyj/cover.jpg",
            "/instagram/DeLRd-YFCyj/2.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/DeLRd-YFCyj/",
        "handle": "lsaboard2030"
    },
    {
        "id": "DeGhmhMFOH2",
        "date": "Oct 5, 2026",
        "caption": "Join the school-wide Bead Game during Cardinalympics! Students will start with one bead and play ro-sham-bo (rock-paper-scissors) against other participants to collect more beads and earn Cardinalympics points for their grade.\n\nParticipation is optional, but highly encouraged. The game will run from Monday, October 5 through Thursday, October 8. All beads must be returned on Thursday to be counted toward your grade’s final total. Good luck!\n\n#canva #graphics #oliviarodrigo #oliviarodrigoedit #design",
        "cover": "/instagram/DeGhmhMFOH2/cover.jpg",
        "slides": [
            "/instagram/DeGhmhMFOH2/cover.jpg",
            "/instagram/DeGhmhMFOH2/2.jpg",
            "/instagram/DeGhmhMFOH2/3.jpg",
            "/instagram/DeGhmhMFOH2/4.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DeGhmhMFOH2/"
    },
    {
        "id": "Dd6CA1Gm_dk",
        "date": "Sep 30, 2026",
        "caption": "‼️ CARDINALYMPICS IS HERE!! ‼️\n\nFrom Monday, 10/05 to Thursday, 10/08, YOU are invited to compete in\nCardinalympics! Participate in games to earn points for your grade to win the ultimate prize: the Cardinal Cup!\n\n1st place: 300 points\n2nd place: 200 points\n3rd place: 100 points\n\nEvery point counts, so show up and compete to help your grade win the cup! Scan the QR codes to sign up!\n\nNO AI USED IN THE PROCESS OF MAKING\n\n#graphicdesign #canva #studentcouncil #persona #persona5fanart",
        "cover": "/instagram/Dd6CA1Gm_dk/cover.jpg",
        "slides": [
            "/instagram/Dd6CA1Gm_dk/cover.jpg",
            "/instagram/Dd6CA1Gm_dk/2.jpg",
            "/instagram/Dd6CA1Gm_dk/3.jpg",
            "/instagram/Dd6CA1Gm_dk/4.jpg",
            "/instagram/Dd6CA1Gm_dk/5.jpg",
            "/instagram/Dd6CA1Gm_dk/6.jpg",
            "/instagram/Dd6CA1Gm_dk/7.jpg",
            "/instagram/Dd6CA1Gm_dk/8.jpg",
            "/instagram/Dd6CA1Gm_dk/9.jpg",
            "/instagram/Dd6CA1Gm_dk/10.jpg",
            "/instagram/Dd6CA1Gm_dk/11.jpg",
            "/instagram/Dd6CA1Gm_dk/12.jpg",
            "/instagram/Dd6CA1Gm_dk/13.jpg",
            "/instagram/Dd6CA1Gm_dk/14.jpg",
            "/instagram/Dd6CA1Gm_dk/15.jpg",
            "/instagram/Dd6CA1Gm_dk/16.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/Dd6CA1Gm_dk/"
    },
    {
        "id": "Ddt5IOomlz4",
        "date": "Sep 25, 2026",
        "caption": "🍂🍁Our FALL 2026 SPIRIT WEEK (10/5-10/9) THEMES ARE……\n\nMonday (10/5) - MEME MONDAY\n\nTuesday (10/6)- TWIN WITH A PLUSHIE\n\nWednesday (10/7)- WRONG OCCASION WEDNESDAY \n\nThursday (10/8) - CARDINAL THURSDAY \n\nFriday (10/9)- 🌈 COLOR WARS Friday Represent your class with your class color ❤️💙💜💚\n\n#graphicdesign #canva #canvadesign #studentcouncil #digitaldesign",
        "cover": "/instagram/Ddt5IOomlz4/cover.jpg",
        "slides": [
            "/instagram/Ddt5IOomlz4/cover.jpg",
            "/instagram/Ddt5IOomlz4/2.jpg",
            "/instagram/Ddt5IOomlz4/3.jpg",
            "/instagram/Ddt5IOomlz4/4.jpg",
            "/instagram/Ddt5IOomlz4/5.jpg",
            "/instagram/Ddt5IOomlz4/6.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/Ddt5IOomlz4/"
    },
    {
        "id": "DddgFANGwJi",
        "date": "Sep 19, 2026",
        "caption": "We're kicking off an epic month of spirit events with Late Night on October 2nd from 4:30 PM - 9:00 PM! We're transforming our hallways into an immersive fantasy world, and each grade is bringing a legendary universe to life:\nFreshmen: Wizard of Oz \nSophomores: Harry Potter \nJuniors: Percy Jackson \nSeniors: Alice in Wonderland\nRSVP:  https://docs.google.com/forms/d/e/1FAIpQLSf4rwAdz10Oru5emB_7pKGTuQuqmjYT2bpI7MN9pTpXaiik3Q/viewform\n\nFind your grade's Late Night Committees down below\n@lowell2027board @lsaboard2028 @lsa2029board @lsaboard2030\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n.\n#alienstage #alienstagefanart #graphics #design #canva",
        "cover": "/instagram/DddgFANGwJi/cover.jpg",
        "slides": [
            "/instagram/DddgFANGwJi/cover.jpg",
            "/instagram/DddgFANGwJi/2.jpg",
            "/instagram/DddgFANGwJi/3.jpg",
            "/instagram/DddgFANGwJi/4.jpg",
            "/instagram/DddgFANGwJi/5.jpg",
            "/instagram/DddgFANGwJi/6.jpg",
            "/instagram/DddgFANGwJi/7.jpg",
            "/instagram/DddgFANGwJi/8.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DddgFANGwJi/"
    },
    {
        "id": "DdddmqyJLnc",
        "date": "Sep 19, 2026",
        "caption": "Want your voice heard? 🗣️ It's time to speak up, share your ideas, and make a real impact at our upcoming Principal Advisory Council!\nHead over to the Student Union on September 23rd to talk directly with Ms. Bautista about whatever is on your mind, ask questions, and bring up school-wide concerns.\nWho should attend? We are looking for 1-2 representatives from every club, along with our dedicated student leaders, to join the conversation and bring their group's perspective.",
        "cover": "/instagram/DdddmqyJLnc/cover.jpg",
        "slides": [
            "/instagram/DdddmqyJLnc/cover.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DdddmqyJLnc/"
    },
    {
        "id": "DdVskrAG1a4",
        "date": "Sep 15, 2026",
        "caption": "💸 Lowell Alumni Association (LAA) grants workshop is on 9/22! Pull up to learn more about LAA grants and the grant application process!",
        "cover": "/instagram/DdVskrAG1a4/cover.jpg",
        "slides": [
            "/instagram/DdVskrAG1a4/cover.jpg",
            "/instagram/DdVskrAG1a4/2.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DdVskrAG1a4/"
    },
    {
        "id": "DdKfOmhj-ze",
        "date": "Sep 11, 2026",
        "caption": "FLY ME TO THE MOON 🌙🌃\n\nCome join us among the stars at Lowell's Homecoming @Courtyard on October 9th! Please read thoroughly on information for tickets and guests tickets. Get ready to dance the night away! \n\nWith last year's ticket system, YOU MUST FILL OUT THE RSVP for a ticket BEFORE purchasing. It is a first come first serve basis. RSVP NOW and buy your ticket at the catwalk starting September 22! \n\nFeel free to reach out with questions!\n\nArt by @fion4yu\n\n#homecoming #school #prom #evangelion #evangelionfanart",
        "cover": "/instagram/DdKfOmhj-ze/cover.jpg",
        "slides": [
            "/instagram/DdKfOmhj-ze/cover.jpg",
            "/instagram/DdKfOmhj-ze/2.jpg",
            "/instagram/DdKfOmhj-ze/3.jpg",
            "/instagram/DdKfOmhj-ze/4.jpg",
            "/instagram/DdKfOmhj-ze/5.jpg",
            "/instagram/DdKfOmhj-ze/6.jpg",
            "/instagram/DdKfOmhj-ze/7.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DdKfOmhj-ze/"
    },
    {
        "id": "DdJ0Rn5p1Az",
        "date": "Sep 11, 2026",
        "caption": "Join us for Club Fair to explore the various clubs that Lowell Offers! This club fair will have the updated organizations of the 2026-2027 year including new unique clubs and our returning clubs. Club Fair is on 9/16 after school at approximately 2:40. We hope to see you there.",
        "cover": "/instagram/DdJ0Rn5p1Az/cover.jpg",
        "slides": [
            "/instagram/DdJ0Rn5p1Az/cover.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DdJ0Rn5p1Az/"
    },
    {
        "id": "DdIKXsmpxzu",
        "date": "Sep 10, 2026",
        "caption": "SOON…🪽🌝 #homecoming2026 #lowellhighschool #bayarea #viral #hoco",
        "cover": "/instagram/DdIKXsmpxzu/cover.jpg",
        "slides": [
            "/instagram/DdIKXsmpxzu/cover.jpg"
        ],
        "video": null,
        "url": "https://www.instagram.com/lowellhs/reel/DdIKXsmpxzu/"
    },
    {
        "id": "DdGWWs-m3yE",
        "date": "Sep 10, 2026",
        "caption": "Check out the website shout out to Mr elections commissioner for updating it 👀👀👀 https://lowellstudentassociation.org/",
        "cover": "/instagram/DdGWWs-m3yE/cover.jpg",
        "slides": [
            "/instagram/DdGWWs-m3yE/cover.jpg",
            "/instagram/DdGWWs-m3yE/2.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/DdGWWs-m3yE/"
    },
    {
        "id": "Dc-FpmEFPdr",
        "date": "Sep 6, 2026",
        "caption": "Submit your application for the LAA grant today! The application is due October 5th: find out more information by scanning the QR code! 🤑💸",
        "cover": "/instagram/Dc-FpmEFPdr/cover.jpg",
        "slides": [
            "/instagram/Dc-FpmEFPdr/cover.jpg",
            "/instagram/Dc-FpmEFPdr/2.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/Dc-FpmEFPdr/"
    },
    {
        "id": "Dc83uBiG6i6",
        "date": "Sep 6, 2026",
        "caption": "Welcome Back Dance #RECAP! 🌅🌴🦄",
        "cover": "/instagram/Dc83uBiG6i6/cover.jpg",
        "slides": [
            "/instagram/Dc83uBiG6i6/cover.jpg",
            "/instagram/Dc83uBiG6i6/2.jpg",
            "/instagram/Dc83uBiG6i6/3.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/Dc83uBiG6i6/"
    },
    {
        "id": "Dc4OyxkAe_T",
        "date": "Sep 4, 2026",
        "caption": "Freshman Mixer Recap! We hope you all had fun 💚",
        "cover": "/instagram/Dc4OyxkAe_T/cover.jpg",
        "slides": [
            "/instagram/Dc4OyxkAe_T/cover.jpg",
            "/instagram/Dc4OyxkAe_T/2.jpg",
            "/instagram/Dc4OyxkAe_T/3.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/Dc4OyxkAe_T/",
        "handle": "lsaboard2030"
    },
    {
        "id": "Dc30L-Em_7I",
        "date": "Sep 4, 2026",
        "caption": "💚 CLASS OF 2030!!! 🍀‼️\n\nIt's almost time for Fall Rally!! Interested in dancing, choreographing, painting or drawing? Join one of our Freshman committees and help make Fall Rally amazing!!\n\n💃 Dance Committee: Learn to perform and dance with other Freshmen at Rally!!\n🎨 Late Night Committee: Help, design, leard, and paint the Freshman banner displayed at Fall Rally and create the Freshman hallway!!!\n\nBoth are perfect opportunities to meet other Freshmen, get involved, and have a fun time with school activities!!!\n\nPlease fill out these forms by:\nDance Committee — September 13th @ 11:59 PM\nLate Night Committee — September 9th @ 11:59 PM",
        "cover": "/instagram/Dc30L-Em_7I/cover.jpg",
        "slides": [
            "/instagram/Dc30L-Em_7I/cover.jpg",
            "/instagram/Dc30L-Em_7I/2.jpg",
            "/instagram/Dc30L-Em_7I/3.jpg"
        ],
        "url": "https://www.instagram.com/lowellhs/p/Dc30L-Em_7I/"
    },
    {
        "id": "Dcnmz32J394",
        "date": "Aug 29, 2026",
        "caption": "🗳️💚CLASS OF 2030!!! Your very first class election is coming up, which means that it’s time for an elections info meeting! If you’re interested in running attend ONE of these MANDATORY info meetings in the 📍Steve Silver: \n\nThursday, September 10th\nFriday, September 11th\n\nAfter school at 3:50pm! Remember YOU MUST ATTEND to run in the elections, if you cannot make one of these dates email lowellelections@gmail.com!\n\nFILL OUT IF INTERESTED: https://forms.gle/hkQ2c1MMSjQcw9qq7\n\nWe hope to see you there!!🍀‼️",
        "cover": "/instagram/Dcnmz32J394/cover.jpg",
        "slides": [
            "/instagram/Dcnmz32J394/cover.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/Dcnmz32J394/",
        "handle": "lsaboard2030"
    },
    {
        "id": "Dchrn1ZlIX_",
        "date": "Aug 26, 2026",
        "caption": "🍀Hey Class of 2030!! 💚\n\nFreshmen Mixer 😛will be held on Wednesday, September 2nd from 2:45-4PM in the courtyard. Come enjoy games, a scavenger hunt🧺, free snacks, 🍕and bond with other Freshmen. This is a great opportunity to get involved with Lowell activities and get to know your class. RSVP here!\n\nhttps://forms.gle/Ly5sQRHHAzHPHuKm8\n\n🌱\n\nReach out to SBC Elections Commissioner  lowellelections@gmail.com for any questions or concerns! See you there!!",
        "cover": "/instagram/Dchrn1ZlIX_/cover.jpg",
        "slides": [
            "/instagram/Dchrn1ZlIX_/cover.jpg",
            "/instagram/Dchrn1ZlIX_/2.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/Dchrn1ZlIX_/",
        "handle": "lsaboard2030"
    },
    {
        "id": "Db1dhrXAQ9O",
        "date": "Aug 9, 2026",
        "caption": "‼️ FRESHMEN AND TRANSFER STUDENTS ‼️\nBe prepared for your Lowell orientation! You should have already received information about your orientation, but here is a post reiterating it for you! Transfer students — check your email for more information.\nWe hope to see you Monday, August 10th! Feel free to leave a comment/DM if you have any questions!",
        "cover": "/instagram/Db1dhrXAQ9O/cover.jpg",
        "slides": [
            "/instagram/Db1dhrXAQ9O/cover.jpg",
            "/instagram/Db1dhrXAQ9O/2.jpg",
            "/instagram/Db1dhrXAQ9O/3.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/Db1dhrXAQ9O/",
        "handle": "lsaboard2030"
    },
    {
        "id": "DbcgRdVJs-C",
        "date": "Jul 30, 2026",
        "caption": "We would like to give a warm welcome to @lsaboard2030 ! This is a new time for you all and we encourage you to explore your interests, form lasting connections and to embrace personal growth. Please check out the important updates and information listed down below. \n\n** FRESHMEN BOARD ACCOUNT:\nPlease make sure you have already followed your freshman board account— @lsaboard2030 This account will be where you receive updates and information regarding your class! \n\n** SCHEDULES:\nThey will be handed out during freshman orientation. Please do not email your counselors before that time, as they are busy trying to finalize schedules.\n\n** BACK TO SCHOOL UPDATES:\nSchool officially starts on Monday, August 17th! Freshman orientation will be on August 10th! We will be making a back to school post so stay tuned! \n\nAnd again, welcome class of 2030! We hope you will have an unforgettable experience here at Lowell! If you have any further questions, don’t be afraid to reach out to us through dms!",
        "cover": "/instagram/DbcgRdVJs-C/cover.jpg",
        "slides": [
            "/instagram/DbcgRdVJs-C/cover.jpg"
        ],
        "url": "https://www.instagram.com/lsaboard2030/p/DbcgRdVJs-C/",
        "handle": "lsaboard2030"
    }
];

export default posts;
