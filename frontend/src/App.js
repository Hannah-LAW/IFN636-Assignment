import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import MatchSuggestions from './pages/MatchSuggestion';
import AdminVerification from './pages/AdminPanel';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/matches" element={<MatchSuggestions />} />
        <Route path="/admin-verification" element={<AdminVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
