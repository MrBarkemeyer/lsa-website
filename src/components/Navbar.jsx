import {Link} from "react-router-dom"
import Logo from "../assets/LSA-Logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faHouse, faCheckToSlot, faBook, faUser, faUsers, faThumbTack, faThumbsUp, faCaretRight} from "@fortawesome/free-solid-svg-icons"
export default function Navbar(props){
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
            name: "ELECTIONS",
            hasDropDown: false,
            icon: faCheckToSlot,
            to: "/Elections",
            id: 2,
        },
        {
            name: "ABOUT LSA",
            hasDropDown: true,
            icon: faBook,
            subLinks: [
                {
                    name: "2024-25 Student Body Council",
                },
                {
                    name: "2025 Senior Board",
                },
                {
                    name: "2026 Junior Board",
                },
                {
                    name: "2027 Sophomore Board"
                },
                {
                    name: "Committees",
                    hasDropDown: true,
                },
                {
                    name: "Charter of the LSA"
                },
                {
                    name: "Director of Student Activities"   
                }
            ],
            to: "/About",
            id: 3,
        },
        {
            name: "ORGANIZATIONS",
            hasDropDown: true,
            icon: faUser,
            subLinks: [
                {
                    name: "The Lowell (Journalism)",
                },
                {
                    name: "VIDEO LOWELL",
                },
                {
                    name: "CSF Tutoring",
                },
                {
                    name: "JROTC",
                },
                {
                    name: "Peer Resources",
                },
                {
                    name: "Mock Trial",
                },
                {
                    name: "Forensic Society (Speech & Debate)",
                },
                {
                    name: "Science Research Program"
                },
                {
                    name: "CardinalBotics",
                },
                {
                    name: "Shield and Scroll",
                },
                {
                    name: "Song",
                },
                {
                    name: "Student Advisory Council",
                }

            ],
            to: "/Organizations",
            id: 4,
        },
        {
            name: "CLUBS AND SPORTS",
            hasDropDown: true,
            icon: faUsers,
            subLinks: [
                {
                    name: "Club Resources",
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
            name: "RESOURCES",
            hasDropDown: true,
            icon: faThumbTack,
            subLinks: [
                {
                    name: "Lowell Wellness Center",
                },
                {
                    name: "Title IX Support"
                },
            ],
            to: "/Resources",
            id: 6,
        },
        {
            name: "MORE",
            hasDropDown: true,
            icon: faThumbsUp,
            subLinks: [
                {
                    name: "Archives",
                },
                {
                    name: "Freshmen Corner",
                },
                {
                    name: "@lowellhs Instagram Feed",
                },
                {
                    name: "Search",
                },
            ],
            to: "",
            id: 7,
        }
    ]
    const navBar = navLinks.map(link=>{
        const {name, subLinks, hasDropDown, icon, id, to} = link
        return(
            <div className="relative first-dropdowns" key={id}>
                <li>
                    <Link to={to} className="link white" >
                        {icon && <FontAwesomeIcon icon={icon} className="icon" />} {name} {hasDropDown ? 
                            <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon"/> : ""}
                    </Link>
                </li>
                {hasDropDown && 
                    <ul className="dropdowns" key={id + 1}>
                        {subLinks.map((subLink, index) =>{
                            return(
                                <li className="dropdown relative" key={index}>
                                    <Link className="link">{subLink.name} {subLink.hasDropDown ? 
                                    <FontAwesomeIcon icon={faCaretRight} className="dropdown-icon right-caret" /> : ""}</Link>
                                    {hasDropDown && subLink.subLinks2 && (
                                        <ul className="second-dropdowns">
                                            {subLink.subLinks2.map((subLink2, idx) => (
                                                    <Link to={subLink2.name} className="link" key={idx}>{subLink2.name}</Link>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                
                            )
                        })}
                    </ul>}
            </div>
        )
    })
    return(
        <div className="navbar">
            <Link className="logo" to="/"><img src={Logo} alt="Lowell Student Association" /></Link>
            <ul className="nav-links">
                {navBar}
            </ul>
        </div>
    )
}