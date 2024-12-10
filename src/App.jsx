import { useState, useEffect } from 'react'
import './App.css'
import { HashRouter as Router, BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
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


function App() {
  const KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
    const SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
     const SHEET_NAME = "Form Responses 1"
     const SHEET_NAME2 = "Officers"
    const [clubData, setClubData] = useState([]);
    const [officerData, setOfficerData] = useState([]);

    useEffect(()=>{
        async function fetchData(){
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}?key=${KEY}`;
            try{
                const res = await fetch(url);
                const data = await res.json();
                setClubData(processSheetData(data.values));
            }
            catch(error){
                console.log(error);
            }
        }
        fetchData();
    }, []);

    useEffect(()=>{
      async function fetchData(){
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME2}?key=${KEY}`;
          try{
              const res = await fetch(url);
              const data = await res.json();
              setOfficerData(processSheetData(data.values));
          }
          catch(error){
              console.log(error);
          }
      }
      fetchData();
  }, []);




    function processSheetData(data) {
        if (!data || data.length === 0) return [];
    
        const headers = data[0]; // First row as headers
        const rows = data.slice(1); // Rest as data rows
    
        return rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || ""; // Safeguard against undefined values
            });
            return obj;
        });
    }
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout clubData = {clubData} />}>
            <Route path="/" element={<Home />} />
            <Route path="Elections" element={<Elections />} />
            
            <Route path="LSA" element={<Outlet />}>
              <Route index element={<AboutLSA/>} />
              <Route path="SBC" element={<SBC officerData={officerData}/>} />
            </Route>

            <Route path="Organizations" element = {<Outlet />}>
              <Route index element={<Organization />} />
            </Route>

            <Route path="Clubs" element={<Outlet />}>
              <Route index element={<Clubs clubData={clubData}/>} />
              <Route path="ClubResources" element={<ClubResources />} />
              <Route path=":ClubName" element={<Club clubData={clubData}/>}/>
            </Route>

            <Route element={<Outlet />}>
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element = {<TitleIX />} />
            </Route>

              <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
              <Route path="LSA" element={<Outlet />}>
                <Route path="Charter" element={<Charter />}/>
              </Route>
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
