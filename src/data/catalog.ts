import { IMG, face } from "@/lib/img";
import {
  Baby, Brush, Car, ChefHat, Dumbbell, Flower2, PaintRoller, Scissors, Shirt, Sparkles, Store, UtensilsCrossed,
  Wrench, Zap, CircleParking, Tag, Users, type LucideIcon,
} from "lucide-react";

export interface Category {
  slug: string;
  title: string;
  short: string;
  icon: LucideIcon;
  image: string;
  blurb: string;
  subs: string[];
  href?: string;
}

export const CATEGORIES: Category[] = [
  { slug: "household-help", title: "Household Help", short: "Staff", icon: Users, image: IMG.maid, blurb: "Verified maids, cooks, drivers, nannies & caregivers", subs: ["Maids", "Cleaning ladies", "Housekeepers", "Cooks", "Pakistani food cooks", "Chinese & continental cooks", "Drivers", "Family drivers", "Nannies", "Babysitters", "Caregivers", "Elderly care", "Gardeners", "Household helpers", "Live-in staff", "Temporary workers"], href: "/resident/explore/household-help" },
  { slug: "home-services", title: "Home Services", short: "Repairs", icon: Wrench, image: IMG.electrician, blurb: "AC, electricians, plumbers, carpenters & more", subs: ["AC repair", "AC servicing", "AC installation", "AC gas filling", "Electricians", "Plumbers", "Carpenters", "Appliance repair", "Glass & aluminium", "Locksmith", "Internet & network"] },
  { slug: "cleaning", title: "Cleaning & Pest Control", short: "Cleaning", icon: Sparkles, image: IMG.cleaning, blurb: "Deep cleaning, sofa & carpet care, fumigation", subs: ["Deep cleaning", "Kitchen cleaning", "Bathroom cleaning", "Sofa cleaning", "Carpet cleaning", "Mattress cleaning", "Fumigation", "Termite treatment", "Cockroach treatment", "Bedbug treatment", "Mosquito control"] },
  { slug: "painting", title: "Painting & Renovation", short: "Painting", icon: PaintRoller, image: IMG.painting, blurb: "Full apartment painting, waterproofing, wallpaper", subs: ["Full apartment painting", "Room painting", "Wall repainting", "Decorative painting", "Waterproofing", "Wallpaper installation", "Minor renovation", "Wall repair"], href: "/resident/explore/painting" },
  { slug: "car-care", title: "Car Care", short: "Car wash", icon: Car, image: IMG.carWash, blurb: "Doorstep washing & detailing in your parking bay", subs: ["Exterior wash", "Interior cleaning", "Vacuuming", "Full detailing", "Polishing", "Seat cleaning", "Monthly subscription"] },
  { slug: "laundry", title: "Laundry & Dry Cleaning", short: "Laundry", icon: Shirt, image: IMG.laundry, blurb: "Pickup, wash, press & deliver — weekly plans", subs: ["Laundry", "Dry cleaning", "Ironing", "Bedding", "Curtains", "Shoe cleaning", "Express laundry", "Weekly pickups"] },
  { slug: "salon", title: "Salon & Barber at Home", short: "Salon", icon: Scissors, image: IMG.barber, blurb: "Barbers, stylists & beauticians at your door", subs: ["Men's haircut", "Beard trim", "Shaving", "Styling", "Hair treatment", "Women's haircut", "Hair colouring", "Makeup", "Facial", "Manicure", "Pedicure", "Skincare"] },
  { slug: "plants", title: "Plants & Gardening", short: "Plants", icon: Flower2, image: IMG.plants, blurb: "Nursery delivered, balcony gardens, gardeners", subs: ["Indoor", "Outdoor", "Flowering", "Succulents", "Herbs", "Pots & planters", "Soil & fertiliser", "Gardening services"], href: "/resident/explore/plants" },
  { slug: "fitness", title: "Classes & Fitness", short: "Classes", icon: Dumbbell, image: IMG.yoga, blurb: "Trainers, swimming, yoga, tutors & kids' classes", subs: ["Personal training", "Yoga", "Pilates", "Strength", "Weight loss", "Swimming", "Kids' swimming", "Football", "Tennis", "Badminton", "Martial arts", "Self-defence", "Dance", "Music", "Art", "Languages", "Tutoring"] },
  { slug: "food", title: "Food & Home Chefs", short: "Food", icon: UtensilsCrossed, image: IMG.biryani, blurb: "Home chefs, bakers & restaurants nearby", subs: [], href: "/resident/food" },
  { slug: "marketplace", title: "Buy & Sell", short: "Market", icon: Store, image: IMG.sofa, blurb: "Pre-loved items from your neighbours", subs: [], href: "/resident/marketplace" },
  { slug: "parking", title: "Parking Rentals", short: "Parking", icon: CircleParking, image: IMG.parking, blurb: "Rent unused bays by the hour, day or month", subs: [], href: "/resident/parking" },
  { slug: "offers", title: "Offers Around You", short: "Offers", icon: Tag, image: IMG.coffee, blurb: "Deals from restaurants, cafés & shops nearby", subs: [], href: "/resident/offers" },
  { slug: "ev", title: "EV Charging", short: "EV", icon: Zap, image: IMG.ev, blurb: "Building & public chargers across Karachi", subs: [], href: "/resident/ev" },
];

