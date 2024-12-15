import SBCImg from "../assets/SBC.jpeg"
import HeroVideo from "../assets/Hero-Video.mp4"
import {useEffect, useState, useRef} from "react"
import Counter from "../components/Counter"
import {Link} from "react-router-dom"
import SeniorBoard from "../assets/SeniorBoard.jpeg"
import JuniorBoard from "../assets/JuniorBoard.jpeg"
import SophomoreBoard from "../assets/SophomoreBoard.jpeg"
import bannerImg from "../assets/Hero-img.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons"
import { GlowCapture, Glow } from "@codaworks/react-glow";
export default function Home(){
    
    // useRef to keep track of the dom element
    // useState gives a variable to keep track of, if it is intersecting
    // useEffect to keep track of function calls outside of rendering
    // uses a callback function to instanciate the intersection observer api
    // intersection observer api takes in an entries that gives us the ability to 
    // keep track of the element, and observe the element using the observe method

    const boardRefs = useRef([]);
    const boardImg = [
        SBCImg, SeniorBoard, JuniorBoard, SophomoreBoard,
    ]
    //board style in order of
    //SBC -> SENIOR -> JUNIOR -> SOPHOMORE -> FRESHMEN 
    //with corresponding board color 
    const boardStyle = [{
            color: "#861212",
        },
        {
            color: "#861212",
        },
        {
            color: "#3498eb",
        },
        {
            color: "#8273da",
        },
        {
            color: "#508d24",
        }
    ]
    const boardArr = [
        {
            title: "We Transform the School Experience",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque nobis praesentium tempora quod nesciunt id doloribus vel quasi neque repellendus deleniti eius suscipit quam alias aliquam recusandae reprehenderit, corrupti nemo enim ex! Sit facilis quis deserunt modi atque voluptatibus rem ratione natus. Sapiente",
            image: SBCImg,
            buttonName: "SBC",
        },
        {
            title: "We Transform the School Experience",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque nobis praesentium tempora quod nesciunt id doloribus vel quasi neque repellendus deleniti eius suscipit quam alias aliquam recusandae reprehenderit, corrupti nemo enim ex! Sit facilis quis deserunt modi atque voluptatibus rem ratione natus. Sapiente",
            image: SBCImg,
            buttonName: "Senior Board",
        },
        {
            title: "We Transform the School Experience",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque nobis praesentium tempora quod nesciunt id doloribus vel quasi neque repellendus deleniti eius suscipit quam alias aliquam recusandae reprehenderit, corrupti nemo enim ex! Sit facilis quis deserunt modi atque voluptatibus rem ratione natus. Sapiente",
            image: SBCImg,
            buttonName: "Junior Board",
        },
        {
            title: "We Transform the School Experience",
            description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque nobis praesentium tempora quod nesciunt id doloribus vel quasi neque repellendus deleniti eius suscipit quam alias aliquam recusandae reprehenderit, corrupti nemo enim ex! Sit facilis quis deserunt modi atque voluptatibus rem ratione natus. Sapiente",
            image: SBCImg,
            buttonName: "Sophomore Board",
        },
        // {
        //     title: "We Transform the School Experience",
        //     description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eaque nobis praesentium tempora quod nesciunt id doloribus vel quasi neque repellendus deleniti eius suscipit quam alias aliquam recusandae reprehenderit, corrupti nemo enim ex! Sit facilis quis deserunt modi atque voluptatibus rem ratione natus. Sapiente",
        //     image: SBCImg,
        //     buttonName: "Sophomore Board",
        // },
    ];
    const [isVisible, setIsVisible] = useState(new Array(boardArr.length).fill(
        false,
    ));

    const displayBoards = boardArr.map((board, index)=>{
        //loop through the boardArr to display the boards
        //because the useRef has multiple objects in the array, we 
        //need to give the reference through our index

        return(
                <section
                    className={`${index % 2 === 1 ? "flex-row-reverse" : ""} lsa-boards`}
                    ref={(el) => (boardRefs.current[index] = el)}
                    data-index={index}
                    key={index}
                >
                <div
                    className={`board-description ${
                    isVisible[index]
                        ? "to-up "
                        : ""
                    }`}
                >
                    <h1 
                        style = {boardStyle[index]}
                    >{board.title}</h1>
                        <GlowCapture>
                            <Glow 
                                color="red"><p className="glowable-text">{board.description}</p>
                            </Glow>
                        </GlowCapture> 
                </div>
                <figure className={`board-image ${
                    isVisible[index]
                    ? "to-up"
                    : ""
                    }`}>
                    <img src={boardImg[index]}/>
                    <figcaption><strong>{board.buttonName}</strong></figcaption>
                </figure>
                </section>

        )
    })
    useEffect(()=>{
        //set isInvisible with the corresponding index that
        //is intersecting the bottom of the page
        //if so, set it to true
        const observer = new IntersectionObserver((entries)=>{
            entries.forEach(entry => {
                const index = entry.target.dataset.index;
                if (entry.isIntersecting) {
                    setIsVisible((prevState) => {
                      const newState = [...prevState];
                      newState[index] = true;
                      return newState;
                    });
                  }
            });
        }, {
            // requires 30% the section to show up before it animate
            threshold: 0.5
        })
        //observe individual ref
        boardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
          });
    }, []);

    return(
        <>
            <video autoPlay loop muted playsInline controls={false} src={HeroVideo} className="hero-video" >
            </video>
            <FontAwesomeIcon icon={faAnglesDown} beatFade className="scroll-icon"/>
            <div className="lsa-description center">
                <h1>Welcome to the Lowell Student Association!</h1>
                <p className="padding-1rem">LSA is the umbrella term for Lowell's student government or all the boards, which includes the Student Body Council, and class boards representing the Senior, Junior, Sophomore, and Freshmen classes.</p>
            </div>
            {/* <div className="vl-head">
                <div className="vl"></div>
            </div> */}
            <h2 className="center">We connect with</h2>
            <div className="stats">
                <div className="center">
                    <Counter start={0} end={2500} duration = {2000}/>
                    <p>Students</p>
                </div>
                <div className="center">
                    <Counter start={0} end={150} duration = {2000}/>
                    <p>Clubs</p>
                </div>
                <div className="center">
                    <Counter start={0} end={9000} duration = {2000}/>
                    <p>Alumni</p>
                </div>
            </div>
            {displayBoards}
        </>
    )
}