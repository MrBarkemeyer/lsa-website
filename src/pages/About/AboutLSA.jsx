import { Link } from "react-router-dom"

export default function AboutLSA(){
    return(
        <>
            <div className="title">
                <h1>Lowell Student Association</h1>
            </div>
            <div className="about-lsa">
                <p>Lowell Student Association is the umbrella term for Lowell's student government or all the boards, which includes SBC (Student Body Council), and class boards for the Seniors, Juniors, Sophomores, and Freshmen. We do our best to represent the general student population and follow a body of rules listed in our charter, which is at the bottom of this page. 
                </p>
                <h2>What is the difference between SBC and Class Boards?</h2>
                <p>SBC is in charge of the whole entire school's events and dances. We take care of school wide events such as the Homecoming Dance, Spirit Rallies, Winterball, Last Dance, Co-Curricular day and more. SBC's main goal is to represent the student voice and make changes based on what the students want. Positions include: President, Vice President, Election Commissioner, Secretary, Treasurer, Community Liaison, Club Coordinator, Events Coordinator, Dance Coordinator, Public Relations, and Co-Public Relations. </p>
                <p>Class boards take care of their own class. Their main goal is to raise money for their class in order to pay for big events such as prom, boat, and graduation. They also put a lot of effort into pumping up class spirit and throwing mini events to help the class bond. Positions include: President, Vice President, Secretary, Treasurer, Historian, and Public Relations.</p>
                <h2>How do I join LSA?</h2>
                <p>Each school year, two elections are held. The first is in the fall, for Freshmen only. This will elect the Freshman board for that year. In the spring, there is another election held for all grades (except the Seniors of course). The election commissioner is in charge of these two elections, and when the time comes, keep your eyes out for posters for an informational meeting!</p>
                <h2>Where can I find LSA members?</h2>
                <p>LSA members are usually huddled in the deepest, darkest, and stuffiest room in all of Lowell. The infamous room 80A (also known as "the Cave'') is where members spend their hours at work, specifically during 1st block in Leadership. In case you have never heard of room 80A, it is the tiny door that slaps you in the face when you turn right from the art wing. You can also approach any LSA member at school at any time, our pictures can be found in the "Meet the Members" section.</p>
                <Link to="Charter"><h2>View Charter of the Lowell Student Association</h2></Link>
            </div>
        </>
    )
}