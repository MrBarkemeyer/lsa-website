import {Link, useLocation} from "react-router-dom"
import Logo from "../assets/LSA-Logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faCaretUp, faPlus, faMinus, faBars, faXmark, faCaretDown, faHouse, faCheckToSlot, faBook, faUser, faUsers, faThumbTack, faThumbsUp, faCaretRight} from "@fortawesome/free-solid-svg-icons"
import {useState, useEffect} from "react"


//Navigation bar/hamburger menu, DO NOT TOUCH!!!!

export default function Navbar(props){
    const [hasScrolled, setHasScrolled] = useState(false);
    const [hamburger, setHamburger] = useState(false);
    const [clickedDropdown, setClickedDropdown] = useState(false);

    function toggleBigSecondDropdown(index, event) {
        setClickedDropdown(prev => (prev === index ? false : index));
    }

    const [hasDropped, setHasDropped] = useState([
        {
            id: 1,
            dropped: false,
        },
        {
            id: 2,
            dropped: false, 
        },
        {
            id: 3,
            dropped: false,
        },
        {
            id: 4,
            dropped: false,
        },
        {
            id: 5,
            dropped: false,
        },
        {
            id: 6,
            dropped: false,
        },
        {
            id: 7,
            dropped: false,
        },
    ]);
    const [childDropdown, setChildDropdown] = useState({});

    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 50) {
            setHasScrolled(true); 
          } else {
            setHasScrolled(false); 
          }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);

    useEffect(
        ()=>{
            setHamburger(false);
        }
    ,[useLocation()])

    const scrolledStyle = {
        background: hasScrolled ? "white" : "transparent",
        opacity: hasScrolled ? 1 : 0.5,
        transition: "all 0.3s ease-in-out", 
    };
    

    function toggleHamburger(){
        setHamburger(prevState=> !prevState);
    }


    function toggleDropDown(id) {
        setHasDropped(prevState =>
            prevState.map(dropdown =>
                dropdown.id === id 
                    ? { ...dropdown, dropped: !dropdown.dropped }
                    : dropdown
            )
        );
    }

    const clubData = props.clubData;
    const navLinks = [
        {
            name: "HOME",
            hasDropdown: false,
            icon: faHouse,
            to: "/",
            id: 1,
        },
        {
            name: "ABOUT LSA",
            hasDropDown: true,
            icon: faBook,
            subLinks: [
                {
                    name: "2024-25 Student Body Council",
                    to: "SBC",
                },
                {
                    name: "2025 Senior Board",
                    to: "Senior Board",
                },
                {
                    name: "2026 Junior Board",
                    to: "Junior Board",
                },
                {
                    name: "2027 Sophomore Board",
                    to: "Sophomore Board",
                },
                {
                    name: "2028 Freshmen Board",
                    to: "Freshmen Board",
                },
                {
                    name: "Committees",
                    hasDropDown: true,
                    to: "Commitees",
                    subLinks2: [
                        {
                            name: "Spirit Committees",
                            to: "Spirit Committee",
                        },
                        {
                            name: "2024 Senior Prom Committee",
                            to: "2024 Senior Prom Committee"
                        },
                        {
                            name: "2025 Junior Prom Committee",
                            to: "2025 Junior Prom Committee",
                        },
                        {
                            name: "2024 Senior Boat Committee",
                            to: "2024 Senior Boat Committee",
                        },
                        {
                            name: "2025 Junior Escape Committee",
                            to: "2025 Junior Escape Committee",
                        },
                    ]
                },
                {
                    name: "Charter of the LSA",
                    to: "Charter",
                },
                {
                    name: "Director of Student Activities",
                    to: "DSA"
                }
            ],
            to: "/LSA",
            id: 3,
        },
        {
            name: "ORGANIZATIONS",
            hasDropDown: true,
            icon: faUser,
            subLinks: [
                {
                    name: "The Lowell (Journalism)",
                    to: "https://thelowell.org/",
                    directLink: "true",
                },
                {
                    name: "VIDEO LOWELL",
                    to: "https://www.youtube.com/channel/UCQHQSnxqQIfYs8AjS8FXfvw",
                    directLink: "true",
                },
                {
                    name: "CSF Tutoring",
                    to: "https://lowellcsf.weebly.com/",
                    directLink: "true",
                },
                {
                    name: "JROTC",
                    to: "https://www.sfbrigade.org/home-of-the-cardinals.html",
                    directLink: "true",
                },
                {
                    name: "Peer Resources",
                    to: "https://lhspeermentoring.weebly.com/",
                    directLink: "true",
                },
                {
                    name: "Mock Trial",
                    to: "http://www.lowellstudentassociation.org/mock-trial.html",
                    directLink: "true",
                },
                {
                    name: "Forensic Society (Speech & Debate)",
                    to: "http://www.lowellstudentassociation.org/forensic-society-speech--debate1.html",
                    directLink: "true",
                },
                {
                    name: "Science Research Program",
                    to: "https://sites.google.com/view/lowellscienceresearch/home?authuser=0",
                    directLink: "true",
                },
                {
                    name: "CardinalBotics",
                    to: "https://www.team4159.org/",
                    directLink: "true",
                },
                {
                    name: "Shield and Scroll",
                    to: "http://www.lowellstudentassociation.org/shield-and-scroll.html",
                    directLink: "true",
                },
                {
                    name: "Song",
                    to: "http://www.lowellstudentassociation.org/song.html",
                    directLink: "true",
                },
                {
                    name: "Student Advisory Council",
                    to: "http://www.lowellstudentassociation.org/student-advisory-council.html",
                    directLink: "true",
                }

            ],
            to: "/Organizations",
            id: 4,
        },
        {
            name: "CLUBS",
            hasDropDown: true,
            bigSubLink: true,
            icon: faUsers,
            subLinks: [
                {
                    name: "Club Resources",
                    to: "Clubs/ClubResources"
                },
                {
                    name: "Sports",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Sports"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    }),
                },
                {
                    name: "Volunteer and Public Service Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Volunteering and Public Service"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "STEM Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "STEM"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Culture and Religion Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Culture/Religion"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Entrepreneurship & Finance Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Finance"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Food and Crafts Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Food/Crafts"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Game and Fantasy Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Games and Fantasy"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Literature and Media Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Literature and Media"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Politics and Public Speaking Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Politics and Public Speaking"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Visual and Performing Arts Club",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "VPA"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
                {
                    name: "Health and Environment Clubs",
                    hasDropDown: true,
                    subLinks2: clubData.filter(club =>{
                        return(
                           club.Category === "Health and Environmental"
                        )
                    }).map(object =>{
                        return {name: object.Name}
                    })
                },
            ],
            to: "/Clubs",
            id: 5,
        },
        {
            name: "ELECTIONS",
            hasDropDown: false,
            icon: faCheckToSlot,
            to: "/Elections",
            id: 2,
        },
        {
            name: "RESOURCES",
            hasDropDown: true,
            icon: faThumbTack,
            subLinks: [
                {
                    name: "Lowell Wellness Center",
                    to: "Wellness"
                },
                {
                    name: "Title IX Support",
                    to: "TitleIX"
                },
            ],
            id: 6,
            to: "",
        },
        {
            name: "MORE",
            hasDropDown: true,
            icon: faThumbsUp,
            subLinks: [
                {
                    name: "Archives",
                    to: "http://www.lowellstudentassociation.org/archives.html",
                    directLink: "true",
                },
                {
                    name: "Freshmen Corner",
                    to: "FreshmenCorner",
                },
                // {
                //     name: "About this site",
                //     to: "AboutSite",
                // },
            ],
            id: 7,
            to: "",
        }
    ];


    function toggleChildDropdown(parentId, childId) {
        setChildDropdown(prev => ({
            ...prev,
            [`${parentId}-${childId}`]: !prev[`${parentId}-${childId}`],
        }));
    }
    const navbar = navLinks.map(link=>{
        const {name, subLinks, hasDropDown, icon, id, to, bigSubLink} = link
        return(
            <div className="relative first-dropdowns" key={id}>
                    <Link to={to} className="link" >
                        {icon && <FontAwesomeIcon icon={icon} className="icon" />} {name} {hasDropDown ? 
                            <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon"/> : ""}
                    </Link>
                {hasDropDown && !bigSubLink &&
                    <ul className="dropdowns" key={id + 1}>
                        {subLinks.map((subLink, index) =>{
                            return(
                                <li className="dropdown relative" key={index}>
                                    <Link className="link" to={subLink.directLink ? `${subLink.to}` : `${to}/${subLink.to}`}>{subLink.name} {subLink.hasDropDown ? 
                                    <FontAwesomeIcon icon={faCaretRight} className="dropdown-icon right-caret" /> : ""}</Link>
                                    {hasDropDown && subLink.subLinks2 && (
                                        <ul className="second-dropdowns">
                                            {subLink.subLinks2.map((subLink2, idx) => (
                                                    <Link to={`${to}/${subLink2.to}`} className="link" key={idx}>{subLink2.name}</Link>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                
                            )
                        })}
                    </ul>}
                {hasDropDown && bigSubLink &&
                    <ul className="big-dropdowns" key={id + 1}>
                        {subLinks.map((subLink, index) =>{
                            return(
                                <li className="big-dropdown relative" key={index}
                                    onClick={(event) => toggleBigSecondDropdown(index, event)}
                                >
                                    <Link className="link" to={subLink.to}>{subLink.name} {subLink.hasDropDown ? 
                                    <FontAwesomeIcon icon={faCaretDown} className= "big-dropdown-icon right-caret" /> : ""}</Link>
                                    {hasDropDown && subLink.subLinks2 && (
                                        <ul className="big-second-dropdowns"
                                            style={{
                                                display: clickedDropdown === index ? "flex" : "none"
                                            }}    
                                        >
                                            {subLink.subLinks2.map((subLink2, idx) => (
                                                    <Link to={`${to}/${subLink2.name}`} className="link" key={idx}>{subLink2.name}</Link>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                
                            )
                        })}
                    </ul>}
            </div>
        )
    });
    const hamburgerNav = navLinks.map(link => {
        const { name, subLinks = [], hasDropDown, icon, id, to } = link;  // Ensure subLinks is an array
        const isDropped = hasDropped.find(drop => drop.id === id)?.dropped;
    
        // Calculate margin based on child dropdowns safely
        const additionalMargin = subLinks.reduce((acc, subLink, index) => {
            const isChildDropped = childDropdown[`${id}-${index}`];
            return isChildDropped && subLink.subLinks2 
                ? acc + subLink.subLinks2.length * 31 + 10 
                : acc;
        }, 0);
    
        return (
            <div
                className="relative ham-first-dropdowns"
                key={id}
                style={{ marginBottom: isDropped ? `${subLinks.length * 42 + additionalMargin}px` : "0px" }}
            >
                <Link to={to} className="link flex-between">
                    <div>{icon && <FontAwesomeIcon icon={icon} className="icon" />} {name}</div>
                </Link>
                {hasDropDown && (
                    <FontAwesomeIcon
                        icon={isDropped ? faMinus : faPlus}
                        className="dropdown-icon"
                        onClick={() => toggleDropDown(id)}
                    />
                )}
    
                {hasDropDown && isDropped && (
                    <ul className="ham-dropdowns">
                        {subLinks.map((subLink, index) => {
                            const isChildDropped = childDropdown[`${id}-${index}`];
                            return (
                                <li
                                    className="dropdown relative"
                                    key={index}
                                    style={{
                                        marginBottom: isChildDropped && subLink.subLinks2
                                            ? `${subLink.subLinks2.length * 31 + 10}px`
                                            : "0px"
                                    }}
                                >
                                    <Link
                                        className="link flex-between"
                                        to={subLink.directLink ? `${subLink.to}` : `${to}/${subLink.to}`}
                                    >
                                        {subLink.name}
                                    </Link>
                                    {subLink.hasDropDown && (
                                            <FontAwesomeIcon
                                                icon={isChildDropped ? faMinus : faPlus}
                                                className="second-dropdown-icon"
                                                onClick={() => toggleChildDropdown(id, index)}
                                            />
                                        )}
    
                                    {subLink.hasDropDown && isChildDropped && subLink.subLinks2 && (
                                        <ul className="ham-second-dropdowns">
                                            {subLink.subLinks2.map((subLink2, idx) => (
                                                <Link
                                                    to={`${to}/${subLink2.name}`}
                                                    className="link"
                                                    key={idx}
                                                >
                                                    {subLink2.name}
                                                </Link>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        );
    });
    return(
        <>
            <div className={useLocation().pathname === "/" ? "ham-offset" : "off-set ham-offset"}></div>
            <div className="navbar">
                <ul className="nav-links" style={hasScrolled ? scrolledStyle : {}}>
                    <Link className="logo" to="/"><img src={Logo} alt="Lowell Student Association" /></Link>
                    {navbar}
                </ul>
            </div>
            
            <div className="hamburger-menu">
                <Link className="logo" to="/"><img src={Logo} alt="Lowell Student Association" /></Link>
                <FontAwesomeIcon icon={hamburger ? faXmark : faBars} className="hamburger-button"
                    onClick = {toggleHamburger}
                    style={{display: hamburger ? "none" : "block"}}
                />
            </div>
            <div className={hamburger ? "hamburger-nav left" : "hamburger-nav right"}>
                <FontAwesomeIcon icon={hamburger ? faXmark : faBars} className="hamburger-button2"
                    onClick = {toggleHamburger}
                />
                {hamburgerNav}    
            </div>
        </>
    )
}