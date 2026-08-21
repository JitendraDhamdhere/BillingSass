-- Reset tables before seeding to prevent duplicate key violations and ensure exactly 20 clean records per table
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE sales_return_items;
TRUNCATE TABLE sales_returns;
TRUNCATE TABLE sale_items;
TRUNCATE TABLE sales;
TRUNCATE TABLE purchase_items;
TRUNCATE TABLE purchases;
TRUNCATE TABLE payments;
TRUNCATE TABLE inventory_transactions;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;
TRUNCATE TABLE brands;
TRUNCATE TABLE customers;
TRUNCATE TABLE suppliers;
SET FOREIGN_KEY_CHECKS = 1;

-- Seed 20 Categories
INSERT INTO categories (name, description, status, created_at, updated_at) VALUES
('Grocery', 'Daily household food items and provisions', 'ACTIVE', NOW(), NOW()),
('Electronics', 'Smartphones, laptops, accessories and gadgets', 'ACTIVE', NOW(), NOW()),
('Clothing', 'Apparels, clothing and fashion wear', 'ACTIVE', NOW(), NOW()),
('Home Appliances', 'Kitchen and living space electrical appliances', 'ACTIVE', NOW(), NOW()),
('Stationery', 'Office and school stationery goods', 'ACTIVE', NOW(), NOW()),
('Cosmetics', 'Beauty products and personal hygiene care', 'ACTIVE', NOW(), NOW()),
('Footwear', 'Shoes, sandals, slippers and sport boots', 'ACTIVE', NOW(), NOW()),
('Toys', 'Indoor and outdoor play toys for kids', 'ACTIVE', NOW(), NOW()),
('Books', 'Academic books, novels, comics and guides', 'ACTIVE', NOW(), NOW()),
('Sports & Fitness', 'Fitness gear, sports equipment and active wear', 'ACTIVE', NOW(), NOW()),
('Automotive', 'Vehicular parts, engine oil, accessories', 'ACTIVE', NOW(), NOW()),
('Furniture', 'Sofas, chairs, study tables and cupboards', 'ACTIVE', NOW(), NOW()),
('Jewelry', 'Fashion ornaments, rings and silver bracelets', 'ACTIVE', NOW(), NOW()),
('Gardening', 'Plant seeds, tools, organic fertilizers', 'ACTIVE', NOW(), NOW()),
('Pet Supplies', 'Pet food, toys, collars and hygiene care', 'ACTIVE', NOW(), NOW()),
('Office Supplies', 'Files, paper rims, calculators and diaries', 'ACTIVE', NOW(), NOW()),
('Hardware', 'Nails, hammers, door locks and building tools', 'ACTIVE', NOW(), NOW()),
('Medical & Health', 'First-aid kits, sanitizers, daily vitamins', 'ACTIVE', NOW(), NOW()),
('Kitchenware', 'Pans, dining plates, spatulas and cutlery', 'ACTIVE', NOW(), NOW()),
('Music', 'Guitar strings, headphones, keyboards', 'ACTIVE', NOW(), NOW());

-- Seed 20 Brands
INSERT INTO brands (name, description, status, created_at, updated_at) VALUES
('Amul', 'Indian dairy co-operative society brand', 'ACTIVE', NOW(), NOW()),
('Britannia', 'Popular biscuit and bakery food brand', 'ACTIVE', NOW(), NOW()),
('Tata', 'Trustworthy Indian conglomerate brand', 'ACTIVE', NOW(), NOW()),
('Reliance', 'Digital products, retail provisions and gear', 'ACTIVE', NOW(), NOW()),
('Samsung', 'High-end smartphones and electronic screens', 'ACTIVE', NOW(), NOW()),
('Sony', 'Premium entertainment audio and visual gear', 'ACTIVE', NOW(), NOW()),
('LG', 'Reliable home appliances and air conditioners', 'ACTIVE', NOW(), NOW()),
('Prestige', 'Quality non-stick pans and pressure cookers', 'ACTIVE', NOW(), NOW()),
('USHA', 'Popular ceiling fans and sewing machines', 'ACTIVE', NOW(), NOW()),
('Wipro', 'LED bulbs, lighting and IT accessories', 'ACTIVE', NOW(), NOW()),
('Boat', 'Budget-friendly audio gadgets and smartwatches', 'ACTIVE', NOW(), NOW()),
('Nike', 'Active sports shoe and apparel brand', 'ACTIVE', NOW(), NOW()),
('Adidas', 'Sporting shoes, backpacks and jerseys', 'ACTIVE', NOW(), NOW()),
('Puma', 'Modern fashion activewear and lifestyle shoes', 'ACTIVE', NOW(), NOW()),
('Titan', 'Premium wristwatches, eye gear and accessories', 'ACTIVE', NOW(), NOW()),
('Dell', 'Office laptops, computer monitors and accessories', 'ACTIVE', NOW(), NOW()),
('HP', 'Printers, laptops, inks and computing goods', 'ACTIVE', NOW(), NOW()),
('Godrej', 'Security lockers, furniture and home items', 'ACTIVE', NOW(), NOW()),
('Bajaj', 'Electrical home products and LED setups', 'ACTIVE', NOW(), NOW()),
('Philips', 'Male grooming, hair dryers and lighting', 'ACTIVE', NOW(), NOW());

