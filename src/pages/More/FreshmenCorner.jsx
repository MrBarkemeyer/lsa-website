import LinkButton from "../../components/LinkButton";
import "../Resources/Resources.scss";

export default function FreshMenCorner() {
  const cardButtonStyle = {
    width: "100%",
    maxWidth: "100%",
    fontSize: "1.05rem",
  };

  return (
    <div className="resource-page">
      <header className="resource-hero freshmen-corner-hero">
        <div className="title">
          <h1>Freshmen Corner</h1>
          <p>Quick links and tools to help new Lowell students get started.</p>
        </div>
      </header>
      <div className="resource-content">
        <div className="freshmen-corner">
          <div className="freshmen-corner__card">
            <p className="freshmen-corner__eyebrow">Get Oriented</p>
            <h3 className="freshmen-corner__title">Virtual tour of Lowell</h3>
            <p className="freshmen-corner__description">
              Explore key campus spaces, important offices, and first-week tips.
            </p>
            <LinkButton
              to="https://docs.google.com/document/d/1UVpp4I76UDjqJkYXNb01JueIAPk6tvpNC2a5KZwHOU0/edit?tab=t.0"
              style={cardButtonStyle}
            >
              Open tour
            </LinkButton>
          </div>
          <div className="freshmen-corner__card">
            <p className="freshmen-corner__eyebrow">Important Document</p>
            <h3 className="freshmen-corner__title">Master registry list</h3>
            <p className="freshmen-corner__description">
              Review the master list for clubs, resources, and class information.
            </p>
            <LinkButton
              to="/Registry"
              noTarget={true}
              style={cardButtonStyle}
            >
              View registry
            </LinkButton>
          </div>
          <div className="freshmen-corner__card">
            <p className="freshmen-corner__eyebrow">Stay Updated</p>
            <h3 className="freshmen-corner__title">Class Instagram</h3>
            <p className="freshmen-corner__description">
              Follow announcements, reminders, and class spirit updates.
            </p>
            <LinkButton
              to="https://www.instagram.com/lowell2027board"
              style={cardButtonStyle}
            >
              @lowell2027board
            </LinkButton>
          </div>
          <div className="freshmen-corner__card">
            <p className="freshmen-corner__eyebrow">Get Involved</p>
            <h3 className="freshmen-corner__title">Class board candidates</h3>
            <p className="freshmen-corner__description">
              Learn about current elections and see who is running.
            </p>
            <LinkButton to="/Elections" noTarget style={cardButtonStyle}>
              View elections
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
