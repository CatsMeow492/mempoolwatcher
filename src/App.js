import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import Header from './components/Header'
import Tracking from './components/Tracking'



function App() {
  return (
    <div className="App">
      <Router>
      <Header />
      <Tracking />
        <Routes>
          {/* <Route exact path='/' element={<Login />} />
          <Route exact path='/Home' element={<Home />} />
          <Route exact path='/Detail/:id' element={<Detail />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
