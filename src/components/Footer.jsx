import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

const LINKS = [
  {
    href: "https://www.instagram.com/lowellhs/",
    label: "Instagram",
    icon: faInstagram,
  },
  {
    href: "https://www.facebook.com/groups/2204571332/",
    label: "Facebook",
    icon: faFacebook,
  },
  {
    href: "https://github.com/MrBarkemeyer/lsa-website",
    label: "GitHub",
    icon: faGithub,
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__name">Lowell Student Association</p>
        <p className="site-footer__place">Lowell High School</p>
        <div className="site-footer__links">
          {LINKS.map(({ href, label, icon }) => (
            <a key={label} href={href} aria-label={label}>
              <FontAwesomeIcon icon={icon} className="footer-icon" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
