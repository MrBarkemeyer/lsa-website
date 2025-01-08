import {Link} from "react-router-dom";
import {GlowCapture, Glow} from "@codaworks/react-glow";
import style from "./components.module.scss";

export default function Linkbutton({to , children, noTarget, ...rest}){
    return(
       <GlowCapture>
        <Glow>
            <Link to={to} className={style.linkButton} target={noTarget ? "" : "_blank" }>
                {children}
            </Link>
        </Glow>
       </GlowCapture>
    )
}