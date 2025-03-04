import CardinalympicLogo from "../components/CardinalympicLogo"
import Counter from "../components/Counter"
export default function Cardinalympics({cardinalympicsData}){
    return(
        <>
            <div className="title">
                <h1>2025 Cardinalympics</h1>
            </div>
            <CardinalympicLogo />
            <div className="cardinalympics-intro-container">
                    <h1>Spirit Week Total</h1>
                    <div className="cardinalympics-scores">
                        <div className="cardinalympics-score">
                            <h2>Freshman:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[0]} duration={2000} className="cardinalympics-counter" color="green"> pts</Counter>
                        </div>
                        <div className="cardinalympics-score">
                            <h2>Sophomore:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[1]} duration={2000} className="cardinalympics-counter" color="purple"> pts</Counter>
                        </div>
                        <div className="cardinalympics-score">
                            <h2>Junior:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[2]} duration={2000} className="cardinalympics-counter" color="#5353f6"> pts</Counter>
                        </div>
                        <div className="cardinalympics-score">
                            <h2>Senior:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[3]} duration={2000} className="cardinalympics-counter" color="#9c1919"> pts</Counter>
                        </div>
                    </div>
                </div>
            <section className="info-page">
                <h3>Check out the entire activities list: <a target="_blank" href="https://docs.google.com/document/d/1VLrgGont0-x0QVqtaHyixDYa2Iyn0bpqV3ZVu8KGmGs/edit?tab=t.0">Here</a></h3>
                <h3>For the detailed scores breakdown: <a target="_blank" href="https://docs.google.com/spreadsheets/d/1YoyeAEx3rFD2ctbrz3R0a0todgsNes76r_JH6MkYUO4/edit?gid=5259979411">Here</a></h3>
                <div>
                    <h1>Monday</h1>
                    <div className="event">
                        <h3 className="event-description">Coloring Contest <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 - 4:30</p>
                        <p className="event-description"><strong>Where:</strong>  Room 230</p>
                        <p className="event-description"><strong>Host:</strong>  Ms. Yoshimura</p>
                        <p className="event-description"><strong>Description:</strong>  Color inside or outside the lines, all participants will color in the same picture. Entries will be judged on originality, creativity, skill, and overall visual appeal. Coloring pens/pencils and paper will be provided.</p>
                        <p className="event-description"><strong>Who?</strong> MAX 34 participants. The first 34 signups will be accommodated. Any no-shows by 3:50 on the day of the contest will be dropped, and anyone who shows up on the day of will be allowed in on a first come, first served basis up to a max of 35 contestants.</p>
                    </div>
                    <div className="event">
                        <h3 className="event-description">Times Tables Comp <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 – 4:10</p>
                        <p className="event-description"><strong>Where:</strong>  Room 255</p>
                        <p className="event-description"><strong>Host:</strong>  Ms. Johnson & Mr. Zeeman</p>
                        <p className="event-description"><strong>Description:</strong>  Can you multiply by 12s without a calculator? Do you know the answer to the dreaded 8 x 7 question? How about 9 x 6? Meet your peers and spend a quick few minutes seeing who can complete a 1-12 by 1-12 times table quickly (and accurately!).</p>
                        <p className="event-description"><strong>Who?</strong> The first 36 individuals that sign up.</p>
                    </div>
                    <div className="event">
                        <h3 className="event-description">Geography Bee <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 – 4:20</p>
                        <p className="event-description"><strong>Where:</strong>  Room 231</p>
                        <p className="event-description"><strong>Host:</strong>  Ms. Hanlon-Young</p>
                        <p className="event-description"><strong>Description:</strong>  Have you played Worldle? Can you locate and name the major mountain ranges in the Americas? Do you know the capitals of most of the countries in Africa? Join us for the Geography Bee, where you will be asked questions in three different categories, over three different rounds. Bring a friend or two AND ONE CHROMEBOOK PER TEAM and compete against others using your geography knowledge.</p>
                        <p className="event-description"><strong>Who?</strong> Teams of 2-3 people (in the same grade level!) up to a maximum of 40 people.</p>
                    </div>
                    <div className="event">
                    <h3 className="event-description">3-Point Contest <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:20</p>
                    <p className="event-description"><strong>Where:</strong>  Bball courts by WL</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Gersten</p>
                    <p className="event-description"><strong>Description:</strong>  Show off your 3-point shot by making as many of 6 shots from outside the arc as you can. Those making the most baskets in each round will move on to further rounds until winners are crowned! <strong>NOTE:</strong> JV and Varsity basketball players MAY compete!</p>
                    <p className="event-description"><strong>Who?</strong> The first 40 who sign up. Others will be on a waiting list.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Climb a Wall <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:20, M 3/17</p>
                    <p className="event-description"><strong>Where:</strong>  Climbing Wall in the Weightroom</p>
                    <p className="event-description"><strong>Host:</strong>  Mr. Worth</p>
                    <p className="event-description"><strong>Description:</strong>  Are you secretly Spiderman? Can you climb a wall in record time? If so, come try your wall-traversing skills on a designated course in a timed competition.</p>
                    <p className="event-description"><strong>Who?</strong> The first 20 who sign up. Others will be on a waiting list.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Origami! <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:20, M 3/17</p>
                    <p className="event-description"><strong>Where:</strong>  Room 137</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Ravelli</p>
                    <p className="event-description"><strong>Description:</strong>  Cranes! Lots and lots of cranes! Can you fold quickly and accurately, creating an origami crane? Join us to see who can make the most cranes in a timed competition. Even if you DON’T know how to make a crane, join us as basic instructions will be provided. All materials will be provided.</p>
                    <p className="event-description"><strong>Who?</strong> The first 34 who sign up. Others will be on a waiting list.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Know Lowell Treasure Hunt <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:35, M 3/17</p>
                    <p className="event-description"><strong>Where:</strong>  Room xxx</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Theilen Burke</p>
                    <p className="event-description"><strong>Description:</strong>  How well do you know your school and all its hidden, quirky things? Show up with up to 3 of your classmates (teams of 4 max) at 3:50 to grab your list of items to find and race around the school to take selfies of you and your teammates with specific objects. Get back to home base (room xx) first, and win!</p>
                    <p className="event-description"><strong>Who?</strong> Unlimited number of teams, but signups must be completed by F 3/14.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Reflection Journaling <span>(300 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  8:30am - 3:50pm, M 3/17 - Th 3/20</p>
                    <p className="event-description"><strong>Where:</strong>  Wellness</p>
                    <p className="event-description"><strong>Host:</strong>  M. Kane & the Wellness Team</p>
                    <p className="event-description"><strong>Description:</strong>  Do you want a little encouragement to take a minute to reflect about yourself, your life, and/or the world around you? Stop by Wellness anytime between 8:30 - 9:30 each day and pick up a daily “reflection card.” Fill it out sometime during the day and drop it off by 3:50. Similar to Cardinal CHIRP coins, this contest will be judged by total percent of classes participating. <strong>Note:</strong> Reflections WILL be read, and only those deemed actually reflective will count.</p>
                    <p className="event-description"><strong>Who?</strong> Unlimited, one card per student per day.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Costume Contest, Character Chaos Monday <span>(Lunch A, 100 pts; Lunch B, 100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  Once during Lunch A, once during Lunch B, 10 minutes after the beginning of lunch</p>
                    <p className="event-description"><strong>Where:</strong>  The Catwalk</p>
                    <p className="event-description"><strong>Host:</strong>  SBC</p>
                    <p className="event-description"><strong>Description:</strong> Do you still have that Batman costume at home?  A Darth Vader mask?  Want to break out your Mean Girl pink? Wear something representing a character, any character, from any movie, historical era, or Netflix show!</p>
                </div>


                                </div>
                                <div>
                                    <h1>Tuesday</h1>
                                    <div className="event">
                    <h3 className="event-description">General Trivia <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 - 4:35</p>
                    <p className="event-description"><strong>Where:</strong>  Room 241</p>
                    <p className="event-description"><strong>Host:</strong>  Mr. Knight</p>
                    <p className="event-description"><strong>Description:</strong>  Movies! News! Sports! Music! Science! Answer trivia questions about (mostly) current events and issues in teams of up to 4 (teams must consist of students all in the same grade). Participants will answer 30 questions, in 3 batches of 10. If necessary, tiebreaker questions will be asked at the end.</p>
                    <p className="event-description"><strong>Who?</strong> Groups of up to 4 (in the same grade level!) will compete against other groups, up to a total of 40 participants.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Air-Dry Sculpture Making <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:35</p>
                    <p className="event-description"><strong>Where:</strong>  218</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Moore</p>
                    <p className="event-description"><strong>Description:</strong>  Looking for a way to bring your ideas to life? Do you like to make small figurines of cats? Dogs? Penguins? Dragons? Use special clay to create quick (but amazing!) sculptures. Judgement will be based on criteria presented at the beginning of the competition. All materials will be provided.</p>
                    <p className="event-description"><strong>Who?</strong> Up to 34 individuals, first to sign up welcomed. If there are any no-shows by 3:50 on the day of the competition, any who are waiting can take any empty seats (first come, first seated).</p>
                </div>
                <div className="event">
                    <h3 className="event-description">History Trivia Bowl <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:30</p>
                    <p className="event-description"><strong>Where:</strong>  Room 241</p>
                    <p className="event-description"><strong>Hosts:</strong>  Mr. Ungar & Ms. Delligatta</p>
                    <p className="event-description"><strong>Description:</strong>  What famous French conqueror has a pastry named after him? How far did the treasure ships of Zheng He sail? Who said, "Workers of the world, UNITE!" What wall did President Reagan demand to be torn down? Answer history trivia questions about (mostly) world history in teams of up to 4. Participants will answer 30 questions, in 3 batches of 10. If necessary, tiebreaker questions will be asked at the end.</p>
                    <p className="event-description"><strong>Who?</strong> Groups of up to 4 (in the same grade level!) will compete against other groups, up to a total of 40 participants.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">GeoGuesser Competition <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  Lunch A (11:25 - 11:45)</p>
                    <p className="event-description"><strong>Where:</strong>  Room 212</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Chassagne</p>
                    <p className="event-description"><strong>Description:</strong>  Can you look at a picture and tell, approximately, where in the world it might be located? Come play GeoGuesser with your friends and see who can guess better, more often… you or your competition! There will be approximately three rounds, showing 5 images each round, and the closer you are to the actual location of the image, the higher your score. There will be three rounds played, and there will be a tiebreaker round if needed.</p>
                    <p className="event-description"><strong>Who?</strong> Teams of 2-3 people (in the same grade level!) compete with other teams, with a maximum of 40 people participating.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Paper Airplane Fly-Away! <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 – 4:20</p>
                    <p className="event-description"><strong>Where:</strong>  Principal’s Office</p>
                    <p className="event-description"><strong>Host:</strong>  Principal Bautista</p>
                    <p className="event-description"><strong>Description:</strong>  Can you build a paper airplane? Can you make it fly far (and in a somewhat straight line)? Materials for building paper airplanes will be provided. So, come and show off your engineering and piloting skills.</p>
                    <p className="event-description"><strong>Who?</strong> The first 40 that sign up.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Costume Contest, Twin Tuesday <span>(Lunch A, 100 pts; Lunch B, 100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  Once during Lunch A, once during Lunch B, 10 minutes after the beginning of lunch</p>
                    <p className="event-description"><strong>Where:</strong>  The Catwalk</p>
                    <p className="event-description"><strong>Host:</strong>  SBC</p>
                    <p className="event-description"><strong>Description:</strong> Twin with another student in the same grade OR dress as your favorite teacher or administrator!  Be creative, the more complex the twin outfit, the better!
                    </p>
                </div>
                                </div>
                                <div>
                                    <h1>Wednesday</h1>
                                    <div className="event">
                    <h3 className="event-description">Photography Competition <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:50 - 4:50</p>
                    <p className="event-description"><strong>Where:</strong>  Room 142</p>
                    <p className="event-description"><strong>Hosts:</strong>  Mr. Flores</p>
                    <p className="event-description"><strong>Description:</strong>  Are your friends impressed with your pics? Do you think your selfies could win an award? Bring yourself and your phone camera and join us in some friendly photo fun. Upon arriving, you will be given THREE criteria for your photos and 45 minutes to wander campus and take THREE pictures that you will upload for judging. Winning photos will be displayed in room 142 at 4:40pm. You must bring your own phone camera or camera and be able to transmit photos via email.</p>
                    <p className="event-description"><strong>Who?</strong> The first 12 people who sign up.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Hello? Hello, Kitty?! <span>(250 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:00 – 4:30</p>
                    <p className="event-description"><strong>Where:</strong>  Start and end in the courtyard, run all over the school</p>
                    <p className="event-description"><strong>Hosts:</strong>  Mr. Shimmon</p>
                    <p className="event-description"><strong>Description:</strong>  Have you ever watched Amazing Race? Do you like solving puzzles? Do you know random factoids about Lowell? In the Great Lowell Scavenger Hunt Race, you and your team (4 people max per team) will solve riddles that will lead you to specific locations where you will complete a task before receiving the next riddle/clue. There will be a total of 5 stages in this contest.</p>
                    <p className="event-description"><strong>Who?</strong> Teams of up to 4 (in the same grade level!) will compete against others. There is no limit to the number of teams that may compete, but your team MUST register ahead of time to participate. The deadline to register is Monday, 11 March at 3:30pm.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">3 x 3 Basketball Tourney (Boys) <span>(250 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:00 – 4:30</p>
                    <p className="event-description"><strong>Where:</strong>  Basketball courts by WL</p>
                    <p className="event-description"><strong>Hosts:</strong>  Coach Magsanay & Coach Hosoda</p>
                    <p className="event-description"><strong>Description:</strong>  Come show off your hoop skills with two of your pals in a 3-on-3 basketball tourney with a total of 8 brackets. Winners will play three half-court matches. Games are to 11 points, win by 2 (1 point per basket).</p>
                    <p className="event-description"><strong>Who?</strong> Teams of 3, up to two teams for each grade (first teams that sign up can participate). <strong>Note:</strong> Unfortunately, NO Varsity or JV players may participate.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">3 x 3 Basketball Tourney (Girls) <span>(250 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:00 – 4:30</p>
                    <p className="event-description"><strong>Where:</strong>  Basketball courts by WL</p>
                    <p className="event-description"><strong>Hosts:</strong>  Coach Magsanay & Coach Hosoda</p>
                    <p className="event-description"><strong>Description:</strong>  Come show off your hoop skills with two of your pals in a 3-on-3 basketball tourney with a total of 8 brackets. Winners will play three half-court matches. Games are to 11 points, win by 2 (1 point per basket).</p>
                    <p className="event-description"><strong>Who?</strong> Teams of 3, up to two teams for each grade (first teams that sign up can participate). <strong>Note:</strong> Unfortunately, NO Varsity or JV players may participate.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Karaoke Contest <span>(250 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  3:00 – 4:30</p>
                    <p className="event-description"><strong>Where:</strong>  Carol Channing Auditorium</p>
                    <p className="event-description"><strong>Hosts:</strong>  Mr. Chan & Ms. Letzl</p>
                    <p className="event-description"><strong>Description:</strong>  Come show us your chops! If you are budding Karaoke royalty, come sing for and compete with your peers by performing on the Carol Channing Stage. You will be judged for your singing AND your performance (it is enough to sing your song with passion and intent, so a dance routine is not necessary, but would also be accepted). Make sure that your chosen song can be found on YouTube Karaoke, that the lyrics and dance moves are clean and school-appropriate. Also, please come with a back-up song to perform in case of a need for an extra, tie-breaking, performance.</p>
                    <p className="event-description"><strong>Who?</strong> The first 16 performers that sign up, as long as there is representation from all grades among the 16 performers. Anyone beyond the first 16 that sign up, and are chosen, will be informed that they are on a waiting list, in case of any no-shows on the day of the performance.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Penalty Kicks! <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  2:40 – 3:20</p>
                    <p className="event-description"><strong>Where:</strong>  “Football” field</p>
                    <p className="event-description"><strong>Hosts:</strong>  Coach Fong & Coach Lopez</p>
                    <p className="event-description"><strong>Description:</strong>  Can you Bend it Like Beckham, are you the next Kadidiatou Diani or Lionel Messi? Come test your PK skills against those of your peers. You will go head-to-head against others in sudden-death rounds, with winners advancing to play the next bracket. Come show us your PK skills!</p>
                    <p className="event-description"><strong>Who?</strong> The first 40 people who sign up!</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Move the Mat! <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  2:40 – 3:20</p>
                    <p className="event-description"><strong>Where:</strong>  The gym</p>
                    <p className="event-description"><strong>Host:</strong>  ???</p>
                    <p className="event-description"><strong>Description:</strong>  Have you ever thrown your body down a slip-and-slide? Did you love it? Then join us in this competition where you and your team of 4 will run and jump on a mat in the gym, pushing it across the floor and back. Join us for some ridiculous fun while competing against other teams!</p>
                    <p className="event-description"><strong>Who?</strong> Up to 12 teams of 3-4 each (in the same grade level!) with a max of 48 contestants.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Table Tennis Tournament <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  2:40 – 4:00, W 3/19</p>
                    <p className="event-description"><strong>Where:</strong>  1st floor, Science Building</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Moses</p>
                    <p className="event-description"><strong>Description:</strong>  Bring on your inner Fan Zhendong or Sun Yingsha! If you don't know who these Gold Medalists are, it doesn't matter! Show all of Lowell your ping-pong prowess at this table tennis tournament for the ages. Bring your own paddle or borrow one from wherever and sign up!</p>
                    <p className="event-description"><strong>Who?</strong>  The first 16 who sign up. Others will be on a waiting list.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Slow Fashion Contest <span>(300 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  2:40 – 4:00, W 3/19</p>
                    <p className="event-description"><strong>Where:</strong>  Steve Silver Auditorium</p>
                    <p className="event-description"><strong>Host:</strong>  Ms. Sandzik</p>
                    <p className="event-description"><strong>Description:</strong>  Are you an avid thrifter? Do you like to reuse, repurpose, or recycle old clothes and fabrics? Are you into sustainable fashion? Come show us your slow fashionista genius in a fun fashion show. Criteria for judging, themes, etc. will be presented via email to all participants who sign up by W 3/12 at 3:40pm.</p>
                    <p className="event-description"><strong>Who?</strong>  The first 20 who sign up. Others will be on a waiting list. Note, in order to have as much time to craft an outfit, according to judged criteria, it would be best to sign up by 3/12.</p>
                </div>
                <div className="event">
                    <h3 className="event-description">Costume Contest, Live, Laugh, Love Lowell Wednesday <span>(100 pts)</span></h3>
                    <p className="event-description"><strong>When:</strong>  once Lunch A, once Lunch B, 10 min after the beginning of lunch</p>
                    <p className="event-description"><strong>Where:</strong>  the Catwalk</p>
                    <p className="event-description"><strong>Host:</strong>  SBC</p>
                    <p className="event-description"><strong>Description:</strong> Wear ALL your Lowell gear!  On a team?  Wear your uniform.  Got the red hoodie?  Wear it.  Don’t have anything?  Wear your PE uniform!  Still don’t have anything?  Go to Book to Book (they are selling items at 20% discount this week only!) OR just wear RED!
                    </p>
                    
                </div>
                                </div>
                <div>
                    <h1>Thursday</h1>
                    <div className="event">
                        <h3 className="event-description">Rubik’s Cube Competition <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 – 4:15</p>
                        <p className="event-description"><strong>Where:</strong>  Room S106</p>
                        <p className="event-description"><strong>Host:</strong>  Mr. Hoffman</p>
                        <p className="event-description"><strong>Description:</strong>  Do you have an urge to perfectly arrange moveable cubes so that all the colors are the same on each side? Are you fast? Do you want to challenge yourself against your peers at Lowell? Come to the Rubik’s Cube Solving Competition. You are allowed to bring your own Cube with you OR one can be provided if you don’t have your own.</p>
                        <p className="event-description"><strong>Who?</strong>  Up to 30 individuals.</p>
                    </div>
                    <div className="event">
                        <h3 className="event-description">LEGOs, LEGOs, LEGOs! <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 – 4:30</p>
                        <p className="event-description"><strong>Where:</strong>  Room 253</p>
                        <p className="event-description"><strong>Hosts:</strong>  Ms. Chiu</p>
                        <p className="event-description"><strong>Description:</strong>  Do you know your way around red and yellow and blue dimpled bricks? Can you freestyle some cool LEGO figures? Join us in room 253 to fiddle around with some LEGOs to design and build something based on criteria that will be provided at the beginning of the competition. LEGOs will be provided.</p>
                        <p className="event-description"><strong>Who?</strong>  Any LEGO fans, up to 36 participants.</p>
                    </div>
                    <div className="event">
                        <h3 className="event-description">Unscramble Words Competition <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 – 4:20</p>
                        <p className="event-description"><strong>Where:</strong>  Room 236</p>
                        <p className="event-description"><strong>Host:</strong>  Ms. Bell</p>
                        <p className="event-description"><strong>Description:</strong>  If you are one of those people who love to arrange a jumble of letters into a correctly spelled word, Oijn us (do you see what we did there??!?!) in the Unscramble Sowdr Competition. You will compete with your team to untangle three lists of scrambled words correctly and quickly.</p>
                        <p className="event-description"><strong>Who?</strong>  Groups of up to 3 people (in the same grade level!), for a maximum of 39 participants.</p>
                    </div>
                    <div className="event">
                        <h3 className="event-description">Sling-Shot Bulls-Eye! <span>(100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  3:50 – 4:20, Th 3/20</p>
                        <p className="event-description"><strong>Where:</strong>  East end of the soccer field (near the trees)</p>
                        <p className="event-description"><strong>Host:</strong>  Mr. Prothro</p>
                        <p className="event-description"><strong>Description:</strong>  Do you have good aim? Superior muscle control? Have you ever used a slingshot? Challenge yourself to hit a target with a slingshot more accurately than your peers.</p>
                        <p className="event-description"><strong>Who?</strong>  The first 40 who sign up. Others will be on a waiting list.</p>
                    </div>
                    <div className="event">
                        <h3 className="event-description">Costume Contest, Mismatch Thursday <span>(Lunch A, 100 pts; Lunch B, 100 pts)</span></h3>
                        <p className="event-description"><strong>When:</strong>  Once Lunch A, once Lunch B, 10 min after the beginning of lunch</p>
                        <p className="event-description"><strong>Where:</strong>  The Catwalk</p>
                        <p className="event-description"><strong>Host:</strong>  SBC</p>
                        <p className="event-description"><strong>Description:</strong> Plaid shirt striped pants?  Shorts with a puffy coat?  Two different shoes and mismatched socks?  Disco on top, country western on the bottom?  Any bizarre combination of mismatching, inside out, or wacky clothes.  The wackier, the better!
                        </p>
                        
                    </div>
                </div>
            </section>
            
        </>
    )
}