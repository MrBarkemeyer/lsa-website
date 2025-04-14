import { useState, useEffect } from 'react'
import './App.scss'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from "./pages/Home"
import Elections from "./pages/Elections"
import Layout from "./pages/Layout"
import Club from "./pages/Clubs/Club"
import TitleIX from './pages/Resources/TitleIX'
import FreshMenCorner from './pages/More/FreshmenCorner'
import Charter from './pages/About/Charter'
import ClubResources from './pages/Clubs/ClubResources'
import Wellness from './pages/Resources/Wellness'
import Clubs from './pages/Clubs/Clubs'
import AboutLSA from './pages/About/AboutLSA'
import Organization from './pages/Organizations/Organizations'
import ScrollToTop from "./components/ScrollToTop";
import SBC from './pages/About/SBC'
import DSA from './pages/About/DSA'
import ClassBoard from "./pages/About/ClassBoard"
import Site from './pages/More/Site'
import Committees from './pages/About/Committees'
import SpiritCommittee from './pages/About/SpiritCommittee'
import Committee from './pages/About/Committee'
import NewClub from './pages/Clubs/club_resources/NewClub'
import EventPlanning from './pages/Clubs/club_resources/EventPlanning'
import Fundraising from './pages/Clubs/club_resources/Fundraising'
import MockTrial from './pages/Organizations/MockTrial'
import ShieldAndScroll from './pages/Organizations/ShieldAndScroll'
import Archives from './pages/More/Archives'
import Forensic from './pages/Organizations/Forensic'
import Cardinalympics from './pages/Cardinalympics'

//note to self - at the end of all this, create a jsx file with all the array
//to be changed every year 

function App() {
    //General data for the website
    const KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
    const SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
    const SHEET_NAME = "Website Info"
    const SHEET_NAME2 = "Officers"
    const [clubData, setClubData] = useState([]);
    const [officerData, setOfficerData] = useState([]);

    //Cardinalympics data
    const SPREADSHEET_ID2 = "1YoyeAEx3rFD2ctbrz3R0a0todgsNes76r_JH6MkYUO4";
    const SHEET_NAME3 = "Sp, 25";
    const [cardinalympicsData, setCardinalympicsData] = useState([0, 0, 0, 0]);

    //Elections data
    const SHEET_NAME4 = "Elections";
    const [electionData, setElectionData] = useState([]);

    //API Calls
    useEffect(() => {
      async function fetchData() {
          try {
              // Fetch the first data
              const url1 = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${KEY}`;
              const res1 = await fetch(url1);
              const data1 = await res1.json();
              setClubData(processSheetData(data1.values));
  
              // Fetch the second data
              const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME2}?key=${KEY}`;
              const res2 = await fetch(url2);
              const data2 = await res2.json();
              setOfficerData(processSheetData(data2.values));
          } catch (error) {
              console.log(error);
          }
      }
      fetchData();
  }, []);

    useEffect(()=>{
      async function fetchElectionData() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME4}?key=${KEY}`;
            const res = await fetch(url);
            const electionData = await res.json();
            setElectionData(processSheetData(electionData.values));
        } catch (error) {
            console.log(error);
        }
    }
      fetchElectionData();
    },[])


    useEffect(()=>{
      async function fetchCardinalympicsData() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID2}/values/${SHEET_NAME3}?key=${KEY}`;
            const res = await fetch(url);
            const data = await res.json();
            setCardinalympicsData(arrayCleanUp(data.values[0]));
        } catch (error) {
            console.log(error);
        }
    }
      fetchCardinalympicsData();
    },[]);


    function arrayCleanUp(array) {
      const cleanedArray = [];
      for (let i = 0; i < array.length; i++) {
        if (array[i] !== "" && !isNaN(parseInt(array[i]))) {
          cleanedArray.push(parseInt(array[i])); 
        }
      }
      return cleanedArray;
    }

    function processSheetData(data) {
        if (!data || data.length === 0) return [];
    
        const headers = data[0]; 
        const rows = data.slice(1);
    
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || "";
            });
            return obj;
        });
    }

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout clubData = {clubData} />}>
            <Route path="/" element={<Home cardinalympicsData={cardinalympicsData}/>} />
            <Route path="Elections" element={<Elections electionData={electionData}/>} />
            
            <Route path="LSA" element={<Outlet />}>
              <Route index element={<AboutLSA/>} />
              <Route path="SBC" element={<SBC officerData={officerData}/>} />
              <Route path=":BoardName" element={<ClassBoard officerData={officerData}/>} />
              <Route path="DSA" element={<DSA />} />
              <Route path="Charter" element={<Charter />}/>
              <Route path="Commitees" element={<Committees />} />
              <Route path="Spirit Committee" element={<SpiritCommittee />} />
              <Route path=":CommitteeName" element={<Committee/>} />
              
            </Route>

            <Route path="Organizations" element = {<Outlet />}>
              <Route index element={<Organization />} />
              <Route path="MockTrial" element={<MockTrial />} />
              <Route path="ShieldAndScroll" element={<ShieldAndScroll />} />
              <Route path="Forensic" element={<Forensic />} />
            </Route>

            <Route path="Clubs" element={<Outlet />}>
              <Route index element={<Clubs clubData={clubData}/>} />
              <Route path="ClubResources" element={<ClubResources />} />
              <Route path=":ClubName" element={<Club clubData={clubData}/>}/>
              <Route path="NewClub" element={<NewClub />} />
              <Route path="EventPlanning" element={<EventPlanning />} />
              <Route path="Fundraising" element={<Fundraising />} />
            </Route>

            <Route element={<Outlet />}>
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element = {<TitleIX />} />
            </Route>
            
            <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
            <Route path="AboutSite" element={<Site />} />
            <Route path="Archives" element={<Archives />} />
            <Route path="Cardinalympics" element={<Cardinalympics cardinalympicsData={cardinalympicsData}/>} />  
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
