import { ArrowLeft } from "lucide-react"
import  mindMentorImage from "../../../../images/mindmentorz_logo.png"
import { useNavigate } from "react-router-dom"

const LeftLogoBar = () => {
    const navigate = useNavigate()
  return (
    <div className="bg-[#642b8f]
 text-white lg:w-2/5 p-2 sm:p-6 lg:p-8 flex flex-col justify-between relative min-h-[30vh] lg:min-h-screen">
    <div className="flex-grow flex flex-col justify-center items-center lg:items-start">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight ">
        Welcome to
      </h2>
      <img
        src={mindMentorImage}
        alt="mindMentorImage"
        className="w-auto max-w-[80%] sm:max-w-[60%] lg:max-w-[80%] h-auto object-contain"
        style={{marginTop:"-30px"}}
      />
    </div>

    <div className="flex justify-between items-center w-full mt-4 lg:mt-0">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-xs sm:text-sm hover:underline transition-all duration-300 hover:opacity-80"
      >
        <ArrowLeft size={16} className="mr-1 sm:mr-2" /> back to site
      </button>
    </div>
  </div>
  )
}

export default LeftLogoBar