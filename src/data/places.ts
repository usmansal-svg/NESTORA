import { IMG, face } from "@/lib/img";

export interface MenuItem { id: string; name: string; price: number; desc: string; image?: string; allergens?: string[]; veg?: boolean; bestseller?: boolean; serves?: string }
export interface Seller {
  id: string; name: string; kind: "Home chef" | "Home baker" | "Restaurant" | "Resident business" | "Local vendor";
  apt?: string; owner?: string; ownerPhoto?: string; cover: string; rating: number; reviews: number; eta: string; distance: string;
  cuisines: string[]; minOrder: number; delivery: boolean; pickup: boolean; open: boolean; hours: string; tagline: string;
  hygiene?: boolean; offer?: string; menu: MenuItem[];
}

export const FOOD_CATS = [
  { id: "Biryani", image: IMG.biryani }, { id: "Pakistani", image: IMG.karahi }, { id: "BBQ", image: IMG.bbqFood }, { id: "Chinese", image: IMG.chinese },
  { id: "Snacks", image: IMG.snacks }, { id: "Desserts", image: IMG.dessert }, { id: "Cakes", image: IMG.cake }, { id: "Frozen", image: IMG.snacks },
  { id: "Healthy", image: IMG.healthy }, { id: "Lunch boxes", image: IMG.healthy }, { id: "Breakfast", image: IMG.breakfast }, { id: "Ramadan boxes", image: IMG.dessert },
];

