import { useState, useEffect } from "react";
import { Lock, Info, CornerDownRight } from "lucide-react";
import BambooPattern from "./components/Bamboo";
import TrophyWatermark from "./components/TrophyWatermark";
import { AttForm } from "./components/AttForm";
// Load Google Font
const loadFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

function App() {
  const [currPage, setCurrPage] = useState("Attendance");
  const [showInfo, setShowInfo] = useState(false);
  const [attendedTeam, setAttendedTeam] = useState(null);
  const [isAlreadyMarked, setIsAlreadyMarked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    loadFont();
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFEEA] relative py-8 px-4 flex flex-col justify-center items-center overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <BambooPattern />
      
      {/* Page Toggle */}
      <div className="relative flex gap-2 mx-auto w-fit p-1 rounded-xl bg-[#930000]/10 backdrop-blur-sm font-bold tracking-wide text-lg mb-8 border-2 border-[#930000]/20 z-10">
        <button
          onClick={() => { 
            setCurrPage("Attendance"); 
            setAttendedTeam(null); 
            setIsAlreadyMarked(false);
          }}
          disabled={currPage !== "Attendance"}
          className={`py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 ${
            currPage === "Attendance" 
              ? "bg-[#930000] text-[#FEFEEA] shadow-lg" 
              : "text-[#930000] cursor-not-allowed opacity-50"
          }`}
        >
          Attendance
          {currPage !== "Attendance" && <Lock className="text-sm w-4 h-4" />}
        </button>
        <button
          onClick={() => { 
            setCurrPage("Certificate"); 
            setAttendedTeam(null); 
            setIsAlreadyMarked(false);
          }}
          disabled={currPage !== "Certificate"}
          className={`py-2 px-6 rounded-lg flex items-center gap-2 transition-all duration-300 ${
            currPage === "Certificate" 
              ? "bg-[#930000] text-[#FEFEEA] shadow-lg" 
              : "text-[#930000] cursor-not-allowed opacity-50"
          }`}
        >
          Certificate
          {currPage !== "Certificate" && <Lock className="text-sm w-4 h-4" />}
        </button>
      </div>

      {/* Main Content Card - Scroll Style */}
      <div className="relative w-full max-w-2xl flex flex-col gap-6 justify-center items-center mx-auto rounded-2xl p-8 md:p-12 text-center shadow-2xl z-10 overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, #FFF9E6 0%, #FFEFD5 100%)',
             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
           }}>
        
        {/* Trophy and 2025 Watermark */}
        <TrophyWatermark />
        
        {/* Chinese Corner Decorations */}
        {/* <div className="absolute top-2 left-2 w-12 h-12 opacity-30">
          <svg viewBox="0 0 50 50">
            <path d="M5 5 L15 5 L15 15 M35 5 L45 5 L45 15 M5 35 L5 45 L15 45 M35 45 L45 45 L45 35" stroke="#930000" strokeWidth="3" fill="none"/>
            <circle cx="25" cy="25" r="8" fill="#930000" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute top-2 right-2 w-12 h-12 opacity-30">
          <svg viewBox="0 0 50 50">
            <path d="M5 5 L15 5 L15 15 M35 5 L45 5 L45 15 M5 35 L5 45 L15 45 M35 45 L45 45 L45 35" stroke="#930000" strokeWidth="3" fill="none"/>
            <circle cx="25" cy="25" r="8" fill="#930000" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 w-12 h-12 opacity-30">
          <svg viewBox="0 0 50 50">
            <path d="M5 5 L15 5 L15 15 M35 5 L45 5 L45 15 M5 35 L5 45 L15 45 M35 45 L45 45 L45 35" stroke="#930000" strokeWidth="3" fill="none"/>
            <circle cx="25" cy="25" r="8" fill="#930000" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 w-12 h-12 opacity-30">
          <svg viewBox="0 0 50 50">
            <path d="M5 5 L15 5 L15 15 M35 5 L45 5 L45 15 M5 35 L5 45 L15 45 M35 45 L45 45 L45 35" stroke="#930000" strokeWidth="3" fill="none"/>
            <circle cx="25" cy="25" r="8" fill="#930000" opacity="0.3"/>
          </svg>
        </div> */}

        {/* Red scroll rods at top and bottom */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#930000] via-[#b30000] to-[#930000] shadow-md"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[#930000] via-[#b30000] to-[#930000] shadow-md"></div>

        {/* Logo/Title Area */}
        <div className="flex flex-col items-center gap-3 z-10 relative">
           {/* Kung Fu Panda Characters Image at Bottom */}
        <div className="mt-4 w-full flex justify-center z-10">
          <img 
            src="./five.png" 
            alt="Kung Fu Panda Characters" 
            className="w-40 md:w-56 object-contain opacity-90 drop-shadow-lg"
          />
        </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#930000] tracking-tight drop-shadow-sm">
            CODERS CUP 2025
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-black">
            {currPage == "Certificate"? `Certificate`: `Attendance`} Portal
          </h2>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#930000] to-transparent my-2 z-10"></div>

        {/* Content Area */}
        <div className="flex flex-col gap-4 items-center w-full z-10 relative">
          {attendedTeam ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">✅</div>
              <h3 className="font-bold text-xl text-[#930000]">
                {currPage === "Attendance" ? "Attendance" : "Certificate"} for team
              </h3>
              <p className="text-2xl font-black text-black">{(attendedTeam?.Team_Name && attendedTeam.Team_Name.length > 0) ?
                (attendedTeam.Team_Name.length > 30
                  ? attendedTeam.Team_Name.substring(0, 27) + "..."
                  : attendedTeam.Team_Name)
                : "Unnamed Team"}
              </p>
              <p className="text-lg font-semibold text-[#930000]">
                {isAlreadyMarked ? "is already marked!" : "marked successfully!"}
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-xl md:text-2xl text-black">
                {currPage === "Attendance" ? "MARK YOUR ATTENDANCE" : "DOWNLOAD CERTIFICATE"}
              </h3>
              <AttForm 
                page={currPage} 
                setAttendedTeam={setAttendedTeam} 
                setIsAlreadyMarked={setIsAlreadyMarked} 
              />
            </>
          )}
        </div>
        
       
      </div>

      {/* Instructions Modal/Toggle */}
      <div className="fixed bottom-6 left-6 md:left-10 z-20">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="w-16 h-16 rounded-full bg-gradient-to-b from-[#930000] to-[#7a0000] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
        >
          <span className="text-3xl">📜</span>
        </button>
        
        {showInfo && (
          <div className="absolute bottom-24 left-0 w-80 bg-white rounded-2xl shadow-2xl border-4 border-[#930000]/20 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[#930000]">📜 Instructions</h3>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-2xl text-[#930000] hover:text-[#7a0000]"
              >
                ×
              </button>
            </div>
            <ul className="flex flex-col gap-3 text-sm text-black">
              <li className="flex gap-3 items-start">
                <CornerDownRight className="mt-1 flex-shrink-0 w-4 h-4 text-[#930000]" />
                <span>Enter the attendance code emailed to you.</span>
              </li>
              <li className="flex gap-3 items-start">
                <CornerDownRight className="mt-1 flex-shrink-0 w-4 h-4 text-[#930000]" />
                <span>Download the participation certificates for your team members.</span>
              </li>
              <li className="mt-2 bg-[#FEFEEA] p-3 rounded-lg border-l-4 border-[#930000]">
                <strong className="text-[#930000]">Tip:</strong> If the certificate has expired, refresh the page and re-enter the code.
              </li>
            </ul>
          </div>
        )}
      </div>

      

      {/* Info Button with Tooltip */}
      <div className="fixed bottom-10 right-6 md:right-10 z-20">
        <div className="relative">
          <button
            onClick={() => window.open("https://acm-official-website-2025.vercel.app/", "_blank")}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#930000] text-[#FEFEEA] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 border-4 border-black/10"
          >
            <Info size={36} />
          </button>
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg whitespace-nowrap shadow-xl">
              Know about the team behind CODERS CUP
              <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;