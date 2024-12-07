import { GlowCapture, Glow } from "@codaworks/react-glow";

export default function TitleIX(){
    return(
        <>
            <div className="title">
                <h1>Title IX Support</h1>
            </div>
            <div className="title-ix">
                <h3>What is Title IX</h3>
                <p>Title IX of the Education Amendments of 1972 prohibits sex discrimination in education, including K-12 schools.
                    Title IX is a federal law that has been used to promote equity in education by ensuring that girls 
                    and women receive equal resources and treatment in the classroom and provides protections for students
                    who are sexually harassed and discriminated against and/or bullied based on their gender.
                </p>
                <p>In addition to this federal law, the California Education code similarly prohibits schools discriminating
                     against its students on the basis of sex (Education Codes 220-221.1).
                </p>
                <p>Sexual harassment is also in violation of San Francisco Unified School District Board and Administrative
                policies. These policies extend to the San Francisco County Office of Education, including community
                school programs and activities. All forms of sexual harassment, whether student to student, staff to student,
                 or student to staff, are unlawful at SFUSD schools.</p>
                <GlowCapture><Glow><a className="link-button flex-center" target="_blank" href="https://www.sfusd.edu/know-your-rights/sexual-harassment-and-sex-discrimination-title-ix">Click Here for more</a></Glow></GlowCapture>
                <p>Resources from the 
                    <a target="_blank" href="https://www.sfusd.edu/departments/office-equity" className="black-underline"> Office of Equity</a>
                    <span>
                        <li>1. <a href="https://drive.google.com/file/d/1Lb_elI3OHaRCE6htqcGOWVIkzjNiL8b8/view" className="black-underline">Investigation Overview</a></li>
                        <li>2. <a href="https://drive.google.com/file/d/1zcOlCWZxyqmgbFQ9JcD5jO2pnyxAFvXU/view" className="black-underline">Student & Family FAQ </a></li>
                    </span>
                </p>
                <p> <a href="https://www.sfusd.edu/know-your-rights/sexual-harassment-and-sex-discrimination-title-ix">San Francisco Unified School District (SFUSD)</a>
                    <span>
                        <li>1. <a href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view" className="black-underline">Title IX Complaint Form</a></li>
                        <li>2. <span>Office of Equity</span></li>
                            <li className="ml-16">Phone: 415-355-7334</li>
                            <li className="ml-16">Email: equity@sfusd.edu</li>
                    </span>

                </p>
                <p> <a href="https://www.sanfranciscopolice.org/get-service/sexual-assault">San Francisco Police Department (SFPD)</a>
                    <span>
                        <li>1. <a href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view" className="black-underline">Title IX Complaint Form</a></li>
                        <li>2. <span>Special Victims Unit</span></li>
                            <li className="ml-16">Phone: 415-553-1361</li>
                            <li className="ml-16">Email: sfpd.sexcrimes@sfgov.org</li>
                    </span>

                </p>
                <p> <a href="https://sfwar.org/programs-services/advocacy-counseling/">San Francisco Women Against Rape (SFWAR)</a>
                    <span>
                        <li>2. <span>Advocacy & Counseling Program</span></li>
                            <li className="ml-16">Phone: 415-861-2024</li>
                            <li className="ml-16">Email: dac@sfwar.org</li>
                    </span>
                </p>
                <p>Title IX Coordinators: Ms. Liverpool (liverpoolk@sfusd.edu), Ms. Fong (fongc3@sfusd.edu)</p>
                <a href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view">SFUSD Title IX Complaint Form <br />
                   → https://tinyurl.com/titleixformalcomplaint
                </a>
                <a href="https://drive.google.com/file/d/1mLVM9x8aYIftEUHCQ_blYr6_djKaN5FE/view">Lowell Incident Report Form<br />
                   → https://tinyurl.com/lhsincidentreport
                </a>
            </div>
        </>
    )
}