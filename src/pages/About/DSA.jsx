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
                    <h2>JACOB BARKEMEYER</h2>
                </div>
                <p>APUSH & Leadership Teacher, Director of Student Activities</p>
            </section>
        </>
    )
}