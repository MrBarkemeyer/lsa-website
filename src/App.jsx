import { useState, useEffect } from 'react'
import './App.css'
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


function App() {
  const KEY = "AIzaSyAgshc5Aqd8B149h5RpsenMh_SQAeb4AXc";
    const SPREADSHEET_ID = "1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4";
     const SHEET_NAME = "Form Responses 1"

    const [clubData, setClubData] = useState([]);
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
    }, [])

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
      <BrowserRouter>
        <Routes>
          <Route element={<Layout clubData = {clubData} />}>
            <Route path="/" element={<Home />} />
            <Route path="Elections" element={<Elections />} />
            <Route path="Club" element={<Outlet />}>
              <Route path="ClubResources" element={<ClubResources />} />
              <Route path=":ClubName" element={<Club clubData={clubData}/>}/>
            </Route>
            <Route path="Resources" element={<Outlet />}>
              <Route path="Wellness" element={<Wellness />} />
              <Route path="TitleIX" element = {<TitleIX />} />
            </Route>
              <Route path="FreshmenCorner" element= {<FreshMenCorner />} />
              <Route path="LSA" element={<Outlet />}>
                <Route path="Charter" element={<Charter />}/>
              </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