export const catHref = (c: Category) => c.href ?? `/resident/explore/${c.slug}`;

export interface Service { name: string; price: number; unit?: string; duration?: string; sub?: string; quote?: boolean }
export interface Provider {
  id: string;
  name: string;
  category: string;
  person?: string;
  photo: string;
  cover: string;
  rating: number;
  reviews: number;
  jobs: number;
  verified: boolean;
  area: string;
  tagline: string;
  about: string;
  eta?: string;
  tags: string[];
  experience: string;
  languages: string[];
  services: Service[];
  portfolio?: string[];
  // fitness / classes
  qualifications?: string[];
  ageGroups?: string[];
  modes?: ("Home visit" | "Building facility" | "Gym" | "Online")[];
  kids?: boolean;
  gender?: "Male" | "Female";
  recurring?: boolean;
}

export const PROVIDERS: Provider[] = [
  // Home services
  { id: "pv-cooltech", name: "CoolTech Karachi", person: "Asif Mehmood", category: "home-services", photo: face("m2"), cover: IMG.ac, rating: 4.8, reviews: 1240, jobs: 5300, verified: true, area: "DHA & Clifton", tagline: "AC experts since 2012", about: "Inverter & split AC specialists. Certified technicians, genuine parts and 30-day service warranty.", eta: "Today", tags: ["AC servicing", "AC repair", "AC installation", "AC gas filling"], experience: "12 yrs", languages: ["Urdu", "English"], services: [
    { name: "AC general service (per unit)", price: 2500, duration: "1 h", sub: "AC servicing" },
    { name: "AC master service with jet wash", price: 3800, duration: "1.5 h", sub: "AC servicing" },
    { name: "AC gas refill (R32/R410)", price: 6500, duration: "1 h", sub: "AC gas filling" },
    { name: "Split AC installation", price: 5500, duration: "3 h", sub: "AC installation" },
    { name: "AC repair diagnosis", price: 1500, duration: "45 min", sub: "AC repair" },
  ] },
  { id: "pv-farhan", name: "Farhan Electricals", person: "Farhan Ali", category: "home-services", photo: face("m1"), cover: IMG.electrician, rating: 4.9, reviews: 612, jobs: 2100, verified: true, area: "DHA Phase V–VIII", tagline: "Licensed electrician · Same-day visits", about: "Wiring, DB boards, UPS & inverter installation, lighting and fault finding. Works with building-approved safety standards.", eta: "In 2 hours", tags: ["Electricians", "Wiring", "UPS installation"], experience: "9 yrs", languages: ["Urdu", "Punjabi"], services: [
    { name: "Visit & inspection", price: 1200, duration: "30 min", sub: "Electricians" },
    { name: "Ceiling fan installation", price: 1500, duration: "45 min", sub: "Electricians" },
    { name: "DB / breaker replacement", price: 3500, duration: "2 h", sub: "Electricians" },
    { name: "UPS / inverter installation", price: 4500, duration: "2 h", sub: "Electricians" },
    { name: "Light fixture installation (per point)", price: 600, sub: "Electricians" },
  ] },
  { id: "pv-rashid", name: "Rashid Plumbing Works", person: "Rashid Khan", category: "home-services", photo: face("m3"), cover: IMG.plumber, rating: 4.7, reviews: 488, jobs: 1650, verified: true, area: "DHA & Clifton", tagline: "Leaks, geysers & bathroom fittings", about: "Leak detection, pipe replacement, geyser service, motor & pump repairs.", eta: "Today", tags: ["Plumbers", "Leak repair", "Geyser"], experience: "15 yrs", languages: ["Urdu", "Pashto"], services: [
    { name: "Plumber visit", price: 1000, sub: "Plumbers" },
    { name: "Leak detection & fix", price: 2800, sub: "Plumbers" },
    { name: "Geyser service", price: 3200, sub: "Plumbers" },
    { name: "Water motor repair", price: 2500, sub: "Plumbers" },
  ] },
  { id: "pv-woodcraft", name: "WoodCraft Carpentry", person: "Ustad Jameel", category: "home-services", photo: face("m4"), cover: IMG.carpenter, rating: 4.6, reviews: 212, jobs: 780, verified: true, area: "Karachi South", tagline: "Furniture repair & custom fittings", about: "Wardrobes, kitchen cabinets, door repairs and custom shelving.", tags: ["Carpenters", "Locksmith"], experience: "20 yrs", languages: ["Urdu"], services: [
    { name: "Carpenter visit", price: 1000, sub: "Carpenters" },
    { name: "Door lock replacement", price: 1800, sub: "Locksmith" },
    { name: "Custom shelving (quote)", price: 0, quote: true, sub: "Carpenters" },
  ] },
  { id: "pv-fixit", name: "FixIt Appliance Care", person: "Owais Hassan", category: "home-services", photo: face("m5"), cover: IMG.electrician, rating: 4.5, reviews: 340, jobs: 1200, verified: true, area: "Karachi", tagline: "Washing machines, fridges, ovens", about: "Repair for all major brands — Haier, Dawlance, PEL, Samsung, LG.", tags: ["Appliance repair", "Internet & network", "Glass & aluminium"], experience: "7 yrs", languages: ["Urdu", "English"], services: [
    { name: "Appliance diagnosis", price: 1200, sub: "Appliance repair" },
    { name: "Wi-Fi & router setup", price: 2000, sub: "Internet & network" },
    { name: "Aluminium window repair", price: 2500, sub: "Glass & aluminium" },
  ] },
  // Cleaning
  { id: "pv-safaipro", name: "SafaiPro", person: "Team of 4", category: "cleaning", photo: face("w2"), cover: IMG.cleaning, rating: 4.8, reviews: 920, jobs: 4100, verified: true, area: "All Karachi", tagline: "Hotel-grade deep cleaning", about: "Trained, background-checked teams with professional equipment and eco-friendly chemicals.", eta: "Tomorrow", tags: ["Deep cleaning", "Kitchen cleaning", "Bathroom cleaning", "Sofa cleaning", "Carpet cleaning", "Mattress cleaning"], experience: "6 yrs", languages: ["Urdu"], services: [
    { name: "Deep cleaning — 2 bed", price: 11000, duration: "4 h", sub: "Deep cleaning" },
    { name: "Deep cleaning — 3 bed", price: 14500, duration: "5 h", sub: "Deep cleaning" },
    { name: "Kitchen deep clean", price: 5500, duration: "2.5 h", sub: "Kitchen cleaning" },
    { name: "Sofa shampoo (per seat)", price: 900, sub: "Sofa cleaning" },
    { name: "Carpet cleaning (per sq ft)", price: 35, sub: "Carpet cleaning" },
    { name: "Mattress sanitisation", price: 2800, sub: "Mattress cleaning" },
  ] },
  { id: "pv-pestaway", name: "PestAway Karachi", person: "Certified team", category: "cleaning", photo: face("m6"), cover: IMG.pest, rating: 4.7, reviews: 530, jobs: 3300, verified: true, area: "All Karachi", tagline: "Odourless, child-safe fumigation", about: "Government-registered pest control with 3-month warranty. Building-approved chemicals.", eta: "Tomorrow", tags: ["Fumigation", "Termite treatment", "Cockroach treatment", "Bedbug treatment", "Mosquito control"], experience: "11 yrs", languages: ["Urdu", "English"], services: [
    { name: "Cockroach gel treatment", price: 4500, sub: "Cockroach treatment" },
    { name: "Full apartment fumigation", price: 7500, sub: "Fumigation" },
    { name: "Termite treatment (quote)", price: 0, quote: true, sub: "Termite treatment" },
    { name: "Bedbug heat treatment", price: 9500, sub: "Bedbug treatment" },
    { name: "Mosquito fogging", price: 3000, sub: "Mosquito control" },
  ] },
  // Painting
  { id: "pv-rangrez", name: "Rangrez Painters", person: "Ustad Iqbal", category: "painting", photo: face("m4"), cover: IMG.painting, rating: 4.8, reviews: 310, jobs: 900, verified: true, area: "DHA & Clifton", tagline: "Premium finishes with Berger & ICI", about: "Apartment painting with furniture covering, crack filling and post-paint cleaning. Quote based on size and photos.", tags: ["Full apartment painting", "Room painting", "Decorative painting", "Wall repair"], experience: "18 yrs", languages: ["Urdu", "Punjabi"], portfolio: [IMG.painting, IMG.livingRoom, IMG.interior], services: [
    { name: "Room painting (per room)", price: 18000, sub: "Room painting" },
    { name: "Full apartment painting (quote)", price: 0, quote: true, sub: "Full apartment painting" },
    { name: "Feature wall — decorative", price: 22000, sub: "Decorative painting" },
  ] },
  { id: "pv-drycoat", name: "DryCoat Waterproofing", person: "Engr. Zubair", category: "painting", photo: face("m1"), cover: IMG.interior, rating: 4.6, reviews: 120, jobs: 410, verified: true, area: "Karachi", tagline: "Seepage & roof waterproofing", about: "Chemical waterproofing, seepage treatment and wallpaper installation.", tags: ["Waterproofing", "Wallpaper installation", "Minor renovation"], experience: "10 yrs", languages: ["Urdu", "English"], services: [
    { name: "Seepage treatment (per wall)", price: 9500, sub: "Waterproofing" },
    { name: "Wallpaper installation (per roll)", price: 1800, sub: "Wallpaper installation" },
  ] },
  // Car care
  { id: "pv-sparkwash", name: "SparkWash Mobile", person: "Adeel & team", category: "car-care", photo: face("m6"), cover: IMG.carWash, rating: 4.7, reviews: 860, jobs: 6100, verified: true, area: "DHA & Clifton", tagline: "Waterless wash in your parking bay", about: "Eco waterless washing, interior detailing and monthly subscriptions. No water mess in basements.", eta: "Today", recurring: true, tags: ["Exterior wash", "Interior cleaning", "Vacuuming", "Monthly subscription"], experience: "5 yrs", languages: ["Urdu"], services: [
    { name: "Exterior wash", price: 1200, duration: "30 min", sub: "Exterior wash" },
    { name: "Interior + vacuum", price: 1800, duration: "45 min", sub: "Interior cleaning" },
    { name: "Monthly plan — 4 washes", price: 6500, sub: "Monthly subscription" },
  ] },
  { id: "pv-detailers", name: "Karachi Detailers", person: "Saad Qureshi", category: "car-care", photo: face("m5"), cover: IMG.carWash, rating: 4.9, reviews: 240, jobs: 900, verified: true, area: "Karachi", tagline: "Ceramic coating & full detailing", about: "Paint correction, polishing, seat shampoo and ceramic coating.", tags: ["Full detailing", "Polishing", "Seat cleaning"], experience: "8 yrs", languages: ["Urdu", "English"], services: [
    { name: "Full detailing", price: 12000, duration: "4 h", sub: "Full detailing" },
    { name: "Machine polish", price: 8000, duration: "3 h", sub: "Polishing" },
    { name: "Seat shampoo", price: 4500, duration: "2 h", sub: "Seat cleaning" },
  ] },
  // Laundry
  { id: "pv-pressperfect", name: "PressPerfect Laundry", person: "Express service", category: "laundry", photo: face("w4"), cover: IMG.laundry, rating: 4.6, reviews: 1430, jobs: 12000, verified: true, area: "DHA, Clifton, PECHS", tagline: "48-hour turnaround, free pickup", about: "Wash & fold, dry cleaning, curtains & bedding. Weekly pickups and real-time tracking.", eta: "Pickup today", recurring: true, tags: ["Laundry", "Dry cleaning", "Ironing", "Bedding", "Curtains", "Shoe cleaning", "Express laundry", "Weekly pickups"], experience: "9 yrs", languages: ["Urdu", "English"], services: [
    { name: "Wash & fold (per kg)", price: 380, sub: "Laundry" },
    { name: "Ironing (per piece)", price: 60, sub: "Ironing" },
    { name: "Dry clean — suit / shalwar kameez", price: 650, sub: "Dry cleaning" },
    { name: "Curtains (per panel)", price: 900, sub: "Curtains" },
    { name: "Shoe cleaning (per pair)", price: 1200, sub: "Shoe cleaning" },
    { name: "Weekly plan — 10 kg", price: 2400, sub: "Weekly pickups" },
  ] },
  // Salon
  { id: "pv-saleem", name: "Ustad Saleem", person: "Saleem Ahmed", category: "salon", photo: face("m3"), cover: IMG.barber, rating: 4.9, reviews: 780, jobs: 5200, verified: true, area: "DHA & Clifton", gender: "Male", tagline: "Classic cuts & hot towel shaves", about: "20 years behind the chair. Sterilised kit, disposable capes — your living room becomes a barbershop.", eta: "Tonight", tags: ["Men's haircut", "Beard trim", "Shaving", "Styling", "Hair treatment"], experience: "20 yrs", languages: ["Urdu"], portfolio: [IMG.barber, IMG.salon], services: [
    { name: "Haircut", price: 1200, duration: "30 min", sub: "Men's haircut" },
    { name: "Haircut & beard trim", price: 1800, duration: "45 min", sub: "Beard trim" },
    { name: "Hot towel shave", price: 900, duration: "25 min", sub: "Shaving" },
    { name: "Kids' haircut", price: 800, duration: "20 min", sub: "Men's haircut" },
    { name: "Hair & scalp treatment", price: 2500, duration: "40 min", sub: "Hair treatment" },
  ] },
  { id: "pv-glam", name: "Glam by Hina", person: "Hina Siddiqui", category: "salon", photo: face("w1"), cover: IMG.makeup, rating: 4.9, reviews: 640, jobs: 2300, verified: true, area: "Karachi South", gender: "Female", tagline: "Bridal & party makeup artist", about: "Women-only team. Makeup, hair styling, facials and mani-pedi at home.", eta: "Tomorrow", tags: ["Women's haircut", "Styling", "Hair colouring", "Makeup", "Facial", "Manicure", "Pedicure", "Skincare"], experience: "11 yrs", languages: ["Urdu", "English"], portfolio: [IMG.makeup, IMG.salon], services: [
    { name: "Haircut & blow-dry", price: 3500, duration: "1 h", sub: "Women's haircut" },
    { name: "Party makeup", price: 9000, duration: "1.5 h", sub: "Makeup" },
    { name: "Hydrating facial", price: 4500, duration: "1 h", sub: "Facial" },
    { name: "Mani + pedi", price: 3800, duration: "1.5 h", sub: "Manicure" },
    { name: "Global hair colour", price: 8500, duration: "2 h", sub: "Hair colouring" },
  ] },
  { id: "pv-fade", name: "The Fade Lab", person: "Danish Khan", category: "salon", photo: face("m5"), cover: IMG.barber, rating: 4.7, reviews: 290, jobs: 1100, verified: true, area: "DHA", gender: "Male", tagline: "Modern fades & styling", about: "Skin fades, textured crops and grooming packages.", tags: ["Men's haircut", "Styling", "Beard trim"], experience: "6 yrs", languages: ["Urdu", "English"], services: [
    { name: "Skin fade", price: 2000, duration: "45 min", sub: "Men's haircut" },
    { name: "Groom package", price: 3500, duration: "1 h", sub: "Styling" },
  ] },
  // Gardening services
  { id: "pv-greenthumb", name: "GreenThumb Gardeners", person: "Mali Bashir", category: "plants", photo: face("m4"), cover: IMG.gardening, rating: 4.8, reviews: 210, jobs: 950, verified: true, area: "DHA & Clifton", tagline: "Balcony & terrace gardens", about: "Balcony gardening, plant installation, repotting, pruning and monthly maintenance plans.", eta: "Tomorrow", recurring: true, tags: ["Balcony gardening", "Terrace gardening", "Plant installation", "Repotting", "Pruning", "Watering", "Plant health checks", "Pest treatment", "Garden design", "Lawn maintenance", "Fertilisation"], experience: "14 yrs", languages: ["Urdu", "Sindhi"], services: [
    { name: "Plant installation visit", price: 1500, sub: "Plant installation" },
    { name: "Repotting (per plant)", price: 350, sub: "Repotting" },
    { name: "Balcony garden setup", price: 12000, sub: "Balcony gardening" },
    { name: "Monthly care plan (4 visits)", price: 6000, sub: "Watering" },
    { name: "Plant health check", price: 1200, sub: "Plant health checks" },
  ] },
  // Fitness & classes
  { id: "pv-faisal", name: "Coach Faisal Ahmed", category: "fitness", photo: face("m5"), cover: IMG.trainer, rating: 4.9, reviews: 180, jobs: 1400, verified: true, area: "DHA", gender: "Male", tagline: "Strength & weight-loss coach", about: "ACE-certified trainer helping professionals lose weight and build strength. Sessions at home or in the Ocean Heights gym.", tags: ["Personal training", "Strength", "Weight loss"], experience: "8 yrs", languages: ["Urdu", "English"], qualifications: ["ACE Certified Personal Trainer", "Precision Nutrition L1", "First Aid & CPR"], ageGroups: ["Adults", "Seniors"], modes: ["Home visit", "Building facility", "Gym"], recurring: true, services: [
    { name: "1:1 session", price: 3500, duration: "60 min", sub: "Personal training" },
    { name: "Package — 12 sessions", price: 36000, sub: "Personal training" },
    { name: "Weight-loss programme (8 wks)", price: 55000, sub: "Weight loss" },
  ] },
  { id: "pv-sara-yoga", name: "Sara Mirza Yoga", category: "fitness", photo: face("w6"), cover: IMG.yoga, rating: 4.9, reviews: 260, jobs: 2200, verified: true, area: "Clifton & DHA", gender: "Female", tagline: "Hatha & vinyasa · Women's batches", about: "RYT-500 teacher. Rooftop group classes at Ocean Heights and private sessions at home.", tags: ["Yoga", "Pilates"], experience: "10 yrs", languages: ["Urdu", "English"], qualifications: ["RYT-500 Yoga Alliance", "Mat Pilates Certified"], ageGroups: ["Adults", "Seniors"], modes: ["Building facility", "Home visit", "Online"], recurring: true, services: [
    { name: "Rooftop group class (drop-in)", price: 1500, duration: "60 min", sub: "Yoga" },
    { name: "Monthly — 3x weekly group", price: 12000, sub: "Yoga" },
    { name: "Private session", price: 4500, duration: "60 min", sub: "Yoga" },
  ] },
  { id: "pv-aqua", name: "AquaKids Swim School", person: "Coach Ayesha Noor", category: "fitness", photo: face("w3"), cover: IMG.swimming, rating: 4.9, reviews: 340, jobs: 3100, verified: true, area: "Ocean Heights pool", gender: "Female", tagline: "Swimming for ages 4+ and adults", about: "ASA-certified coaches, 1:4 ratio for kids, female coach available. Lessons held in the Ocean Heights pool.", kids: true, tags: ["Swimming", "Kids' swimming"], experience: "12 yrs", languages: ["Urdu", "English"], qualifications: ["ASA Level 2 Swimming Coach", "RLSS Lifeguard", "Safeguarding Children (Level 2)"], ageGroups: ["4–7 yrs", "8–12 yrs", "Teens", "Adults"], modes: ["Building facility"], recurring: true, services: [
    { name: "Kids — 8 lessons (weekend batch)", price: 16000, duration: "45 min", sub: "Kids' swimming" },
    { name: "Adult beginner — 8 lessons", price: 20000, duration: "45 min", sub: "Swimming" },
    { name: "Trial lesson", price: 2500, duration: "45 min", sub: "Kids' swimming" },
  ] },
  { id: "pv-ace-tennis", name: "Ace Tennis Academy", person: "Coach Haris", category: "fitness", photo: face("m1"), cover: IMG.tennis, rating: 4.7, reviews: 95, jobs: 600, verified: true, area: "DHA Creek Club", gender: "Male", tagline: "Tennis & badminton coaching", about: "Group and private coaching for juniors and adults.", kids: true, tags: ["Tennis", "Badminton", "Football"], experience: "9 yrs", languages: ["Urdu", "English"], qualifications: ["ITF Level 1 Coach"], ageGroups: ["6–12 yrs", "Teens", "Adults"], modes: ["Building facility", "Gym"], recurring: true, services: [
    { name: "Junior group — monthly", price: 9000, sub: "Tennis" },
    { name: "Private lesson", price: 3500, duration: "60 min", sub: "Tennis" },
  ] },
  { id: "pv-karate", name: "Shotokan Dojo Karachi", person: "Sensei Kamran", category: "fitness", photo: face("m2"), cover: IMG.gym, rating: 4.8, reviews: 140, jobs: 800, verified: true, area: "Community hall", gender: "Male", tagline: "Martial arts & self-defence", about: "Kids' karate and women's self-defence workshops in the Ocean Heights community hall.", kids: true, tags: ["Martial arts", "Self-defence"], experience: "16 yrs", languages: ["Urdu", "English"], qualifications: ["3rd Dan Black Belt (JKA)", "Safeguarding Children"], ageGroups: ["5–12 yrs", "Teens", "Adults"], modes: ["Building facility"], recurring: true, services: [
    { name: "Kids' karate — monthly (2x week)", price: 7000, sub: "Martial arts" },
    { name: "Women's self-defence workshop", price: 4000, sub: "Self-defence" },
  ] },
  { id: "pv-tutor", name: "Ms. Fatima Zaidi", category: "fitness", photo: face("w5"), cover: IMG.tutoring, rating: 4.9, reviews: 76, jobs: 400, verified: true, area: "DHA", gender: "Female", tagline: "O/A Level maths & physics tutor", about: "Cambridge-qualified tutor. Home tuition and small batches in the building meeting room.", kids: true, tags: ["Tutoring", "Languages"], experience: "7 yrs", languages: ["English", "Urdu"], qualifications: ["MSc Physics, LUMS", "Cambridge examiner (2022–)"], ageGroups: ["11–18 yrs"], modes: ["Home visit", "Building facility", "Online"], recurring: true, services: [
    { name: "1:1 tuition (per hour)", price: 4000, duration: "60 min", sub: "Tutoring" },
    { name: "Monthly — 2x weekly", price: 28000, sub: "Tutoring" },
  ] },
  { id: "pv-music", name: "Sur Sangeet Music", person: "Ustad Raheel", category: "fitness", photo: face("m6"), cover: IMG.music, rating: 4.8, reviews: 64, jobs: 300, verified: true, area: "Clifton", gender: "Male", tagline: "Guitar, piano, vocals & art", about: "Music and art lessons for children and adults.", kids: true, tags: ["Music", "Art", "Dance"], experience: "12 yrs", languages: ["Urdu", "English"], qualifications: ["Trinity Grade 8 Piano"], ageGroups: ["6+ yrs", "Adults"], modes: ["Home visit", "Online"], recurring: true, services: [
    { name: "Guitar lesson", price: 3000, duration: "45 min", sub: "Music" },
    { name: "Kids' art class (monthly)", price: 8000, sub: "Art" },
  ] },
];

