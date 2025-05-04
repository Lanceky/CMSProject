import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import KnowledgeHub from './pages/KnowledgeHub'; 
import MyAccount from './pages/MyAccount';
import MyCalendar from './pages/MyCalendar';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/knowledgehub' element={<KnowledgeHub />} />  {/* Added KnowledgeHub route */}
        <Route path='/MyAccount' element={<MyAccount />} />
        <Route path='/MyCalendar' element={<MyCalendar />} />
      </Routes>
    </Router>
  );
};

export default App;
