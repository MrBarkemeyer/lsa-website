import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Clubs(props){
    const clubData = props.clubData;
    const [searchParams, setSearchParams] = useSearchParams();
    const [filterState, setFilterState] = useState(false);
    const [visibleClubs, setVisibleClubs] = useState(9);

    function loadMore(){
        setVisibleClubs((prev) => prev + 9);
      };
    function setFilter(){
        setFilterState(true);
    }
    function clearFilter(){
        setFilterState(false);
    }
    const categoryFilter = searchParams.get("category");


    const displayClubs = clubData.slice(0, visibleClubs).map((club, index)=>{
        const {Name, Category} = club;
        const clubColor = {
            color: "white",
            background: 
            Category === "Sports" ? "red" :
            Category === "VPA" ? "purple" :
            Category === "Volunteering and Public Service" ? "green" :
            Category === "Culture/Religion" ? "orange" :
            Category === "Finance" ? "gold" :
            Category === "Food/Crafts" ? "brown" :
            Category === "Games and Fantasy" ? "darkblue" :
            Category === "Literature and Media" ? "teal" :
            Category === "Politics and Public Speaking" ? "lightcoral" :
            Category === "Visual and Performing Arts Club" ? "magenta" :
            Category === "Health and Environmental" ? "forestgreen" :
            Category === "STEM" ? "#861212" :
            "gray",
        }
        return(
                categoryFilter === Category ? <Link className="clubs" key={index} to={Name}>
                    <div className="club">
                        <img src={`https://picsum.photos/200/200?random=${Math.floor(Math.random()*1000)}`} alt="" />
                        <p className="club-name">{Name}</p>
                        <p style={clubColor} className="club-category">{Category}</p>
                    </div>
                </Link> : !categoryFilter ? <Link className="clubs" key={index} to={Name}>
                    <div className="club">
                        <img src={`https://picsum.photos/200/200?random=${Math.floor(Math.random()*1000)}`} alt="" />
                        <p className="club-name">{Name}</p>
                        <p style={clubColor} className="club-category">{Category}</p>
                    </div>
                </Link> : ""
        )
    });

    const displayFilteredClubs = clubData.map((club, index)=>{
        const {Name, Category} = club;
        const clubColor = {
            color: "white",
            background: 
            Category === "Sports" ? "red" :
            Category === "VPA" ? "purple" :
            Category === "Volunteering and Public Service" ? "green" :
            Category === "Culture/Religion" ? "orange" :
            Category === "Finance" ? "gold" :
            Category === "Food/Crafts" ? "brown" :
            Category === "Games and Fantasy" ? "darkblue" :
            Category === "Literature and Media" ? "teal" :
            Category === "Politics and Public Speaking" ? "lightcoral" :
            Category === "Visual and Performing Arts Club" ? "magenta" :
            Category === "Health and Environmental" ? "forestgreen" :
            Category === "STEM" ? "#861212" :
            "gray",
        }
        return(
                categoryFilter === Category ? <Link className="clubs" key={index} to={Name}>
                    <div className="club">
                        <img src={`https://picsum.photos/200/200?random=${Math.floor(Math.random()*1000)}`} alt="" />
                        <p className="club-name">{Name}</p>
                        <p style={clubColor} className="club-category">{Category}</p>
                    </div>
                </Link> : ""
        )
    });
    


    function getUniqueCategories(clubs) {
        return clubs
          .map(club => club.Category)
          .filter((Category, index, self) => self.indexOf(Category) === index);
      }

    const filterButton = getUniqueCategories(clubData).map((category,index)=>{
        const clubColor = {
            color: "white",
            backgroundColor: 
            category === "Sports" ? "red" :
            category === "VPA" ? "purple" :
            category === "Volunteering and Public Service" ? "green" :
            category === "Culture/Religion" ? "orange" :
            category === "Finance" ? "gold" :
            category === "Food/Crafts" ? "brown" :
            category === "Games and Fantasy" ? "darkblue" :
            category === "Literature and Media" ? "teal" :
            category === "Politics and Public Speaking" ? "lightcoral" :
            category === "Visual and Performing Arts Club" ? "magenta" :
            category === "Health and Environmental" ? "forestgreen" :
            category === "STEM" ? "#861212" :
            "gray",
        }
        return(

            <div key={index}>
                        <button style={filterState && categoryFilter === category ? clubColor : {}} 
                            onClick={()=>{
                                setSearchParams({category: `${category}`})
                                setFilter();
                            }}
                            >{category}
                        </button>
            </div>
        )
    });

    return(
        <>
            <div className="title">
                <h1>
                    All Registered Clubs and Sports
                </h1>
            </div>
            <div className="club-filters">
                <div className="filter-button">
                    {filterButton}
                    <button className="clear-button relative"
                        onClick={
                            () => {
                                setSearchParams({})
                                clearFilter();
                        }
                            
                        }
                    >Clear filter</button>
                </div>
            </div>
                <div className="clubs">
                    {filterState ? displayFilteredClubs : displayClubs}
                </div>
                <div className="flex-center margin-1rem">
                    {!filterState && visibleClubs < clubData.length ? <button className="load-button" onClick={loadMore}>Load More Clubs</button> : ""}
                </div>

        </>
    )
}