"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { MoveRight, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw, X } from "lucide-react";

export type ValuationRound = {
  question: string;
  questionCategory: 'mileage' | 'condition' | 'accidents' | 'features' | 'other';
  answer: string;
};

export type PriceRange = {
  low: number;
  high: number;
  currency: 'USD';
};

export type ValuationResponse = {
  priceRange: PriceRange;
  confidence: number;
  nextQuestion: string | null;
  questionCategory: string | null;
  reasoning: string;
};

export type DecodedVehicle = {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
};

type TabType = "plate" | "vin" | "make";
type StepType = "decoding" | "preview" | "valuating" | "question" | "final_offer" | "success";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://vinme-backend.vercel.app";

const VEHICLE_DATA: Record<string, string[]> = {
  "Abarth": ["500", "595", "695", "124 Spider"],
  "Acura": ["MDX", "RDX", "TLX", "Integra", "ILX", "NSX"],
  "Alfa Romeo": ["Giulia", "Stelvio", "Tonale", "4C"],
  "Alpine": ["A110"],
  "Ariel": ["Atom", "Nomad", "Ace"],
  "Aston Martin": ["Vantage", "DB11", "DBX", "DBS", "Valhalla"],
  "ATS": ["GT"],
  "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  "BAC": ["Mono"],
  "Bentley": ["Continental GT", "Flying Spur", "Bentayga"],
  "Bizzarrini": ["5300 GT", "Giotto"],
  "BMW": ["3 Series", "4 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7", "M3", "M5"],
  "Bugatti": ["Chiron", "Veyron", "Mistral", "Bolide"],
  "Buick": ["Enclave", "Encore", "Envision", "Regal", "Lacrosse"],
  "BYD": ["Atto 3", "Han", "Tang", "Dolphin", "Seal"],
  "Cadillac": ["Escalade", "CT4", "CT5", "XT4", "XT5", "XT6", "CTS"],
  "Caterham": ["Seven 170", "Seven 360", "Seven 420", "Seven 620"],
  "Changan": ["Uni-K", "Uni-V", "CS55 Plus", "CS75 Plus"],
  "Chery": ["Tiggo 7", "Tiggo 8", "Omoda 5", "Arrizo 8"],
  "Chevrolet": ["Silverado", "Equinox", "Tahoe", "Suburban", "Malibu", "Trax", "Blazer", "Corvette", "Camaro", "Bolt EV"],
  "Chrysler": ["300", "Pacifica", "Voyager", "Aspen"],
  "Citroën": ["C3", "C4", "C5 Aircross", "Berlingo"],
  "Cupra": ["Formentor", "Born", "Leon", "Ateca"],
  "Czinger": ["21C"],
  "Dacia": ["Sandero", "Duster", "Jogger", "Logan"],
  "Daihatsu": ["Mira", "Move", "Tanto", "Copen", "Rocky", "Sirion"],
  "Dallara": ["Stradale"],
  "Datsun": ["Go", "Go+", "redi-GO", "on-Do", "mi-Do"],
  "De Tomaso": ["Pantera", "Mangusta", "P72"],
  "Dodge": ["Charger", "Challenger", "Durango", "Grand Caravan", "Journey", "Dart"],
  "Donkervoort": ["D8 GTO", "F22"],
  "DS Automobiles": ["DS 3", "DS 4", "DS 7", "DS 9"],
  "Ferrari": ["F8 Tributo", "Roma", "Portofino", "296 GTB", "SF90", "Purosangue"],
  "Fiat": ["500", "500X", "124 Spider"],
  "Fisker": ["Ocean"],
  "Ford": ["F-150", "Explorer", "Escape", "Edge", "Mustang", "Bronco", "Ranger", "Expedition", "Fusion", "Focus"],
  "Geely": ["Coolray", "Tugella", "Monjaro", "Emgrand"],
  "Genesis": ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  "GMC": ["Sierra", "Yukon", "Acadia", "Terrain", "Canyon"],
  "GWM": ["Haval H6", "Tank 300", "Ora Funky Cat", "Poer"],
  "Hennessey": ["Venom GT", "Venom F5"],
  "Holden": ["Commodore", "Colorado", "Caprice", "Astra", "Barina"],
  "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "HR-V", "Ridgeline", "Passport", "Insight"],
  "Hummer": ["H2", "H3", "EV Pickup", "EV SUV"],
  "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Kona", "Ioniq 5", "Ioniq 6", "Venue"],
  "Infiniti": ["Q50", "Q60", "QX50", "QX60", "QX80"],
  "Iso Rivolta": ["Grifo", "Fidia", "GT Zagato"],
  "Isuzu": ["D-Max", "MU-X", "Rodeo"],
  "Jaguar": ["F-TYPE", "F-PACE", "E-PACE", "I-PACE", "XF"],
  "Jeep": ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator", "Wagoneer"],
  "Kia": ["Forte", "Optima", "K5", "Sportage", "Sorento", "Telluride", "Soul", "Seltos", "EV6"],
  "Koenigsegg": ["Jesko", "Gemera", "Regera", "CC850"],
  "Lada": ["Niva", "Granta", "Vesta"],
  "Lamborghini": ["Urus", "Huracan", "Aventador", "Revuelto"],
  "Lancia": ["Ypsilon", "Delta", "Thema", "Stratos"],
  "Land Rover": ["Range Rover", "Defender", "Discovery", "Evoque", "Velar", "Discovery Sport"],
  "Lexus": ["RX", "ES", "IS", "NX", "GX", "LX", "UX", "LS", "LC"],
  "Li Auto": ["L7", "L8", "L9", "ONE"],
  "Lincoln": ["Navigator", "Aviator", "Nautilus", "Corsair", "MKZ"],
  "Lotus": ["Emira", "Evija", "Eletre", "Elise", "Exige"],
  "Lucid": ["Air"],
  "Mahindra": ["Thar", "XUV700", "Scorpio-N", "Bolero"],
  "Maserati": ["Ghibli", "Quattroporte", "Levante", "MC20", "Grecale"],
  "Maybach": ["S-Class Maybach", "GLS Maybach", "57", "62"],
  "Mazda": ["Mazda3", "Mazda6", "CX-30", "CX-5", "CX-50", "CX-9", "MX-5 Miata"],
  "Mazzanti": ["Evantra"],
  "McLaren": ["720S", "Artura", "GT", "570S", "750S"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE", "GLS", "CLA", "EQS"],
  "Mercury": ["Grand Marquis", "Cougar", "Milan", "Mariner", "Mountaineer"],
  "MG": ["MG4 EV", "HS", "ZS", "MG3", "Cyberster"],
  "MINI": ["Cooper", "Countryman", "Clubman"],
  "Mitsubishi": ["Outlander", "Eclipse Cross", "Mirage", "Lancer"],
  "Morgan": ["Plus Four", "Plus Six", "Super 3"],
  "NIO": ["ET5", "ET7", "ES6", "ES8", "EC6"],
  "Nissan": ["Altima", "Sentra", "Rogue", "Pathfinder", "Frontier", "Murano", "Titan", "Versa", "Armada", "370Z", "Ariya"],
  "Noble": ["M600", "M500", "M12"],
  "Oldsmobile": ["Cutlass", "Alero", "Intrigue", "Aurora"],
  "Opel": ["Corsa", "Astra", "Mokka", "Grandland"],
  "Pagani": ["Huayra", "Utopia", "Zonda"],
  "Peugeot": ["208", "308", "3008", "5008", "2008"],
  "Pininfarina": ["Battista"],
  "Perodua": ["Myvi", "Bezza", "Axia", "Ativa", "Alza"],
  "Plymouth": ["Prowler", "Neon", "Voyager", "Breeze", "Barracuda"],
  "Polestar": ["Polestar 2", "Polestar 3", "Polestar 4"],
  "Pontiac": ["Grand Prix", "GTO", "Firebird", "Solstice", "G6", "Vibe"],
  "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718 Boxster", "718 Cayman"],
  "Proton": ["Saga", "X50", "X70", "Persona", "Iriz"],
  "Ram": ["1500", "2500", "3500", "ProMaster"],
  "Renault": ["Clio", "Captur", "Megane E-Tech", "Scenic", "Austral"],
  "Rimac": ["Nevera", "Concept One"],
  "Rivian": ["R1T", "R1S"],
  "Rolls-Royce": ["Phantom", "Ghost", "Cullinan", "Spectre"],
  "Saab": ["9-3", "9-5", "900"],
  "Saturn": ["Vue", "Ion", "Sky", "Aura", "Outlook"],
  "Scion": ["tC", "xB", "xA", "xD", "FR-S", "iQ"],
  "SEAT": ["Ibiza", "Leon", "Arona", "Ateca"],
  "Skoda": ["Octavia", "Superb", "Kodiaq", "Enyaq", "Karoq"],
  "Smart": ["#1", "#3", "Fortwo"],
  "SsangYong": ["Rexton", "Tivoli", "Korando", "Musso", "Torres"],
  "SSC": ["Tuatara", "Ultimate Aero"],
  "Subaru": ["Outback", "Forester", "Crosstrek", "Impreza", "Legacy", "WRX", "Ascent", "BRZ"],
  "Suzuki": ["Swift", "Vitara", "Jimny", "S-Cross"],
  "Tata": ["Nexon", "Harrier", "Safari", "Punch", "Altroz"],
  "Tesla": ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Tacoma", "Tundra", "Prius", "Sienna", "4Runner", "Sequoia", "Supra"],
  "TVR": ["Griffith", "Sagaris", "Tuscan", "Cerbera"],
  "Volkswagen": ["Jetta", "Passat", "Golf", "Tiguan", "Atlas", "ID.4", "Taos", "Arteon"],
  "Volvo": ["S60", "S90", "V60", "XC40", "XC60", "XC90", "C40"],
  "W Motors": ["Lykan Hypersport", "Fenyr Supersport"],
  "XPeng": ["P7", "P5", "G9", "G6", "G3i"],
  "Zenvo": ["TSR-S", "TSR-GT", "Aurora"]
};