-- Seed 20 Products
INSERT INTO products (product_code, barcode, name, description, category_id, brand_id, unit, purchase_price, selling_price, tax_percentage, minimum_stock, current_stock, status, created_at, updated_at) VALUES
('PROD-001', '8901230000010', 'Tata Salt 1kg', 'Iodized table salt', 1, 3, 'PACK', 20.00, 28.00, 0.00, 50, 200, 'ACTIVE', NOW(), NOW()),
('PROD-002', '8901230000027', 'Britannia Marie Gold 250g', 'Crispy tea biscuits', 1, 2, 'PACK', 25.00, 35.00, 5.00, 40, 150, 'ACTIVE', NOW(), NOW()),
('PROD-003', '8901230000034', 'Amul Butter 500g', 'Salted table butter', 1, 1, 'PACK', 210.00, 255.00, 12.00, 20, 80, 'ACTIVE', NOW(), NOW()),
('PROD-004', '8901230000041', 'Samsung Galaxy M34', '5G smartphone with 6000mAh battery', 2, 5, 'PCS', 14000.00, 16999.00, 18.00, 5, 25, 'ACTIVE', NOW(), NOW()),
('PROD-005', '8901230000058', 'Boat Rockerz 450', 'On-ear wireless headphones', 2, 11, 'PCS', 900.00, 1299.00, 18.00, 10, 45, 'ACTIVE', NOW(), NOW()),
('PROD-006', '8901230000065', 'Prestige pressure cooker 3L', 'Aluminum inner lid pressure cooker', 4, 8, 'PCS', 1100.00, 1499.00, 12.00, 8, 30, 'ACTIVE', NOW(), NOW()),
('PROD-007', '8901230000072', 'Wipro 9W LED Bulb', 'Cool day light energy saving bulb', 4, 10, 'PCS', 70.00, 99.00, 18.00, 50, 300, 'ACTIVE', NOW(), NOW()),
('PROD-008', '8901230000089', 'Titan Neo Watch', 'Men analog brown dial leather watch', 3, 15, 'PCS', 2200.00, 2995.00, 18.00, 5, 15, 'ACTIVE', NOW(), NOW()),
('PROD-009', '8901230000096', 'Nike Revolution 6 Shoes', 'Men running lightweight sport shoes', 7, 12, 'PAIR', 2800.00, 3695.00, 18.00, 6, 20, 'ACTIVE', NOW(), NOW()),
('PROD-010', '8901230000102', 'Adidas Classic Backpack', 'Durable 25L school and office backpack', 3, 13, 'PCS', 1200.00, 1699.00, 18.00, 10, 35, 'ACTIVE', NOW(), NOW()),
('PROD-011', '8901230000119', 'Puma Active T-Shirt', 'Breathable dry-fit polyester sports tee', 3, 14, 'PCS', 600.00, 899.00, 5.00, 15, 60, 'ACTIVE', NOW(), NOW()),
('PROD-012', '8901230000126', 'USHA Maxx Air Pedestal Fan', 'High-speed cooling fan with heavy base', 4, 9, 'PCS', 2100.00, 2850.00, 18.00, 4, 12, 'ACTIVE', NOW(), NOW()),
('PROD-013', '8901230000133', 'Dell Wireless Keyboard & Mouse', 'KM3322W silent combo', 2, 16, 'PCS', 1100.00, 1499.00, 18.00, 10, 40, 'ACTIVE', NOW(), NOW()),
('PROD-014', '8901230000140', 'HP LaserJet M1005 Printer', 'Multifunction monochrome laser printer', 2, 17, 'PCS', 16500.00, 19500.00, 18.00, 2, 8, 'ACTIVE', NOW(), NOW()),
('PROD-015', '8901230000157', 'Godrej Padlock 75mm', 'Heavy-duty brass padlock with 3 keys', 17, 18, 'PCS', 350.00, 480.00, 18.00, 15, 50, 'ACTIVE', NOW(), NOW()),
('PROD-016', '8901230000164', 'Bajaj Splendora 3L Water Heater', 'Instant 3kW geyser for bathroom', 4, 19, 'PCS', 2300.00, 3199.00, 18.00, 5, 18, 'ACTIVE', NOW(), NOW()),
('PROD-017', '8901230000171', 'Philips Series 1000 Shaver', 'Cordless clean shave rotary razor', 6, 20, 'PCS', 1400.00, 1999.00, 18.00, 8, 22, 'ACTIVE', NOW(), NOW()),
('PROD-018', '8901230000188', 'LG 20L Solo Microwave Oven', 'Basic reheating and defrosting oven', 4, 7, 'PCS', 5500.00, 6899.00, 18.00, 3, 10, 'ACTIVE', NOW(), NOW()),
('PROD-019', '8901230000195', 'Sony WH-CH520 Headphones', 'On-ear bluetooth battery beast headset', 2, 6, 'PCS', 3400.00, 4490.00, 18.00, 5, 16, 'ACTIVE', NOW(), NOW()),
('PROD-020', '8901230000201', 'Amul Dark Chocolate 150g', 'Premium 55% cocoa chocolate bar', 1, 1, 'PACK', 80.00, 110.00, 18.00, 30, 100, 'ACTIVE', NOW(), NOW());

