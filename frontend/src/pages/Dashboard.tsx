import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaStethoscope, 
  FaBook, 
  FaInfoCircle, 
  FaBars, 
  FaWallet 
} from 'react-icons/fa';
import { getAuth, User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './Dashboard.css';
import KnowledgeHub from './KnowledgeHub';
import MyAccount from './MyAccount';
import MyCalendar from './MyCalendar';
import Financials from './Financials';
import VeterinaryServices from './VeterinaryServices';
import AboutUs from './AboutUs';

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('myAccount');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('User');
  const [dailyQuote, setDailyQuote] = useState<string>('');

  const farmQuotes: string[] = [
    "The dairy farmer has to be an optimist—or they wouldn’t still be milking! — Will Rogers",

    "Farming looks mighty easy when your plow is a pencil and you're a thousand miles from the pasture. — Dwight D. Eisenhower",

    "Dairy farming is our wisest pursuit because it will, in the end, contribute most to real cheese, good butter, and happiness. — Thomas Jefferson"
,
    "The ultimate goal of dairy farming is not just the making of milk, but the cultivation and perfection of bovine bliss — Masanobu Fukuoka",

    "To be a successful dairy farmer, one must first know the nature of the cow. — Xenophon",

    "There are no dairy farming problems—only udder design challenges. — Bill Mollison",

    "The dairy cow is the foster mother of the human race—pass the cheese, please! — W.D. Hoard",

    "Good dairy farmers, who take seriously their duties as stewards of their herds… deserve our respect and a tall glass of milk. — Pope Francis",

    "Dairy farming is a profession of hope—and a lot of early mornings. — Brett L. Markham",

    "Take care of the cows, and the cows will take care of you — Old Farmer’s Proverb",
  ];

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user: User | null = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserName(userDoc.data().name || "User");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const setRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * farmQuotes.length);
      setDailyQuote(farmQuotes[randomIndex]);
    };

    fetchUserName();
    setRandomQuote();

    const quoteInterval = setInterval(setRandomQuote, 86400000); // Change quote daily
    return () => clearInterval(quoteInterval);
  }, [auth, db]);

  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderSection = () => {
    switch (activeSection) {
      case 'myCalendar':
        return <MyCalendar />;
      case 'Financials':
        return <Financials />;
      case 'veterinary':
        return <VeterinaryServices />;
      case 'knowledgeHub':
        return <KnowledgeHub />;
      case 'AboutUs':
        return <AboutUs />;
      default:
        return <MyAccount />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo">
          <img src="/src/assets/logo.jpg" alt="Farm Logo" className="logo-image" />
         
        </div>
        <div className="daily-quote">
          {dailyQuote}
        </div>
        <div className="user-greeting">
          <span>Welcome, </span>
          <strong>{userName}</strong>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-layout">
        {/* Sidebar Navigation */}
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="hamburger" onClick={handleToggleSidebar}>
            <FaBars />
          </div>
          
          <nav>
            <div 
              className={`nav-item ${activeSection === 'myAccount' ? 'active' : ''}`} 
              onClick={() => setActiveSection('myAccount')}
            >
              <FaUser />
              {isSidebarOpen && <span>My Account</span>}
            </div>
            
            <div 
              className={`nav-item ${activeSection === 'Financials' ? 'active' : ''}`} 
              onClick={() => setActiveSection('Financials')}
            >
              <FaWallet />
              {isSidebarOpen && <span>Financials</span>}
            </div>
            
            <div 
              className={`nav-item ${activeSection === 'myCalendar' ? 'active' : ''}`} 
              onClick={() => setActiveSection('myCalendar')}
            >
              <FaCalendarAlt />
              {isSidebarOpen && <span>Calendar</span>}
            </div>
            
            <div 
              className={`nav-item ${activeSection === 'veterinary' ? 'active' : ''}`} 
              onClick={() => setActiveSection('veterinary')}
            >
              <FaStethoscope />
              {isSidebarOpen && <span>Veterinary</span>}
            </div>
            
            <div 
              className={`nav-item ${activeSection === 'knowledgeHub' ? 'active' : ''}`} 
              onClick={() => setActiveSection('knowledgeHub')}
            >
              <FaBook />
              {isSidebarOpen && <span>Cattle Knowledge</span>}
            </div>
            
            <div 
              className={`nav-item ${activeSection === 'AboutUs' ? 'active' : ''}`} 
              onClick={() => setActiveSection('AboutUs')}
            >
              <FaInfoCircle />
              {isSidebarOpen && <span>About Us</span>}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <main className="main-content">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;