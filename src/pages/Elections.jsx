export default function Elections(){
    const electionResults = [
        {
            board: "LSA 2028 Board",
            color: "green",
            president: "Dylan Mac",
            vicePresident: "Trish Tran",
            secretary: "Isabella Rabe",
            treasurer: "Mauricio",
            publicRelations: "Nhalan Vo",
            historian: "Chelsea Ly"
        }
    ];
    const displayElectionResults = electionResults.map(element=>{
        const {board, color, president, vicePresident, secretary, treasurer, publicRelations, historian} = element
        return(
            <>
                <div className="election-outer-container">
                    <div className="election-inner-container">
                        <h3 style={{color: color}}>{board}</h3>
                        <p><span className="bold">President: </span>{president}</p>
                        <p><span className="bold">Vice President: </span>{vicePresident}</p>
                        <p><span className="bold">Secretary: </span>{secretary}</p>
                        <p><span className="bold">Treasurer: </span>{treasurer}</p>
                        <p><span className="bold">Public Relations: </span>{publicRelations}</p>
                        <p><span className="bold">Historian: </span>{historian}</p>
                    </div>
                </div>
            </>
        )
    })
    return(
        <>
            <div className="election-title flex-center">
                <h1>
                    Fall '24 <br />
                    Lowell Elections
                </h1>
            </div>
            <div className="election-results">
                <h2 className="center freshmen-election-title flex-center">
                    Fall 2024 <br />
                    Freshmen Election Results
                </h2>
                {displayElectionResults}
            </div>
            
        </>
    )
}