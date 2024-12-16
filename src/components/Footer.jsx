import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"
export default function Footer(){
    return(
        <>
            <footer className="flex-center">
                <div>
                    <Link><FontAwesomeIcon icon={faInstagram} className="footer-icon"/></Link>
                    <Link><FontAwesomeIcon icon={faFacebook} className="footer-icon"/></Link>
                    <Link><FontAwesomeIcon icon={faGithub} className="footer-icon"/></Link>
                </div>
            </footer>
        </>
    )
}