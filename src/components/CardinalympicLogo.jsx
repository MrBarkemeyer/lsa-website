import style from "./components.module.scss";

export default function CardinalympicLogo(){
    return(
        <>
           <div className={style.logoContainer}>
                <div className={style.upperRings}>
                    <div className={style.topLeftLogo}></div>
                    <div className={style.topMiddleLogo}></div>
                    <div className={style.topRightLogo}></div>
                </div>
                <div className={style.lowerRings}>
                    <div className={style.bottomLeftLogo}></div>
                    <div className={style.bottomRightLogo}></div>
                </div>
            </div>
        </>
    )
}