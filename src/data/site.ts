// Hollmann International · content layer
// Vehicle data, pricing and imagery sourced from hollmann.international (live stock at time of build).
// Specifications are indicative manufacturer figures. This is a design concept by Agensea.

export const company = {
  name: "Hollmann",
  full: "Hollmann International",
  legal: "Hollmann International GmbH & Co. KG",
  tagline: "The world's most exclusive automobiles",
  intro:
    "An internationally operating house specialised in the premium vehicle segment. Our passion for exceptional automobiles reaches our clients through the highest standard of service and a deep wealth of know-how.",
  founded: 2009,
  partner: { name: "Al Ain Class Motors", url: "https://alainclass.com" },
  address: {
    street: "Charlotte-Auerbach-Str. 4",
    postal: "28816",
    city: "Stuhr",
    country: "Germany",
  },
  phone: "+49 421 80608210",
  phoneHref: "+4942180608210",
  email: "info@hollmann.international",
  hours: "Mon - Fri: 09:00 - 18:00",
  viewing: "Viewings by prior arrangement only.",
  languages: ["EN", "DE", "ZH", "AR"],
};

export const nav = [
  { label: "Collection", href: "/collection" },
  { label: "Specialities", href: "/#categories" },
  { label: "Service", href: "/#service" },
  { label: "House", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const social = [
  { label: "WhatsApp", href: "https://wa.me/4942180608210" },
  { label: "Telegram", href: "https://t.me/hollmann" },
  { label: "Instagram", href: "https://instagram.com/hollmann.international" },
  { label: "YouTube", href: "https://youtube.com/@hollmanninternational" },
  { label: "TikTok", href: "https://tiktok.com/@hollmann.international" },
];

export const stats = [
  { value: 2009, label: "Founded", suffix: "", prefix: "Since " },
  { value: 50, label: "Marques represented", suffix: "+" },
  { value: 7, label: "Languages spoken", suffix: "" },
  { value: 120, label: "Countries delivered to", suffix: "+" },
];

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  variant?: string;
  year: number;
  priceGross: number | null;
  priceNet: number;
  vatNote?: string;
  drivetrain: string;
  engine: string;
  power: string;
  accel: string;
  topSpeed: string;
  consumption: string;
  co2: string;
  co2class: string;
  mileage: string;
  transmission: string;
  colorExt: string;
  colorInt: string;
  categories: string[];
  badge?: string;
  tagline: string;
  images: number;
};

const img = (id: string, n: number) => `/cars/${id}/${n}.jpg`;
export const carImage = img;
export const carImages = (v: Vehicle) =>
  Array.from({ length: v.images }, (_, i) => img(v.id, i + 1));

export const fmtEUR = (n: number) =>
  "€" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });

export const vehicleSlug = (v: Vehicle) => v.id.toLowerCase();
export const vehicleTitle = (v: Vehicle) =>
  [v.brand, v.model, v.variant].filter(Boolean).join(" ");

export const categories = [
  { slug: "all", label: "All" },
  { slug: "hypercars", label: "Hypercars" },
  { slug: "gt", label: "Supercars & GT" },
  { slug: "luxury-suv", label: "Luxury & SUV" },
  { slug: "armoured", label: "Armoured" },
  { slug: "customized", label: "Customized" },
];

