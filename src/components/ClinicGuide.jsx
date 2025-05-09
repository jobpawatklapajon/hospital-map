import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { FaArrowLeft } from "react-icons/fa";
import { HiOutlineMap } from "react-icons/hi2";
import { LazyImage } from "./ClinicList";

export default function ClinicGuide({
  selectedClinic,
  handleBackToClinicList,
  handleBackToBuildings,
}) {
  return (
    <div className="h-full w-full overflow-y-auto px-4 pt-5 pb-28 relative" style={{ WebkitOverflowScrolling: 'touch' }}>
      <div className="mb-6 flex items-center justify-center">
        <HiOutlineMapPin size={24} className="text-[#7ac142] mr-2" />
        <h2 className="text-lg font-bold text-gray-800">
          {selectedClinic.name}
        </h2>
      </div>

      <div className="flex flex-col items-center p-2 max-w-2xl mx-auto">
        {selectedClinic.navigation_guide.map((navigation, index) => (
          <div key={index} className="mb-8 w-full">
            <div className="flex items-center mb-3 bg-[#f9f9f9] p-3 rounded-lg shadow-sm border-l-4 border-[#7ac142]">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7ac142] text-white font-medium mr-3">
                {index + 1}
              </div>
              <p key={index} className="text-md font-medium text-gray-700">
                {navigation.description}
              </p>
            </div>
            <div className="border border-[#f0f0f0] rounded-lg overflow-hidden shadow-sm">
              <LazyImage
                src={navigation.path}
                alt={`Navigation step ${index + 1}`}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md border-t border-[#7ac142]/20">
        <div className="container mx-auto px-4 py-3 flex justify-center gap-x-3 max-w-md">
          <button
            onClick={handleBackToClinicList}
            className="flex items-center justify-center bg-[#7ac142] text-white px-4 py-2 rounded-lg hover:bg-[#68a936] transition-all shadow-sm hover:shadow font-medium text-sm"
          >
            <FaArrowLeft size={14} className="mr-1.5" />
            กลับ
          </button>
          <button
            onClick={handleBackToBuildings}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-50 transition-all shadow-sm hover:shadow font-medium text-sm"
          >
            <HiOutlineMap size={14} className="mr-1.5 text-[#7ac142]" />
            คลินิกทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}