export const providersFor = (slug: string) => PROVIDERS.filter((p) => p.category === slug);
export const getProvider = (id: string) => PROVIDERS.find((p) => p.id === id);

export interface Candidate {
  id: string;
  name: string;
  photo: string;
  role: string;
  roles: string[];
  age: number;
  experience: number;
  skills: string[];
  languages: string[];
  salary: number;
  salaryUnit: "month" | "day" | "hour";
  types: ("Full-time" | "Part-time" | "Daily" | "Hourly" | "Monthly" | "Temporary" | "Live-in")[];
  availability: string;
  area: string;
  verified: { cnic: boolean; police: boolean; references: boolean; medical?: boolean };
  rating: number;
  reviews: number;
  about: string;
  references: { name: string; relation: string; phone: string; years: string }[];
  agency?: string;
}

export const CANDIDATES: Candidate[] = [
  { id: "cd-1", name: "Nasreen Bibi", photo: face("w5"), role: "Maid", roles: ["Maids", "Cleaning ladies", "Housekeepers"], age: 34, experience: 8, skills: ["Cleaning", "Laundry & ironing", "Dusting", "Dishwashing", "Basic cooking"], languages: ["Urdu", "Punjabi"], salary: 28000, salaryUnit: "month", types: ["Part-time", "Monthly"], availability: "Mon–Sat, mornings", area: "Neelum Colony (15 min)", verified: { cnic: true, police: true, references: true, medical: true }, rating: 4.8, reviews: 23, about: "Worked 5 years with a family in DHA Phase VI. Punctual, careful with valuables, comfortable with pets.", references: [{ name: "Mrs. Rehana Aziz", relation: "Previous employer", phone: "+92 300 2xx xx41", years: "2019–2024" }, { name: "Mrs. Samina Sheikh", relation: "Current part-time", phone: "+92 321 8xx xx09", years: "2024–now" }] },
  { id: "cd-2", name: "Shabana Parveen", photo: face("w3"), role: "Maid", roles: ["Maids", "Housekeepers", "Live-in staff"], age: 41, experience: 14, skills: ["Housekeeping", "Laundry", "Cooking — desi", "Elderly assistance"], languages: ["Urdu", "Saraiki"], salary: 45000, salaryUnit: "month", types: ["Full-time", "Live-in"], availability: "Immediate · Live-in", area: "Can relocate", verified: { cnic: true, police: true, references: true }, rating: 4.9, reviews: 31, about: "Experienced live-in housekeeper. Manages full household routines and supervises other staff.", references: [{ name: "Mr. Javed Iqbal", relation: "Employer, Clifton", phone: "+92 333 4xx xx18", years: "2015–2025" }] },
  { id: "cd-3", name: "Abdul Ghaffar", photo: face("m4"), role: "Cook", roles: ["Cooks", "Pakistani food cooks"], age: 45, experience: 18, skills: ["Karahi & handi", "Biryani & pulao", "BBQ", "Daal & sabzi", "Baking basics"], languages: ["Urdu", "Pashto"], salary: 55000, salaryUnit: "month", types: ["Full-time", "Part-time"], availability: "From 1 Dec", area: "Mehmoodabad (20 min)", verified: { cnic: true, police: true, references: true, medical: true }, rating: 4.9, reviews: 17, about: "Former restaurant cook. Known for Peshawari karahi and mutton pulao. Hygiene trained.", references: [{ name: "Mrs. Nighat Rizvi", relation: "Employer, DHA Phase V", phone: "+92 300 9xx xx77", years: "2016–2025" }] },
  { id: "cd-4", name: "Joseph Masih", photo: face("m2"), role: "Cook", roles: ["Cooks", "Chinese & continental cooks"], age: 38, experience: 12, skills: ["Chinese", "Continental", "Pasta & bakes", "Desserts", "Meal prep"], languages: ["Urdu", "English"], salary: 65000, salaryUnit: "month", types: ["Full-time"], availability: "Immediate", area: "Essa Nagri (25 min)", verified: { cnic: true, police: true, references: true }, rating: 4.8, reviews: 12, about: "Trained at a 5-star hotel kitchen. Plans weekly menus and manages groceries.", references: [{ name: "Chef Adnan", relation: "Head chef, hotel", phone: "+92 321 2xx xx55", years: "2014–2020" }] },
  { id: "cd-5", name: "Muhammad Saleem", photo: face("m1"), role: "Driver", roles: ["Drivers", "Personal drivers", "Family drivers"], age: 36, experience: 11, skills: ["Automatic & manual", "Karachi routes", "School runs", "Basic maintenance"], languages: ["Urdu", "Punjabi"], salary: 42000, salaryUnit: "month", types: ["Full-time", "Monthly"], availability: "Immediate", area: "Ibrahim Hyderi (20 min)", verified: { cnic: true, police: true, references: true }, rating: 4.7, reviews: 19, about: "Valid LTV licence. Clean driving record. Experienced with family & school duty.", references: [{ name: "Mr. Asad Khan", relation: "Employer", phone: "+92 300 8xx xx12", years: "2018–2025" }] },
  { id: "cd-6", name: "Rukhsana Kausar", photo: face("w2"), role: "Nanny", roles: ["Nannies", "Babysitters"], age: 32, experience: 9, skills: ["Newborn care", "Toddler routines", "Feeding & hygiene", "Homework help", "First aid"], languages: ["Urdu", "English (basic)"], salary: 40000, salaryUnit: "month", types: ["Full-time", "Part-time", "Live-in"], availability: "Mon–Sat", area: "Korangi (25 min)", verified: { cnic: true, police: true, references: true, medical: true }, rating: 4.9, reviews: 21, about: "Cared for twins from birth to age 4. Paediatric first-aid certified.", references: [{ name: "Dr. Maha Ali", relation: "Employer", phone: "+92 333 7xx xx30", years: "2020–2025" }] },
  { id: "cd-7", name: "Sister Grace", photo: face("w4"), role: "Caregiver", roles: ["Caregivers", "Elderly care"], age: 44, experience: 15, skills: ["Elderly care", "Medication schedules", "Mobility support", "BP & sugar monitoring", "Post-surgery care"], languages: ["Urdu", "English"], salary: 3500, salaryUnit: "day", types: ["Daily", "Live-in", "Temporary"], availability: "12-hour or 24-hour shifts", area: "Saddar", verified: { cnic: true, police: true, references: true, medical: true }, rating: 5.0, reviews: 14, about: "Registered nursing assistant with hospital experience. Compassionate elderly care.", references: [{ name: "Aga Khan Hospital ward", relation: "Former workplace", phone: "+92 21 3xx xx00", years: "2010–2018" }] },
  { id: "cd-8", name: "Ghulam Rasool", photo: face("m6"), role: "Gardener", roles: ["Gardeners", "Household helpers"], age: 50, experience: 22, skills: ["Lawn care", "Pruning", "Potted plants", "Composting"], languages: ["Urdu", "Sindhi"], salary: 900, salaryUnit: "hour", types: ["Hourly", "Part-time"], availability: "Tue, Thu, Sat", area: "Chanesar Goth", verified: { cnic: true, police: false, references: true }, rating: 4.6, reviews: 9, about: "Maintains rooftop and balcony gardens for several DHA buildings.", references: [{ name: "Mr. Hassan", relation: "Building manager", phone: "+92 300 1xx xx88", years: "2015–now" }] },
  { id: "cd-9", name: "Kamran Yousuf", photo: face("m3"), role: "Household helper", roles: ["Household helpers", "Temporary workers", "Cleaning ladies"], age: 27, experience: 4, skills: ["Shifting help", "Heavy cleaning", "Errands", "Event help"], languages: ["Urdu"], salary: 2500, salaryUnit: "day", types: ["Daily", "Temporary"], availability: "On-demand", area: "Clifton", verified: { cnic: true, police: true, references: false }, rating: 4.5, reviews: 11, about: "Reliable helper for moving days, events and heavy cleaning.", references: [] },
];