export const SELLERS: Seller[] = [
  { id: "fs-ammi", name: "Ammi's Kitchen", kind: "Home chef", apt: "C-0905", owner: "Farzana Siddiqui", ownerPhoto: face("w3"), cover: IMG.biryani, rating: 4.9, reviews: 412, eta: "35–45 min", distance: "In your building", cuisines: ["Biryani", "Pakistani", "Frozen"], minOrder: 800, delivery: true, pickup: true, open: true, hours: "12 PM – 10 PM", tagline: "Dum-pukht biryani & home-style salans", hygiene: true, offer: "Free raita on biryani orders", menu: [
    { id: "m1", name: "Chicken Biryani (full)", price: 1650, desc: "Serves 3–4. Sindhi-style with aloo, slow dum.", image: IMG.biryani, allergens: ["Dairy"], bestseller: true, serves: "3–4" },
    { id: "m2", name: "Mutton Biryani (full)", price: 2600, desc: "Tender bakra gosht, kewra & saffron.", image: IMG.biryani, allergens: ["Dairy"], serves: "3–4" },
    { id: "m3", name: "Chicken Karahi (1 kg)", price: 2400, desc: "Tomato-ginger karahi, made to order.", image: IMG.karahi, allergens: ["Dairy"], bestseller: true },
    { id: "m4", name: "Daal Chawal combo", price: 650, desc: "Masoor daal, zeera rice, kachumber.", image: IMG.healthy, veg: true },
    { id: "m5", name: "Frozen chicken samosas (24)", price: 1300, desc: "Ready to fry. Ramadan favourite.", image: IMG.snacks, allergens: ["Gluten"] },
    { id: "m6", name: "Raita", price: 120, desc: "Mint & cucumber.", allergens: ["Dairy"], veg: true },
  ] },
  { id: "fs-sweet", name: "Sweet Tooth by Maham", kind: "Home baker", apt: "A-0507", owner: "Maham Tariq", ownerPhoto: face("w6"), cover: IMG.cake, rating: 4.8, reviews: 230, eta: "Pre-order · 24 h", distance: "In your building", cuisines: ["Cakes", "Desserts"], minOrder: 1500, delivery: true, pickup: true, open: true, hours: "Orders till 8 PM", tagline: "Custom cakes, brownies & cheesecakes", hygiene: true, menu: [
    { id: "s1", name: "Lotus cheesecake (8\")", price: 4200, desc: "Biscoff base, baked cheesecake.", image: IMG.cake, allergens: ["Dairy", "Gluten", "Eggs"], bestseller: true },
    { id: "s2", name: "Fudge brownies (box of 9)", price: 1800, desc: "Belgian chocolate, walnut optional.", image: IMG.dessert, allergens: ["Dairy", "Gluten", "Eggs", "Nuts"] },
    { id: "s3", name: "Birthday cake — 2 lb", price: 3800, desc: "Choose chocolate, vanilla or red velvet.", image: IMG.cake, allergens: ["Dairy", "Gluten", "Eggs"] },
    { id: "s4", name: "Kheer (family pot)", price: 1200, desc: "Slow-cooked rice pudding, pistachio.", image: IMG.dessert, allergens: ["Dairy", "Nuts"], veg: true },
  ] },
  { id: "fs-kolachi", name: "Kolachi Grill", kind: "Restaurant", cover: IMG.bbqFood, rating: 4.6, reviews: 3200, eta: "40–55 min", distance: "2.8 km · Do Darya", cuisines: ["BBQ", "Pakistani"], minOrder: 1500, delivery: true, pickup: true, open: true, hours: "6 PM – 2 AM", tagline: "Seaside BBQ classics", offer: "20% off family platters", menu: [
    { id: "k1", name: "Family BBQ platter", price: 6800, desc: "Seekh, tikka, malai boti, naan. Serves 4.", image: IMG.bbqFood, allergens: ["Dairy", "Gluten"], bestseller: true },
    { id: "k2", name: "Chicken tikka (leg)", price: 950, desc: "Charcoal-grilled, mint chutney.", image: IMG.bbqFood },
    { id: "k3", name: "Mutton karahi (half)", price: 2900, desc: "Peshawari style.", image: IMG.karahi },
    { id: "k4", name: "Garlic naan", price: 180, desc: "Tandoor fresh.", allergens: ["Gluten", "Dairy"], veg: true },
  ] },
  { id: "fs-wok", name: "Wok This Way", kind: "Resident business", apt: "B-1501", owner: "Ali & Zoya Chen", ownerPhoto: face("m2"), cover: IMG.chinese, rating: 4.7, reviews: 156, eta: "30–40 min", distance: "In your building", cuisines: ["Chinese"], minOrder: 1000, delivery: true, pickup: true, open: true, hours: "1 PM – 11 PM", tagline: "Karachi-Chinese comfort food", hygiene: true, menu: [
    { id: "w1", name: "Chicken Manchurian + egg fried rice", price: 1350, desc: "Serves 1–2.", image: IMG.chinese, allergens: ["Soy", "Eggs"], bestseller: true },
    { id: "w2", name: "Chicken chow mein", price: 1100, desc: "Wok-tossed noodles.", image: IMG.chinese, allergens: ["Soy", "Gluten"] },
    { id: "w3", name: "Hot & sour soup (family)", price: 900, desc: "Serves 4.", allergens: ["Soy", "Eggs"] },
  ] },
  { id: "fs-fit", name: "FitBox Meals", kind: "Local vendor", cover: IMG.healthy, rating: 4.5, reviews: 640, eta: "Next day", distance: "Bukhari Commercial", cuisines: ["Healthy", "Lunch boxes", "Breakfast"], minOrder: 900, delivery: true, pickup: false, open: true, hours: "Subscriptions", tagline: "Macro-counted lunch boxes", menu: [
    { id: "f1", name: "Grilled chicken bowl", price: 1250, desc: "520 kcal · 42 g protein.", image: IMG.healthy, bestseller: true },
    { id: "f2", name: "Weekly lunch box (5 days)", price: 5800, desc: "Rotating menu, office delivery.", image: IMG.healthy },
    { id: "f3", name: "Desi breakfast box", price: 850, desc: "Anda paratha, chai.", image: IMG.breakfast, allergens: ["Gluten", "Eggs", "Dairy"] },
  ] },
  { id: "fs-nihari", name: "Burns Road Nihari House", kind: "Restaurant", cover: IMG.karahi, rating: 4.7, reviews: 5200, eta: "45–60 min", distance: "6.1 km", cuisines: ["Pakistani", "Breakfast"], minOrder: 1200, delivery: true, pickup: false, open: true, hours: "7 AM – 1 AM", tagline: "Old Karachi flavours", offer: "Free delivery over Rs 3,000", menu: [
    { id: "n1", name: "Beef nihari (full)", price: 1800, desc: "With nalli, served with khameeri roti.", image: IMG.karahi, bestseller: true },
    { id: "n2", name: "Haleem (family)", price: 1600, desc: "Slow-cooked overnight.", image: IMG.karahi },
  ] },
];

