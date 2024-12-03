import { ArrowLeft } from "lucide-react"
import mindMentorImage from "../../../images/mindmentorz_logo.png"
import { useNavigate } from "react-router-dom"


const KidLeftSide = () => {
    const navigate = useNavigate()
  return (
    <div className="bg-primary text-white lg:w-2/5 p-8 flex flex-col justify-between relative">
    <div className="flex-grow flex flex-col justify-center mb-8 lg:mb-0">
      <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">Welcome to</h2>
      <img src={mindMentorImage} alt="mindMentorImage" className="w-full h-auto" />
    </div>
    <div className="flex justify-between items-center mt-4 lg:mt-8">
      <button onClick={() => navigate("/")} className="flex items-center text-sm hover:underline transition duration-300">
        <ArrowLeft size={16} className="mr-2" /> back to site
      </button>
     
    </div>
  </div>
  )
}

export default KidLeftSide