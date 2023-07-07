import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackerPage from "./pages/TrackerPage"
import Header from "./components/Header"
function App(){
  return(
  <>
      <Header/>
      <BrowserRouter>
        <Routes>
          <Route index element={<TrackerPage/>}/>
          <Route path="/tracker" element={<TrackerPage/>}/>
        </Routes>
      </BrowserRouter>
  </>
  )
}

export default App;
