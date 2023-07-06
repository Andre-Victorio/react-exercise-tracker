import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackerPage from "./pages/TrackerPage"
function App(){
  return(
  <>
      <div>
        <a href="/tracker">Tracker Application</a>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/tracker" element={<TrackerPage/>}/>
        </Routes>
      </BrowserRouter>
  </>
  )
}

export default App;
