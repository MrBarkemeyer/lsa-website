import Barkemeyer from "../../assets/Barkemeyer.jpg"

export default function DSA(){
    return(
        <>
            <div className="title">
                <h1>Directors of Student Activities</h1>
            </div>
            <section className="dsa center">
                <div>
                    <img src={Barkemeyer} alt="Mr. Barkemeyer" className="dsa-image"/>
                    <p>JACOB BARKEMEYER</p>
                </div>
                <p>That one APUSH Teacher</p>
            </section>
        </>
    )
}