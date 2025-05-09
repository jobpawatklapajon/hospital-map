import { LazyImage } from './ClinicList';

export default function ClinicItem({clinic, handleClinicSelect}) {
    return (
        <div 
            className="w-24 h-24 p-2 bg-white shadow-md hover:shadow transition-all cursor-pointer flex flex-col items-center justify-center text-center mb-4 border-4 border-[#7ac142] rounded-2xl"
            onClick={() => handleClinicSelect(clinic)}
        >
            <LazyImage src={clinic.icon} alt={clinic.name} className="w-20 h-20 object-contain" />
        </div>
    )
}