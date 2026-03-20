import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (
      storedUsername &&
      storedUsername !== "undefined" &&
      storedUsername !== "null"
    ) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");

    setTimeout(() => {
      setIsLoggingOut(false);
      alert("ออกจากระบบสำเร็จ");
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#142845]">
          <div className="w-16 h-16 border-4 border-[#FFC800]/30 border-t-[#FFC800] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#FFC800] font-bold text-xl animate-pulse">
            Logging out...
          </p>
        </div>
      )}

      <nav className="w-full min-h-[80px] md:h-[116px] bg-[#142845] flex items-center justify-between py-4 px-6 md:px-[100px] transition-all">
        <div className="flex items-center text-xl md:text-3xl text-[#FFC800] font-bold hover:scale-105 transition-transform duration-300 cursor-pointer">
          Notes Boy
        </div>
        <div className=" flex items-center gap-4 md:gap-[50px]">
          <Link
            href="#"
            className="hidden md:flex min-w-[120px] px-6 h-[50px] bg-[#E2E2E2] items-center justify-center text-lg md:text-xl text-[#424242] rounded-full hover:bg-white transition-colors"
          >
            {username}
          </Link>

          <button
            onClick={handleLogout}
            className="text-white hover:text-red-400 transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}