-- Seed 20 Customers
INSERT INTO customers (customer_code, name, mobile, email, address, city, state, pincode, gst_number, status, created_at, updated_at) VALUES
('CUST-001', 'Aarav Sharma', '9876543210', 'aarav.sharma@gmail.com', 'Flat 402, Shiv Towers, Andheri West', 'Mumbai', 'Maharashtra', '400053', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-002', 'Vihaan Patel', '9812345678', 'vihaan.patel@yahoo.com', '12, Gokul Dham, Satellite Road', 'Ahmedabad', 'Gujarat', '380015', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-003', 'Sai Kumar', '8123456789', 'sai.kumar@outlook.com', 'Flat A-3, Jayanagar 4th Block', 'Bangalore', 'Karnataka', '560041', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-004', 'Ananya Iyer', '9445678901', 'ananya.iyer@gmail.com', 'Apt 14, Sterling Road, Nungambakkam', 'Chennai', 'Tamil Nadu', '600034', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-005', 'Reyansh Gupta', '7012345678', 'reyansh.g@gmail.com', '54, Kailash Hills, East of Kailash', 'New Delhi', 'Delhi', '110065', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-006', 'Aadhya Reddy', '9988776655', 'aadhya.reddy@gmail.com', 'Plot 98, Jubilee Hills Road No. 36', 'Hyderabad', 'Telangana', '500033', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-007', 'Ishaan Chatterjee', '9830012345', 'ishaan.c@gmail.com', '14/2, Salt Lake Sector 3', 'Kolkata', 'West Bengal', '700097', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-008', 'Diya Joshi', '9611223344', 'diya.j@gmail.com', 'Flat 5, Kothrud Heritage, Karve Road', 'Pune', 'Maharashtra', '411038', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-009', 'Krishna Verma', '7890123456', 'krishna.v@gmail.com', 'House 43, Vijay Nagar', 'Indore', 'Madhya Pradesh', '452010', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-010', 'Pranav Nair', '9048123456', 'pranav.nair@gmail.com', 'Sopanam House, Kakkanad', 'Kochi', 'Kerala', '682030', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-011', 'Kiara Sen', '8901234567', 'kiara.sen@gmail.com', 'Sector 4, Bokaro Steel City', 'Bokaro', 'Jharkhand', '827004', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-012', 'Arjun Kapoor', '9911223344', 'arjun.k@gmail.com', '42-A, Model Town', 'Ludhiana', 'Punjab', '141002', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-013', 'Meera Deshmukh', '9545123456', 'meera.d@gmail.com', 'Row House 4, Indira Nagar', 'Nashik', 'Maharashtra', '422009', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-014', 'Dev Mishra', '8812345678', 'dev.mishra@gmail.com', '12/45, Hazratganj Bypass', 'Lucknow', 'Uttar Pradesh', '226001', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-015', 'Zara Sheikh', '9717123456', 'zara.s@gmail.com', 'A-89, Zakir Nagar, Okhla', 'New Delhi', 'Delhi', '110025', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-016', 'Kabir Malhotra', '9811223344', 'kabir.m@gmail.com', 'Flat 804, Nirvana Country', 'Gurugram', 'Haryana', '122018', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-017', 'Myra Singhal', '9312345678', 'myra.s@gmail.com', '102, Shanti Kunj', 'Dehradun', 'Uttarakhand', '248001', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-018', 'Advait Choudhury', '9435123456', 'advait.c@gmail.com', 'B-12, Zoo Road', 'Guwahati', 'Assam', '781024', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-019', 'Riya Bansal', '7503123456', 'riya.bansal@gmail.com', 'Flat 4, City Palace View, Civil Lines', 'Jaipur', 'Rajasthan', '302006', NULL, 'ACTIVE', NOW(), NOW()),
('CUST-020', 'Shreyas Kamble', '9123456789', 'shreyas.k@gmail.com', 'Flat 101, Datta Prasad, Deccan', 'Pune', 'Maharashtra', '411004', NULL, 'ACTIVE', NOW(), NOW());