export const vehicles: Vehicle[] = [
  {
    id: "26G0848",
    brand: "Lamborghini",
    model: "Revuelto",
    variant: "by MANSORY Carbonado X",
    year: 2025,
    priceGross: 1904000,
    priceNet: 1600000,
    drivetrain: "Plug-in Hybrid",
    engine: "6.5 V12 + 3x e-motor",
    power: "1048 PS",
    accel: "2.5 s",
    topSpeed: "350 km/h",
    consumption: "11.6 l + 28.6 kWh / 100 km",
    co2: "275 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "8-speed DCT",
    colorExt: "Forged carbon / Nero",
    colorInt: "Alcantara, contrast stitch",
    categories: ["hypercars", "customized"],
    badge: "MANSORY one-off",
    tagline: "A full forged-carbon reinterpretation of the V12 flagship.",
    images: 10,
  },
  {
    id: "26G0295",
    brand: "Ferrari",
    model: "812 GTS",
    variant: "by NOVITEC N-LARGO S",
    year: 2024,
    priceGross: 1785000,
    priceNet: 1500000,
    drivetrain: "Combustion (Petrol)",
    engine: "6.5 V12",
    power: "840 PS",
    accel: "2.8 s",
    topSpeed: "340 km/h",
    consumption: "16.4 l / 100 km",
    co2: "373 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "7-speed DCT",
    colorExt: "Rosso Corsa",
    colorInt: "Nero leather, carbon",
    categories: ["gt", "customized"],
    badge: "1 of 1",
    tagline: "The widebody open-top V12, built as a singular commission.",
    images: 10,
  },
  {
    id: "26G0847",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    variant: "MANSORY P820 Grande Entree",
    year: 2025,
    priceGross: 1029350,
    priceNet: 865000,
    drivetrain: "Combustion (Petrol)",
    engine: "4.0 V8 BiTurbo",
    power: "820 PS",
    accel: "4.0 s",
    topSpeed: "250 km/h",
    consumption: "14.8 l / 100 km",
    co2: "338 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "9-speed automatic",
    colorExt: "Forged carbon widebody",
    colorInt: "Bespoke quilted leather",
    categories: ["luxury-suv", "customized"],
    badge: "MANSORY P820",
    tagline: "The G-Class taken to coachbuilt extremes.",
    images: 10,
  },
  {
    id: "26G0548",
    brand: "Mercedes-Benz",
    model: "S 680",
    variant: "4MATIC GUARD VR10",
    year: 2024,
    priceGross: 874650,
    priceNet: 735000,
    drivetrain: "Combustion (Petrol)",
    engine: "6.0 V12 BiTurbo",
    power: "612 PS",
    accel: "4.6 s",
    topSpeed: "250 km/h",
    consumption: "20.0 l / 100 km",
    co2: "453 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "9-speed automatic",
    colorExt: "Obsidian Black",
    colorInt: "Nappa, executive rear",
    categories: ["armoured", "luxury-suv"],
    badge: "Armoured VR10",
    tagline: "Factory ballistic protection in a discreet flagship saloon.",
    images: 10,
  },
  {
    id: "26G0731",
    brand: "Ferrari",
    model: "SF90 Spider",
    variant: "Tailor Made Ispirazioni",
    year: 2024,
    priceGross: 749462,
    priceNet: 629800,
    drivetrain: "Plug-in Hybrid",
    engine: "4.0 V8 + 3x e-motor",
    power: "1000 PS",
    accel: "2.5 s",
    topSpeed: "340 km/h",
    consumption: "Plug-in Hybrid",
    co2: "On request",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "8-speed DCT",
    colorExt: "Tailor Made livery",
    colorInt: "Bespoke Ispirazioni",
    categories: ["hypercars"],
    badge: "Tailor Made",
    tagline: "Ferrari's 1000 PS retractable-roof hybrid, individually commissioned.",
    images: 10,
  },
  {
    id: "26G0269",
    brand: "Ferrari",
    model: "F8 Spider",
    variant: "by NOVITEC N-LARGO",
    year: 2024,
    priceGross: 712810,
    priceNet: 599000,
    drivetrain: "Combustion (Petrol)",
    engine: "3.9 V8 BiTurbo",
    power: "800 PS",
    accel: "2.8 s",
    topSpeed: "345 km/h",
    consumption: "13.0 l / 100 km",
    co2: "296 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "7-speed DCT",
    colorExt: "Giallo Modena",
    colorInt: "Nero / Giallo accents",
    categories: ["gt", "customized"],
    badge: "Novitec N-LARGO",
    tagline: "The widebody F8 Spider, hand-finished by Novitec.",
    images: 10,
  },
  {
    id: "26G0850",
    brand: "Ferrari",
    model: "Purosangue",
    year: 2024,
    priceGross: 582862,
    priceNet: 489800,
    drivetrain: "Combustion (Petrol)",
    engine: "6.5 V12",
    power: "725 PS",
    accel: "3.3 s",
    topSpeed: "310 km/h",
    consumption: "17.3 l / 100 km",
    co2: "393 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "8-speed DCT",
    colorExt: "Blu Pozzi",
    colorInt: "Cuoio leather",
    categories: ["luxury-suv", "gt"],
    tagline: "The naturally aspirated V12, reimagined for four.",
    images: 10,
  },
  {
    id: "26G0853",
    brand: "Ferrari",
    model: "812 Superfast",
    year: 2023,
    priceGross: 488495,
    priceNet: 410500,
    drivetrain: "Combustion (Petrol)",
    engine: "6.5 V12",
    power: "800 PS",
    accel: "2.9 s",
    topSpeed: "340 km/h",
    consumption: "16.4 l / 100 km",
    co2: "373 g/km",
    co2class: "G",
    mileage: "4,200 km",
    transmission: "7-speed DCT",
    colorExt: "Grigio Silverstone",
    colorInt: "Rosso leather",
    categories: ["gt"],
    tagline: "The last of the front-engined V12 Superfasts.",
    images: 10,
  },
  {
    id: "26G0849",
    brand: "Porsche",
    model: "911 GT3 RS",
    variant: "by MANTHEY",
    year: 2024,
    priceGross: 475881,
    priceNet: 399900,
    drivetrain: "Combustion (Petrol)",
    engine: "4.0 flat-six",
    power: "525 PS",
    accel: "3.2 s",
    topSpeed: "296 km/h",
    consumption: "13.4 l / 100 km",
    co2: "305 g/km",
    co2class: "G",
    mileage: "1,100 km",
    transmission: "7-speed PDK",
    colorExt: "GT Silver",
    colorInt: "Black race, carbon buckets",
    categories: ["hypercars", "gt"],
    badge: "Manthey Kit",
    tagline: "The track-bred 992 RS with the full Manthey aero package.",
    images: 10,
  },
  {
    id: "26G0852",
    brand: "KTM",
    model: "X-BOW GT-XR",
    variant: "Limited Edition",
    year: 2024,
    priceGross: 428162,
    priceNet: 359800,
    drivetrain: "Combustion (Petrol)",
    engine: "2.5 TFSI",
    power: "500 PS",
    accel: "3.4 s",
    topSpeed: "280 km/h",
    consumption: "9.1 l / 100 km",
    co2: "204 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "7-speed DSG",
    colorExt: "Carbon / signal accents",
    colorInt: "Carbon race interior",
    categories: ["hypercars"],
    badge: "1 of 100",
    tagline: "A road-legal canopy racer, strictly limited.",
    images: 10,
  },
  {
    id: "26G0837",
    brand: "Bentley",
    model: "Continental GTC",
    variant: "Speed W12",
    year: 2023,
    priceGross: null,
    priceNet: 279800,
    vatNote: "Margin scheme, VAT not applicable",
    drivetrain: "Combustion (Petrol)",
    engine: "6.0 W12 TT",
    power: "659 PS",
    accel: "3.6 s",
    topSpeed: "335 km/h",
    consumption: "On request",
    co2: "On request",
    co2class: "G",
    mileage: "9,800 km",
    transmission: "8-speed DCT",
    colorExt: "British Racing Green",
    colorInt: "Linen / Beluga hide",
    categories: ["gt", "luxury-suv"],
    tagline: "The final W12 convertible grand tourer from Crewe.",
    images: 10,
  },
  {
    id: "26G0494",
    brand: "Ferrari",
    model: "F8 Tributo",
    year: 2022,
    priceGross: null,
    priceNet: 275000,
    vatNote: "Margin scheme, VAT not applicable",
    drivetrain: "Combustion (Petrol)",
    engine: "3.9 V8 BiTurbo",
    power: "720 PS",
    accel: "2.9 s",
    topSpeed: "340 km/h",
    consumption: "On request",
    co2: "On request",
    co2class: "G",
    mileage: "11,500 km",
    transmission: "7-speed DCT",
    colorExt: "Rosso Corsa",
    colorInt: "Nero, Daytona seats",
    categories: ["gt"],
    tagline: "The most powerful V8 Ferrari of its generation.",
    images: 10,
  },
  {
    id: "26G0805",
    brand: "Aston Martin",
    model: "Vanquish S",
    year: 2018,
    priceGross: null,
    priceNet: 219900,
    vatNote: "Margin scheme, VAT not applicable",
    drivetrain: "Combustion (Petrol)",
    engine: "6.0 V12",
    power: "600 PS",
    accel: "3.5 s",
    topSpeed: "323 km/h",
    consumption: "On request",
    co2: "On request",
    co2class: "G",
    mileage: "14,300 km",
    transmission: "8-speed automatic",
    colorExt: "Ultramarine Black",
    colorInt: "Obsidian / Spicy Red",
    categories: ["gt"],
    tagline: "The last naturally aspirated V12 Vanquish.",
    images: 10,
  },
  {
    id: "26G0509",
    brand: "Land Rover",
    model: "Range Rover",
    variant: "P615 SV",
    year: 2024,
    priceGross: 261562,
    priceNet: 219800,
    drivetrain: "Combustion (Petrol)",
    engine: "4.4 V8 TT",
    power: "615 PS",
    accel: "4.4 s",
    topSpeed: "250 km/h",
    consumption: "11.8 l / 100 km",
    co2: "267 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "8-speed automatic",
    colorExt: "Sunrise Copper SV",
    colorInt: "Semi-aniline, ceramic detail",
    categories: ["luxury-suv"],
    tagline: "The SV flagship of the Range Rover line.",
    images: 10,
  },
  {
    id: "26G0820",
    brand: "Mercedes-Benz",
    model: "GLE 63 S AMG",
    variant: "4MATIC+ Coupe Facelift",
    year: 2024,
    priceGross: 175525,
    priceNet: 147500,
    drivetrain: "Combustion (Petrol)",
    engine: "4.0 V8 BiTurbo",
    power: "612 PS",
    accel: "3.8 s",
    topSpeed: "280 km/h",
    consumption: "12.6 l / 100 km",
    co2: "286 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "9-speed AMG",
    colorExt: "Obsidian Black",
    colorInt: "Nappa, AMG performance",
    categories: ["luxury-suv"],
    tagline: "The facelifted AMG coupe-SUV, fully specified.",
    images: 10,
  },
  {
    id: "26G0845",
    brand: "Mercedes-Benz",
    model: "G 63 AMG",
    variant: "Facelift",
    year: 2024,
    priceGross: 267155,
    priceNet: 224500,
    drivetrain: "Combustion (Petrol)",
    engine: "4.0 V8 BiTurbo",
    power: "585 PS",
    accel: "4.3 s",
    topSpeed: "240 km/h",
    consumption: "14.8 l / 100 km",
    co2: "338 g/km",
    co2class: "G",
    mileage: "Delivery mileage",
    transmission: "9-speed AMG",
    colorExt: "G manufaktur night black",
    colorInt: "Nappa, two-tone",
    categories: ["luxury-suv"],
    tagline: "The icon, in its latest facelifted specification.",
    images: 10,
  },
];

