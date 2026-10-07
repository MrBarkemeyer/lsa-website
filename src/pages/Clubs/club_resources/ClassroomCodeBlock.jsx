import { useState } from "react";
import PropTypes from "prop-types";

export default function ClassroomCodeBlock({ code }) {
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
    <section className="detail-block">
      <h2 className="detail-block__heading">
        2026-27 Activities Google Classroom
      </h2>
      <p className="detail-text">
        Announcements, co-curricular sign-ups, and important forms. Join the
        Classroom to submit documents and get updates.
      </p>
      <div className="detail-code">
        <div className="detail-code__row">
          <span className="detail-code__value">{code}</span>
          <button
            type="button"
            className={`detail-code__copy${copied ? " detail-code__copy--done" : ""}`}
            onClick={copyJoinCode}
          >
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
      </div>
    </section>
  );
}

ClassroomCodeBlock.propTypes = {
  code: PropTypes.string.isRequired,
};
