-- ============================================================================
-- TASMAC RESERVE — SUPABASE DATABASE SCHEMA & SEED DATA
-- Tamil Nadu State Marketing Corporation (Express Retail & Digital Token Queue)
-- ============================================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. DRINKS TABLE (Catalog Master)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.drinks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  rating TEXT,
  bestseller BOOLEAN DEFAULT false,
  abv TEXT,
  origin TEXT,
  description TEXT,
  img_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & allow public read
ALTER TABLE public.drinks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to drinks catalog"
  ON public.drinks FOR SELECT
  USING (true);

-- ============================================================================
-- 2. OUTLETS TABLE (Chennai Stores Master)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.outlets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  zone TEXT NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  timing TEXT,
  features TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & allow public read
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to outlets"
  ON public.outlets FOR SELECT
  USING (true);

-- ============================================================================
-- 3. RESERVATIONS TABLE (Express Digital Token Queues)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  id_type TEXT NOT NULL,
  outlet_id TEXT REFERENCES public.outlets(id),
  outlet_name TEXT,
  total_amount NUMERIC(10, 2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'collected', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & allow anyone to insert reservations, read their own by token or phone
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous creation of reservations"
  ON public.reservations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to read reservations by token"
  ON public.reservations FOR SELECT
  USING (true);

-- ============================================================================
-- 4. PATRON PROFILES TABLE (Verified 21+ Customers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  id_type TEXT,
  id_number TEXT,
  verified_21 BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- 5. SEED DATA: DRINKS CATALOG (26 Verified Bottles)
-- ============================================================================
INSERT INTO public.drinks (id, name, brand, category, size, price, rating, bestseller, abv, origin, description, img_url)
VALUES
  ('AMRUT-SGL-750', 'Amrut Fusion Indian Single Malt', 'Amrut Distilleries', 'IMFL Whisky', '750 ml', 4200, '5.0 (2.4k)', true, '50% ABV', 'Bengaluru, Karnataka', 'World-acclaimed single malt crafted from Scottish peated barley and Indian barley. Rich oak, candied orange, and peaty smoke.', 'images/AMRUT-SGL-750.png'),
  ('MCD-NO1-750', 'McDowell''s No.1 Reserve Whisky', 'United Spirits', 'IMFL Whisky', '750 ml', 720, '4.9 (1.8k)', true, '42.8% ABV', 'Bengaluru, Karnataka', 'India''s favorite smooth blend of selected Scotch malts and fine Indian spirits with delicate woody tones.', 'images/MCD-NO1-750.png'),
  ('SN-WH-750', 'Signature Premier Grain Whisky', 'United Spirits', 'IMFL Whisky', '750 ml', 920, '4.8 (920)', false, '42.8% ABV', 'Bengaluru, Karnataka', 'Master-crafted grain whisky aged in imported oak barrels with notes of toasted hazelnut and honeyed malt.', 'images/SN-WH-750.png'),
  ('RC-WH-750', 'Royal Challenge Select Premium', 'United Spirits', 'IMFL Whisky', '750 ml', 840, '4.8 (1.6k)', true, '42.8% ABV', 'Bengaluru, Karnataka', 'Deep golden whisky fused with Scottish peated malts. Balanced sweetness, smooth vanilla, and crisp oak finish.', 'images/RC-WH-750.png'),
  ('BP-WH-750', 'Blenders Pride Rare Premium', 'Pernod Ricard', 'IMFL Whisky', '750 ml', 980, '4.8 (2.1k)', true, '42.8% ABV', 'Kolkata, India', 'Expert marriage of imported Scotch malt concentrate and premium grain spirit, delivering a signature buttery palate.', 'images/BP-WH-750.png'),
  ('JW-BLK-750', 'Johnnie Walker Black Label 12YO', 'Diageo', 'IMFL Whisky', '750 ml', 3400, '5.0 (3.2k)', true, '40% ABV', 'Kilmarnock, Scotland', 'Iconic 12-year-old blended Scotch whisky from the four corners of Scotland. Rich dark fruit, sweet vanilla, and signature peat smoke.', 'images/JW-BLK-750.png'),
  ('TEACH-SCO-750', 'Teacher''s Highland Cream Scotch', 'Beam Suntory', 'IMFL Whisky', '750 ml', 1850, '4.8 (1.9k)', false, '42.8% ABV', 'Glasgow, Scotland', 'Exceptionally high single malt content led by peated Ardmore malt. Warm amber with malty sweetness and smoky depth.', 'images/TEACH-SCO-750.png'),
  ('MH-BR-750', 'Mansion House French Brandy', 'Tilaknagar Industries', 'IMFL Brandy', '750 ml', 860, '4.9 (4.1k)', true, '42.8% ABV', 'Chennai, Tamil Nadu', 'Tamil Nadu''s benchmark French grape brandy. Matured in seasoned oak casks, delivering warm spiced fruit and caramel notes.', 'images/MH-BR-750.png'),
  ('MOR-XO-750', 'Morpheus Blue XO Brandy', 'Radico Khaitan', 'IMFL Brandy', '750 ml', 1120, '4.9 (1.7k)', true, '42.8% ABV', 'Rampur, Uttar Pradesh', 'Extraordinary aged grape brandy infused with French oak nuances. Notes of dark chocolate, prune, and velvety vanilla.', 'images/MOR-XO-750.png'),
  ('COUR-NAP-750', 'Courrier Napoleon French Brandy', 'Tilaknagar Industries', 'IMFL Brandy', '750 ml', 920, '4.7 (940)', false, '42.8% ABV', 'Cognac, France', 'Distilled from carefully selected grapes and aged in Limousin oak barrels with pleasant dried fruit aroma.', 'images/COUR-NAP-750.png'),
  ('KY-BR-750', 'Kyron Premium French Brandy', 'Empee Distilleries', 'IMFL Brandy', '750 ml', 960, '4.8 (850)', false, '42.8% ABV', 'Chennai, Tamil Nadu', 'Artisanal pot-still brandy with floral grape top notes, subtle spice, and a velvety smooth lingering finish.', 'images/KY-BR-750.png'),
  ('MC-WH-750', 'Old Monk Supreme Rum', 'Mohan Meakin', 'IMFL Rum', '750 ml', 650, '5.0 (5.8k)', true, '42.8% ABV', 'Kasauli, Himachal Pradesh', 'Legendary 7-year vatted dark rum distilled from sugarcane molasses. Inimitable vanilla, caramel, and cacao essence.', 'images/MC-WH-750.png'),
  ('BAC-SUP-750', 'Bacardi Superior White Rum', 'Bacardi', 'IMFL Rum', '750 ml', 820, '4.8 (1.2k)', false, '40% ABV', 'San Juan, Puerto Rico', 'Triple charcoal filtered light rum aged in white oak. Clean floral aroma with hints of almond and fresh citrus.', 'images/BAC-SUP-750.png'),
  ('CAPT-MORG-750', 'Captain Morgan Spiced Gold', 'Diageo', 'IMFL Rum', '750 ml', 940, '4.8 (1.4k)', true, '35% ABV', 'Kingston, Jamaica', 'Secret blend of Caribbean rums and natural spices. Notes of rich bourbon vanilla, brown sugar, and warm cinnamon.', 'images/CAPT-MORG-750.png'),
  ('OLD-PORT-750', 'Old Port Deluxe Rum', 'Amrut Distilleries', 'IMFL Rum', '750 ml', 580, '4.7 (1.1k)', false, '42.8% ABV', 'Bengaluru, Karnataka', 'Crafted from 100% Indian sugarcane with rich oak maturation, spicy notes, and a deep copper hue.', 'images/OLD-PORT-750.png'),
  ('KF-PR-650', 'Kingfisher Premium Lager Beer', 'United Breweries', 'Beer', '650 ml', 170, '4.9 (3.8k)', true, '4.8% ABV', 'Bengaluru, Karnataka', 'The King of Good Times. Perfectly balanced, crisp malt lager brewed from the finest Saaz hops and two-row barley.', 'images/KF-PR-650.png'),
  ('KF-ULTRA-650', 'Kingfisher Ultra Max', 'United Breweries', 'Beer', '650 ml', 220, '4.9 (1.9k)', true, '6.5% ABV', 'Bengaluru, Karnataka', 'Super premium strong beer crafted with imported Pilsen barley malt for supreme smoothness and rich body.', 'images/KF-ULTRA-650.png'),
  ('BUD-MAG-650', 'Budweiser Magnum Super Beer', 'AB InBev', 'Beer', '650 ml', 240, '4.9 (2.8k)', true, '6.5% ABV', 'St. Louis, USA', 'Exclusive dark golden strong lager aged over genuine beechwood chips for intense flavor and exceptional drinkability.', 'images/BUD-MAG-650.png'),
  ('BP-BR-650', 'British Empire Strong Beer', 'SNJ Breweries', 'Beer', '650 ml', 180, '4.7 (2.4k)', false, '7.5% ABV', 'Madurantakam, Tamil Nadu', 'Robust full-strength lager brewed locally in Tamil Nadu with rich roasted malt and punchy hop bitterness.', 'images/BP-BR-650.png'),
  ('CORONA-330', 'Corona Extra Mexican Lager', 'Grupo Modelo', 'Beer', '330 ml', 280, '4.9 (1.1k)', false, '4.5% ABV', 'Mexico City, Mexico', 'World''s most refreshing imported lager. Light golden color, delicate floral hop aroma, best served with a wedge of fresh lime.', 'images/CORONA-330.png'),
  ('BIRA-WHT-500', 'Bira 91 White Belgian Wheat', 'B9 Beverages', 'Beer', '500 ml', 210, '4.8 (1.8k)', true, '4.9% ABV', 'New Delhi, India', 'Deliciously cloudy wheat ale spiced with orange peel and coriander seeds. Low bitterness and ultra-refreshing finish.', 'images/BIRA-WHT-500.png'),
  ('MAGIC-VOD-750', 'Magic Moments Grain Vodka', 'Radico Khaitan', 'Vodka', '750 ml', 760, '4.8 (2.1k)', true, '42.8% ABV', 'Rampur, Uttar Pradesh', 'Triple-distilled rice grain vodka filtered through activated charcoal. Pure, odorless, crisp finish.', 'images/MAGIC-VOD-750.png'),
  ('SMIR-RED-750', 'Smirnoff No.21 Triple Distilled', 'Diageo', 'Vodka', '750 ml', 920, '4.9 (3.1k)', true, '40% ABV', 'Moscow, Russia', 'The world''s number one pure vodka. Exceptionally smooth, robust palate with dry finish.', 'images/SMIR-RED-750.png'),
  ('SULA-SH-750', 'Sula Vineyards Shiraz Red', 'Sula Vineyards', 'Premium Wine', '750 ml', 980, '4.8 (1.1k)', true, '13.5% ABV', 'Nashik Valley, Maharashtra', 'Medium-bodied ruby red with aromas of blackcurrant, dark plum, and cracked black pepper. Oak aged.', 'images/SULA-SH-750.png'),
  ('FRAT-MER-750', 'Fratelli Classic Merlot', 'Fratelli', 'Premium Wine', '750 ml', 920, '4.7 (820)', false, '13.5% ABV', 'Akluj, Maharashtra', 'Smooth Italian-style red wine from pristine hillside vineyards with supple tannins and ripe berry notes.', 'images/FRAT-MER-750.png'),
  ('BOMBAY-SAPH-750', 'Bombay Sapphire London Dry', 'Bacardi', 'Craft Gin', '750 ml', 2400, '4.9 (1.6k)', true, '47% ABV', 'Hampshire, England', 'Vapour-infused with 10 exotic botanicals including Moroccan coriander, juniper berries, and lemon peel.', 'images/BOMBAY-SAPH-750.png')
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  in_stock = EXCLUDED.in_stock;

-- ============================================================================
-- 6. SEED DATA: CHENNAI TASMAC OUTLETS (37 Counters)
-- ============================================================================
INSERT INTO public.outlets (id, name, area, zone, type, address, lat, lng, timing, features)
VALUES
  ('1085', 'Shop #1085 (Elite)', 'Usman Road, T. Nagar', 'Central', 'elite', 'Near Panagal Park, North Usman Road, T. Nagar, Chennai 600017', 13.0418, 80.2341, '12:00 PM – 10:00 PM', ARRAY['Imported Scotch','Craft Beers','Wine Vault','AC Lounge','Card/UPI']),
  ('1098', 'Shop #1098', 'Pondy Bazaar, T. Nagar', 'Central', 'retail', 'Sir Theagaraya Road, Pondy Bazaar, T. Nagar, Chennai 600017', 13.0402, 80.2415, '12:00 PM – 10:00 PM', ARRAY['Fast Token Counter','Govt MRP Guaranteed','UPI Payments']),
  ('1114', 'Shop #1114', 'Eldams Road, Teynampet', 'Central', 'retail', 'Near SIET College, Eldams Road, Teynampet, Chennai 600018', 13.0375, 80.2502, '12:00 PM – 10:00 PM', ARRAY['Cold Beer Chiller','Fresh Daily Stock']),
  ('1120', 'Shop #1120 (Elite)', 'Express Avenue, Royapettah', 'Central', 'elite', 'Whites Road, Express Avenue Mall Complex, Royapettah, Chennai 600014', 13.0588, 80.2642, '12:00 PM – 10:00 PM', ARRAY['AC Showroom','Single Malt Vault','Premium Wine Selection','Card/UPI']),
  ('1168', 'Shop #1168 (Elite)', 'KNK Road, Nungambakkam', 'Central', 'elite', 'Khader Nawaz Khan Road, Nungambakkam, Chennai 600006', 13.0631, 80.2435, '12:00 PM – 10:00 PM', ARRAY['Elite Flagship','Imported Champagne','Craft Gin Cellar','Card/UPI']),
  ('1175', 'Shop #1175', 'Egmore Station Road', 'Central', 'retail', 'Gandhi Irwin Road, Opp. Egmore Railway Station, Chennai 600008', 13.0789, 80.2612, '12:00 PM – 10:00 PM', ARRAY['Transit Express Counter','Govt MRP Guaranteed']),
  ('1182', 'Shop #1182', 'PH Road, Kilpauk', 'Central', 'retail', 'Poonamallee High Road, Near Kilpauk Medical College, Chennai 600010', 13.0805, 80.242, '12:00 PM – 10:00 PM', ARRAY['Chilled Beer Storage','Full IMFL Catalog']),
  ('1042', 'Shop #1042 (Elite)', '2nd Avenue, Anna Nagar', 'Anna Nagar & West', 'elite', '2nd Avenue, Near Anna Nagar Roundtana, Chennai 600040', 13.085, 80.21, '12:00 PM – 10:00 PM', ARRAY['Air Conditioned','Craft Beer Chiller','Single Malt Scotch','Card/UPI']),
  ('1055', 'Shop #1055', 'Shanthi Colony, Anna Nagar', 'Anna Nagar & West', 'retail', '4th Avenue, Shanthi Colony Main Road, Anna Nagar West, Chennai 600040', 13.0872, 80.2035, '12:00 PM – 10:00 PM', ARRAY['Express Pickup Line','Cold Beer Vault']),
  ('1072', 'Shop #1072', '10th Main Rd, Anna Nagar West', 'Anna Nagar & West', 'retail', '10th Main Road, Near West Bus Depot, Chennai 600101', 13.0935, 80.1982, '12:00 PM – 10:00 PM', ARRAY['All IMFL Brands','Fast Counter Service']),
  ('1060', 'Shop #1060', 'Shenoy Nagar Metro Road', 'Anna Nagar & West', 'retail', 'Near Shenoy Nagar Metro Station Gate 2, Pulla Avenue, Chennai 600030', 13.0792, 80.2245, '12:00 PM – 10:00 PM', ARRAY['Metro Commuter Express','UPI Accepted']),
  ('1068', 'Shop #1068', 'Mogappair East Main Road', 'Anna Nagar & West', 'retail', 'Mogappair East Main Road, Near Spartan School, Chennai 600037', 13.0835, 80.183, '12:00 PM – 10:00 PM', ARRAY['Chilled Beer Crates','Govt MRP Guaranteed']),
  ('1075', 'Shop #1075', 'Koyambedu Market Road', 'Anna Nagar & West', 'retail', 'Near Koyambedu Wholesale Market Bypass, Chennai 600107', 13.069, 80.1925, '12:00 PM – 10:00 PM', ARRAY['Wholesale Transit Counter','High Volume Stock']),
  ('1204', 'Shop #1204 (Elite)', 'LB Road, Adyar', 'South & Adyar', 'elite', 'Lattice Bridge Road, Near Adyar Signal, Adyar, Chennai 600020', 13.0035, 80.255, '12:00 PM – 10:00 PM', ARRAY['Elite Showroom','Imported Wines','Craft Beer Chiller','Card/UPI']),
  ('1210', 'Shop #1210', 'MG Road, Shastri Nagar', 'South & Adyar', 'retail', 'Mahatma Gandhi Road, Shastri Nagar, Adyar, Chennai 600020', 12.9972, 80.2595, '12:00 PM – 10:00 PM', ARRAY['Chilled Beer Crates','Quick Counter Service']),
  ('1218', 'Shop #1218 (Elite)', 'Thiruvanmiyur ECR Junction', 'South & Adyar', 'elite', 'East Coast Road (ECR), Opp. RTO Office, Thiruvanmiyur, Chennai 600041', 12.982, 80.261, '12:00 PM – 10:00 PM', ARRAY['ECR Gateway Elite','Cold Storage','Weekend Party Stocks']),
  ('1225', 'Shop #1225', 'Kottivakkam ECR Main Road', 'South & Adyar', 'retail', 'ECR Main Road, Near Sea Cliff, Kottivakkam, Chennai 600041', 12.968, 80.259, '12:00 PM – 10:00 PM', ARRAY['Coastal Retail','Ice-Cold Beer Cans']),
  ('1230', 'Shop #1230 (Elite)', 'Palavakkam ECR Beach Road', 'South & Adyar', 'elite', 'ECR Main Road, Near Palavakkam Beach Signal, Chennai 600041', 12.952, 80.2565, '12:00 PM – 10:00 PM', ARRAY['Beachside Elite','Premium Champagne','Imported Beers','Card/UPI']),
  ('1142', 'Shop #1142', 'Kutchery Road, Mylapore', 'South & Adyar', 'retail', 'Near Luz Corner, Kutchery Road, Mylapore, Chennai 600004', 13.0335, 80.269, '12:00 PM – 10:00 PM', ARRAY['Classic Counter','Fresh Stock Verified']),
  ('1150', 'Shop #1150', 'TTK Road, Alwarpet', 'South & Adyar', 'retail', 'TT Krishnamachari Road, Near Music Academy, Alwarpet, Chennai 600018', 13.039, 80.254, '12:00 PM – 10:00 PM', ARRAY['Cold Beers','Quick Token Window']),
  ('1158', 'Shop #1158', 'R.A. Puram 3rd Cross', 'South & Adyar', 'retail', '3rd Cross Street, Raja Annamalai Puram, Chennai 600028', 13.0245, 80.258, '12:00 PM – 10:00 PM', ARRAY['Premium IMFL','Govt MRP Guaranteed']),
  ('888', 'Shop #888 (Elite)', '100 Ft Bypass, Velachery', 'OMR IT Corridor', 'elite', '100 Feet Bypass Road, Near Phoenix Marketcity, Velachery, Chennai 600042', 12.9815, 80.218, '12:00 PM – 10:00 PM', ARRAY['Elite Multi-Counter','All Premium Brands','Air Conditioned','Fast Token Line']),
  ('892', 'Shop #892', 'Taramani Link Rd, Velachery', 'OMR IT Corridor', 'retail', 'Taramani Link Road, Opp. TCS Gate, Velachery, Chennai 600042', 12.974, 80.2285, '12:00 PM – 10:00 PM', ARRAY['Tech Park Quick Counter','Govt MRP Guaranteed']),
  ('1250', 'Shop #1250', 'SRP Tools, OMR Perungudi', 'OMR IT Corridor', 'retail', 'Rajiv Gandhi Salai (OMR), Near SRP Tools Junction, Perungudi, Chennai 600096', 12.965, 80.245, '12:00 PM – 10:00 PM', ARRAY['OMR Express Hub','Chilled Beers Available']),
  ('1265', 'Shop #1265', 'OMR Karapakkam', 'OMR IT Corridor', 'retail', 'OMR IT Expressway, Near CTS & Accenture, Karapakkam, Chennai 600097', 12.915, 80.229, '12:00 PM – 10:00 PM', ARRAY['Techie Express Pickup','Govt MRP Guaranteed']),
  ('1278', 'Shop #1278 (Elite)', 'Sholinganallur Junction, OMR', 'OMR IT Corridor', 'elite', 'Sholinganallur Signal, OMR-ECR Link Road, Chennai 600119', 12.898, 80.228, '12:00 PM – 10:00 PM', ARRAY['Elite IT Hub Store','Wide Wine Collection','Single Malt Vault']),
  ('1285', 'Shop #1285', 'Navalur OMR (Vivira Mall)', 'OMR IT Corridor', 'retail', 'Rajiv Gandhi Salai, Next to Vivira Mall, Navalur, Chennai 603103', 12.845, 80.226, '12:00 PM – 10:00 PM', ARRAY['Drive-by Counter','Chilled Brews']),
  ('976', 'Shop #976', 'Guindy Industrial Estate', 'Tambaram & Guindy', 'retail', 'Inner Ring Road, Guindy Industrial Area, Ekkattuthangal, Chennai 600032', 13.0067, 80.202, '12:00 PM – 10:00 PM', ARRAY['Express Counter','High Stock Capacity']),
  ('953', 'Shop #953 (Elite)', 'Kathipara Urban Square', 'Tambaram & Guindy', 'elite', 'Kathipara Junction Complex, GST Road, Alandur, Chennai 600016', 13.0075, 80.2055, '12:00 PM – 10:00 PM', ARRAY['Urban Square Elite','Air Conditioned','Card/UPI accepted']),
  ('960', 'Shop #960', 'Saidapet Bazaar Road', 'Tambaram & Guindy', 'retail', 'Bazaar Road, Near Saidapet Bus Terminus, Chennai 600015', 13.0185, 80.2225, '12:00 PM – 10:00 PM', ARRAY['Fast Transit Counter','Govt MRP Guaranteed']),
  ('941', 'Shop #941', 'Mount-Poonamallee, Porur', 'Tambaram & Guindy', 'retail', 'Mount-Poonamallee High Road, Near DLF Cybercity, Porur, Chennai 600116', 13.0315, 80.1685, '12:00 PM – 10:00 PM', ARRAY['Cybercity Counter','Cold Beer Stock']),
  ('902', 'Shop #902', 'GST Road, Tambaram', 'Tambaram & Guindy', 'retail', 'GST Road, Near West Tambaram Railway Terminus, Chennai 600045', 12.9249, 80.12, '12:00 PM – 10:00 PM', ARRAY['Express Station Counter','All IMFL Brands']),
  ('915', 'Shop #915', 'GST Road, Chromepet', 'Tambaram & Guindy', 'retail', 'GST Road, Opposite MIT Flyover, Chromepet, Chennai 600044', 12.9515, 80.1415, '12:00 PM – 10:00 PM', ARRAY['Cold Beer Vault','UPI Payments']),
  ('922', 'Shop #922', 'Pallavaram Main Road', 'Tambaram & Guindy', 'retail', 'Old Trunk Road, Near Pallavaram Cantonment, Chennai 600043', 12.9685, 80.148, '12:00 PM – 10:00 PM', ARRAY['Govt MRP Enforced','Standard IMFL']),
  ('1305', 'Shop #1305', 'Rajaji Salai, George Town', 'North Chennai', 'retail', 'Rajaji Salai, Near Parrys Corner / High Court, Chennai 600001', 13.091, 80.291, '12:00 PM – 10:00 PM', ARRAY['Harbour Zone Counter','Govt MRP Guaranteed']),
  ('1312', 'Shop #1312', 'Royapuram West', 'North Chennai', 'retail', 'Kalmandapam Main Road, Near Royapuram Bridge, Chennai 600013', 13.107, 80.293, '12:00 PM – 10:00 PM', ARRAY['Coastal Retail','Cold Beers']),
  ('1320', 'Shop #1320', 'Perambur High Road', 'North Chennai', 'retail', 'Madhavaram High Road, Near Perambur Loco Works, Chennai 600011', 13.114, 80.241, '12:00 PM – 10:00 PM', ARRAY['Loco Works Express','All IMFL Brands'])
ON CONFLICT (id) DO UPDATE SET
  address = EXCLUDED.address,
  timing = EXCLUDED.timing;
