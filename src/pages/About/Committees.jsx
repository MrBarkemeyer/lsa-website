import { Link } from "react-router-dom"
import { GlowCapture, Glow } from "@codaworks/react-glow";
export default function Committees(){

    const committees = [
        {
            name: "Prom Committee",
            to: "PromCommittee",
        },
        {
            name: "Escape/Boat Committee",
            to: "Escape/BoatCommittee",
        },
        {
            name: "2024 Senior Prom",
            to: "2024 Senior Prom Committee",
        },
        {
            name: "2024 Senior Boat",
            to: "2024 Senior Boat Committee",
        },
        {
            name: "2025 Junior Prom",
            to: "2025 Junior Prom Committee",
        },
        {
            name: "2025 Junior Escape",
            to: "2024 Junior Escape Committee"
        }
    ];
    const displayCommitteeButtons = committees.map((committee, index)=>{
        return(
            <Link className="committee-button link-button" to={`/LSA/${committee.to}`} key={index}>
                {committee.name}
            </Link>
        )
    })

    return(
        <>
            <GlowCapture>
                <Glow >
                    <div className="title">
                        <h1>Lowell Committees</h1>
                    </div>
                    <section className="committees">
                        <p className="commiteees-description">
                            Lowell Committees are all put together by each class board. Each committee has a different job/goal. Spirit committee only comes around once a year, and participation time lasts approximately two months. Their main job is to take care of spirit week activities, such as organizing the dance, hallway art, and the spirit banner. Dance committees such as prom and escape are handpicked by the board members themselves. Their job is to organize those specific dances, plan everything from the theme to the food laid out on the table. They must fund raise money in order to pay for these dances as well. Participation in the committees lasts for about a year and a half. 
                        </p>
                        <p>
                            For more committee specific information, please refer to the committee links below. Committees in bold are planning events hosted in the current school year.
                        </p>
                        <div className="committee-buttons">
                            {displayCommitteeButtons}
                        </div>
                        <p className="committee-description">
                            In addition to the several event planning committees, the Spirit Committees are put together by each class board. The committees meets everyday after school for about 6 weeks. Their goal is to decorate the hallway with the best posters, choreograph the best dance, and pick those ready to compete in rally games.
                        </p>
                        <Link to="/LSA/Spirit Committees" className="committee-button link-button">Spirit Committee</Link>
                    </section>
                </Glow>
            </GlowCapture>
        </>
    )
}