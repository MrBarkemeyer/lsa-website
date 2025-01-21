import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"
export default function Footer(){
    //Footer
    return(
        <>
            <footer className="flex-center">
                <div>
                    <Link to='https://www.instagram.com/lowellhs/'><FontAwesomeIcon icon={faInstagram} className="footer-icon"/></Link>
                    <Link to='https://www.facebook.com/groups/2204571332/'><FontAwesomeIcon icon={faFacebook} className="footer-icon"/></Link>
                    <Link to="https://github.com/Sheng232/lsa-website"><FontAwesomeIcon icon={faGithub} className="footer-icon"/></Link>
                </div>
            </footer>
        </>
    )
}