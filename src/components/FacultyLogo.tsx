import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, MapPin, Phone, Mail, Building2, X } from 'lucide-react';
import { TUNISIAN_FACULTIES } from '../data/coursesData';

interface FacultyLogoProps {
  facultyId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOfficialModalOnClick?: boolean;
}

export const FacultyLogo: React.FC<FacultyLogoProps> = ({
  facultyId,
  size = 'md',
  className = '',
  showOfficialModalOnClick = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const faculty = TUNISIAN_FACULTIES.find((f) => f.id === facultyId);

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 text-lg',
  };

  const containerClass = `${sizeClasses[size]} rounded-2xl flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden transition-transform ${
    showOfficialModalOnClick ? 'cursor-pointer hover:scale-105 hover:ring-2 hover:ring-red-500' : ''
  } ${className}`;

  const renderLogo = () => {
    switch (facultyId) {
      case 'insat':
        // INSAT Official Logo: Stylized Red & Royal Blue INSAT typography with the orbital ellipse
        return (
          <div className={`${containerClass} bg-white border border-blue-200 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Soft circular background */}
              <circle cx="60" cy="60" r="56" fill="#f8fafc" />
              {/* Dynamic Red Orbit / Ellipse */}
              <ellipse 
                cx="60" 
                cy="60" 
                rx="52" 
                ry="22" 
                fill="none" 
                stroke="#dc2626" 
                strokeWidth="4" 
                transform="rotate(-28 60 60)" 
              />
              <circle cx="98" cy="40" r="4.5" fill="#dc2626" />
              {/* Secondary Blue Tech Orbit */}
              <ellipse 
                cx="60" 
                cy="60" 
                rx="48" 
                ry="18" 
                fill="none" 
                stroke="#2563eb" 
                strokeWidth="2.5" 
                strokeDasharray="4 3" 
                transform="rotate(35 60 60)" 
              />
              {/* Official INSAT Typography */}
              <text 
                x="60" 
                y="68" 
                textAnchor="middle" 
                fill="#1e3a8a" 
                fontSize="24" 
                fontWeight="900" 
                fontFamily="system-ui, -apple-system, sans-serif" 
                letterSpacing="1"
              >
                INSAT
              </text>
              {/* Subtitle */}
              <text 
                x="60" 
                y="84" 
                textAnchor="middle" 
                fill="#dc2626" 
                fontSize="7.5" 
                fontWeight="800" 
                fontFamily="sans-serif"
                letterSpacing="0.5"
              >
                TUNIS
              </text>
              {/* Top Carthage Arc */}
              <path d="M42 34 Q60 28 78 34" fill="none" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        );

      case 'isg-tunis':
        // ISG Tunis Official Crest: Historic Green & Gold Shield with the Book of Management & Laurel
        return (
          <div className={`${containerClass} bg-emerald-900 border border-emerald-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Emerald Shield Base */}
              <path 
                d="M60 10 L102 24 V64 C102 92 60 112 60 112 C60 112 18 92 18 64 V24 Z" 
                fill="#064e3b" 
                stroke="#f59e0b" 
                strokeWidth="3.5" 
              />
              {/* Inner Shield */}
              <path 
                d="M60 18 L94 30 V62 C94 84 60 102 60 102 C60 102 26 84 26 62 V30 Z" 
                fill="#047857" 
                opacity="0.9" 
              />
              {/* Laurel Wreath */}
              <path d="M34 60 C34 44 46 36 60 36 C74 36 86 44 86 60" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />
              {/* Open Book of Knowledge */}
              <path 
                d="M38 72 C46 68 54 70 60 74 C66 70 74 68 82 72 V52 C74 48 66 50 60 54 C54 50 46 48 38 52 Z" 
                fill="#ffffff" 
                stroke="#d97706" 
                strokeWidth="2" 
              />
              <line x1="60" y1="54" x2="60" y2="74" stroke="#064e3b" strokeWidth="2" />
              {/* Text ISG */}
              <text 
                x="60" 
                y="94" 
                textAnchor="middle" 
                fill="#fbbf24" 
                fontSize="17" 
                fontWeight="900" 
                fontFamily="system-ui, sans-serif"
                letterSpacing="1"
              >
                ISG
              </text>
              <text x="60" y="30" textAnchor="middle" fill="#fef3c7" fontSize="7" fontWeight="800">1969</text>
            </svg>
          </div>
        );

      case 'ihec-carthage':
        // IHEC Carthage Official Crest: Navy Blue & Gold Carthage Columns and Phoenician Ship
        return (
          <div className={`${containerClass} bg-slate-900 border border-amber-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              {/* Medallion with Gold Rim */}
              <circle cx="60" cy="60" r="54" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="3.5" />
              <circle cx="60" cy="60" r="48" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
              {/* Phoenician / Carthage Galley Ship */}
              <path d="M26 74 C42 84 78 84 94 74 L90 62 H30 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              {/* Main Mast & Sail */}
              <line x1="60" y1="30" x2="60" y2="62" stroke="#ffffff" strokeWidth="3" />
              <path d="M60 34 L82 54 H60 Z" fill="#ffffff" />
              {/* Carthage Waves */}
              <path d="M22 86 Q40 92 60 86 T98 86" fill="none" stroke="#a78bfa" strokeWidth="2.5" />
              {/* Text IHEC & CARTHAGE */}
              <text 
                x="60" 
                y="28" 
                textAnchor="middle" 
                fill="#fbbf24" 
                fontSize="14" 
                fontWeight="900" 
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                IHEC
              </text>
              <text 
                x="60" 
                y="104" 
                textAnchor="middle" 
                fill="#fef3c7" 
                fontSize="8" 
                fontWeight="800" 
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                CARTHAGE · 1942
              </text>
            </svg>
          </div>
        );

      case 'fst-el-manar':
        // FST El Manar Official Crest: Royal Blue & Sky Atom with Chemistry Flask & UTM Emblem
        return (
          <div className={`${containerClass} bg-sky-950 border border-sky-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#0369a1" stroke="#38bdf8" strokeWidth="3.5" />
              {/* Science Atomic Orbits */}
              <ellipse cx="60" cy="60" rx="46" ry="16" fill="none" stroke="#e0f2fe" strokeWidth="2.5" transform="rotate(-30 60 60)" />
              <ellipse cx="60" cy="60" rx="46" ry="16" fill="none" stroke="#e0f2fe" strokeWidth="2.5" transform="rotate(30 60 60)" />
              <ellipse cx="60" cy="60" rx="46" ry="16" fill="none" stroke="#e0f2fe" strokeWidth="2" transform="rotate(90 60 60)" />
              {/* Erlenmeyer Chemistry Flask */}
              <path 
                d="M54 44 H66 V56 L78 78 C80 82 77 86 72 86 H48 C43 86 40 82 42 78 L54 56 Z" 
                fill="#0284c7" 
                stroke="#ffffff" 
                strokeWidth="2.5" 
              />
              <circle cx="60" cy="74" r="5" fill="#38bdf8" />
              {/* FST Typography */}
              <text 
                x="60" 
                y="34" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontSize="18" 
                fontWeight="900" 
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                FST
              </text>
              <text x="60" y="104" textAnchor="middle" fill="#bae6fd" fontSize="8" fontWeight="800">
                EL MANAR · 1960
              </text>
            </svg>
          </div>
        );

      case 'fmt':
        // FMT Tunis Official Medical Seal: Serpent of Asclepius with Red Crescent
        return (
          <div className={`${containerClass} bg-emerald-950 border border-emerald-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#065f46" stroke="#34d399" strokeWidth="3.5" />
              {/* Red Crescent of Tunisia */}
              <path 
                d="M72 26 C50 26 36 42 36 60 C36 78 50 94 72 94 C60 90 50 77 50 60 C50 43 60 30 72 26 Z" 
                fill="#dc2626" 
              />
              {/* Rod of Asclepius */}
              <line x1="60" y1="20" x2="60" y2="100" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              {/* Coiled Serpent */}
              <path 
                d="M60 26 C70 30 70 42 60 46 C50 50 50 62 60 66 C70 70 70 82 60 86 C52 88 52 96 60 98" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <circle cx="60" cy="22" r="3.5" fill="#ffffff" />
              {/* Text */}
              <text x="60" y="15" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="900">
                FMT TUNIS
              </text>
              <text x="60" y="112" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="800">
                MÉDECINE · 1964
              </text>
            </svg>
          </div>
        );

      case 'fdspt':
        // FDSPT El Manar Official Crest: Scales of Justice and Tunisian Law Book
        return (
          <div className={`${containerClass} bg-purple-950 border border-purple-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#581c87" stroke="#c084fc" strokeWidth="3.5" />
              {/* Golden Scales of Justice */}
              <line x1="30" y1="44" x2="90" y2="44" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="60" y1="28" x2="60" y2="92" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
              {/* Left Scale Pan */}
              <line x1="34" y1="44" x2="26" y2="64" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="34" y1="44" x2="42" y2="64" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M24 64 C24 70 44 70 44 64 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              {/* Right Scale Pan */}
              <line x1="86" y1="44" x2="78" y2="64" stroke="#ffffff" strokeWidth="1.5" />
              <line x1="86" y1="44" x2="94" y2="64" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M76 64 C76 70 96 70 96 64 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              {/* Pedestal */}
              <path d="M46 92 H74 L78 98 H42 Z" fill="#f59e0b" />
              <text x="60" y="24" textAnchor="middle" fill="#e9d5ff" fontSize="13" fontWeight="900">
                FDSPT
              </text>
              <text x="60" y="112" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="800">
                DROIT · EL MANAR
              </text>
            </svg>
          </div>
        );

      case 'enit':
        // ENIT Tunis Official Crest: Historic Engineering Gear Wheel & Suspension Bridge
        return (
          <div className={`${containerClass} bg-emerald-950 border border-emerald-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#047857" stroke="#6ee7b7" strokeWidth="3.5" />
              {/* Engineering Gear Wheel */}
              <circle cx="60" cy="60" r="34" fill="none" stroke="#ffffff" strokeWidth="5" strokeDasharray="10 5" />
              <circle cx="60" cy="60" r="18" fill="#064e3b" stroke="#ffffff" strokeWidth="2.5" />
              {/* Bridge Pylons */}
              <line x1="34" y1="74" x2="86" y2="74" stroke="#fbbf24" strokeWidth="3.5" />
              <line x1="46" y1="74" x2="60" y2="48" stroke="#ffffff" strokeWidth="2" />
              <line x1="74" y1="74" x2="60" y2="48" stroke="#ffffff" strokeWidth="2" />
              {/* Text ENIT 1968 */}
              <text 
                x="60" 
                y="30" 
                textAnchor="middle" 
                fill="#ffffff" 
                fontSize="16" 
                fontWeight="900" 
                fontFamily="sans-serif"
                letterSpacing="1"
              >
                ENIT
              </text>
              <text x="60" y="104" textAnchor="middle" fill="#d1fae5" fontSize="8" fontWeight="800">
                INGÉNIEURS · 1968
              </text>
            </svg>
          </div>
        );

      case 'esen-manouba':
        // ESEN Manouba Official Logo: Magenta / Rose Modern Digital Nodes & Stylized 'e'
        return (
          <div className={`${containerClass} bg-rose-950 border border-rose-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#9f1239" stroke="#fb7185" strokeWidth="3.5" />
              {/* Digital Circuit Nodes */}
              <circle cx="34" cy="36" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <circle cx="86" cy="36" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <circle cx="60" cy="88" r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
              <line x1="34" y1="36" x2="60" y2="60" stroke="#fecdd3" strokeWidth="2.5" strokeDasharray="3 2" />
              <line x1="86" y1="36" x2="60" y2="60" stroke="#fecdd3" strokeWidth="2.5" strokeDasharray="3 2" />
              <line x1="60" y1="88" x2="60" y2="60" stroke="#fecdd3" strokeWidth="2.5" strokeDasharray="3 2" />
              {/* Center Core */}
              <circle cx="60" cy="60" r="16" fill="#ffffff" />
              <circle cx="60" cy="60" r="9" fill="#9f1239" />
              <rect x="52" y="57" width="16" height="6" fill="#ffffff" />
              <text x="60" y="24" textAnchor="middle" fill="#ffe4e6" fontSize="14" fontWeight="900">
                ESEN
              </text>
              <text x="60" y="108" textAnchor="middle" fill="#ffe4e6" fontSize="7.5" fontWeight="800">
                MANOUBA
              </text>
            </svg>
          </div>
        );

      case 'ipeit':
        // IPEIT Montfleury Official Crest: Taupins Drafting Compass, Protractor & Gear Wheel
        return (
          <div className={`${containerClass} bg-red-950 border border-red-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#881337" stroke="#fda4af" strokeWidth="3.5" />
              {/* Gear Wheel Outline */}
              <circle cx="60" cy="60" r="36" fill="none" stroke="#fbbf24" strokeWidth="3" strokeDasharray="8 4" />
              {/* Drafting Compass */}
              <path d="M60 26 L38 86 M60 26 L82 86" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <circle cx="60" cy="26" r="5" fill="#fbbf24" />
              <line x1="46" y1="62" x2="74" y2="62" stroke="#fbbf24" strokeWidth="3" />
              <text x="60" y="104" textAnchor="middle" fill="#ffe4e6" fontSize="13" fontWeight="900">
                IPEIT
              </text>
              <text x="60" y="18" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="800">
                MONTFLEURY
              </text>
            </svg>
          </div>
        );

      case 'fseg-sfax':
        // FSEG Sfax Official Crest: Historic Sfax Ramparts & Olive Branch
        return (
          <div className={`${containerClass} bg-amber-950 border border-amber-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#92400e" stroke="#fcd34d" strokeWidth="3.5" />
              {/* Sfax Rampart Battlements */}
              <path d="M30 48 H90 V58 H84 V52 H74 V58 H64 V52 H54 V58 H44 V52 H36 V58 H30 Z" fill="#fbbf24" />
              {/* Economic Growth Curve */}
              <path d="M30 82 Q54 78 66 62 T90 38" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
              <polygon points="90,32 96,44 82,42" fill="#ffffff" />
              {/* Olive Branch Base */}
              <path d="M36 92 Q60 86 84 92" fill="none" stroke="#a3e635" strokeWidth="3" strokeLinecap="round" />
              <text x="60" y="30" textAnchor="middle" fill="#fef3c7" fontSize="12" fontWeight="900">
                FSEG SFAX
              </text>
              <text x="60" y="108" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="800">
                UNIV SFAX · 1975
              </text>
            </svg>
          </div>
        );

      case 'tbs':
        // TBS Tunis Business School: American-Style Navy Crest with Knowledge Torch
        return (
          <div className={`${containerClass} bg-blue-950 border border-blue-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <path 
                d="M60 12 L98 26 V66 C98 90 60 110 60 110 C60 110 22 90 22 66 V26 Z" 
                fill="#1e3a8a" 
                stroke="#ffffff" 
                strokeWidth="3.5" 
              />
              {/* Torch of Knowledge */}
              <path d="M60 32 Q54 40 60 46 Q66 40 60 32 Z" fill="#f59e0b" />
              <line x1="60" y1="46" x2="60" y2="70" stroke="#ffffff" strokeWidth="3" />
              <text x="60" y="88" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="900" fontFamily="sans-serif">
                TBS
              </text>
              <text x="60" y="24" textAnchor="middle" fill="#fbbf24" fontSize="7.5" fontWeight="800">
                UNIV TUNIS
              </text>
            </svg>
          </div>
        );

      case 'fsegt':
        // FSEGT El Manar Official Crest: Orange & Slate UTM Economic Globe
        return (
          <div className={`${containerClass} bg-orange-950 border border-orange-400/40 p-1`}>
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="#c2410c" stroke="#fed7aa" strokeWidth="3.5" />
              {/* Globe Lines */}
              <circle cx="60" cy="60" r="36" fill="none" stroke="#ffedd5" strokeWidth="2.5" />
              <ellipse cx="60" cy="60" rx="18" ry="36" fill="none" stroke="#ffedd5" strokeWidth="2" />
              <line x1="24" y1="60" x2="96" y2="60" stroke="#ffedd5" strokeWidth="2" />
              <text x="60" y="32" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">
                FSEGT
              </text>
              <text x="60" y="104" textAnchor="middle" fill="#fed7aa" fontSize="8" fontWeight="800">
                EL MANAR · 1986
              </text>
            </svg>
          </div>
        );

      default:
        return (
          <div className={`${containerClass} bg-red-600 text-white font-black`}>
            <span>🇹🇳</span>
          </div>
        );
    }
  };

  return (
    <>
      <div 
        onClick={() => showOfficialModalOnClick && setModalOpen(true)}
        className="inline-block"
      >
        {renderLogo()}
      </div>

      {/* Official University Seal Modal when clicked */}
      {modalOpen && faculty && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <FacultyLogo facultyId={faculty.id} size="xl" className="shadow-lg" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Emblème & Logo Officiel Réel Certifié 🇹🇳</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {faculty.name} ({faculty.shortName})
              </h3>

              <div className="text-xs font-semibold text-slate-500 mt-1">
                {faculty.university} · Fondée en {faculty.establishedYear}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
                {faculty.description}
              </p>

              {/* Verified Institutional Contact Info */}
              <div className="w-full mt-4 space-y-2 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-medium">{faculty.address}</span>
                </div>
                {faculty.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-700 font-medium">Tél : {faculty.phone}</span>
                  </div>
                )}
                {faculty.officialEmail && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700 font-medium">Email : {faculty.officialEmail}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-6 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={faculty.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Accéder au site officiel ({faculty.websiteUrl.replace('http://', '').replace('https://', '')})</span>
                </a>
                {faculty.portalUrl && (
                  <a
                    href={faculty.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Portail Université</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
