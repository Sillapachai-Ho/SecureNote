import React, { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Sign_in() {
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // ฟังก์ชันสำหรับสลับสถานะ
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 1. สร้าง State สำหรับเก็บค่า Username และ Password
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ตัวช่วยเปลี่ยนหน้า

  useEffect(() => {
    // ให้โหลดทิ้งไว้ 800 มิลลิวินาที (0.8 วินาที) แล้วค่อยโชว์หน้าล็อกอิน
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer); // คืนค่าหน่วยความจำตอนเปลี่ยนหน้า
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST", // Login ต้องใช้ POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("username", result.username);

        alert("เข้าสู่ระบบสำเร็จ!");
        navigate("/");
      } else {
        alert("เข้าสู้ระบบไม่สำเร็จ: " + result.message);
      }
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#E2E2E2] to-[#142845]">
        <div className="w-16 h-16 border-4 border-[#FFC800]/30 border-t-[#FFC800] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#FFC800] font-bold text-xl animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-screen h-screen bg-gradient-to-b from-[#E2E2E2] to-[#142845] flex items-center justify-center p-4">
        <div className="w-full max-w-[494px] min-h-fit bg-[#142845] rounded-[30px] flex flex-col items-center gap-6 md:gap-[30px] px-6 py-10 md:px-[70px] md:py[60px] shadow-2xl">
          <div className="text-3xl md:text-[48px] font-bold text-[#FFC800] mb-2 md:mb-0">
            Notes Boy
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="username" className="text-sm text-[#D9D9D9]">
              Username / Email
            </label>
            <div className="w-full h-[58px] bg-[#FFFFFF] rounded-full px-8 flex items-center">
              <input
                id="username"
                type="text"
                className="w-full text-[#424242] outline-none bg-transparent"
                placeholder="Enter your username or email"
                value={username} // เชื่อมกับ State
                onChange={(e) => setUsername(e.target.value)} // อัปเดต State เมื่อพิมพ์
              />
            </div>
          </div>

          <div className="w-full flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-[#D9D9D9]">
              Password
            </label>
            <div className="w-full h-[58px] bg-[#FFFFFF] rounded-full px-8 flex items-center relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full h-full text-[#424242] outline-none bg-transparent"
                placeholder="••••••••"
                value={password} // เชื่อมกับ State
                onChange={(e) => setPassword(e.target.value)} // อัปเดต State เมื่อพิมพ์
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-6 text-[#424242] hover:text-[#142845] transition-all"
              >
                {showPassword ? (
                  /* ไอคอนตาเปิด (SVG) */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* ไอคอนตาปิด (SVG) */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#D9D9D9]">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded cursor-pointer accent-[#FFC800]"
              />
              <span className="group-hover:text-white transition-colors">
                Remember me
              </span>
            </label>
            <Link
              href="#"
              className="text-[#D9D9D9] hover:text-[#FFC800] hover:underline transition-all"
            >
              Forget Password?
            </Link>
          </div>

          <button
            onClick={handleLogin}
            type="submit"
            className="w-full max-w-[350px] h-[58px] bg-[#FFC800] hover:bg-yellow-400 text-[#142845] rounded-full transition-all active:scale-95 cursor-pointer text-xl md:text-2xl font-bold shadow-lg mt-2"
          >
            Sign In
          </button>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-[#D9D9D9] mt-2">
            <span>Don’t have an account yet?</span>
            <Link
              to="/sign-up"
              className="text-[#FFC800] hover:font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sign_in;