-- Seed 20 Suppliers
INSERT INTO suppliers (supplier_code, name, company_name, mobile, email, address, city, state, pincode, gst_number, status, created_at, updated_at) VALUES
('SUPP-001', 'Rajesh Khandelwal', 'Khandelwal Grocery Distributors', '9829012345', 'distributors.khandelwal@gmail.com', 'G-12, APMC Market 2, Vashi', 'Navi Mumbai', 'Maharashtra', '400703', '27AAAACK8901A1Z1', 'ACTIVE', NOW(), NOW()),
('SUPP-002', 'Dinesh Patel', 'Patel Electronics Trading Co.', '9879012345', 'patel.electronics@yahoo.com', '104, Lamington Road, Grant Road East', 'Mumbai', 'Maharashtra', '400007', '27AABCP1234F2Z4', 'ACTIVE', NOW(), NOW()),
('SUPP-003', 'Srinivas Murthy', 'Murthy Home Appliances Wholesale', '8023456789', 'wholesale.murthy@outlook.com', '45, SP Road, Chickpet', 'Bangalore', 'Karnataka', '560053', '29AADCM4567K1Z5', 'ACTIVE', NOW(), NOW()),
('SUPP-004', 'Laxman Shenoy', 'Shenoy Stationery & Paper Mart', '9444012345', 'shenoy.paper@gmail.com', '12, Broadway, George Town', 'Chennai', 'Tamil Nadu', '600001', '33AABCS7890D1Z6', 'ACTIVE', NOW(), NOW()),
('SUPP-005', 'Gaurav Aggarwal', 'Aggarwal Sports & Garments Agency', '7011012345', 'garments.aggarwal@gmail.com', 'Sector 15, Industrial Area', 'Faridabad', 'Haryana', '121007', '06AACCA1234P1Z3', 'ACTIVE', NOW(), NOW()),
('SUPP-006', 'Venkat Rao', 'Rao Hardware & Safe Locks Supplier', '9989012345', 'rao.hardware@gmail.com', 'Station Road, Secunderabad', 'Hyderabad', 'Telangana', '500003', '36AABCR1234E1Z7', 'ACTIVE', NOW(), NOW()),
('SUPP-007', 'Sujit Sen', 'Sen Cosmetics & Beauty Care Agency', '9831012345', 'sen.cosmetics@gmail.com', '67, Canning Street', 'Kolkata', 'West Bengal', '700001', '19AABCS5678Q1Z2', 'ACTIVE', NOW(), NOW()),
('SUPP-008', 'Vinod Joshi', 'Joshi Kitchenware Distributors', '9611012345', 'joshi.kitchenware@gmail.com', '109, Ravivar Peth', 'Pune', 'Maharashtra', '411002', '27AABCJ4567D1Z8', 'ACTIVE', NOW(), NOW()),
('SUPP-009', 'Naveen Verma', 'Verma Footwear Wholesale Hub', '7890012345', 'verma.footwear@gmail.com', 'Cloth Market, Subhash Chowk', 'Indore', 'Madhya Pradesh', '452002', '23AABCV1234R1Z9', 'ACTIVE', NOW(), NOW()),
('SUPP-010', 'Praveen Pillai', 'Pillai Toys & Stationery Agency', '9048012345', 'pillai.toys@gmail.com', 'Broadway, Ernakulam', 'Kochi', 'Kerala', '682031', '32AABCP4567F1Z0', 'ACTIVE', NOW(), NOW()),
('SUPP-011', 'Mohan Roy', 'Bokaro Medical Supplies Corp', '8901012345', 'roy.medical@gmail.com', 'Cooperative Colony', 'Bokaro', 'Jharkhand', '827001', '20AABCM1234N1Z1', 'ACTIVE', NOW(), NOW()),
('SUPP-012', 'Baldev Singh', 'Baldev Agro & Seeds Trading', '9911012345', 'baldev.agro@gmail.com', 'Gill Road, Miller Ganj', 'Ludhiana', 'Punjab', '141003', '03AABCS4567H1Z2', 'ACTIVE', NOW(), NOW()),
('SUPP-013', 'Sunita Patil', 'Nashik Industrial Safety Goods', '9545012345', 'sunita.patil@gmail.com', 'Ambad MIDC Area', 'Nashik', 'Maharashtra', '422010', '27AABCP7890S1Z3', 'ACTIVE', NOW(), NOW()),
('SUPP-014', 'Sanjay Tiwari', 'Tiwari Office Stationers Ltd', '8812012345', 'sanjay.tiwari@gmail.com', 'Nagram Road, Lalbagh', 'Lucknow', 'Uttar Pradesh', '226001', '09AABCT1234C1Z4', 'ACTIVE', NOW(), NOW()),
('SUPP-015', 'Salim Khan', 'Khan Tools & Builders Hardware', '9717012345', 'salim.builders@gmail.com', 'GB Road, Lal Kuan', 'Old Delhi', 'Delhi', '110006', '07AABCK1234M1Z5', 'ACTIVE', NOW(), NOW()),
('SUPP-016', 'Rohan Malhotra', 'Malhotra Audio-Visual Distributors', '9811012345', 'rohan.malhotra@gmail.com', 'Phase 5, Udyog Vihar', 'Gurugram', 'Haryana', '122016', '06AABCM7890L1Z6', 'ACTIVE', NOW(), NOW()),
('SUPP-017', 'Deepak Singhal', 'Dehradun Electrical Wholesale', '9312012345', 'deepak.singhal@gmail.com', 'Patel Nagar Market', 'Dehradun', 'Uttarakhand', '248001', '05AABCS1234T1Z7', 'ACTIVE', NOW(), NOW()),
('SUPP-018', 'Anupam Barua', 'Barua Pet Foods & Accessories', '9435012345', 'anupam.barua@gmail.com', 'GS Road, Dispur', 'Guwahati', 'Assam', '781005', '18AABCB1234G1Z8', 'ACTIVE', NOW(), NOW()),
('SUPP-019', 'Pradeep Bansal', 'Bansal Plywood & Furniture Agency', '7503012345', 'pradeep.bansal@gmail.com', 'Industrial Area, Jhotwara', 'Jaipur', 'Rajasthan', '302012', '08AABCB4567Y1Z9', 'ACTIVE', NOW(), NOW()),
('SUPP-020', 'Ashish Kamble', 'Kamble Musical Instruments Agency', '9123012345', 'ashish.kamble@gmail.com', 'Budhwar Peth', 'Pune', 'Maharashtra', '411002', '27AABCK4567R1Z0', 'ACTIVE', NOW(), NOW());