export const getSeller = (id: string) => SELLERS.find((s) => s.id === id);

export interface Offer { id: string; business: string; kind: "Restaurant" | "Café" | "Bakery" | "Grocery" | "Salon" | "Gym" | "Pharmacy" | "Local business"; title: string; desc: string; code: string; image: string; distance: string; area: string; discount: string; validTill: string; sponsored?: boolean; deal: "Discount" | "BOGO" | "Family deal" | "Coupon"; claimed?: number }
export const OFFERS: Offer[] = [
  { id: "of-1", business: "Kolachi Grill", kind: "Restaurant", title: "20% off family platters", desc: "Valid on dine-in & delivery for Ocean Heights residents. Show the code at the counter.", code: "NEST20", image: IMG.bbqFood, distance: "2.8 km", area: "Do Darya", discount: "20%", validTill: "31 Dec", sponsored: true, deal: "Family deal", claimed: 214 },
  { id: "of-2", business: "Espresso Lane", kind: "Café", title: "Buy 1 get 1 on lattes", desc: "Every weekday 8–11 AM.", code: "BOGOLATTE", image: IMG.coffee, distance: "900 m", area: "Bukhari Commercial", discount: "BOGO", validTill: "15 Dec", deal: "BOGO", claimed: 88 },
  { id: "of-3", business: "Delizia Bakers", kind: "Bakery", title: "Rs 500 off cakes above Rs 3,000", desc: "Order 24 hours in advance.", code: "CAKE500", image: IMG.bakery, distance: "1.4 km", area: "Badar Commercial", discount: "Rs 500", validTill: "30 Nov", deal: "Coupon", claimed: 41 },
  { id: "of-4", business: "Imtiaz Super Market", kind: "Grocery", title: "Free delivery + 5% off", desc: "Groceries delivered to your lobby within 2 hours.", code: "IMTIAZ5", image: IMG.grocery, distance: "3.2 km", area: "Khayaban-e-Bukhari", discount: "5%", validTill: "31 Dec", sponsored: true, deal: "Discount", claimed: 302 },
  { id: "of-5", business: "Toni & Guy Zamzama", kind: "Salon", title: "15% off first visit", desc: "Haircut, colour and treatments.", code: "NESTGLOW", image: IMG.salon, distance: "2.1 km", area: "Zamzama", discount: "15%", validTill: "20 Dec", deal: "Discount", claimed: 57 },
  { id: "of-6", business: "Shapes Fitness", kind: "Gym", title: "1 month free on annual plan", desc: "Includes pool & classes.", code: "SHAPES13", image: IMG.gym, distance: "3.6 km", area: "Clifton", discount: "1 month", validTill: "31 Dec", deal: "Coupon", claimed: 19 },
  { id: "of-7", business: "Dvago Pharmacy", kind: "Pharmacy", title: "10% off medicines", desc: "24/7 delivery to Ocean Heights.", code: "DVAGO10", image: IMG.pharmacy, distance: "1.1 km", area: "Phase VIII", discount: "10%", validTill: "31 Jan", deal: "Discount", claimed: 133 },
  { id: "of-8", business: "Pizza Bistro", kind: "Restaurant", title: "Family deal — 2 large + drink", desc: "Rs 3,999 only for residents.", code: "FAM3999", image: IMG.pizza, distance: "1.9 km", area: "Khayaban-e-Ittehad", discount: "Rs 3,999", validTill: "10 Dec", deal: "Family deal", claimed: 76 },
];

