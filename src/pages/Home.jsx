import HeroImg from "../assets/Hero-img.jpg"
import StudentBanner from "../assets/student-banner.jpg"
import VoteBanner from "../assets/Vote-banner.jpg"
import LinkImage1 from "../assets/Student-Events-Activities.png"
import LinkImage2 from "../assets/Our-150+-Student-Clubs.png"
import LinkImage3 from "../assets/Free-Wellness-Resources.png"
import PrincipalPDF from "../assets/PrincipalPDF.pdf"
import { Link } from "react-router-dom"
import HeroVideo from "../assets/Hero-Video.mp4"
import {useEffect, useState} from "react"
export default function Home(){


    // const classBoards = [
    //     {
    //         year: "2024-2025",
    //         name: "STUDENT BODY COUNCIL",
    //         id: 1,
    //     },
    //     {
    //         year: "LOWELL 2025",
    //         name: "SENIOR CLASS BOARD",
    //         id: 2,
    //     },
    //     {
    //         year: "LOWELL 2026",
    //         name: "JUNIOR CLASS BOARD",
    //         id: 3,
    //     },
    //     {
    //         year: "LOWELL 2027",
    //         name: "SOPHOMORE CLASS BOARD",
    //         id: 4,
    //     },
    //     {
    //         year: "LOWELL 2028",
    //         name: "SOPHOMORE CLASS BOARD",
    //         id: 5,
    //     },
    //     {
    //         year: "2024-2025",
    //         name: "DIRECTOR OF STUDENT ACTIVITIES",
    //         id: 6,
    //     }
    // ]
    const newsCorner = [
        {
            name: "All Grades:",
            news: "",
            color: "#861212",
            id: 1,
        },
        {
            name: "Seniors:",
            news: "",
            color: "orange",
            id: 2,
        },
        {
            name: "Juniors:",
            news: "",
            color: "lightskyblue",
            id: 3,
        },
        {
            name: "Sophomores:",
            news: "",
            color: "purple",
            id: 4,
        },
        {
            name: "Freshmen",
            news: "",
            color: "green",
            id: 5,
        }
    ]
    const displayNewsCorner = newsCorner.map(element=>{
        const {name, news, color, id} = element
        return(
            <div className="news-corner" style={{color: color}} key={id}>
                {name} {news}
            </div>
        )
    })
    // const displayClassboards = classBoards.map(classBoard =>{
    //     const {year, name, id} = classBoard;
    //     return(
    //         <Link className="black" key={id}>
    //             <div className="class-board flex-center">
    //                 <p>{year}</p> <br />
    //                 <span className="bold">{name}</span>
    //             </div>
    //         </Link>
    //     )
    // })
    return(
        <>
            {/* <figure>
                <img src={HeroImg} alt="Lowell High School" className="hero-image relative" />
                <video control autoplay src={HeroVideo} muted className="hero-video"/>
            </figure> */}
            <video autoPlay loop muted playsInline controls={false} src={HeroVideo} className="hero-video"></video>
            <div className="hero-texts">
                <p className="hero-title">Welcome to the <br />
                    <span className="bold">Lowell Student Association!</span></p>
                <p className="hero-description">LSA is the umbrella term for Lowell's student government or all the boards, which includes the Student Body Council, and class boards representing the Senior, Junior, Sophomore, and Freshmen classes.</p>
            </div>
            <figure className="vote-banner relative">
                <img src={VoteBanner} alt="vote-banner" className="banner" />
                <figcaption className="absolute-center">
                    <h1>2024-25 LSA/SBC</h1>
                    <p>Results of the Spring 2024 election is released.</p>
                    <Link className="white" to="Elections">Check out your officers HERE!</Link>
                </figcaption>
            </figure>
            <div className="news-corner-container flex-center">
                    <h1>News Corner:</h1>
                    <object className="pdf" 
                        data=
                        {PrincipalPDF}
                        >
                    </object>
            </div>
            <div className="hero-links">
                <Link><img src={LinkImage1} alt="Student Events & Activities" className="hero-link" /></Link>
                <Link><img src={LinkImage2} alt="Our 150+ Student Clubs"  className="hero-link"/></Link>
                <Link><img src={LinkImage3} alt="Free Wellness Resources"  className="hero-link"/></Link>
            </div>
            <div className="life-at-lowell">
                <div className="title flex-center">
                    <h2>WATCH: Student Life at Lowell High School</h2>
                </div>
                <div className="preamble flex-center">
                <p>“We, the students of Lowell High School, in order to maintain the Lowell community, to <br />
                acknowledge and foster the diversity of needs, views, and rights of students at Lowell to <br />
                express opinions and interests to the community on relevant issues regarding student life, to <br />
                promote the educational welfare, and to enhance all benefits offered by the school and the <br />
                San Francisco Unified School District, do hereby establish and ordain this Charter of the <br />
                Lowell High School Student Association.”</p>
                <br /><br />
                <span className="bold">PREAMBLE OF THE CHARTER OF THE LOWELL STUDENT ASSOCIATION</span>
                <p className="preamble-link-text">
                The Lowell Student Association does its best to represent the general student population and follow a body of rules listed in our charter, which you can read <a>here</a>.</p>
                </div>
            </div>
            <div className="banner">
                <img src={StudentBanner} alt="student-banner" className="banner" />
            </div>
            {/* <div className="class-board-links">
                {displayClassboards}
            </div> */}
        </>
    )
}