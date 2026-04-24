import { Link } from "react-router-dom";
import { GlowCapture, Glow } from "@codaworks/react-glow";
import PropTypes from "prop-types";
import style from "./components.module.scss";

export default function LinkButton({ to, children, noTarget, ...rest }) {
  return (
    <GlowCapture>
      <Glow>
        <Link
          to={to}
          className={style.linkButton}
          target={noTarget ? undefined : "_blank"}
          {...rest}
        >
          {children}
        </Link>
      </Glow>
    </GlowCapture>
  );
}

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  noTarget: PropTypes.bool,
};
