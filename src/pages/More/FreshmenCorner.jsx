import { Link } from "react-router-dom"
import { GlowCapture, Glow } from "@codaworks/react-glow"
import LinkButton from '../../components/LinkButton'
import style from "./More.module.scss"
export default function FreshMenCorner(){
    return(
        <>
                    <div className="title">
                        <h1>Welcome, Class of 2027!</h1>
                    </div>
                    <div className={style.freshmenResources}>
                        <div className="resource">
                            <h3>Virtual Tour of Lowell</h3>
                            <LinkButton to="https://docs.google.com/document/d/1UVpp4I76UDjqJkYXNb01JueIAPk6tvpNC2a5KZwHOU0/edit?tab=t.0">Click Here</LinkButton>
                        </div>
                        <div className="resource">
                            <h3>Master Registry List</h3>
                            <LinkButton to={"https://docs.google.com/spreadsheets/d/1A-_2bJtMrByR2uPgT4uAyXeEx3Q6IYwWzZ-YuWLg65U/edit?gid=225032051#gid=225032051"}>View Here</LinkButton>
                        </div>
                        <div className="resource">
                            <h3>Follow your Class Instagram</h3>
                            <LinkButton to="https://www.instagram.com/lowell2027board">@lowell2027board</LinkButton>
                        </div>
                        <div className="resource">
                            <h3>Meet your 2028 Class Board Candidates!</h3>
                            <LinkButton to="/Elections">Click Here</LinkButton>
                        </div>
                    </div>
        </>
    )
}