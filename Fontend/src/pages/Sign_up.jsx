import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Sign_up() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.passwordConfirm) {
      setErrorMsg("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (response.ok) {
        alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
        navigate("/login");
      } else {
        setErrorMsg("ไม่สามารถสมัครได้: ข้อมูลอาจซ้ำ หรือรหัสผ่านสั้นเกินไป");
      }
    } catch (error) {
      console.error("Sign Up Error:", error);
      setErrorMsg("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#E2E2E2] to-[#142845]">
          <div className="w-16 h-16 border-4 border-[#FFC800]/30 border-t-[#FFC800] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#FFC800] font-bold text-xl animate-pulse">
            Loading...
          </p>
        </div>
      )}

      <div className="w-screen h-screen bg-gradient-to-b from-[#E2E2E2] to-[#142845] flex items-center justify-center p-4">
        <form
          onSubmit={handleSignUp}
          className="w-full max-w-[494px] min-h-fit bg-[#142845] rounded-[30px] flex flex-col items-center gap-6 px-6 py-10 shadow-2xl"
        >
          <div className="text-3xl md:text-[40px] font-bold text-[#FFC800]">
            Sign Up
          </div>

          {errorMsg && <div className="text-red-400 text-sm">{errorMsg}</div>}

          <div className="w-full flex flex-col gap-2">
            <input
              type="text"
              name="username"
              className="w-full h-[58px] bg-[#FFFFFF] rounded-full px-8 text-[#424242] outline-none"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <input
              type="email"
              name="email"
              className="w-full h-[58px] bg-[#FFFFFF] rounded-full px-8 text-[#424242] outline-none"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <input
              type="password"
              name="password"
              className="w-full h-[58px] bg-[#FFFFFF] rounded-full px-8 text-[#424242] outline-none"
              placeholder="Password (Minimum 8 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="w-full flex flex-col gap-2">
            <input
              type="password"
              name="passwordConfirm"
              className="w-full h-[58px] bg-[#FFFFFF] rounded-full px-8 text-[#424242] outline-none"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="w-full max-w-[350px] h-[58px] bg-[#FFC800] hover:bg-yellow-400 text-[#142845] rounded-full font-bold text-xl mt-4 transition-all cursor-pointer"
          >
            Create Account
          </button>

          <div className="flex gap-2 text-sm text-[#D9D9D9] mt-2">
            <span>Already have an account?</span>
            <Link to="/login" className="text-[#FFC800] hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Sign_up;