export const collections = [
  {
    slug: "armoured",
    title: "Armoured",
    desc: "Factory and certified ballistic protection, from discreet saloons to executive SUVs. Engineered to VR-level standards without compromising comfort.",
    gallery: 7,
  },
  {
    slug: "customized",
    title: "Customized",
    desc: "Coachbuilt and refiner editions from Mansory, Novitec, Brabus and Techart. Widebody conversions, forged carbon and one-off commissions.",
    gallery: 13,
  },
  {
    slug: "electric",
    title: "Electric",
    desc: "The new generation of electric performance and luxury, curated for clients moving toward silent, instant power.",
    gallery: 4,
  },
  {
    slug: "oldtimer",
    title: "Oldtimer",
    desc: "Investment-grade classics and youngtimers, sourced and documented for the discerning collector.",
    gallery: 16,
  },
];

export const services = [
  {
    title: "Worldwide delivery",
    desc: "Door-to-door logistics to more than 120 countries. Enclosed transport, customs handling and export documentation, fully managed.",
  },
  {
    title: "Sourcing & procurement",
    desc: "Looking for something specific? Through our network and our partner Al Ain Class Motors we locate rare and allocation-only vehicles on your behalf.",
  },
  {
    title: "Bespoke individualization",
    desc: "Interior in any leather and colour, technical retrofits such as entertainment systems, full exterior and interior conversions, and personalised keys.",
  },
  {
    title: "Trade-in & consignment",
    desc: "Fair, fast valuation of your current vehicle, or discreet consignment sale through our international clientele.",
  },
  {
    title: "Financing & leasing",
    desc: "Tailored finance and leasing structures for private and corporate clients, arranged through specialised partners.",
  },
  {
    title: "Inspection & warranty",
    desc: "Every vehicle is technically inspected and documented. Extended warranty programmes available on request.",
  },
];

