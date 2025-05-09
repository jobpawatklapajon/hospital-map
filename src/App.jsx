import MapView from './components/Mapview.jsx';
import ClinicList from './components/ClinicList.jsx';
import { useState, useCallback } from 'react';

function App() {
  // State management
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [mapExpanded, setMapExpanded] = useState(false);

  // Event handlers
  const handleSelectedBuild = useCallback((build, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedBuild(build);
    setMapExpanded(false);
  }, []);

  const handleMapTouch = useCallback(() => {
    setMapExpanded(false);
  }, []);

  const handleClinicTouch = useCallback(() => {
    if (!selectedClinic) {
      setMapExpanded(false);
    }
  }, [selectedClinic]);

  // Component styles
  const mapContainerClass = `
    p-2
    bg-white
    transition-all 
    duration-500 
    ease-in-out 
    ${selectedClinic ? 'h-0' : mapExpanded ? 'h-2/5' : 'h-2/5'} 
    overflow-hidden
  `;
  
  const clinicListContainerClass = `
    rounded-t-xl
    shadow-md
    bg-white 
    transition-all 
    duration-500 
    ease-in-out 
    ${selectedClinic ? 'h-full flex-1' : mapExpanded ? 'h-3/5' : 'h-3/5'} 
    overflow-y-auto
    border-t
    border-gray-200
  `;

  return (
    <div className='flex flex-col h-screen w-screen bg-gray-50 transition-all duration-300 overflow-hidden'>
      {/* Map Section */}
      <div 
        className={mapContainerClass}
        onClick={handleMapTouch}
        onTouchStart={handleMapTouch}
      >
        {!selectedClinic && (
          <div className='relative flex items-center justify-center h-full'>
            {/* <span className='absolute bottom-0 left-1/2 -translate-x-1/2 text-sm text-gray-500 z-10'>กดเพื่อเลือกตึก</span> */}
            <MapView 
              setSelectedBuild={handleSelectedBuild} 
              build={selectedBuild} 
            />
          </div>
        )}
      </div>
      
      {/* Clinic List Section */}
      <div 
        className={clinicListContainerClass}
        onClick={handleClinicTouch}
        onTouchStart={handleClinicTouch}
      >
        <div className="px-2 py-1 bg-green-200 rounded-full w-20 mx-auto mt-2 mb-2">
          <div className="h-1.5 bg-green-500 rounded-full"></div>
        </div>
        <ClinicList 
          selectedBuild={selectedBuild} 
          handleSelectedBuild={handleSelectedBuild} 
          selectedClinic={selectedClinic} 
          setSelectedClinic={setSelectedClinic} 
        />
      </div>
    </div>
  );
}

export default App;
