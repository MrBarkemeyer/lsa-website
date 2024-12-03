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
            id: 1,
        },
        {
            name: "ELECTIONS",
            hasDropDown: false,
            icon: faCheckToSlot,
            id: 2,
        },
        {
            name: "ABOUT LSA",
            hasDropDown: true,
            icon: faBook,
            subLinks: {},
            id: 3,
        },
        {
            name: "ORGANIZATIONS",
            hasDropDown: true,
            icon: faUser,
            subLinks: {},
            id: 4,
        },
        {
            name: "CLUBS AND SPORTS",
            hasDropDown: true,
            icon: faUsers,
            subLinks: {

            },
            id: 5,
        },
        {
            name: "RESOURCES",
            hasDropDown: true,
            icon: faThumbTack,
            subLinks: {},
            id: 6,
        },
        {
            name: "MORE",
            hasDropDown: true,
            icon: faThumbsUp,
            subLinks: {},
            id: 7,
        }
    ]
    const navBar = navLinks.map(link=>{
        const {name, subLinks, hasDropDown, icon, id} = link
        return(
            <div key={id}>
                <Link className="link" >
                    {icon && <FontAwesomeIcon icon={icon} className="icon" />} {name} {hasDropDown ? 
                        <FontAwesomeIcon icon={faCaretDown} className="drop-down"/> : ""}
                </Link>
            </div>
        )
    })
    return(
        <>
            <Link className="logo" to="/"><img src={Logo} alt="Lowell Student Association" /></Link>
            <div className="nav-links">
                {navBar}
            </div>
        </>
    )
}