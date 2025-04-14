export default function Elections({electionData}){

//Old Code - Not used anymore
    const electionResults = [
        {
            board: "LSA 2028 Board",
            color: "green",
            president: "Dylan Mac",
            vicePresident: "Trish Tran",
            secretary: "Isabella Rabe",
            treasurer: "Mauricio Becerra",
            publicRelations: "Nhalan Vo",
            historian: "Chelsea Ly"
        },
    ];
    const displayElectionResults = electionResults.map((element, index)=>{
        const {board, color, president, vicePresident, secretary, treasurer, publicRelations, historian} = element
        return(
            <div key={index}>
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
            </div>
        )
    })


//New Code Starts Here
    // Function to extract the file ID from a Google Drive URL
    function extractFileId(url) {
        const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }


    const displayElectionCandidates = (() => {
        const groupedData = electionData.reduce((acc, curr) => {
            const board = curr.Board;
            const grade = curr.Grade;
            const position = curr.Position;
    
            // Key for organizing: e.g. "LSA 2028" or "SBC"
            const boardKey = board === 'LSA' ? `${board} ${grade}` : 'SBC';
    
            if (!acc[boardKey]) acc[boardKey] = {};
            if (!acc[boardKey][position]) acc[boardKey][position] = [];
    
            acc[boardKey][position].push(curr);
            return acc;
        }, {});
    
        const POSITIONS = [
            "President",
            "Vice President",
            "Secretary",
            "Treasurer",
            "Public Relations",
            "Historian"
        ];
    
        return Object.entries(groupedData).map(([sectionTitle, positions]) => (
            <div className="elections" key={sectionTitle}>
                <h2 className="election-title">
                    {sectionTitle} Elections
                </h2>
    
                {POSITIONS.map(position => (
                    <div key={position}>
                        <h3 className="center election-title flex-center">{position}</h3>
    
                        {positions[position]?.map(candidate => (
                            <div className="candidate" key={candidate.Name}>
                                <h3>{candidate.Name}</h3>
                                <p>{candidate.WrittenPetition}</p>
                                {candidate.MediaPetition && <img className="candidate-media-petition"src={`https://drive.google.com/thumbnail?id=${extractFileId(candidate.MediaPetition)}`} alt={`${candidate.Name}`}/>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        ));
    })();

//New Code Starts Here


    return(
        <>
            <div className="title">
                <h1>
                    Spring '25 <br />
                    Lowell Elections
                </h1>
            </div>
            <section className="info-page">
                {displayElectionCandidates}
            </section>
            
        </>
    )
}