-- Seed 20 Purchases
INSERT INTO purchases (id, purchase_number, supplier_id, purchase_date, subtotal, discount, tax, grand_total, payment_status, notes, created_at, updated_at) VALUES
(1, 'PO-2026-001', 1, '2026-08-01 10:00:00', 4000.00, 200.00, 0.00, 3800.00, 'PAID', 'Initial stock load of Tata Salt', NOW(), NOW()),
(2, 'PO-2026-002', 2, '2026-08-02 11:30:00', 3750.00, 150.00, 180.00, 3780.00, 'PAID', 'Tea biscuits bulk buy', NOW(), NOW()),
(3, 'PO-2026-003', 3, '2026-08-03 14:15:00', 16800.00, 800.00, 1920.00, 17920.00, 'PAID', 'Amul Butter replenishment', NOW(), NOW()),
(4, 'PO-2026-004', 4, '2026-08-04 16:45:00', 140000.00, 5000.00, 24300.00, 159300.00, 'PAID', 'Samsung Galaxy phones stock', NOW(), NOW()),
(5, 'PO-2026-005', 5, '2026-08-05 10:20:00', 18000.00, 600.00, 3132.00, 20532.00, 'PAID', 'Boat Rockerz bulk purchase', NOW(), NOW()),
(6, 'PO-2026-006', 6, '2026-08-06 13:00:00', 11000.00, 400.00, 1272.00, 11872.00, 'PAID', 'Pressure cookers load', NOW(), NOW()),
(7, 'PO-2026-007', 7, '2026-08-07 15:30:00', 7000.00, 300.00, 1206.00, 7906.00, 'PAID', 'Wipro LED Bulbs order', NOW(), NOW()),
(8, 'PO-2026-008', 8, '2026-08-08 12:10:00', 22000.00, 1000.00, 3780.00, 24780.00, 'PAID', 'Titan watches order', NOW(), NOW()),
(9, 'PO-2026-009', 9, '2026-08-09 11:00:00', 28000.00, 1200.00, 4824.00, 31624.00, 'PAID', 'Nike running shoes buy', NOW(), NOW()),
(10, 'PO-2026-010', 10, '2026-08-10 14:00:00', 12000.00, 500.00, 2070.00, 13570.00, 'PAID', 'Adidas backpacks load', NOW(), NOW()),
(11, 'PO-2026-011', 11, '2026-08-11 16:30:00', 9000.00, 400.00, 430.00, 9030.00, 'PAID', 'Puma active tees buy', NOW(), NOW()),
(12, 'PO-2026-012', 12, '2026-08-12 10:45:00', 10500.00, 500.00, 1800.00, 11800.00, 'PAID', 'USHA pedestal fans stock', NOW(), NOW()),
(13, 'PO-2026-013', 13, '2026-08-13 13:20:00', 11000.00, 500.00, 1890.00, 12390.00, 'PAID', 'Dell keyboards buy', NOW(), NOW()),
(14, 'PO-2026-014', 14, '2026-08-14 15:00:00', 33000.00, 1500.00, 5670.00, 37170.00, 'PAID', 'HP Laser printers order', NOW(), NOW()),
(15, 'PO-2026-015', 15, '2026-08-15 11:30:00', 7000.00, 350.00, 1197.00, 7847.00, 'PAID', 'Godrej brass padlocks', NOW(), NOW()),
(16, 'PO-2026-016', 16, '2026-08-16 14:10:00', 11500.00, 500.00, 1980.00, 12980.00, 'PAID', 'Instant geysers order', NOW(), NOW()),
(17, 'PO-2026-017', 17, '2026-08-17 16:20:00', 14000.00, 600.00, 2412.00, 15812.00, 'PAID', 'Philips trimmers buy', NOW(), NOW()),
(18, 'PO-2026-018', 18, '2026-08-18 10:15:00', 16500.00, 700.00, 2844.00, 18644.00, 'PAID', 'LG microwave ovens buy', NOW(), NOW()),
(19, 'PO-2026-019', 19, '2026-08-19 12:30:00', 17000.00, 800.00, 2916.00, 19116.00, 'PAID', 'Sony Bluetooth headsets buy', NOW(), NOW()),
(20, 'PO-2026-020', 20, '2026-08-20 15:45:00', 2400.00, 100.00, 414.00, 2714.00, 'PAID', 'Amul dark chocolate bars', NOW(), NOW());