export const STAFF_TYPES = ["All", "Maids", "Cooks", "Drivers", "Nannies", "Caregivers", "Gardeners", "Live-in staff", "Temporary workers"];

export interface PlantProduct { id: string; name: string; category: string; price: number; image: string; light: string; water: string; size: string; petSafe?: boolean; bestseller?: boolean; nursery: string }
export const PLANTS: PlantProduct[] = [
  { id: "pl-1", name: "Monstera Deliciosa", category: "Indoor", price: 4500, image: "1614594975525-e45190c55d0b", light: "Bright indirect", water: "Weekly", size: "3 ft with pot", bestseller: true, nursery: "Clifton Nursery" },
  { id: "pl-2", name: "Snake Plant (Sansevieria)", category: "Indoor", price: 1800, image: "1593482892290-f54927ae1bb6", light: "Low to bright", water: "Every 2 weeks", size: "2 ft", nursery: "Clifton Nursery" },
  { id: "pl-3", name: "Areca Palm", category: "Indoor", price: 3200, image: "1600411833196-7c1f6b1a8b90", light: "Bright indirect", water: "Twice weekly", size: "4 ft", petSafe: true, nursery: "Bagh-e-Ibn-e-Qasim Nursery" },
  { id: "pl-4", name: "Bougainvillea", category: "Flowering", price: 1500, image: "1597305877032-0668b3c6413a", light: "Full sun", water: "Twice weekly", size: "3 ft", bestseller: true, nursery: "Clifton Nursery" },
  { id: "pl-5", name: "Jasmine (Motia)", category: "Flowering", price: 900, image: "1595351298020-038700609878", light: "Full sun", water: "Daily in summer", size: "1.5 ft", nursery: "Bagh-e-Ibn-e-Qasim Nursery" },
  { id: "pl-6", name: "Succulent trio", category: "Succulents", price: 1200, image: "1459411552884-841db9b3cc2a", light: "Bright", water: "Every 2 weeks", size: "Tabletop", petSafe: true, nursery: "Urban Leaf" },
  { id: "pl-7", name: "Golden Barrel Cactus", category: "Succulents", price: 1400, image: "1509423350716-97f9360b4e09", light: "Full sun", water: "Monthly", size: "6 in", nursery: "Urban Leaf" },
  { id: "pl-8", name: "Herb kit — mint, basil, coriander", category: "Herbs", price: 1600, image: "1466692476868-aef1dfb1e735", light: "Sunny balcony", water: "Daily", size: "3 pots", petSafe: true, bestseller: true, nursery: "Urban Leaf" },
  { id: "pl-9", name: "Lemon tree (dwarf)", category: "Outdoor", price: 3800, image: "1587049352846-4a222e784d38", light: "Full sun", water: "Twice weekly", size: "3 ft", nursery: "Clifton Nursery" },
  { id: "pl-10", name: "Terracotta planter set (3)", category: "Pots & planters", price: 2600, image: "1485955900006-10f4d324d411", light: "—", water: "—", size: "8/10/12 in", nursery: "Urban Leaf" },
  { id: "pl-11", name: "Organic potting mix 10 kg", category: "Soil & fertiliser", price: 950, image: "1416879595882-3373a0480b5b", light: "—", water: "—", size: "10 kg", nursery: "Bagh-e-Ibn-e-Qasim Nursery" },
  { id: "pl-12", name: "Fiddle Leaf Fig", category: "Indoor", price: 5500, image: "1545241047-6083a3684587", light: "Bright indirect", water: "Weekly", size: "4 ft", nursery: "Clifton Nursery" },
];

export const PLANT_CATS = ["All", "Indoor", "Outdoor", "Flowering", "Succulents", "Herbs", "Pots & planters", "Soil & fertiliser"];

export const ICONS_BY_SLUG: Record<string, LucideIcon> = {
  "household-help": Users, "home-services": Wrench, cleaning: Sparkles, painting: PaintRoller, "car-care": Car, laundry: Shirt, salon: Scissors, plants: Flower2, fitness: Dumbbell, food: ChefHat, nanny: Baby, brush: Brush,
};
