import LinkButton from "../../../components/LinkButton";

export default function NewClub() {
    return (
        <>  
            <div className="title">
                <h1>How to Start a Club</h1>
            </div>

            <section className="info-page">
                <LinkButton to="/Clubs/ClubResources" noTarget={true}>
                    {"< back to club resources"}
                </LinkButton>

                <p>
                    Resources to get you started on how to plan an event for your club!
                    Club events are DIFFERENT from fundraisers! If you are looking to
                    plan a fundraiser, visit the fundraising resources page!
                </p>

                <p>
                    KEEP IN MIND that there are only resources that are listed here. If
                    you are looking for more information, join the 2025–2026 Activities
                    Google Classroom (knmn6yuw).
                </p>

                <h2>Main Contact: Enkhiinkhuslen Tegshjargal (SBC Club Coordinator)</h2>
                <p>Email: lowellclubcoord25@gmail.com</p>

                <h2>Step 1: Join the 2025–2026 Activities Google Classroom</h2>
                <p>Join Code: knmn6yuw</p>
                <p>
                    Here you can find updates and announcements for clubs, such as
                    sign-ups for co-curricular events, or important forms to fill out!
                    Keep in mind that although the materials can be found here, you must
                    join the Google Classroom to submit docs and receive important
                    updates.
                </p>

                <h2>Step 2: Complete the Necessary Forms</h2>
                <p>
                    Before you can start meetings, you must fill out a couple of forms
                    and get them approved by the SBC Club Coordinator. All of these MUST
                    be filled out by the deadline. All forms should preferably be signed
                    digitally. Please email lowellclubcoord25@gmail.com with any
                    questions.
                </p>

                <div className="club-buttons">
                    <LinkButton 
                        to="https://docs.google.com/document/d/1C2tdUqwsz1S0V9ZbfCRr1k_uonUBG-SceAxFLxdT48o/edit?tab=t.0" 
                        target="_blank"
                    >
                        Petition for New Club
                    </LinkButton>
                    <LinkButton 
                        to="https://docs.google.com/forms/d/e/1FAIpQLSelC6x-lAH0ZDVCV6rgW3kPS3rtA2EY3Ovt1ymoaQirc82ojg/viewform?usp=send_form" 
                        target="_blank"
                    >
                        Club Registration Form
                    </LinkButton>
                    <LinkButton 
                        to="https://docs.google.com/document/d/1Ma-iRM0Ekb_u6JsmHUrumZdr3akvoKn254Tq3bPK03A/edit?tab=t.0" 
                        target="_blank"
                    >
                        Club Contract
                    </LinkButton>
                    <LinkButton 
                        to="https://docs.google.com/document/d/1e-gC-V2FurpMbVvCAsreaLbWMTrX41U6O7_tsdczjoE/edit?tab=t.0" 
                        target="_blank"
                    >
                        Club Policies
                    </LinkButton>
                    <LinkButton 
                        to="https://docs.google.com/spreadsheets/d/1rA3dCsXYGsM59IIUCbi6FT1KawqKG4EuvjWyYuJhk-c/edit?authuser=0&usp=classroom_web" 
                        target="_blank"
                    >
                        Club Budget Sheet
                    </LinkButton>
                </div>

                <h2>Step 3: Create a Club Bulletin Board</h2>
                <p>
                    Once you get an EMAIL saying you are CONFIRMED with all your
                    submitted forms, you will be sent a spreadsheet with your bulletin
                    board assignment. Check the spreadsheet, decorate your bulletin
                    board, then submit the form below.
                </p>

                <h2>What are your next steps?</h2>
                <p>
                    Get your club started by promoting it, and deciding when your club
                    will be meeting!
                </p>
                </div>
            </section>
        </>
    );
}