-- Seed 20 Purchase Items (po_id matches the list above)
INSERT INTO purchase_items (purchase_id, product_id, quantity, purchase_price, discount, tax, total) VALUES
(1, 1, 200, 20.00, 200.00, 0.00, 3800.00),
(2, 2, 150, 25.00, 150.00, 180.00, 3780.00),
(3, 3, 80, 210.00, 800.00, 1920.00, 17920.00),
(4, 4, 10, 14000.00, 5000.00, 24300.00, 159300.00),
(5, 5, 20, 900.00, 600.00, 3132.00, 20532.00),
(6, 6, 10, 1100.00, 400.00, 1272.00, 11872.00),
(7, 7, 100, 70.00, 300.00, 1206.00, 7906.00),
(8, 8, 10, 2200.00, 1000.00, 3780.00, 24780.00),
(9, 9, 10, 2800.00, 1200.00, 4824.00, 31624.00),
(10, 10, 10, 1200.00, 500.00, 2070.00, 13570.00),
(11, 11, 15, 600.00, 400.00, 430.00, 9030.00),
(12, 12, 5, 2100.00, 500.00, 1800.00, 11800.00),
(13, 13, 10, 1100.00, 500.00, 1890.00, 12390.00),
(14, 14, 2, 16500.00, 1500.00, 5670.00, 37170.00),
(15, 15, 20, 350.00, 350.00, 1197.00, 7847.00),
(16, 16, 5, 2300.00, 500.00, 1980.00, 12980.00),
(17, 17, 10, 1400.00, 600.00, 2412.00, 15812.00),
(18, 18, 3, 5500.00, 700.00, 2844.00, 18644.00),
(19, 19, 5, 3400.00, 800.00, 2916.00, 19116.00),
(20, 20, 30, 80.00, 100.00, 414.00, 2714.00);

-- Seed 20 Sales
INSERT INTO sales (id, sale_number, customer_id, sale_date, subtotal, discount, tax, grand_total, payment_status, notes, cashier, created_at, updated_at) VALUES
(1, 'INV-2026-001', 1, '2026-08-21 10:15:00', 56.00, 0.00, 0.00, 56.00, 'PAID', 'Walk-in cash sale', 'cashier', NOW(), NOW()),
(2, 'INV-2026-002', 2, '2026-08-21 11:00:00', 70.00, 0.00, 3.50, 73.50, 'PAID', 'Tea biscuits card sale', 'cashier', NOW(), NOW()),
(3, 'INV-2026-003', 3, '2026-08-21 11:45:00', 510.00, 20.00, 58.80, 548.80, 'PAID', 'Butter UPI purchase', 'cashier', NOW(), NOW()),
(4, 'INV-2026-004', 4, '2026-08-21 12:30:00', 16999.00, 500.00, 2969.82, 19468.82, 'PAID', 'Samsung smartphone sale', 'admin', NOW(), NOW()),
(5, 'INV-2026-005', 5, '2026-08-21 13:00:00', 1299.00, 100.00, 215.82, 1414.82, 'PAID', 'Headphones card sale', 'cashier', NOW(), NOW()),
(6, 'INV-2026-006', 6, '2026-08-21 14:15:00', 1499.00, 50.00, 173.88, 1622.88, 'PAID', 'Pressure cooker sale', 'cashier', NOW(), NOW()),
(7, 'INV-2026-007', 7, '2026-08-21 14:45:00', 198.00, 0.00, 35.64, 233.64, 'PAID', 'LED bulbs UPI sale', 'cashier', NOW(), NOW()),
(8, 'INV-2026-008', 8, '2026-08-21 15:20:00', 2995.00, 150.00, 512.10, 3357.10, 'PAID', 'Watch sale', 'cashier', NOW(), NOW()),
(9, 'INV-2026-009', 9, '2026-08-21 15:45:00', 3695.00, 200.00, 629.10, 4124.10, 'PAID', 'Running shoes UPI sale', 'cashier', NOW(), NOW()),
(10, 'INV-2026-010', 10, '2026-08-21 16:10:00', 1699.00, 100.00, 287.82, 1886.82, 'PAID', 'Backpack sale', 'cashier', NOW(), NOW()),
(11, 'INV-2026-011', 11, '2026-08-21 16:30:00', 899.00, 50.00, 42.45, 891.45, 'PAID', 'Active dry-fit tee sale', 'cashier', NOW(), NOW()),
(12, 'INV-2026-012', 12, '2026-08-21 17:00:00', 2850.00, 150.00, 486.00, 3186.00, 'PAID', 'Pedestal fan sale', 'admin', NOW(), NOW()),
(13, 'INV-2026-013', 13, '2026-08-21 17:20:00', 1499.00, 50.00, 260.82, 1709.82, 'PAID', 'Wireless keyboard sale', 'cashier', NOW(), NOW()),
(14, 'INV-2026-014', 14, '2026-08-21 17:45:00', 19500.00, 1000.00, 3330.00, 21830.00, 'PAID', 'HP LaserJet printer sale', 'admin', NOW(), NOW()),
(15, 'INV-2026-015', 15, '2026-08-21 18:00:00', 480.00, 20.00, 82.80, 542.80, 'PAID', 'Godrej padlock sale', 'cashier', NOW(), NOW()),
(16, 'INV-2026-016', 16, '2026-08-21 18:20:00', 3199.00, 100.00, 557.82, 3656.82, 'PAID', 'Water heater sale', 'cashier', NOW(), NOW()),
(17, 'INV-2026-017', 17, '2026-08-21 18:40:00', 1999.00, 100.00, 341.82, 2240.82, 'PAID', 'Philips trimmer sale', 'cashier', NOW(), NOW()),
(18, 'INV-2026-018', 18, '2026-08-21 19:00:00', 6899.00, 300.00, 1187.82, 7786.82, 'PAID', 'LG microwave oven sale', 'cashier', NOW(), NOW()),
(19, 'INV-2026-019', 19, '2026-08-21 19:15:00', 4490.00, 200.00, 772.20, 5062.20, 'PAID', 'Sony Bluetooth headset sale', 'cashier', NOW(), NOW()),
(20, 'INV-2026-020', 20, '2026-08-21 19:30:00', 110.00, 10.00, 18.00, 118.00, 'PAID', 'Dark chocolate bar sale', 'cashier', NOW(), NOW());

