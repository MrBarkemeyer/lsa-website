import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Home from "./pages/Home"
import Elections from "./pages/Elections"
import Navbar from './components/Navbar'
import Layout from "./pages/Layout"
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="Elections" element={<Elections />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
