import { useParams } from "react-router-dom"

export default function Committee(){
    const params = useParams().CommitteeName;

    return(
        <>
            <div className="title">
                <h1>{params}</h1>
            </div>
            <section className="center">
                <h2>Coming soon</h2>
            </section>
        </>
    )
}