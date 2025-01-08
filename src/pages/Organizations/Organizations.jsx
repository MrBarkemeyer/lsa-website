import { Link } from "react-router-dom";
import "./Organizations.scss"
export default function Organization(){
    const organizations = [
        {
            name: "The Lowell (Journalism)",
            description: "The Lowell is the official student-run news publication for Lowell High School, and has been publishing content for the student body for over a century. Join now and learn from established student journalists about writing news, managing business, designing pages, and more.",
            link: "https://thelowell.org/",
        },
        {
            name: "Shield and Scroll",
            description: "Shield and Scroll — Lowell’s second oldest organization — is an organization dedicated to helping Lowell run as effectively and efficiently as possible. We are an honor and service society with a goal to serve the students and faculty of Lowell with service, scholarship, and citizenship.",
            link: "SAS",
        },
        {
            name: "CSF Tutoring",
            description: "Lowell CSF is the 273rd Chapter of the California Scholarship Federation, a statewide honor society which encourages 'scholarship through service.' At Lowell, it has been a tradition of CSF to provide a tutoring service to the school and parts of the local community.",
            link: "https://lowellcsf.weebly.com/",
        },
        {
            name: "Peer Resources",
            description: "The Peer Mentoring Program's goal is to help the freshmen smoothly transition to Lowell through the guidance from our peer mentors. In addition to providing each freshman a mentor, we provide Professional Developments and participate in school-wide events like Wellness Week.",
            link: "https://lhspeermentoring.weebly.com/",
        },
        {
            name: "Mock Trial",
            description: "The Lowell Mock Trial team is a program dedicated to fostering a better understanding of the law and the the systems that work within the US government. The Mock trial program not only helps students learn more about the law, but also helps team members develop the critical public speaking skills they will need to succeed later in life.",
            link: "MockTrial",
        },
        {
            name: "Forensic Society (Speech & Debate)",
            description: "The Lowell Forensic Society, founded in 1892, is the oldest high school speech and debate team in the United States. The society's home base is in Room 135 — the 'Leland Room,' named after Deputy Under Treasury Secretary Marc Leland.",
            link: "Forensic",
        },
        {
            name: "Lowell Science Research Program (LSRP)",
            description: "The UCSF-Lowell Science Research Program is a collaborative effort between Lowell High School and the University of California, San Francisco with a mission to introduce students to the world of science, teach them laboratory techniques, and inspire a passion for research and discovery.",
            link: "https://sites.google.com/view/lowellscienceresearch/home",
        },
        {
            name: "Student Advisory Council",
            description: "The SAC is a citywide, youth-led organization that is committed to providing a voice for the students of the San Francisco Unified School District (SFUSD) by representing and presenting the interests of the students to the administrative and policy making bodies of the SFUSD.",
            link: "SAC",
        },
    ];
    const displayOrg = organizations.map((organization, index)=>{
        return(
            <div className="organization" key={index}>
                <h2>{organization.name}</h2>
                <p>{organization.description}</p>
                <Link to={organization.link}>Learn more about {organization.name} →</Link>
            </div>
        )
    })
    return(
        <>
            <div className="title">
                <h1>Organizations at Lowell</h1>
            </div>
            <div className="organizations">
                {displayOrg}
            </div>
        </>
    )
}