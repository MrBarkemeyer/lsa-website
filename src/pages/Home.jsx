
import HeroVideo from "../assets/Hero-Video.mp4"
import Counter from "../components/Counter"
import {Link} from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons"
import studentLifeVideo from "../assets/student-life-video.mp4"
export default function Home({cardinalympicsData}) {
    return(
        <>
            <video autoPlay muted playsInline controls={false} src={HeroVideo} className="hero-video" >
            </video>
            <div className="video-credit">
                Video by Video Lowell</div>
            <div className="intro-container">
                <h2>2025 Cardinalympics!</h2>
                <div className="cardinalympics-scores">
                        <div className="score">
                            <h2>Freshman:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[0]} duration = {2000} className="counter" color="green"> pts</Counter>
                        </div>
                        <div className="score">
                            <h2>Sophomore:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[1]} duration = {2000} className="counter" color="purple"> pts</Counter>
                        </div>
                        <div className="score">
                            <h2>Junior:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[2]} duration = {2000} className="counter" color="blue"> pts</Counter>
                        </div>
                        <div className="score">
                            <h2>Senior:&nbsp;</h2> 
                            <Counter start={0} end={cardinalympicsData[3]} duration = {2000} className="counter" color="#861212"> pts</Counter>
                        </div>
                </div>
                <Link to="Cardinalympics">Learn more</Link>
            </div>
            <FontAwesomeIcon icon={faAnglesDown} beatFade className="scroll-icon"/>
            <div className="lsa-description center">
                <h1>Welcome to the Lowell Student Association!</h1>
                <p className="padding-1rem">LSA is the umbrella term for Lowell's student government or all the boards, which includes the Student Body Council, and class boards representing the Senior, Junior, Sophomore, and Freshmen classes.</p>
                <h2 className="center">We connect with</h2>
                <div className="stats">
                    <div className="center">
                        <Counter start={0} end={2500} duration = {2000} className="counter">+</Counter>
                        <p>Students</p>
                    </div>
                    <div className="center">
                        <Counter start={0} end={150} duration = {2000} className="counter">+</Counter>
                        <p>Clubs</p>
                    </div>
                    <div className="center">
                        <Counter start={0} end={9000} duration = {2000} className="counter">+</Counter>
                        <p>Alumni</p>
                    </div>
                </div>
            </div>
            <div className="life-at-lowell">
                <h2>WATCH: Student Life at Lowell High School</h2>
                <video controls muted src={studentLifeVideo} className="responsive-video"></video>            </div>
            <div className="preamble flex-center">
                <p>“We, the students of Lowell High School, in order to maintain the Lowell community, to <br />
                acknowledge and foster the diversity of needs, views, and rights of students at Lowell to <br />
                express opinions and interests to the community on relevant issues regarding student life, to <br />
                promote the educational welfare, and to enhance all benefits offered by the school and the <br />
                San Francisco Unified School District, do hereby establish and ordain this Charter of the <br />
                Lowell High School Student Association.”</p>
                <br /><br />
                <span className="bold">PREAMBLE OF THE CHARTER OF THE LOWELL STUDENT ASSOCIATION</span>
            </div>
        </>
    )
}