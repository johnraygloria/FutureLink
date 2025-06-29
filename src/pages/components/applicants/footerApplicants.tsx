import { IconCheck} from "@tabler/icons-react"
function FooterApplicants (){
  return (
    <div className="bg-white border-t border-gray-200 p-4 shadow-sm flex-shrink-0">
    <div className="flex gap-2">
      <button className="cursor-pointer flex-1 bg-custom-teal from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm flex items-center justify-center gap-2">
        <IconCheck size={16} />
        Procide
      </button>
    </div>
  </div>
  )
} 
export default FooterApplicants