-- Seed 20 Sale Items (sale_id matches the sales above)
INSERT INTO sale_items (sale_id, product_id, quantity, selling_price, purchase_price_at_sale, discount, tax, total) VALUES
(1, 1, 2, 28.00, 20.00, 0.00, 0.00, 56.00),
(2, 2, 2, 35.00, 25.00, 0.00, 3.50, 73.50),
(3, 3, 2, 255.00, 210.00, 20.00, 58.80, 548.80),
(4, 4, 1, 16999.00, 14000.00, 500.00, 2969.82, 19468.82),
(5, 5, 1, 1299.00, 900.00, 100.00, 215.82, 1414.82),
(6, 6, 1, 1499.00, 1100.00, 50.00, 173.88, 1622.88),
(7, 7, 2, 99.00, 70.00, 0.00, 35.64, 233.64),
(8, 8, 1, 2995.00, 2200.00, 150.00, 512.10, 3357.10),
(9, 9, 1, 3695.00, 2800.00, 200.00, 629.10, 4124.10),
(10, 10, 1, 1699.00, 1200.00, 100.00, 287.82, 1886.82),
(11, 11, 1, 899.00, 600.00, 50.00, 42.45, 891.45),
(12, 12, 1, 2850.00, 2100.00, 150.00, 486.00, 3186.00),
(13, 13, 1, 1499.00, 1100.00, 50.00, 260.82, 1709.82),
(14, 14, 1, 19500.00, 16500.00, 1000.00, 3330.00, 21830.00),
(15, 15, 1, 480.00, 350.00, 20.00, 82.80, 542.80),
(16, 16, 1, 3199.00, 2300.00, 100.00, 557.82, 3656.82),
(17, 17, 1, 1999.00, 1400.00, 100.00, 341.82, 2240.82),
(18, 18, 1, 6899.00, 5500.00, 300.00, 1187.82, 7786.82),
(19, 19, 1, 4490.00, 3400.00, 200.00, 772.20, 5062.20),
(20, 20, 1, 110.00, 80.00, 10.00, 18.00, 118.00);

