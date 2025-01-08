import Sheng from "../../assets/Sheng.jpg"
import "../More/More.scss"
export default function Site(){
    return(
        <>
            <div className="title">
                    <h1>About This Website</h1>
                </div>
            <section className="site flex-center">
                <img src={Sheng} className="sheng"/>
                <p className="sheng-description">Hello Lowellites, My name is Sheng Jian and I am the
                    the creator of this site! I enjoy spending my days building
                    interactive softwares through the powers of front-end technology. If
                    you are looking for a collaborator, feel free to reach out. 
                </p>
                <p className="sheng-description">Check out my Github Projects: <a href="https://github.com/Sheng232">Click Here</a></p>
                <p className="sheng-description">P.S. I built this project as my T.A. works for Mr. Barkemeyer. If you have experience with React.js and want to contribute, check out the source code.</p>
                <p>Link to the Source Code: <a href="https://github.com/Sheng232/lsa-website">Click Here</a></p>
            </section>
        </>
    )
}