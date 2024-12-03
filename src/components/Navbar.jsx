import Logo from "../assets/LSA-Logo.png"
import {NavLink, Link} from "react-router-dom"
export default function Navbar(){
    const navLinks = [
        {
            name: "HOME",
        },
        {
            name: "ELECTIONS"
        },
        {
            name: "ABOUT LSA",
            subLinks: {
                
            }
        },
        {
            name: "ORGANIZATIONS",
            subLinks: {

            }
        },
        {
            name: "CLUBS AND SPORTS",
            subLinks: {

            }
        },
        {
            name: "RESOURCES",
            subLinks: {

            }
        },
        {
            name: "MORE...",
            subLinks: {

            }
        }
    ]
    const navBar = navLinks.map(link=>{
        const {name, subLinks} = link
        return(
            <>
                <Link>
                    
                </Link>
            </>
        )
    })
    return(
        <>
            <nav className="navbar">
                <Link><img src={Logo} alt="Lowell Student Association" className="logo"/></Link>
                <div className="nav-buttons">

                </div>
            </nav>

        </> 
    )
}