type SearchableSelectProps = {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  onSelectOther: () => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
};

function SearchableSelect({
  value,
  placeholder,
  options,
  onChange,
  onSelectOther,
  disabled = false,
  disabledPlaceholder = "LOCKED"
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className="relative w-full">
      {disabled ? (
        <div className="w-full border-b border-soot/40 text-ash/40 px-0 py-4 font-[600] text-[16px] sm:text-[18px] uppercase tracking-[0.1em] sm:tracking-[0.2em] opacity-50 cursor-not-allowed select-none text-left">
          {disabledPlaceholder}
        </div>
      ) : (
        <>
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full border-b px-0 py-4 font-[600] text-[16px] sm:text-[18px] uppercase tracking-[0.1em] sm:tracking-[0.2em] cursor-pointer flex justify-between items-center transition-colors select-none ${
              isOpen ? "border-signal-amber text-bone-white" : "border-soot text-bone-white"
            }`}
          >
            <span className={value ? "text-bone-white" : "text-ash/30"}>
              {value ? value.toUpperCase() : placeholder}
            </span>
            <span className="text-[10px] text-ash shrink-0">▼</span>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 mt-1 bg-void-black border border-soot shadow-xl z-30 p-4 max-h-[320px] flex flex-col gap-3 text-left"
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH..."
                  autoFocus
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  className="w-full bg-carbon border border-soot/60 text-bone-white px-3 py-3 text-[16px] font-mono tracking-wider focus:outline-none focus:border-signal-amber rounded-none uppercase"
                />

                <div 
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="flex-1 overflow-y-auto flex flex-col font-mono text-[13px] tracking-wide divide-y divide-soot/20"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          onChange(opt);
                          setIsOpen(false);
                          setSearch("");
                        }}
                        className="w-full text-left py-4 hover:text-signal-amber transition-colors uppercase font-[600] cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-ash italic text-center">
                      NO MATCHES FOUND
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      onSelectOther();
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className="w-full text-left py-4 text-ash hover:text-bone-white transition-colors uppercase font-[600] cursor-pointer"
                  >
                    + OTHER (TYPE MANUALLY)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default function ValuationWidget() {
  const [activeTab, setActiveTab] = useState<TabType>("plate");
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<StepType>("decoding");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [error, setError] = useState<string | null>(null);

  // Form Inputs
  const [plate, setPlate] = useState("");
  const [state, setState] = useState("CA");
  const [vin, setVin] = useState("");
  
  // Make + Model Inputs
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [trim, setTrim] = useState("");
  const [isCustomMake, setIsCustomMake] = useState(false);
  const [isCustomModel, setIsCustomModel] = useState(false);

  // Decoded/Selected Vehicle Details
  const [decodedVehicle, setDecodedVehicle] = useState<DecodedVehicle | null>(null);

  // Valuation Round States
  const [previousRounds, setPreviousRounds] = useState<ValuationRound[]>([]);
  const [currentValuation, setCurrentValuation] = useState<ValuationResponse | null>(null);
  const [freeTextAnswer, setFreeTextAnswer] = useState("");
  const [imgError, setImgError] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    setImgError(false);
    setImgLoading(true);
  }, [decodedVehicle]);

  // Lead Submission Inputs
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCity, setLeadCity] = useState("");
  const [submittingLead, setSubmittingLead] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);



  // Year list for manual selection
  const years = Array.from({ length: 27 }, (_, i) => (2026 - i).toString());

  // Initial trigger validation from the on-page form
  const handleStartRequest = () => {
    setError(null);

    if (activeTab === "plate") {
      if (!plate.trim()) {
        setError("Please enter a license plate number.");
        return;
      }
      setIsOpen(true);
      setStep("decoding");
      triggerPlateDecode();
    } else if (activeTab === "vin") {
      const cleanVin = vin.trim().toUpperCase();
      if (cleanVin.length !== 17) {
        setError("Please enter a valid 17-digit VIN.");
        return;
      }
      setIsOpen(true);
      setStep("decoding");
      triggerVinDecode(cleanVin);
    } else if (activeTab === "make") {
      if (!year || !make.trim() || !model.trim()) {
        setError("Please select Year and enter Make and Model.");
        return;
      }
      setIsOpen(true);
      
      const vehicle: DecodedVehicle = {
        vin: `MANUAL_${Date.now()}`,
        year: parseInt(year),
        make: make.trim(),
        model: model.trim(),
        trim: trim.trim() || undefined
      };
      
      setDecodedVehicle(vehicle);
      triggerFirstValuation(vehicle);
    }
  };

  // Decode Plate Simulation
  const triggerPlateDecode = () => {
    setTimeout(() => {
      const mockCars = [
        { year: 2018, make: "Toyota", model: "Camry", trim: "SE", engine: "2.5L I4", drivetrain: "FWD", bodyType: "Sedan", fuelType: "Gasoline" },
        { year: 2020, make: "Honda", model: "Civic", trim: "EX", engine: "1.5T I4", drivetrain: "FWD", bodyType: "Sedan", fuelType: "Gasoline" },
        { year: 2019, make: "Ford", model: "Mustang", trim: "EcoBoost", engine: "2.3T I4", drivetrain: "RWD", bodyType: "Coupe", fuelType: "Gasoline" },
        { year: 2021, make: "Tesla", model: "Model 3", trim: "Standard Range", engine: "Electric", drivetrain: "RWD", bodyType: "Sedan", fuelType: "Electric" },
        { year: 2022, make: "Ferrari", model: "Roma", trim: "V8", engine: "3.9L Twin-Turbo V8", drivetrain: "RWD", bodyType: "Coupe", fuelType: "Gasoline" },
        { year: 2021, make: "Lamborghini", model: "Urus", trim: "V8", engine: "4.0L Twin-Turbo V8", drivetrain: "AWD", bodyType: "SUV", fuelType: "Gasoline" },
        { year: 2023, make: "Maserati", model: "MC20", trim: "Nettuno", engine: "3.0L Twin-Turbo V6", drivetrain: "RWD", bodyType: "Coupe", fuelType: "Gasoline" }
      ];

      const seed = plate.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const chosenCar = mockCars[seed % mockCars.length];

      setDecodedVehicle({
        vin: `1HGCM${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
        ...chosenCar
      });
      setStep("preview");
    }, 1500);
  };

  // Decode VIN via API
  const triggerVinDecode = async (cleanVin: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/vehicle/decode/${cleanVin}`);
      if (!res.ok) {
        throw new Error("Unable to decode this VIN. Please check it and try again.");
      }
      const data = await res.json();
      setDecodedVehicle(data);
      setStep("preview");
    } catch (err: any) {
      setError(err.message || "Failed to decode VIN. Close modal and enter details manually.");
      setIsOpen(false);
    }
  };

  // Primary Call to AI Valuation Engine
  const triggerFirstValuation = async (vehicle: DecodedVehicle) => {
    setStep("valuating");
    setError(null);

    const carSummary = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ""}`.trim();
    const payload = {
      carSummary,
      carDetails: {
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model
      },
      previousRounds: [],
      isFirstCall: true
    };

    try {
      const res = await fetch(`${BASE_URL}/api/valuate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in an hour.");
        }
        throw new Error("Valuation engine error. Please try again.");
      }

      const data: ValuationResponse = await res.json();
      setCurrentValuation(data);
      setPreviousRounds([]);

      if (data.nextQuestion === null) {
        setStep("final_offer");
      } else {
        setStep("question");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsOpen(false);
    }
  };

  // Submit Answer & Fetch Next Question
  const handleAnswerSubmit = async (answerText: string) => {
    if (!decodedVehicle || !currentValuation) return;
    setStep("valuating");
    setError(null);

    const currentRound: ValuationRound = {
      question: currentValuation.nextQuestion || "",
      questionCategory: (currentValuation.questionCategory as any) || "other",
      answer: answerText
    };

    const updatedRounds = [...previousRounds, currentRound];
    const carSummary = `${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model} ${decodedVehicle.trim || ""}`.trim();
    
    const payload = {
      carSummary,
      carDetails: {
        year: decodedVehicle.year,
        make: decodedVehicle.make,
        model: decodedVehicle.model
      },
      previousRounds: updatedRounds,
      isFirstCall: false
    };

    try {
      const res = await fetch(`${BASE_URL}/api/valuate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to process your response. Please try again.");
      }

      const data: ValuationResponse = await res.json();
      setCurrentValuation(data);
      setPreviousRounds(updatedRounds);
      setFreeTextAnswer("");

      if (data.nextQuestion === null) {
        setStep("final_offer");
      } else {
        setStep("question");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit answer. Please try again.");
      setStep("question");
    }
  };

  // Submit Lead Information
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone || !leadEmail || !leadCity || !decodedVehicle) return;

    setSubmittingLead(true);
    setError(null);

    const carSummary = `${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model} ${decodedVehicle.trim || ""}`.trim();
    const payload = {
      name: leadName,
      phone: leadPhone,
      email: leadEmail,
      city: leadCity,
      car_summary: carSummary
    };

    try {
      const res = await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Unable to submit lead details. Please try again.");
      }

      setStep("success");
    } catch (err: any) {
      setError(err.message || "Error submitting form. Please try again.");
    } finally {
      setSubmittingLead(false);
    }
  };

  // Close and reset everything
  const handleClose = () => {
    setIsOpen(false);
    setDecodedVehicle(null);
    setCurrentValuation(null);
    setPreviousRounds([]);
    setFreeTextAnswer("");
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setLeadCity("");
    setError(null);
  };

  // Render Category Answer Chips inside Modal
  const renderCategoryOptions = () => {
    if (!currentValuation) return null;

    const category = currentValuation.questionCategory;
    const itemArrow = (
      <span className="opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-signal-amber text-[16px] font-[700] shrink-0 ml-4">
        ➔
      </span>
    );

    if (category === "mileage") {
      const chips = ["< 30,000 mi", "30–70k mi", "70–120k mi", "120–200k mi", "> 200k mi"];
      return (
        <div className="flex flex-col gap-2.5 mt-6 w-full">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleAnswerSubmit(chip)}
              className="w-full text-left px-5 py-[14px] bg-carbon/15 border border-soot/30 text-[14px] font-sans tracking-wide text-bone-white hover:bg-carbon/40 hover:border-signal-amber transition-all duration-300 uppercase cursor-pointer rounded-none flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <span className="font-[600]">{chip}</span>
              {itemArrow}
            </button>
          ))}
        </div>
      );
    }

    if (category === "condition") {
      const chips = ["Excellent", "Good", "Fair", "Needs work"];
      return (
        <div className="flex flex-col gap-2.5 mt-6 w-full">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleAnswerSubmit(chip)}
              className="w-full text-left px-5 py-[18px] bg-carbon/15 border border-soot/30 text-[16px] font-sans tracking-wide text-bone-white hover:bg-carbon/40 hover:border-signal-amber transition-all duration-300 uppercase cursor-pointer rounded-none flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <span className="font-[600]">{chip}</span>
              {itemArrow}
            </button>
          ))}
        </div>
      );
    }

    if (category === "accidents") {
      const chips = ["No accidents", "Minor damage", "Major accident"];
      return (
        <div className="flex flex-col gap-2.5 mt-6 w-full">
          {chips.map((chip) => (
            <button
              key={chip}
              onClick={() => handleAnswerSubmit(chip)}
              className="w-full text-left px-5 py-[18px] bg-carbon/15 border border-soot/30 text-[16px] font-sans tracking-wide text-bone-white hover:bg-carbon/40 hover:border-signal-amber transition-all duration-300 uppercase cursor-pointer rounded-none flex items-center justify-between group shadow-sm hover:shadow-md"
            >
              <span className="font-[600]">{chip}</span>
              {itemArrow}
            </button>
          ))}
        </div>
      );
    }

    // Default / Features: Free text input
    return (
      <div className="flex flex-col gap-6 mt-6">
        <textarea
          rows={3}
          value={freeTextAnswer}
          onChange={(e) => setFreeTextAnswer(e.target.value)}
          placeholder="E.g. Premium Sound System, Sunroof, Leather Seats, AWD, Driver Assistance Package"
          className="w-full bg-void-black border border-soot/60 text-bone-white px-4 py-3 focus:outline-none focus:border-signal-amber font-[400] text-[16px] transition-colors rounded-none placeholder:text-ash/40 resize-none"
        />
        <div className="flex gap-4">
          <button
            onClick={() => handleAnswerSubmit(freeTextAnswer.trim() || "None")}
            className="flex-1 btn-editorial !py-[16px] cursor-pointer"
          >
            Submit Specifications
          </button>
          <button
            onClick={() => handleAnswerSubmit("None")}
            className="px-6 py-3.5 bg-void-black border border-soot/60 text-[13px] font-mono tracking-wider text-ash hover:text-bone-white hover:bg-carbon/50 transition-all duration-300 uppercase cursor-pointer rounded-none text-center"
          >
            Skip Step
          </button>
        </div>
      </div>
    );
  };

  // Get color for confidence bar
  const getConfidenceStyle = (score: number) => {
    if (score >= 85) return { color: "#e8a020", class: "bg-[#e8a020]" };
    if (score >= 65) return { color: "rgba(232, 160, 32, 0.7)", class: "bg-[#e8a020]/70" };
    return { color: "#888880", class: "bg-[#888880]" };
  };

  return (
    <>
      <div 
        ref={containerRef}
        className="relative w-full p-6 sm:p-8 lg:p-12 flex flex-col z-10 bg-void-black border border-soot transition-all duration-500 ease-in-out text-left"
      >
        {/* Subtle brand lines in corner */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-signal-amber/40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-signal-amber/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-signal-amber/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-signal-amber/40" />

        {error && !isOpen && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-mono uppercase tracking-wide">{error}</span>
          </div>
        )}

        <div className="flex border-b border-soot mb-6 relative">
          {(["plate", "vin", "make"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                setError(null);
                setIsCustomMake(false);
                setIsCustomModel(false);
              }}
              className={`flex-1 pt-4 pb-4 sm:pt-6 sm:pb-6 text-[11px] sm:text-[12px] font-mono font-[600] uppercase tracking-[0.05em] sm:tracking-[0.15em] transition-colors relative rounded-none ${
                activeTab === tab ? "text-bone-white font-[700]" : "text-ash hover:text-bone-white"
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-signal-amber z-20"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {tab === "plate" ? "License Plate" : tab === "vin" ? "VIN Decode" : "Manual Input"}
              </span>
            </button>
          ))}
        </div>

        <div className="min-h-[140px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeTab === "plate" && (
              <motion.div 
                key="plate"
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col gap-6"
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="flex-[2] relative">
                    <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">Plate Registration</label>
                    <input
                      type="text"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value)}
                      placeholder="ENTER PLATE"
                      autoCorrect="off"
                      autoCapitalize="characters"
                      autoComplete="off"
                      spellCheck="false"
                      className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] placeholder:text-ash/20 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] rounded-none focus:border-transparent peer"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                  </div>
                  <div className="flex-1 relative">
                    <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">State</label>
                    <div className="relative">
                      <select 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] appearance-none rounded-none cursor-pointer focus:border-transparent peer pr-6"
                      >
                        <option value="CA" className="bg-void-black text-bone-white">CA</option>
                        <option value="NY" className="bg-void-black text-bone-white">NY</option>
                        <option value="TX" className="bg-void-black text-bone-white">TX</option>
                        <option value="FL" className="bg-void-black text-bone-white">FL</option>
                      </select>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-ash pointer-events-none">▼</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "vin" && (
              <motion.div 
                key="vin"
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col gap-6"
              >
                <div className="relative">
                  <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">17-Digit Vehicle Identification Number (VIN)</label>
                  <input
                    type="text"
                    maxLength={17}
                    value={vin}
                    onChange={(e) => setVin(e.target.value)}
                    placeholder="ENTER 17-DIGIT VIN"
                    autoCorrect="off"
                    autoCapitalize="characters"
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] placeholder:text-ash/20 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] rounded-none focus:border-transparent peer"
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                </div>
              </motion.div>
            )}

            {activeTab === "make" && (
              <motion.div 
                key="make"
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col gap-6 mb-6"
              >
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">Year</label>
                    <div className="relative">
                      <select 
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] appearance-none rounded-none cursor-pointer focus:border-transparent peer pr-6"
                      >
                        <option value="" className="bg-void-black text-bone-white">YEAR</option>
                        {years.map((y) => (
                          <option key={y} value={y} className="bg-void-black text-bone-white">{y}</option>
                        ))}
                      </select>
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-ash pointer-events-none">▼</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">Make</label>
                    {!isCustomMake ? (
                      <SearchableSelect
                        value={make}
                        placeholder="SELECT MAKE"
                        options={Object.keys(VEHICLE_DATA)}
                        onChange={(val) => {
                          setMake(val);
                          setModel("");
                        }}
                        onSelectOther={() => {
                          setMake("");
                          setIsCustomMake(true);
                          setModel("");
                          setIsCustomModel(true);
                        }}
                      />
                    ) : (
                      <div className="relative flex items-center gap-2">
                        <input
                          type="text"
                          value={make}
                          onChange={(e) => setMake(e.target.value)}
                          placeholder="ENTER MAKE"
                          autoCorrect="off"
                          autoComplete="off"
                          className="flex-1 bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] placeholder:text-ash/20 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] rounded-none focus:border-transparent peer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomMake(false);
                            setMake("");
                            setIsCustomModel(false);
                            setModel("");
                          }}
                          className="text-[10px] font-mono text-ash hover:text-bone-white transition-colors uppercase tracking-wider shrink-0 pb-1 border-b border-dashed border-ash"
                        >
                          List
                        </button>
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">Model</label>
                    {!isCustomModel ? (
                      <SearchableSelect
                        disabled={!make}
                        disabledPlaceholder="MODEL"
                        value={model}
                        placeholder="SELECT MODEL"
                        options={make && VEHICLE_DATA[make] ? VEHICLE_DATA[make] : []}
                        onChange={(val) => {
                          setModel(val);
                        }}
                        onSelectOther={() => {
                          setModel("");
                          setIsCustomModel(true);
                        }}
                      />
                    ) : (
                      <div className="relative flex items-center gap-2">
                        <input
                          type="text"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          placeholder="ENTER MODEL"
                          autoCorrect="off"
                          autoComplete="off"
                          className="flex-1 bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] placeholder:text-ash/20 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] rounded-none focus:border-transparent peer"
                        />
                        {!isCustomMake && make && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsCustomModel(false);
                              setModel("");
                            }}
                            className="text-[10px] font-mono text-ash hover:text-bone-white transition-colors uppercase tracking-wider shrink-0 pb-1 border-b border-dashed border-ash"
                          >
                            List
                          </button>
                        )}
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase block mb-1">Trim (Optional)</label>
                    <input
                      type="text"
                      value={trim}
                      onChange={(e) => setTrim(e.target.value)}
                      placeholder="E.G. SE"
                      autoCorrect="off"
                      autoComplete="off"
                      className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-4 focus:outline-none font-[600] text-[16px] sm:text-[18px] placeholder:text-ash/20 transition-colors uppercase tracking-[0.1em] sm:tracking-[0.2em] rounded-none focus:border-transparent peer"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-signal-amber transition-all duration-500 peer-focus:w-full" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <button 
            type="button"
            onClick={handleStartRequest}
            className="btn-editorial w-full !px-[32px] !py-[20px] flex items-center justify-between group cursor-pointer"
          >
            <span className="relative z-10">Request Appraisal</span>
            <MoveRight className="relative z-10 w-[20px] h-[20px] transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* FULL SCREEN SPACIOUS MODAL OVERLAY */}
      {mounted ? createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-slate-950/60 backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0.96, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 15 }}
                transition={{ type: "spring", duration: 0.5 }}
                data-lenis-prevent
                className="relative w-full max-w-5xl bg-void-black border border-soot p-5 sm:p-8 md:p-12 flex flex-col gap-6 md:gap-8 max-h-[90vh] overflow-y-auto z-10 shadow-2xl text-left"
              >
              {/* Corner accents inside modal */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-signal-amber" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-signal-amber" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-signal-amber" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-signal-amber" />

              {/* Close Button */}
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-ash hover:text-bone-white transition-colors cursor-pointer"
                aria-label="Close appraisal flow"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="font-mono uppercase tracking-wide">{error}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* MODAL STEP: DECODING */}
                {step === "decoding" && (
                  <motion.div
                    key="modal-decoding"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 gap-8"
                  >
                    <div className="w-full max-w-md bg-gunmetal h-[2px] overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-signal-amber absolute top-0 left-0 w-1/4"
                        animate={{
                          x: ["-100%", "400%"]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] font-mono font-[600] text-ash tracking-[0.2em] uppercase">SECURE REGISTRY LINK</div>
                      <div className="text-[16px] font-mono text-bone-white mt-2 tracking-wide">Decoding specifications from global database...</div>
                    </div>
                  </motion.div>
                )}

                {/* MODAL STEP: PREVIEW SPECS */}
                {step === "preview" && decodedVehicle && (
                  <motion.div
                    key="modal-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-8"
                  >
                    <div className="border-b border-soot pb-4">
                      <div className="text-[10px] font-mono font-[600] text-ash tracking-[0.25em] uppercase mb-1">SPECIFICATION CONFIRMATION</div>
                      <h3 className="text-[28px] font-[700] text-bone-white tracking-tight leading-none uppercase">
                        Verify Appraised Asset Specs
                      </h3>
                    </div>

                    {/* Diagnostic Invoice Table */}
                    <div className="bg-carbon border border-soot p-6 md:p-8 font-mono text-[14px] flex flex-col gap-4">
                      <div className="text-[11px] font-[600] text-ash tracking-[0.15em] uppercase border-b border-soot pb-4 mb-2">
                        Official Spec Record
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-ash uppercase">Model Identifier</span>
                        <span className="text-bone-white font-[700] uppercase text-right">
                          {decodedVehicle.year} {decodedVehicle.make} {decodedVehicle.model}
                        </span>
                      </div>
                      {decodedVehicle.trim && (
                        <div className="flex justify-between py-1 border-t border-soot/40">
                          <span className="text-ash uppercase">Trim Package</span>
                          <span className="text-bone-white font-[600] uppercase">{decodedVehicle.trim}</span>
                        </div>
                      )}
                      {decodedVehicle.engine && (
                        <div className="flex justify-between py-1 border-t border-soot/40">
                          <span className="text-ash uppercase">Engine Specification</span>
                          <span className="text-bone-white font-[600] uppercase">{decodedVehicle.engine}</span>
                        </div>
                      )}
                      {decodedVehicle.drivetrain && (
                        <div className="flex justify-between py-1 border-t border-soot/40">
                          <span className="text-ash uppercase">Drivetrain</span>
                          <span className="text-bone-white font-[600] uppercase">{decodedVehicle.drivetrain}</span>
                        </div>
                      )}
                      {decodedVehicle.bodyType && (
                        <div className="flex justify-between py-1 border-t border-soot/40">
                          <span className="text-ash uppercase">Body Variant</span>
                          <span className="text-bone-white font-[600] uppercase">{decodedVehicle.bodyType}</span>
                        </div>
                      )}
                      {decodedVehicle.fuelType && (
                        <div className="flex justify-between py-1 border-t border-soot/40">
                          <span className="text-ash uppercase">Propulsion Unit</span>
                          <span className="text-bone-white font-[600] uppercase">{decodedVehicle.fuelType}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <button
                        onClick={() => triggerFirstValuation(decodedVehicle)}
                        className="flex-[2] btn-editorial !px-[32px] !py-[20px] flex items-center justify-between group cursor-pointer"
                      >
                        <span className="relative z-10">Confirm Specifications & Start Appraisal</span>
                        <MoveRight className="relative z-10 w-[20px] h-[20px] transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 px-8 py-5 bg-transparent border border-soot/60 text-[13px] font-mono tracking-wider text-ash hover:text-bone-white hover:bg-carbon/50 transition-all duration-300 uppercase cursor-pointer rounded-none text-center"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* MODAL STEP: VALUATING SYSTEM GENERATION */}
                {step === "valuating" && (
                  <motion.div
                    key="modal-valuating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 gap-8"
                  >
                    <div className="w-full max-w-md bg-gunmetal h-[2px] overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-signal-amber absolute top-0 left-0 w-1/4"
                        animate={{
                          x: ["-100%", "400%"]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-[11px] font-mono font-[600] text-ash tracking-[0.2em] uppercase">CALCULATION QUEUE</div>
                      <div className="text-[16px] font-mono text-bone-white mt-2 tracking-wide">Recalculating algorithmic market valuation bounds...</div>
                    </div>
                  </motion.div>
                )}

                {/* MODAL STEP: ACTIVE QUESTION FLOW */}
                {step === "question" && currentValuation && decodedVehicle && (
                  <motion.div
                    key="modal-question"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 w-full"
                  >
                    {/* 1. Progress Bar (Top) */}
                    <div className="w-full flex flex-col gap-2 font-mono text-left pt-2 md:pt-4">
                      <div className="text-[10px] text-ash tracking-wider uppercase font-[600]">
                        Progress
                      </div>
                      <div className="w-full h-[4px] bg-carbon overflow-hidden">
                        <motion.div 
                          className="h-full bg-signal-amber"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, ((previousRounds.length + 1) / 4) * 100)}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* 2. Split Columns Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mt-2">
                      {/* Left Column: Price, Confidence, Image, and Model */}
                      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 sm:gap-5 text-left">
                        <div className="flex flex-col gap-1">
                          <div className="text-[10px] font-mono font-[600] text-ash tracking-[0.15em] uppercase">Estimated Value</div>
                          <div className="text-[26px] sm:text-[32px] md:text-[36px] font-[800] text-bone-white tracking-tight leading-none mt-2 font-sans">
                            ${currentValuation.priceRange.low.toLocaleString()} – ${currentValuation.priceRange.high.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-end text-[11px] font-sans tracking-wide">
                            <span className="text-ash tracking-[0.1em] uppercase">Appraisal Confidence</span>
                            <span className="font-[700] text-bone-white">{currentValuation.confidence}%</span>
                          </div>
                          {/* Clean Confidence Bar */}
                          <div className="w-full h-[3px] bg-carbon overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-700 ease-out ${getConfidenceStyle(currentValuation.confidence).class}`}
                              style={{ width: `${currentValuation.confidence}%` }}
                            />
                          </div>
                        </div>

                        {/* White Background Car Image Container with Skeleton */}
                        <div className="relative w-full h-[150px] sm:h-[180px] md:h-[220px] bg-white flex items-center justify-center overflow-hidden p-4">
                          {imgLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-ash/10 animate-pulse">
                              <div className="w-2/3 h-[50px] bg-ash/20 rounded-none" />
                              <span className="text-[10px] font-mono text-ash mt-2 uppercase tracking-widest">Loading model profile...</span>
                            </div>
                          )}
                          <img
                            key={`${decodedVehicle.make}-${decodedVehicle.model}`}
                            src={imgError 
                              ? `https://images.unsplash.com/featured/800x450/?white,car,${encodeURIComponent(decodedVehicle.make.toLowerCase())},${encodeURIComponent(decodedVehicle.model.toLowerCase())}`
                              : `https://cdn.imagin.studio/getimage?customer=carwow&make=${encodeURIComponent(decodedVehicle.make.toLowerCase())}&modelFamily=${encodeURIComponent(decodedVehicle.model.toLowerCase().split(' ')[0])}&zoomType=fullscreen&paintId=pspc0006&modelYear=${decodedVehicle.year}`
                            }
                            alt={`${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model}`}
                            onLoad={() => setImgLoading(false)}
                            onError={() => {
                              setImgError(true);
                              setImgLoading(false);
                            }}
                            className={`w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] h-auto object-contain max-h-[130px] sm:max-h-[150px] md:max-h-[180px] mx-auto transition-all duration-500 hover:scale-[1.02] ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                          />
                        </div>

                        <div className="text-left font-mono text-[12px] pt-2 mt-2">
                          <div className="text-bone-white font-[700] uppercase text-[14px]">
                            {decodedVehicle.year} {decodedVehicle.make} {decodedVehicle.model} {decodedVehicle.trim ? ` ${decodedVehicle.trim}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Question & Option Chips */}
                      <div className="col-span-12 lg:col-span-7 flex flex-col justify-between text-left lg:pl-10">
                        <div>
                          <h4 className="text-[20px] md:text-[22px] font-[600] text-bone-white leading-snug tracking-tight mb-1">
                            {currentValuation.nextQuestion}
                          </h4>

                          {/* Spacious Chips Grid */}
                          {renderCategoryOptions()}
                        </div>

                        <div className="flex justify-between items-center pt-6 mt-8 font-mono text-[12px]">
                          <span className="text-ash uppercase">
                            Step {previousRounds.length + 1} of 4
                          </span>
                          <button
                            onClick={handleClose}
                            className="text-ash hover:text-bone-white transition-colors uppercase tracking-[0.1em] flex items-center gap-2 cursor-pointer font-[600]"
                          >
                            <RefreshCw className="w-3.5 h-3.5" /> Restart Analysis
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* MODAL STEP: FINAL OFFERS & DIGNIFIED FORM */}
                {step === "final_offer" && currentValuation && decodedVehicle && (
                  <motion.div
                    key="modal-final-offer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6 md:gap-8"
                  >
                    <div className="border-b border-soot pb-6 md:pb-8 flex flex-col gap-4 md:gap-5 text-center">
                      {currentValuation.confidence >= 65 ? (
                        <>
                          <div className="text-[11px] font-mono font-[600] text-ash tracking-[0.25em] uppercase">FINAL APPRAISAL RESULT</div>
                          <div className="text-[32px] sm:text-[42px] md:text-[56px] font-[800] text-[#e8a020] tracking-tight leading-none my-3 font-sans">
                            ${currentValuation.priceRange.low.toLocaleString()} – ${currentValuation.priceRange.high.toLocaleString()}
                          </div>
                          
                          <div className="flex justify-center items-center gap-2 text-[12px] font-sans tracking-wide">
                            <span className="text-ash tracking-[0.1em] uppercase">System Appraisal Confidence:</span>
                            <span className="font-[700] text-bone-white">{currentValuation.confidence}%</span>
                          </div>

                          {/* Confidence Bar */}
                          <div className="w-full h-[4px] bg-carbon overflow-hidden max-w-md mx-auto">
                            <div 
                              className={`h-full transition-all duration-700 ease-out ${getConfidenceStyle(currentValuation.confidence).class}`}
                              style={{ width: `${currentValuation.confidence}%` }}
                            />
                          </div>

                          {/* White Background Car Image Card */}
                          <div className="w-full py-4 sm:py-5 flex items-center justify-center bg-white overflow-hidden p-4">
                            <img
                              key={`${decodedVehicle.make}-${decodedVehicle.model}`}
                              src={imgError 
                                ? `https://images.unsplash.com/featured/800x450/?white,car,${encodeURIComponent(decodedVehicle.make.toLowerCase())},${encodeURIComponent(decodedVehicle.model.toLowerCase())}`
                                : `https://cdn.imagin.studio/getimage?customer=carwow&make=${encodeURIComponent(decodedVehicle.make.toLowerCase())}&modelFamily=${encodeURIComponent(decodedVehicle.model.toLowerCase().split(' ')[0])}&zoomType=fullscreen&paintId=pspc0006&modelYear=${decodedVehicle.year}`
                              }
                              alt={`${decodedVehicle.year} ${decodedVehicle.make} ${decodedVehicle.model}`}
                              onError={() => setImgError(true)}
                              className="w-full max-w-[300px] sm:max-w-[440px] h-auto object-contain max-h-[150px] sm:max-h-[220px] mx-auto transition-all duration-500 hover:scale-[1.02]"
                            />
                          </div>

                          {currentValuation.confidence < 85 && (
                            <div className="text-[13px] text-ash italic tracking-wide mt-3">
                              “Note: A market specialist may refine this baseline valuation range further.”
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="py-6 px-8 bg-carbon border border-soot text-left font-mono">
                          <div className="text-[15px] font-[700] text-bone-white uppercase tracking-[0.15em] mb-2">Additional Verification Required</div>
                          <p className="text-[15px] text-ash leading-relaxed">
                            We require manual validation files to formulate a guaranteed purchase proposal for this vehicle config. Please complete the transmission record below.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Highly Structured, Generously Spaced Contact Form */}
                    <form onSubmit={handleLeadSubmit} className="flex flex-col gap-8 mt-2">
                      <div className="text-[12px] font-mono font-[700] text-bone-white uppercase tracking-[0.15em]">
                        Register Account Details to Guarantee Appraisal
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.2em] uppercase block mb-1">Contact Name</label>
                          <input
                            required
                            type="text"
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                            placeholder="YOUR FULL NAME"
                            className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-3 focus:outline-none focus:border-signal-amber font-[500] text-[18px] placeholder:text-ash/20 transition-colors rounded-none uppercase tracking-wider"
                          />
                        </div>
                        <div className="relative">
                          <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.2em] uppercase block mb-1">Phone Number</label>
                          <input
                            required
                            type="tel"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                            placeholder="(555) 000-0000"
                            className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-3 focus:outline-none focus:border-signal-amber font-[500] text-[18px] placeholder:text-ash/20 transition-colors rounded-none uppercase tracking-wider"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                          <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.2em] uppercase block mb-1">Email Address</label>
                          <input
                            required
                            type="email"
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                            placeholder="NAME@DOMAIN.COM"
                            className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-3 focus:outline-none focus:border-signal-amber font-[500] text-[18px] placeholder:text-ash/20 transition-colors rounded-none uppercase tracking-wider"
                          />
                        </div>
                        <div className="relative">
                          <label className="text-[10px] font-mono font-[600] text-ash tracking-[0.2em] uppercase block mb-1">City / Location</label>
                          <input
                            required
                            type="text"
                            value={leadCity}
                            onChange={(e) => setLeadCity(e.target.value)}
                            placeholder="E.G. NEW YORK"
                            className="w-full bg-transparent border-b border-soot text-bone-white px-0 py-3 focus:outline-none focus:border-signal-amber font-[500] text-[18px] placeholder:text-ash/20 transition-colors rounded-none uppercase tracking-wider"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingLead}
                        className="btn-editorial w-full !px-[32px] !py-[20px] mt-4 flex items-center justify-between cursor-pointer"
                      >
                        <span className="relative z-10 text-[14px]">{submittingLead ? "Transmitting information..." : "Submit Registry & Claim Valuation"}</span>
                        {!submittingLead && <MoveRight className="relative z-10 w-[20px] h-[20px]" />}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* MODAL STEP: SUCCESS SCREEN */}
                {step === "success" && (
                  <motion.div
                    key="modal-success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8 sm:py-16 text-center gap-6 sm:gap-8"
                  >
                    <div className="w-16 h-16 rounded-full border border-signal-amber flex items-center justify-center text-signal-amber mb-2">
                      <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <h3 className="text-[26px] font-[700] text-bone-white tracking-tight uppercase leading-none font-mono">Transmission Complete</h3>
                      <p className="text-[16px] text-ash mt-4 leading-relaxed max-w-[500px] mx-auto">
                        Appraisal data for the <b className="text-bone-white uppercase">{decodedVehicle?.year} {decodedVehicle?.make} {decodedVehicle?.model}</b> has been locked and recorded.
                      </p>
                      <p className="text-[13px] text-ash/80 font-mono uppercase tracking-widest mt-2">
                        Our appraisal specialists will review the file and call you shortly at {leadPhone}.
                      </p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="mt-8 btn-editorial !px-[48px] !py-[20px] cursor-pointer"
                    >
                      Close Valuation Window
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      ) : null}
    </>
  );
}
