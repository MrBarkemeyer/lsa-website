import PropTypes from "prop-types";
import style from "./components.module.scss";

export default function CardinalympicLogo({ variant = "default" }) {
  if (variant === "homeBackdrop") {
    return (
      <div className={style.logoContainerHome}>
        <div className={style.topLeftLogo} />
        <div className={style.topMiddleLogo} />
        <div className={style.topRightLogo} />
        <div className={style.bottomLeftLogo} />
        <div className={style.bottomRightLogo} />
      </div>
    );
  }

  return (
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
  );
}

CardinalympicLogo.propTypes = {
  variant: PropTypes.oneOf(["default", "homeBackdrop"]),
};