export interface Charger { id: string; connector: "Type 2" | "CCS2" | "CHAdeMO" | "GB/T"; power: number; kind: "AC" | "DC"; status: "Available" | "Charging" | "Reserved" | "Offline" }
export interface Station { id: string; name: string; address: string; lat: number; lng: number; network: "Building (private)" | "Public"; price: number; hours: string; distance: string; chargers: Charger[]; amenities: string[]; rating: number; ocpp: string; residentsOnly?: boolean }
export const STATIONS: Station[] = [
  { id: "st-oh", name: "Ocean Heights P1", address: "Basement P1, Ocean Heights, DHA Phase VIII", lat: 24.7925, lng: 67.0705, network: "Building (private)", price: 70, hours: "24/7 · residents", distance: "In your building", residentsOnly: true, rating: 4.8, ocpp: "OCPP 1.6J", amenities: ["Covered", "CCTV", "Reserved bays"], chargers: [
    { id: "OH-P1-01", connector: "Type 2", power: 22, kind: "AC", status: "Charging" },
    { id: "OH-P1-02", connector: "Type 2", power: 22, kind: "AC", status: "Available" },
    { id: "OH-P1-03", connector: "Type 2", power: 11, kind: "AC", status: "Available" },
    { id: "OH-P1-04", connector: "CCS2", power: 30, kind: "DC", status: "Reserved" },
  ] },
  { id: "st-dolmen", name: "Dolmen Mall Clifton", address: "Parking level B2, HC-3 Block 4, Clifton", lat: 24.8023, lng: 67.0295, network: "Public", price: 120, hours: "10 AM – 11 PM", distance: "4.6 km", rating: 4.5, ocpp: "OCPP 2.0.1", amenities: ["Mall", "Food court", "Restrooms"], chargers: [
    { id: "DMC-DC-01", connector: "CCS2", power: 60, kind: "DC", status: "Available" },
    { id: "DMC-DC-02", connector: "CHAdeMO", power: 50, kind: "DC", status: "Charging" },
    { id: "DMC-AC-01", connector: "Type 2", power: 22, kind: "AC", status: "Available" },
  ] },
  { id: "st-ittehad", name: "Khayaban-e-Ittehad Fuel Hub", address: "Kh-e-Ittehad, DHA Phase VI", lat: 24.8015, lng: 67.0560, network: "Public", price: 110, hours: "24/7", distance: "1.9 km", rating: 4.3, ocpp: "OCPP 1.6J", amenities: ["Convenience store", "Café"], chargers: [
    { id: "KEI-DC-01", connector: "CCS2", power: 120, kind: "DC", status: "Available" },
    { id: "KEI-DC-02", connector: "GB/T", power: 60, kind: "DC", status: "Offline" },
  ] },
  { id: "st-seaview", name: "Sea View Parking", address: "Abdul Sattar Edhi Ave, Sea View", lat: 24.7845, lng: 67.0490, network: "Public", price: 95, hours: "6 AM – 12 AM", distance: "2.4 km", rating: 4.1, ocpp: "OCPP 1.6J", amenities: ["Beachfront", "Open air"], chargers: [
    { id: "SV-AC-01", connector: "Type 2", power: 22, kind: "AC", status: "Charging" },
    { id: "SV-AC-02", connector: "Type 2", power: 22, kind: "AC", status: "Available" },
  ] },
  { id: "st-ocean", name: "Ocean Mall", address: "Khayaban-e-Iqbal, Clifton Block 9", lat: 24.8226, lng: 67.0337, network: "Public", price: 125, hours: "10 AM – 11 PM", distance: "5.8 km", rating: 4.4, ocpp: "OCPP 2.0.1", amenities: ["Mall", "Covered"], chargers: [
    { id: "OM-DC-01", connector: "CCS2", power: 90, kind: "DC", status: "Available" },
    { id: "OM-DC-02", connector: "CCS2", power: 90, kind: "DC", status: "Available" },
  ] },
];