export const individualization = [
  "Individualization of the interior in any type of leather and colour",
  "Technical retrofits such as entertainment and comfort systems",
  "Complete exterior and interior conversions on individual request",
  "Personalization of the vehicle key",
];

export const process = [
  {
    step: "01",
    title: "Consultation",
    desc: "We listen to the specification, the use and the timeline. Discreet, no obligation.",
  },
  {
    step: "02",
    title: "Sourcing",
    desc: "From stock or sourced worldwide through our network and refiner partners.",
  },
  {
    step: "03",
    title: "Inspection",
    desc: "Technical inspection, documentation and any bespoke individualization.",
  },
  {
    step: "04",
    title: "Delivery",
    desc: "Enclosed transport and full export handling to your door, anywhere.",
  },
];

export const team = [
  { name: "Konstantin Hollmann", role: "Founder & Managing Director" },
  { name: "Raissa Hollmann", role: "Managing Director" },
];

export const spokenLanguages = [
  "English",
  "German",
  "Russian",
  "Chinese",
  "French",
  "Arabic",
  "Bulgarian",
];

export const marques = [
  "Alpina", "Aston Martin", "Audi", "BMW", "Bentley", "Brabus", "Bugatti",
  "Dodge", "Ducati", "Ferrari", "Ford", "Ineos", "KTM", "Koenigsegg",
  "Lamborghini", "Land Rover", "Lexus", "MV Agusta", "Mansory", "Maybach",
  "McLaren", "Mercedes-Benz", "Novitec", "Porsche", "Rolls-Royce", "Techart",
  "Trasco", "Vespa",
];

