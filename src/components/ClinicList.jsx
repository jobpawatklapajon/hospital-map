import { useState, useEffect, lazy, Suspense, useMemo, useCallback, useRef } from "react";
import { FaHospital, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineMap } from "react-icons/hi";
import PropTypes from 'prop-types';
import clinicData from '../data/clinics.json';

// Lazy load components
const ClinicItem = lazy(() => import('./ClinicItem'));
const ClinicGuide = lazy(() => import('./ClinicGuide'));

// Utility function for handling relative paths
const getImageUrl = (url) => {
    if (url.startsWith('/')) {
        return `${import.meta.env.BASE_URL.replace(/\/$/, '')}${url}`;
    }
    return url;
};

// LazyImage component for optimized image loading
export const LazyImage = ({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imageUrl = useMemo(() => getImageUrl(src), [src]);

    useEffect(() => {
        const img = new Image();
        img.src = imageUrl;

        const handleLoad = () => setIsLoaded(true);
        const handleError = () => setError(true);

        img.onload = handleLoad;
        img.onerror = handleError;

        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [imageUrl]);

    if (error) {
        return (
            <div className={`${className} bg-gray-200 flex items-center justify-center animate-pulse`}>
                <span className="text-gray-500">
                    <FaExclamationTriangle size={24} className="text-gray-500 animate-bounce" />
                </span>
            </div>
        );
    }

    return (
        <div className={`${className} relative`}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 border-2 border-[#0077B6] border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <img
                src={imageUrl}
                alt={alt}
                className={`${className} ${!isLoaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} transition-all duration-300 ease-in-out`}
                loading="lazy"
            />
        </div>
    );
};

LazyImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string
};

// Loading fallback component
const LoadingFallback = () => (
    <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-lg" />
);

// Back button component
const BackButton = ({ onClick, icon: Icon, text, variant = "primary" }) => {
    const styles = {
        primary: "bg-[#7ac142] text-white hover:bg-[#68a936]",
        secondary: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
    };
    
    return (
        <button 
            onClick={onClick}
            className={`flex items-center justify-center ${styles[variant]} px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow font-medium text-sm`}
        >
            <Icon size={14} className={`mr-1.5 ${variant === "secondary" ? "text-[#7ac142]" : ""}`} />
            {text}
        </button>
    );
};

BackButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.elementType.isRequired,
    text: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["primary", "secondary"])
};

// Main component
export default function ClinicList({ selectedBuild, handleSelectedBuild, selectedClinic, setSelectedClinic }) {
    const [clinics] = useState(clinicData.clinics);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const scrollContainerRef = useRef(null);

    // Reinitialize the scroll handler whenever the component mounts or selectedClinic changes
    useEffect(() => {
        // Reset scroll state when returning from clinic guide
        if (!selectedClinic) {
            setLastScrollTop(0);
            setIsScrollingDown(false);
        }
    }, [selectedClinic]);

    // Handle scroll events to show/hide controls
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        
        const handleScroll = () => {
            const scrollTop = scrollContainer.scrollTop;
            
            if (scrollTop > lastScrollTop + 5) {
                // Scrolling down (smaller threshold for better responsiveness)
                setIsScrollingDown(true);
            } else if (scrollTop < lastScrollTop - 2) {
                // Scrolling up (even smaller threshold for quicker detection of upward scrolling)
                setIsScrollingDown(false);
            }
            
            // Update last scroll position
            setLastScrollTop(scrollTop);
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [lastScrollTop, selectedClinic]);

    const handleClinicSelect = useCallback((clinic) => {
        setSelectedClinic(clinic);
    }, [setSelectedClinic]);

    const handleBackToBuildings = useCallback(() => {
        handleSelectedBuild(null);
        setSelectedClinic(null);
    }, [handleSelectedBuild, setSelectedClinic]);

    const handleBackToClinicList = useCallback(() => {
        setSelectedClinic(null);
    }, [setSelectedClinic]);

    // Memoize clinic lists to prevent unnecessary re-renders
    const allClinics = useMemo(() => 
        clinics.map((clinic, index) => (
            <div key={index}>
                <Suspense fallback={<LoadingFallback />}>
                    <ClinicItem 
                        clinic={clinic} 
                        handleClinicSelect={handleClinicSelect} 
                    />
                </Suspense>
            </div>
        )), [clinics, handleClinicSelect]);

    const clinicsInBuild = useMemo(() => 
        clinics
            .filter(clinic => clinic.build === selectedBuild)
            .map((clinic, index) => (
                <Suspense 
                    key={index} 
                    fallback={<LoadingFallback />}
                >
                    <ClinicItem 
                        clinic={clinic} 
                        handleClinicSelect={handleClinicSelect} 
                    />
                </Suspense>
            )), [clinics, selectedBuild, handleClinicSelect]);

    // If a clinic is selected, show the image navigation guide
    if (selectedClinic) {
        return (
            <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7ac142]" />
                </div>
            }>
                <ClinicGuide 
                    selectedClinic={selectedClinic} 
                    handleBackToClinicList={handleBackToClinicList} 
                    handleBackToBuildings={handleBackToBuildings} 
                />
            </Suspense>
        );
    }

    // Render appropriate view based on selection state
    return (
        <div 
            ref={scrollContainerRef}
            className="h-full w-full overflow-y-auto px-4 pt-5 pb-32" 
            style={{ WebkitOverflowScrolling: 'touch' }}
        >
            {selectedBuild == null ? (
                // All clinics view
                <>
                    <div className="flex items-center mb-6 justify-center">
                        <h2 className="text-xl font-bold text-gray-800">คลินิกทั้งหมด</h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4 p-2">
                        {allClinics}
                    </div>
                </>
            ) : (
                // Building-specific clinics view
                <>
                    <div className="mb-6 flex items-center justify-center">
                        <h1 className="text-xl font-bold text-gray-800">
                            {selectedBuild}
                        </h1>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 p-2">
                        {clinicsInBuild}
                    </div>
                    
                    <div className={`fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md border-t border-[#7ac142]/20 transition-transform duration-300 ease-in-out ${isScrollingDown ? 'translate-y-full' : 'translate-y-0'}`}>
                        <div className="container mx-auto px-4 py-3 flex justify-center gap-x-3 max-w-md">
                            <BackButton 
                                onClick={handleBackToBuildings}
                                icon={FaArrowLeft}
                                text="คลินิกทั้งหมด"
                                variant="primary"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

ClinicList.propTypes = {
    selectedBuild: PropTypes.string,
    handleSelectedBuild: PropTypes.func.isRequired,
    selectedClinic: PropTypes.object,
    setSelectedClinic: PropTypes.func.isRequired
};