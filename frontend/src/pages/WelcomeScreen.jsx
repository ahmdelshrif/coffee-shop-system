import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Login from "./Login";
const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#3e2c23] to-[#d2b48c] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center p-10 rounded-2xl shadow-2xl bg-white/20 backdrop-blur-md max-w-2xl w-full"
      >
        <h1 className="text-[38px] font-extrabold text-white mb-10 drop-shadow-lg">☕ MEMO Café</h1>
        <p className="text-white text-[30px]  font-medium">
Hello !

        </p>
        <button
        onClick={() => navigate("./Login")}
          className="bg-[#5c3a2e] p-[25px] w-[150px] hover:bg-[#6e4a3a] text-white text-[23px] font-black  rounded-full transition-all shadow-md border-none mt-8"
        >
          ابدأ الطلب
        </button>
     
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;