export const currencies = [
  { code: "EUR", symbol: "€", rate: 1 },
  { code: "USD", symbol: "$", rate: 1.08 },
  { code: "GBP", symbol: "£", rate: 0.85 },
  { code: "CHF", symbol: "CHF ", rate: 0.96 },
  { code: "AED", symbol: "AED ", rate: 3.96 },
];

// Compact dataset shipped to the client for shortlist, compare and enquiry UIs
export const clientVehicles = vehicles.map((v) => ({
  id: v.id,
  slug: vehicleSlug(v),
  brand: v.brand,
  title: vehicleTitle(v),
  model: [v.model, v.variant].filter(Boolean).join(" "),
  priceNet: v.priceNet,
  priceGross: v.priceGross,
  vatNote: v.vatNote ?? "",
  power: v.power,
  accel: v.accel,
  topSpeed: v.topSpeed,
  engine: v.engine,
  drivetrain: v.drivetrain,
  transmission: v.transmission,
  year: v.year,
  mileage: v.mileage,
  image: carImage(v.id, 1),
  badge: v.badge ?? "",
}));

export const testimonials = [
  {
    quote:
      "I described the exact specification I wanted. Three weeks later the car was in my garage in Dubai, flawless. This is how it should be done.",
    author: "Private collector",
    location: "United Arab Emirates",
  },
  {
    quote:
      "Discretion, speed and a genuine understanding of these cars. Hollmann is the only address I call now.",
    author: "Family office",
    location: "Switzerland",
  },
  {
    quote:
      "The armoured S-Class was delivered with complete documentation and faultless finish. Trust earned.",
    author: "Corporate client",
    location: "Singapore",
  },
];
