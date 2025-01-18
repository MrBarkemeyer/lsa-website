import { useParams } from "react-router-dom"

export default function Committee(){
    const params = useParams().CommitteeName;
    console.log(params);
    return(
        <>
            <div className="title">
                <h1>{params}</h1>
            </div>
        </>
    )
}