-- Seed 20 Payments (matching purchases and sales)
INSERT INTO payments (transaction_type, transaction_id, payment_method, amount, notes, payment_date) VALUES
('PURCHASE', 1, 'BANK_TRANSFER', 3800.00, 'Paid full invoice to Khandelwal Grocery', '2026-08-01 10:05:00'),
('PURCHASE', 2, 'BANK_TRANSFER', 3780.00, 'Paid Britannia bulk order', '2026-08-02 11:35:00'),
('PURCHASE', 3, 'BANK_TRANSFER', 17920.00, 'Amul Butter invoice paid', '2026-08-03 14:20:00'),
('PURCHASE', 4, 'BANK_TRANSFER', 159300.00, 'Samsung wholesale order paid', '2026-08-04 16:50:00'),
('PURCHASE', 5, 'BANK_TRANSFER', 20532.00, 'Boat audio gear paid', '2026-08-05 10:25:00'),
('SALE', 1, 'CASH', 56.00, 'Received cash payment at counter', '2026-08-21 10:15:00'),
('SALE', 2, 'CARD', 73.50, 'Paid via credit card terminal', '2026-08-21 11:00:00'),
('SALE', 3, 'UPI', 548.80, 'Google Pay transaction success', '2026-08-21 11:45:00'),
('SALE', 4, 'UPI', 19468.82, 'PhonePe transaction success', '2026-08-21 12:30:00'),
('SALE', 5, 'CARD', 1414.82, 'Debit card transaction swipe', '2026-08-21 13:00:00'),
('SALE', 6, 'CASH', 1622.88, 'Cash transaction at counter', '2026-08-21 14:15:00'),
('SALE', 7, 'UPI', 233.64, 'Paytm scan and pay success', '2026-08-21 14:45:00'),
('SALE', 8, 'CARD', 3357.10, 'Visa card terminal tap payment', '2026-08-21 15:20:00'),
('SALE', 9, 'UPI', 4124.10, 'BHIM UPI transaction success', '2026-08-21 15:45:00'),
('SALE', 10, 'CARD', 1886.82, 'Debit card payment swipe', '2026-08-21 16:10:00'),
('SALE', 11, 'CASH', 891.45, 'Cash payment at checkout counter', '2026-08-21 16:30:00'),
('SALE', 12, 'UPI', 3186.00, 'GPay merchant scan payment', '2026-08-21 17:00:00'),
('SALE', 13, 'CARD', 1709.82, 'Card swipe success', '2026-08-21 17:20:00'),
('SALE', 14, 'BANK_TRANSFER', 21830.00, 'NEFT bank transfer confirmed', '2026-08-21 17:45:00'),
('SALE', 15, 'CASH', 542.80, 'Cash payment counter receipt', '2026-08-21 18:00:00');

-- Seed 20 Inventory Transactions (matching the purchases and sales stock movements)
INSERT INTO inventory_transactions (product_id, type, previous_quantity, transaction_quantity, new_quantity, reference_number, reason, username, transaction_date) VALUES
(1, 'PURCHASE', 0, 200, 200, 'PO-2026-001', 'Stock inward from Khandelwal Grocery', 'manager', '2026-08-01 10:00:00'),
(2, 'PURCHASE', 0, 150, 150, 'PO-2026-002', 'Stock inward from Britannia Bakery', 'manager', '2026-08-02 11:30:00'),
(3, 'PURCHASE', 0, 80, 80, 'PO-2026-003', 'Stock inward from Amul distributor', 'manager', '2026-08-03 14:15:00'),
(4, 'PURCHASE', 0, 10, 10, 'PO-2026-004', 'Stock inward from Patel Electronics', 'manager', '2026-08-04 16:45:00'),
(5, 'PURCHASE', 0, 20, 20, 'PO-2026-005', 'Stock inward from Boat Audio Agency', 'manager', '2026-08-05 10:20:00'),
(1, 'SALE', 200, -2, 198, 'INV-2026-001', 'Sale checkout via POS', 'cashier', '2026-08-21 10:15:00'),
(2, 'SALE', 150, -2, 148, 'INV-2026-002', 'Sale checkout via POS', 'cashier', '2026-08-21 11:00:00'),
(3, 'SALE', 80, -2, 78, 'INV-2026-003', 'Sale checkout via POS', 'cashier', '2026-08-21 11:45:00'),
(4, 'SALE', 10, -1, 9, 'INV-2026-004', 'Sale checkout via POS', 'admin', '2026-08-21 12:30:00'),
(5, 'SALE', 20, -1, 19, 'INV-2026-005', 'Sale checkout via POS', 'cashier', '2026-08-21 13:00:00'),
(6, 'SALE', 30, -1, 29, 'INV-2026-006', 'Sale checkout via POS', 'cashier', '2026-08-21 14:15:00'),
(7, 'SALE', 300, -2, 298, 'INV-2026-007', 'Sale checkout via POS', 'cashier', '2026-08-21 14:45:00'),
(8, 'SALE', 15, -1, 14, 'INV-2026-008', 'Sale checkout via POS', 'cashier', '2026-08-21 15:20:00'),
(9, 'SALE', 20, -1, 19, 'INV-2026-009', 'Sale checkout via POS', 'cashier', '2026-08-21 15:45:00'),
(10, 'SALE', 35, -1, 34, 'INV-2026-010', 'Sale checkout via POS', 'cashier', '2026-08-21 16:10:00'),
(11, 'SALE', 60, -1, 59, 'INV-2026-011', 'Sale checkout via POS', 'cashier', '2026-08-21 16:30:00'),
(12, 'SALE', 12, -1, 11, 'INV-2026-012', 'Sale checkout via POS', 'admin', '2026-08-21 17:00:00'),
(13, 'SALE', 40, -1, 39, 'INV-2026-013', 'Sale checkout via POS', 'cashier', '2026-08-21 17:20:00'),
(14, 'SALE', 8, -1, 7, 'INV-2026-014', 'Sale checkout via POS', 'admin', '2026-08-21 17:45:00'),
(15, 'SALE', 50, -1, 49, 'INV-2026-015', 'Sale checkout via POS', 'cashier', '2026-08-21 18:00:00');
