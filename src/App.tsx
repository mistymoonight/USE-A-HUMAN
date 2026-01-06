import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Preface from './pages/Preface';
import TimeManagement from './pages/TimeManagement';
import UnlockBehavior from './pages/UnlockBehavior';
import ThumbPilgrimage from './pages/ThumbPilgrimage';
import BedtimeRituals from './pages/BedtimeRituals';
import Ending from './pages/Ending';

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Preface />} />
        <Route path="/time-management" element={<TimeManagement />} />
        <Route path="/unlock-behavior" element={<UnlockBehavior />} />
        <Route path="/thumb-pilgrimage" element={<ThumbPilgrimage />} />
        <Route path="/bedtime-rituals" element={<BedtimeRituals />} />
        <Route path="/ending" element={<Ending />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