export interface ParkingSpot { id: string; owner: string; ownerPhoto: string; apt: string; slot: string; level: string; suits: ("Car" | "Motorcycle" | "SUV")[]; hour: number; day: number; month: number; covered: boolean; ev?: boolean; image: string; note: string; availability: string; rating: number }
export const PARKING_SPOTS: ParkingSpot[] = [
  { id: "pk-1", owner: "Hira Shah", ownerPhoto: face("w1"), apt: "B-1102", slot: "P1-077", level: "Basement P1", suits: ["Car", "SUV"], hour: 150, day: 800, month: 12000, covered: true, image: IMG.parking, note: "Close to Tower B lift. Owner abroad till March.", availability: "Available now · till 15 Mar", rating: 4.9 },
  { id: "pk-2", owner: "Omer Farooq", ownerPhoto: face("m2"), apt: "C-0304", slot: "P2-131", level: "Basement P2", suits: ["Car"], hour: 120, day: 600, month: 9000, covered: true, image: IMG.parking, note: "Weekdays 9 AM – 6 PM only.", availability: "Weekdays, daytime", rating: 4.7 },
  { id: "pk-3", owner: "Saba Aziz", ownerPhoto: face("w4"), apt: "A-1608", slot: "P1-012 (EV)", level: "Basement P1", suits: ["Car"], hour: 200, day: 1000, month: 15000, covered: true, ev: true, image: IMG.ev, note: "Has a 7 kW wall charger — electricity billed separately.", availability: "Evenings & weekends", rating: 4.8 },
  { id: "pk-4", owner: "Kamran Ali", ownerPhoto: face("m4"), apt: "A-0302", slot: "M-04", level: "Ground (bikes)", suits: ["Motorcycle"], hour: 40, day: 200, month: 2500, covered: true, image: IMG.parking, note: "Motorcycle bay near Gate 2.", availability: "Available now", rating: 4.6 },
];

export const AMENITIES = [
  { id: "am-gym", name: "Gym", image: IMG.gym, price: 0, unit: "Free for residents", capacity: 12, hours: "5 AM – 11 PM", slots: ["06:00", "07:00", "08:00", "18:00", "19:00", "20:00", "21:00"] },
  { id: "am-pool", name: "Swimming pool", image: IMG.pool, price: 0, unit: "Free · family slots", capacity: 20, hours: "7 AM – 9 PM", slots: ["07:00", "09:00", "11:00", "16:00", "17:00", "18:00", "19:00"] },
  { id: "am-roof", name: "Rooftop terrace", image: IMG.rooftop, price: 6000, unit: "per evening", capacity: 60, hours: "Events till 11 PM", slots: ["17:00", "19:00"] },
  { id: "am-hall", name: "Community hall", image: IMG.hall, price: 15000, unit: "per 4 hours", capacity: 120, hours: "9 AM – 11 PM", slots: ["10:00", "14:00", "18:00"] },
  { id: "am-guest", name: "Guest suite", image: IMG.guestRoom, price: 9500, unit: "per night", capacity: 3, hours: "Check-in 2 PM", slots: ["14:00"] },
  { id: "am-bbq", name: "BBQ deck", image: IMG.bbq, price: 3000, unit: "per evening", capacity: 25, hours: "5 PM – 11 PM", slots: ["17:00", "19:00", "21:00"] },
  { id: "am-court", name: "Badminton & squash court", image: IMG.court, price: 0, unit: "Free · 1 h slots", capacity: 4, hours: "6 AM – 10 PM", slots: ["06:00", "07:00", "17:00", "18:00", "19:00", "20:00"] },
  { id: "am-meet", name: "Meeting room", image: IMG.meeting, price: 1500, unit: "per hour", capacity: 10, hours: "8 AM – 10 PM", slots: ["09:00", "11:00", "14:00", "16:00", "18:00"] },
];
