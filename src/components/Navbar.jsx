import {Link} from "react-router-dom"
import Logo from "../assets/LSA-Logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCaretDown, faHouse, faCheckToSlot, faBook, faUser, faUsers, faThumbTack, faThumbsUp} from "@fortawesome/free-solid-svg-icons"
export default function Navbar(){
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
                    name: "Committees"
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
                    name: "The Lowell (Journalism)"
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
                    name: "Sports",
                },
                {
                    name: "Club Resources",
                },
                {
                    name: "Academic Competition Clubs",
                },
                {
                    name: "Culture and Religion Clubs",
                },
                {
                    name: "Entrepreneurship & Finance Clubs",
                },
                {
                    name: "Food and Crafts Clubs",
                },
                {
                    name: "Game and Fantasy Clubs",
                },
                {
                    name: "Health and Environment Clubs"
                },
                {
                    name: "Literature and Media Clubs",
                },
                {
                    name: "Politics and Public Speaking Clubs",
                },
                {
                    name: "STEM Clubs",
                },
                {
                    name: "Visual and Performing Arts Club",
                },
                {
                    name: "Volunteer and Public Service Clubs"
                },
                {
                    name: "Health and Environment Clubs",
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
                                <li className="dropdown" key={index}>
                                    <Link className="link">{subLink.name}</Link>
                                </li>
                            )
                        })}
                    </ul>}
            </div>
        )
    })
    return(
        <div className="">
            <Link className="logo" to="/"><img src={Logo} alt="Lowell Student Association" /></Link>
            <ul className="nav-links">
                {navBar}
            </ul>
        </div>
    )
}