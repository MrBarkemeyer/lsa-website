import "./About.css"
import { useState } from "react"
import { GlowCapture, Glow } from "@codaworks/react-glow";
export default function Charter(){
    const [isCursive, setIsCursive] = useState(true);

    function toggleCursive(){
        setIsCursive(prevState => !prevState);
    }

    const charterParagraph = [
        {
            article: "Article I. Student Body Council",
            sections: [
                {
                title: "Section 1.",
                paragraph: "The student executive power of Lowell shall be vested in the Student Body Council (SBC). The SBC shall be charged with the general welfare of the student body. The SBC shall have the authority to pass regulations and laws pertaining to the student body so long as those laws are consistent with the spirit of this Charter, Lowell High School, the San Francisco Unified School District, and the California State Educational Code. The officers of the SBC shall be elected by the entire student body and shall hold office for a one-year term, which shall begin on the last day of the school year in which they were elected."
            },
              {
                title: "Section 2.",
                paragraph: "The Student Activities Director shall be a certified faculty member of Lowell High School and be appointed by the Principal. He is responsible for all student government sponsored activities. Without a Student Activities Director to sponsor student government, it shall cease to exercise powers stated within this Charter until a new Student Activities Director is appointed. When the Student Activities Director is unavailable for an extended period of time, as deemed by the Principal, or when he is no longer a faculty member, the Principal shall immediately appoint an interim replacement."
            },
              {
                title: "Section 3.",
                paragraph: "The SBC is composed of a President, a Vice President, an Elections Commissioner, a Secretary, a Treasurer, a Community Liaison, a Club Coordinator, an Events Coordinator, a Public Relations Officer, a Dance Coordinator, and a Co-Public Relations Officer.",
            },
              {
                title: "Subsection 1.",
                paragraph: "The SBC President is the chief executive officer of the student body. They shall supervise the organization of the SBC and oversee all LSA officers and activities. They must be a senior at the time they take office. The SBC President shall set an agenda for the SBC and LSA-wide meetings. They shall preside over SBC and LSA-wide meetings. They shall hold Presidents’ meetings with the Class Presidents at least once a month and invite the administration to Presidents’ meetings. They shall be the chief representative of the LSA and of the Lowell student body at large. They shall attend school and community events as a representative of the student body. They shall consult with faculty advisors when necessary. They shall work closely with administration and other faculty members as a representative of the student voice. They shall understand and  be familiar with this Charter.",
            },
            {
                title: "Subsection 2.",
                paragraph: " The SBC Vice President shall assist the SBC President with their duties. They shall be responsible for LSA board and Student Activities Director(s) evaluations each semester. They shall be responsible for organizing internal LSA events including the annual retreat. ",
            },
            {
                title: "Subsubsection 1.",
                paragraph: " In the event that the SBC President is removed from office or is incapable of fulfilling the duties of the office, with the advice of the Student Activities Director and majority consent of the members of the SBC, the SBC Vice President shall become the SBC President. The agreement of three-fourths of the officers of the SBC, along with the advice of the Student Activities Director, can reinstate the SBC President into their role. If the SBC President is  permanently incapacitated, the Vice President shall become the SBC President immediately. (In either such an event, the Vice President does not have to be a senior).",
            },    
            {
                title: "Subsection 3.",
                paragraph: "The SBC Elections Commissioner shall organize and preside over all student body elections. They are responsible for maintaining and enforcing the Elections Guidelines. The Elections Commissioner shall convene an Elections Committee to assist in the process of the elections when necessary. This committee shall consist only of seniors that have no clear, vested bias in the election as determined by the Elections Commissioner. With the help of the SBC Public Relations Officers and SBC Dance Coordinator, the Elections Commissioner shall oversee the freshman spirit committee for Spirit Week. The Elections Commissioner shall be a senior at the time they take office.",
            },
              {
                title: "Subsubsection 1.",
                paragraph: "Elections for student body and class offices shall be held in the spring. Elections for the new freshman class shall start within eight weeks after the start of the new school year, unless two-thirds of the LSA deem it is impossible. ",
            },
              {
                title: "Subsubsection 2.",
                paragraph: "In the absence of both the SBC President and Vice President, the Elections Commissioner shall assume the chief executive role of the SBC. ​",
            },
              {
                title: "Subsubsection 3.",
                paragraph: "The SBC position of Elections Commissioner shall be appointed through an interview process overseen by the sitting Elections Committee before each spring election. This process shall take place in its entirety before the deadline to submit a petition to run for a position in the general election.",
            },
              {
                title: "Paragraph 1. ",
                paragraph: "Students who apply but are not appointed to the position of Elections Commissioner shall still be eligible to run for a position in the general election.",
            },
              {
                title: "Subsection 4.",
                paragraph: "The SBC Secretary shall record the minutes of SBC meetings and LSA-wide meetings, which shall be made accessible to the student body. They shall maintain a record of minutes from each class board. They shall organize and maintain an LSA roster. The SBC Secretary shall carry on all correspondence of the LSA as a whole, maintain and regulate the student government board and government mailbox, and be responsible for the upkeep of student government equipment. ",
            },
              {
                title: "Subsection 5. ",
                paragraph: "The SBC Treasurer shall be responsible for all student body accounts through the school accountant. They shall create a yearly budget and give periodic updates on the student body budget to the SBC and Student Activities Director(s). They have the power, with the consent of the Student Activities Director, to authorize the deposit, withdrawal, and transfer of monetary funds. The Treasurer is responsible for enforcing the fiscal policies within this Charter. They shall be in charge of, but not liable for, fundraisers of all extracurricular organizations. They shall be presented a budget at their discretion for any or all student body organizations. ",
            },
              {
                title: "Subsection 6.",
                paragraph: "The SBC Community Liaison and SBC Co-Community Liaison shall be the official representatives of the Lowell Student Body at meetings regarding the students of Lowell High School where officers of the SBC are not present, such as School Site Council meetings, Parent Teacher Student Association executive meetings, and SFUSD Student Advisory Council meetings. They shall possess the power to vote on behalf of Lowell High School students in non-LSA events. They are responsible for reporting back to the LSA about the meetings as well as coordinating a Social Awareness Week.",
            },
              {
                title: "Subsubsection 1.",
                paragraph: "Social Awareness Week shall be an annual event at Lowell High School, which spotlights a societal issue and its possible solutions for the school community, with the main goal of spreading awareness, understanding, and empathy.",
            },
              {
                title: "Subsubsection 2.",
                paragraph: "The SBC shall include two Community Liaisons. One shall be democratically elected each spring election. The second shall be elected through an application process overseen by the SBC-elect.",
            },
              {
                title: "Paragraph 1.",
                paragraph: "The Community Liaison-elect, in conjunction with the SBC-elect shall produce an application open to all qualified Lowell students with appropriate guiding questions. The Community Liaison-elect and SBC President-elect shall schedule and record interviews and present the candidates to the Lowell Student Association-elect. Each member of the Lowell Student Association-elect as well as the Student Activities Director(s) shall receive one vote, cast anonymously. ",
            },
              {
                title: "Subsection 7.",
                paragraph: "The Club Coordinator shall be responsible for monitoring all school clubs, defined as organizations that partake in recreational activities and meet regularly. They shall be responsible for enforcing the rules of the Club Contract and with the consent of the SBC, will assign penalties to clubs that do not fulfill their duties and requirements. They shall approve service projects with all clubs and aid Lowell administrators in organizing school beautification days and Freshmen Orientation. They shall organize at least one function where all clubs are given the opportunity to advertise to the student  body at large. In conjunction with the Events Coordinator, they shall organize two Co-Curricular days per semester. They shall be responsible for the upkeep of the student activities calendar, the club bulletin board, and the maintenance of the Lowell Student Association Website.",
            },
              {
                title: "Subsection 8.",
                paragraph: "The Events Coordinator shall be responsible for coordinating functions involving the student body at large. He They shall organize one two school-wide rallies and other school-wide functions, including assemblies and a Talent Show, sponsored by the SBC to promote school spirit. They shall organize any inter-high-school social events with the help of the Dance Coordinator and Public Relations Officers and aid the Club Coordinator in planning Co-Curricular days and Freshmen Orientation.",
            },
              {
                title: "Subsection 9.",
                paragraph: "The SBC Public Relations Officer and SBC Co-PR shall advertise events sponsored by SBC through banners, posters, flyers, and other forms of media. They shall also be responsible for the upkeep and maintenance of art supplies that are necessary for the SBC advertisements. They shall regulate the posting of flyers or posters by extracurricular organizations. They shall aid the SBC Club Coordinator in the upkeep and maintenance of the Lowell Student Association Website. They shall aid the Elections Commissioner in overseeing the Freshmen Art Committee in the fall. They shall organize any inter-high-school social events with the help of the Dance Coordinator and Events Coordinator.",
            },
              {
                title: "Subsubsection 1.",
                paragraph: "SBC shall include two Public Relations officers. One shall be democratically elected through the spring election. The second shall be elected through an application process overseen by the SBC-elect.",
            },
              {
                title: "Paragraph 1.",
                paragraph: "The Public Relations officer-elect shall produce an application form open to all Lowell students with portfolio requirements and guiding questions. The Public Relations officer-elect shall schedule and record interviews and present the candidates and their work to the SBC-elect. The Public Relation officer-elect shall receive two votes and all other members of the SBC-elect shall receive one vote. The Public Relations officer-elect shall not cast their two votes for one single candidate.",
            },
              {
                title: "Subsection 10.",
                paragraph: "The Dance Coordinator shall organize all SBC sponsored dances including a Homecoming, Winterball, and the Last Dance. They shall be responsible for maintaining a record of dance resources for each SBC sponsored Lowell dance as well as handling all venue, chaperone, and guest contracts. They shall present to the SBC a  budget for each SBC sponsored dance in coordination with the SBC Treasurer. They shall communicate with administration and the Student Activities Director(s) regarding dances. They shall aid the Elections Commissioner in overseeing the Freshmen Dance Committee in the fall. They shall help coordinate any inter-high school social event with the help of the Events Coordinator and the SBC Public Relations Officer. They shall be a resource for any class boards and dance committees wishing to sponsor a dance such as the Junior and Seniors Proms, and the Junior Escape.",
            },
              {
                title: "Section 4.",
                paragraph: "The responsibilities of each student body officer stated within the Charter are distinguished from their internal duties. These duties are to be determined by each SBC board. ",
            },
              {
                title: "Section 5.",
                paragraph: "The SBC President and the SBC Treasurer, with the consent of the Student Activities Director, shall have the power to suspend any student organization's bank account when they deem it to be necessary. For suspensions in excess of 30 days, they must convene a meeting of the Lowell Student Association in order to gain approval from a majority of the members  present/of the Association.",
            },
              {
                title: "Section 6.",
                paragraph: "The SBC shall have the power to make regulations that are necessary and proper for carrying into execution the foregoing powers, and all other powers within this Charter, with the consultation of the entire LSA.",
            },
              {
                title: "Section 7.",
                paragraph: "SBC officers are not exempt from the rules of Lowell High School unless the school  principal deems it permissible. ",
            },
              {
                title: "",
                paragraph: "",
            },
              {
                title: "",
                paragraph: "",
            },
        ]
        },
        {
            article: "Artile II. Class Boards",
            sections: [{
                title: "Section 1.",
                paragraph: "There shall be a class board for each grade level. Each class board is composed of a President, a Vice President, a Secretary, a Treasurer, a Public Relations Officer, and a Historian. Each class officer shall be a member of and elected by their respective class, and shall hold office for a one-year term. The term of the freshman class officers shall begin when they are elected and will end at the end of the school year. ",
            },
              {
                title: "Section 2.",
                paragraph: "Each class board shall serve as representatives of their class’s best interests. The  board shall be responsible for a State-of-the-Class meeting, which will be open to all class members. The board shall be responsible for organizing fundraising activities, conducting class community service projects, carrying forth Student Activity Card sales, and leading Spirit Week, in sync cooperation with the Events Coordinator. The class boards shall also oversee and appoint members of their grade to serve on Junior Escape, Junior Prom, and Senior Prom Committees where a member of the board will serve as an ex-officio member of their committee in a capacity determined by the class board. The board shall present to SBC a calendar of proposed events, fundraising events, rosters of officers, and proposed semester budgets. The senior board shall make preparations for future class reunions.",
            },
              {
                title: "Subsection 1.",
                paragraph: "The Class President shall coordinate, delegate, and supervise all class activities and events. They shall present board projects and events during the LSA-wide meetings. They shall attend meetings with relevant administration on behalf of their  board and class. They shall preside over class board meetings, and be the official representative of their class unless otherwise delegated.",
            },
              {
                title: "Subsection 2.",
                paragraph: "The Class Vice-President shall represent the president when they are unable to preside and assist them with their duties. They shall communicate with external organizations for class events. They shall assist all other board members when necessary. They shall oversee and aid the class Dance Committees. ",
            },
              {
                title: "Subsection 3.",
                paragraph: "The Class Secretary shall record board meeting minutes, distribute a copy of the minutes to class sponsor(s) and the SBC Secretary for record keeping, and have minutes accessible to the class. They shall be responsible for the upkeep of the board locker as well as organizing the class binder. They shall also present an itemized list of  board materials when requested for by the Student Activities Director(s) or the SBC Secretary. ",
            },
              {
                title: "Subsection 4.",
                paragraph: "The Class Treasurer shall create and maintain a budget of the class account, and serve as the financial liaison for the class board. They shall present to the SBC Treasurer a plan for their budget once a year. They shall be responsible for completing and submitting fundraising request forms and grant applications.",
            },
              {
                title: "Subsection 5.",
                paragraph: "The Class Public Relations Officer shall be responsible for publicity for all class activities and events, such as notices for the student bulletin board, Radio Lowell, registry boxes, posters, and fliers for the hallways. They shall organize the sale of Class Apparel. They shall take inventory of, and purchase when necessary, art materials for their class. They shall oversee and aid the class Art Committees. ",
            },
              {
                title: "Subsection 6.",
                paragraph: "The Class Historian shall take pictures of all class events, submit pictures to the Yearbook Committee, and display pictures to members of the class via social media.",
            },
              {
                title: "Section 3.",
                paragraph: "Class boards may choose to assemble Class Registry Representatives, composed of two representatives selected by each individual class registry. In the event that this body is assembled, the Class Vice President shall preside over Class Registry Representative meetings and the Class Secretary is responsible for recording Class Registry Representative meeting minutes.",
            },
              {
                title: "Section 4.",
                paragraph: "The responsibilities of each class officer stated within the Charter are distinguished from their internal duties. These duties are to be determined by each class board.",
            },
              {
                title: "Section 5.",
                paragraph: "The class boards shall have the power to make regulations that are necessary and  proper to provide for their class, yet they must respect the needs and rights of other classes.",
            },
        ]
        },
        {
            article: "Article III. Association of Student Arbitration",
            sections:[{
                title: "Section 1.",
                paragraph: "The judicial power of the Lowell Student Body shall be vested in an Association of Student Arbitration (ASA). Members of the ASA may not simultaneously hold any student elected or appointed position within the school. The members of the ASA shall hold office until the completion of their senior year, and during good behavior. ",
            },
              {
                title: "Section 2.",
                paragraph: "The ASA shall have the power to interpret this charter when questions or conflict arise between the two or more class boards; -questions and conflict between SBC and any number of class boards; question or conflict between members of the Lowell student government and any level of student government. ",
            },
              {
                title: "Section 3.",
                paragraph: "The SBC President shall have the sole power to nominate candidates for the ASA. Members of the ASA are appointed with the consent of two-thirds of membership of the class  boards. The ASA shall not exceed more than five members.",
            },
        ]
        },
            {
            article: "Article IV. Lowell Student Association",
            sections:[{
                title: "Section 1.",
                paragraph: "The Student Body Council and the class boards shall be titled as the Lowell Student Association (LSA). The SBC President shall convene a meeting of the LSA at least once a month. President shall have no vote unless the LSA is equally divided. The Vice President has the authority to begin and end the meeting. ",
            },
              {
                title: "Section 2.",
                paragraph: "During a meeting of the LSA each class board shall have the right to discuss a brief state of the class. In addition, any class officer may introduce a proposal to SBC. The proposals must be submitted to the SBC Vice President one week prior to the meeting and they are given the authority to determine the order in which the proposals will be discussed. A majority vote by the members of the class boards is required for the proposal to be reviewed by SBC. SBC must submit a response to the class boards within seven school days from the meeting or else the  proposal becomes a requirement for SBC.",
            },
              {
                title: "Subsection 1.",
                paragraph: "Proposals are defined as any plan or suggestions put forth by any member of the LSA to be discussed and considered. Proposals are any and all recommendations and additions to the LSA, acted upon by the entire LSA.",
            },
              {
                title: "Section 3.",
                paragraph: "If matters of the LSA meeting are left unresolved, it is required that two-thirds of the LSA agree to continue the session to the next school day available.",
            },
        ]
        },
        {
            article: "Article V. Impeachment",
            sections: [{
                title: "Section 1.",
                paragraph: "Endangerment to the classes, the school, or the interpretation of the Charter is a crime worthy of impeachment. When this is in question, the student arbiters shall be given the sole  power to call for impeachment proceedings, which will be presided by the Director of Arbitration. The combination of all of SBC and LSA members must be present throughout the  proceedings. ",
            },
              {
                title: "Section 2.",
                paragraph: "Prior to the proceedings the defendant has the opportunity to resign from public office and if so no judgment shall be set forth.",
            },
              {
                title: "Section 3.",
                paragraph: "No person shall be convicted without the concurrence of two-thirds of the members  present. Judgment in cases of impeachment shall be restricted to the removal from office and the disqualification to hold any further office under Lowell Student Government.",
            },
              {
                title: "Section 4.",
                paragraph: "The Elections Commissioner shall maintain updated proceedings for all impeachments, which shall include the investigation process, trial process, and the rights of the accused. The Elections Commissioner in conjunction with SBC and the majority of the Class Presidents will create and maintain impeachment proceedings.",
            },
        ]
        },
        {
            article: "Article VI. Individual Liberties",
            sections: [{
                title: "Section 1.",
                paragraph: "The San Francisco Unified School District and the Lowell High School administration have domain over the LSA. The SBC guarantees the rights stated within the Charter, however, if the rights are in conflict with a higher authority there is no longer an assured  protection. ",
            },
              {
                title: "Section 2.",
                paragraph: "Lowell students have the freedom of opinion expressed through speech, attire, and  petition.",
            },
              {
                title: "Section 3.",
                paragraph: "Lowell students may find fault with student government and file suits through the ASA.",
            },
              {
                title: "Section 4.",
                paragraph: "Lowell students are guaranteed the right to vote for their student representatives without any monetary or grade requirements.",
            },
              {
                title: "Section 5.",
                paragraph: "Publications and announcements through institutionalized student media are protected from interference from student government.",
            },
              {
                title: "Section 6.",
                paragraph: "All Lowell clubs must be open to all members of the Lowell student body.",
            },
              {
                title: "Section 7.",
                paragraph: "Student organizations may impartially formulate committees that will assist in their duties.",
            },
        ]
        },
        {
            article: "Article VII. Fiscal Policies",
            sections: [{
                title: "Section 1.",
                paragraph: "Any fiscal policies and procedures not mentioned below are subject to district, local, state, and federal jurisdiction as interpreted by the Principal with advice from SBC. ",
            },
              {
                title: "Section 2.",
                paragraph: "Any extracurricular organization with an account with the School Accountant shall be under the jurisdiction of SBC and its policies. Each organization needs to confer its budget and fiscal plans with the SBC Treasurer or whomever they appoint. The SBC Treasurer, along with advice from SBC and the Student Activities Director, shall have a clear set of policies and  procedures regarding fiscal matters. ",
            },
              {
                title: "Section 3.",
                paragraph: "All fundraising by all organizations, whether extracurricular or not, must be reviewed and approved by the SBC Treasurer. Any organization that fundraises without consent of SBC is subject to punishment by withholding profits or freezing accounts.",
            },
              {
                title: "Section 4.",
                paragraph: "The SBC has domain over the Student Body Council account and allocates its funds wherever and whenever necessary. Requests for funds from the aforementioned account shall be  presented to the SBC Treasurer along with necessary documents. ",
            },
              {
                title: "Subsection 1.",
                paragraph: "Any Lowell student organization in good standing with the SBC in need of financial aid shall have the opportunity to request funding from the SBC account through a written proposal submitted to the SBC Treasurer. ",
            },
              {
                title: "Subsection 2.",
                paragraph: "All requests for funding must be written with the interests of all Lowell students and to the benefit of the Lowell community. If possible, requests for funding must be submitted with a list of previous transactions detailing the past two years' monetary deposits and expenditures of the organization.",
            },
              {
                title: "Subsection 3.",
                paragraph: "Requests shall be subject to a vote by the SBC. Approved requests shall receive an affirmative majority. Requests approved by the SBC shall be announced to the entire LSA. Members of LSA who take issue with the approved request shall be able to request an all-LSA vote, requiring a majority to pass. The request shall be approved or denied within 10 school days after it is submitted. Within 60 days of the disbursement of funds, the organization shall submit an itemized list to the SBC detailing the usages of the funds allocated. All unused funds must be reimbursed to the Student Body Council account.",
            },
              {
                title: "Subsection 4.",
                paragraph: "All decisions are final and no requests may be resubmitted.",
            },
              {
                title: "Section 5.",
                paragraph: "The SBC Treasurer, by default, is the treasurer of any account without one already  predetermined. The Principal or Student Activities Director, by default, is the sponsor of any account without one already predetermined. ",
            },
              {
                title: "Section 6.",
                paragraph: "All interest from accounts with the School Accountant shall be installed into the Student Body Council account on the first day of the new fiscal year.",
            },
              {
                title: "Section 7.",
                paragraph: "All balances remaining from graduating senior classes shall be transferred to the Student Body Council account on the first day of the new fiscal year, unless specifically allocated in writing and submitted to the SBC Treasurer before this date. All debts from graduating senior classes shall be assumed by the Student Body Council account.",
            },
              {
                title: "Section 8.",
                paragraph: "During the spring semester, the senior class board shall submit monthly fiscal reports and budget proposals to the SBC Treasurer, SBC President, and the Student Activities Director for advice and review.",
            },
              {
                title: "Section 9.",
                paragraph: "Funds cannot be withdrawn from any account without the authorization of the School Accountant, the organization's sponsor, and respective treasurer. Transfers are authorized by the School Accountant, the giving organization's sponsor, and its treasurer.",
            },
              {
                title: "Section 10.",
                paragraph: "The SBC Treasurer, whenever they deem necessary, shall obtain a list of transactions from any organization specified in Section 2 for review by SBC. The SBC Treasurer, whenever they deem necessary, shall obtain a general ledger report for analysis by SBC.",
            },
            ]
        },

        {
            article: "Article VIII. Amendments",
            sections: [{
                title: "Section 1.",
                paragraph: "Whenever two-thirds of the entire student government determine it necessary, shall  propose amendments to the Charter. ",
            },
              {
                title: "",
                paragraph: "",
            },
        ]
        },
        {
            article: "Article IX. Ratification",
            sections: [{
                title: "Section 1.",
                paragraph: "The ratification of three-fourths of the student body that votes shall be sufficient for the establishment of this Charter for Lowell student body.",
            },
        ]
        },
    ]
    const constitution = charterParagraph.map((p, index) => {
        return (
          <GlowCapture>
            <Glow color="red">
          <div className="constitution glowable-text" key={index}>
            <h2 style={{ fontFamily: isCursive ? 'Cedarville Cursive' : 'Open Sans' }}>
              {p.article}
            </h2>
            {p.sections.map((section, idx) => (
              <p key={idx} style={{ fontFamily: isCursive ? "'Cedarville Cursive', 'cursive" : 'Open Sans, serif' }}>
                <strong style={{ fontFamily: isCursive ? 'Cedarville Cursive' : 'Open Sans' }}>{section.title}</strong> {section.paragraph}
              </p>
            ))}
          </div>
          </Glow>
          </GlowCapture>
        );
      });

    return(
        <>
            <div className="title">
                <h1>Charter of the Lowell Student Association</h1>
            </div>

            <div className="charter">
                    <p className="charter-intro">
                        We, the students of Lowell High School, in order to maintain the Lowell community, to acknowledge and foster the diversity of needs, views, and rights of students at Lowell to express opinions and interests to the community on relevant issues regarding student life, to promote the educational welfare, and to enhance all benefits offered by the school and the San Francisco Unified School District, do hereby establish and ordain this Charter of the Lowell High School Student Association.*
                    </p>
                <p>
                    *All pronouns “they” shall refer to all genders here forward in this Charter.
                </p>
                <div className="font-button flex-center">
                    <button onClick={toggleCursive}>
                        Can't Read Cursive?
                    </button>
                </div>
                {constitution}
            </div>
        </>
    )
}