import { useState } from "react";
import PropTypes from "prop-types";

export default function ClassroomCodeBlock({ code, classNamePrefix = "club-guide-page" }) {
  const [copied, setCopied] = useState(false);

  async function copyJoinCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={`${classNamePrefix}__code-block`}>
      <p className={`${classNamePrefix}__code-label`}>
        2025–26 Activities Google Classroom
      </p>
      <div className={`${classNamePrefix}__code-row`}>
        <span className={`${classNamePrefix}__code`}>{code}</span>
        <button
          type="button"
          className={`${classNamePrefix}__copy${copied ? ` ${classNamePrefix}__copy--done` : ""}`}
          onClick={copyJoinCode}
        >
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
    </div>
  );
}

ClassroomCodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
  classNamePrefix: PropTypes.string,
};
