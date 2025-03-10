import LandingPage from './LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainContextProvider } from './context/MainContext';
import Starter from './Starter';
import Results from './Results';
import Projects  from './Projects';
import ProfileManager from './Profile';
import AboutPage from './About';
import NotFound from './NotFound';

function App() {
  return (
    <MainContextProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/starter' element={<Starter/>} />
          <Route path='/results' element={<Results/>} />
          <Route path='/:name/projects' element={<Projects/>} />
          <Route path='/profile' element={<ProfileManager />} />
          <Route path='/About' element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
     </MainContextProvider>
  );
}

export default App
