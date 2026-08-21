# SHOP BILLING MANAGEMENT SYSTEM
## Full-Stack Production Application — Java Spring Boot + Angular + MySQL

You are a **Senior Software Architect, Senior Java Spring Boot Developer, Senior Angular Developer, Database Architect, Security Engineer, QA Engineer, and UI/UX Engineer**.

Build a complete, production-quality **Shop Billing Management System** from scratch.

This must NOT be a simple CRUD demo.

Build a real-world application suitable for a small/medium retail shop with:

- Product management
- Category management
- Brand management
- Customer management
- Supplier management
- Purchase management
- Inventory management
- POS billing / sales
- Sales returns
- Purchase returns
- Invoice generation
- Invoice printing
- Payment management
- Dashboard
- Reports
- User management
- Role-based access control
- JWT authentication
- Swagger/OpenAPI
- Audit logs
- Shop settings
- Responsive desktop/tablet/mobile UI

The application must be secure, maintainable, scalable, responsive, tested, and actually runnable.

---

# 1. MANDATORY TECHNOLOGY STACK

Use **LTS/stable versions only**.

Do NOT use:

- Beta
- Alpha
- RC
- SNAPSHOT
- Experimental releases
- Deprecated technologies
- End-of-life versions

## Backend

Use:

- Java 21 LTS
- Spring Boot 3.x current stable/LTS-compatible release
- Spring Web
- Spring Data JPA
- Hibernate
- Spring Security
- JWT
- BCrypt
- Jakarta Bean Validation
- Lombok where useful
- Maven 3.9.x
- SLF4J
- Logback

Use Java 21 features only where they improve the code.

---

# 2. FRONTEND

Use:

- Angular current LTS release
- Node.js current LTS release
- npm bundled with Node.js LTS
- TypeScript version officially supported by the selected Angular version
- Angular Material
- Angular CDK
- Reactive Forms
- Angular Router
- HttpClient
- Route Guards
- HTTP Interceptors

IMPORTANT:

Before implementation, verify that Angular, Node.js, npm and TypeScript versions are compatible.

Do not install incompatible versions.

---

# 3. DATABASE

Use:

```text
MySQL 8.4 LTS
```

Use:

- JPA
- Hibernate
- Flyway
- Proper indexes
- Foreign keys
- Constraints
- Transactions

Never use:

```text
double
float
```

for money.

Use:

```text
BigDecimal
```

for all financial calculations.

---

# 4. PROJECT STRUCTURE

Create:

```text
ShopBillingSystem/
│
├── backend/
│   ├── pom.xml
│   ├── README.md
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   └── resources/
│       └── test/
│
├── frontend/
│   ├── package.json
│   ├── angular.json
│   ├── README.md
│   └── src/
│
├── database/
│   └── README.md
│
├── docs/
│
├── .gitignore
├── README.md
└── docker-compose.yml
```

Keep backend and frontend completely separated.

---

# 5. BACKEND PACKAGE STRUCTURE

Base package:

```text
com.shopbilling
```

Use:

```text
com.shopbilling
│
├── config
├── security
├── controller
├── service
├── repository
├── entity
├── dto
│   ├── request
│   └── response
├── mapper
├── exception
├── specification
├── projection
├── util
└── audit
```

Follow:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

Controllers must contain NO business logic.

Business logic belongs in services.

Do not expose JPA entities directly through APIs.

Use DTOs.

---

# 6. DATABASE ENTITIES

Create a properly normalized database.

Main entities:

```text
User
Role
Permission
UserRole

Category
Brand
Product

Customer
Supplier

Purchase
PurchaseItem

Sale
SaleItem

Payment

Inventory
InventoryTransaction

Invoice
InvoiceItem

SalesReturn
SalesReturnItem

PurchaseReturn
PurchaseReturnItem

ShopSettings

AuditLog
```

Use appropriate relationships.

Examples:

```text
Category 1 → N Products
Brand 1 → N Products

Supplier 1 → N Purchases
Purchase 1 → N PurchaseItems

Customer 1 → N Sales
Sale 1 → N SaleItems

Product 1 → N InventoryTransactions

Sale 1 → N Payments
Sale 1 → 1 Invoice
```

Avoid unnecessary bidirectional relationships.

Avoid infinite JSON serialization.

Use DTOs.

---

# 7. COMMON ENTITY FIELDS

Where appropriate use:

```text
id
createdAt
updatedAt
createdBy
updatedBy
status
```

Use:

```text
LocalDateTime
```

for timestamps.

Use proper enum types for statuses.

Do not store arbitrary status strings everywhere.

---

# 8. USER MANAGEMENT

User fields:

```text
id
username
password
fullName
mobile
email
status
createdAt
updatedAt
```

Password must be stored as BCrypt hash.

Never store plaintext passwords.

Never log passwords.

Never return passwords through APIs.

---

# 9. ROLE MANAGEMENT

Create:

```text
ADMIN
MANAGER
CASHIER
```

Permissions:

## ADMIN

Full access.

## MANAGER

Access to:

- Dashboard
- Products
- Categories
- Brands
- Customers
- Suppliers
- Purchases
- Sales
- Inventory
- Reports
- Invoices

## CASHIER

Access to:

- Dashboard
- Customers
- Products
- POS billing
- Sales
- Invoices
- Customer history

CASHIER must NOT manage users, system settings, suppliers, or sensitive administrative configuration.

Backend authorization is mandatory.

Do not rely only on Angular permissions.

---

# 10. JWT SECURITY

Implement complete JWT authentication.

Flow:

```text
Login
 ↓
Validate username/password
 ↓
BCrypt verification
 ↓
Generate JWT
 ↓
Return authentication response
 ↓
Angular stores token appropriately
 ↓
HTTP interceptor adds Bearer token
 ↓
Spring Security validates JWT
```

Implement:

```text
JwtAuthenticationFilter
JwtTokenService
SecurityConfig
UserDetailsService
PasswordEncoder
AuthenticationService
```

Use:

```text
Authorization: Bearer <token>
```

Protect all business APIs.

Public endpoints:

```text
/api/auth/login
/api/auth/refresh
```

if refresh tokens are implemented.

Never expose sensitive endpoints publicly.

---

# 11. JWT CONFIGURATION

JWT secret must come from environment/configuration.

Example:

```text
JWT_SECRET
JWT_EXPIRATION
```

Never hardcode the secret in Java source code.

Never commit secrets to Git.

Do not log JWT tokens.

Use secure expiration settings.

If refresh tokens are implemented, secure them properly.

---

# 12. CORS

Configure CORS properly.

Development:

```text
Angular → Spring Boot
```

Do not use:

```text
allowedOrigins("*")
```

with credentials.

Make frontend origin configurable.

Example:

```text
FRONTEND_URL
```

---

# 13. PRODUCT MANAGEMENT

Product fields:

```text
id
productCode
barcode
name
description
categoryId
brandId
unit
purchasePrice
sellingPrice
taxPercentage
minimumStock
currentStock
status
createdAt
updatedAt
```

Features:

- Create
- Update
- View
- Activate/deactivate
- Search
- Barcode search
- Category filter
- Brand filter
- Price filter
- Low-stock detection
- Pagination
- Sorting

Do not physically delete products that are referenced by historical transactions.

Use active/inactive status.

---

# 14. CATEGORY MANAGEMENT

Implement:

- Create category
- Update category
- View category
- Search
- Activate/deactivate

Do not allow unsafe deletion of categories referenced by products.

---

# 15. BRAND MANAGEMENT

Implement:

- Create
- Update
- Search
- View
- Activate/deactivate

---

# 16. CUSTOMER MANAGEMENT

Fields:

```text
id
customerCode
name
mobile
email
address
city
state
pincode
gstNumber
status
createdAt
updatedAt
```

Features:

- CRUD
- Search
- Purchase history
- Sales history
- Outstanding balance if credit sales are supported

Validate mobile and email.

---

# 17. SUPPLIER MANAGEMENT

Fields:

```text
id
supplierCode
name
companyName
mobile
email
address
city
state
pincode
gstNumber
status
createdAt
updatedAt
```

Features:

- CRUD
- Search
- Purchase history
- Outstanding amount

---

# 18. PURCHASE MODULE

Purchase fields:

```text
purchaseNumber
supplier
purchaseDate
subtotal
discount
tax
grandTotal
paymentStatus
notes
```

Purchase item:

```text
product
quantity
purchasePrice
discount
tax
total
```

When purchase is completed:

```text
Stock increases
Inventory transaction created
Purchase saved
Payment recorded
```

Use database transaction.

If any operation fails, rollback the complete transaction.

---

# 19. POS BILLING MODULE

This is the primary feature.

Create a professional POS billing screen.

Features:

```text
Search product
Barcode search
Add to cart
Change quantity
Remove item
Apply item discount
Apply bill discount
Calculate tax
Calculate subtotal
Calculate grand total
Select customer
Select payment method
Complete sale
Generate invoice
Print invoice
```

The POS screen must be extremely fast and user-friendly.

Keyboard-friendly desktop experience.

Touch-friendly mobile experience.

---

# 20. SALE CALCULATION

The backend must calculate all financial values.

Never trust totals sent by Angular.

Backend must recalculate:

```text
item subtotal
item discount
tax
bill discount
subtotal
grand total
```

Use:

```text
BigDecimal
```

for all money.

Use proper rounding rules.

Document the rounding strategy.

---

# 21. PAYMENT METHODS

Support:

```text
CASH
CARD
UPI
BANK_TRANSFER
CREDIT
MIXED
```

For MIXED payment, support multiple payment entries.

Example:

```text
Cash     ₹500
UPI      ₹300
----------------
Total    ₹800
```

Ensure payment totals equal invoice total.

---

# 22. STOCK MANAGEMENT

Stock changes:

```text
Purchase completed
→ Increase stock

Sale completed
→ Decrease stock

Sale return
→ Increase stock

Purchase return
→ Decrease stock

Manual adjustment
→ Increase/decrease stock
```

Create inventory transactions:

```text
PURCHASE
SALE
SALE_RETURN
PURCHASE_RETURN
ADJUSTMENT
```

Maintain complete stock history.

Prevent selling more than available stock unless explicitly configured.

Use transactional locking/appropriate concurrency handling where required to prevent overselling.

---

# 23. INVENTORY ADJUSTMENT

ADMIN/MANAGER can manually adjust inventory.

Require:

```text
Product
Previous quantity
Adjustment quantity
New quantity
Reason
User
Timestamp
```

Every adjustment must create an inventory transaction.

Never silently change stock.

---

# 24. INVOICE MANAGEMENT

Generate invoice numbers:

```text
INV-2026-000001
INV-2026-000002
```

Invoice must contain:

```text
Shop information
Invoice number
Date/time
Customer
Products
Quantity
Rate
Discount
Tax
Subtotal
Grand total
Payment method
Cashier
```

Implement:

- View invoice
- Search invoice
- Download invoice
- Print invoice
- Reprint invoice

Invoice must be printable on:

- A4
- Thermal receipt if practical

---

# 25. SALES RETURN

Implement sales returns.

Flow:

```text
Search invoice
 ↓
Select item
 ↓
Select return quantity
 ↓
Validate quantity
 ↓
Calculate refund
 ↓
Create return
 ↓
Increase stock
 ↓
Create inventory transaction
```

Never allow return quantity greater than the original sold quantity.

Track returned quantities.

---

# 26. PURCHASE RETURN

Implement:

```text
Search purchase
Select products
Select return quantities
Calculate amount
Update inventory
Create purchase return
```

Do not allow return quantity greater than purchased quantity.

---

# 27. DASHBOARD

Create a professional dashboard.

Cards:

```text
Today's Sales
Today's Purchases
Today's Profit
Total Products
Low Stock Products
Total Customers
Total Suppliers
Outstanding Amount
```

Charts:

```text
Daily Sales
Monthly Sales
Top Products
Category Sales
Payment Methods
```

Backend should provide optimized aggregation APIs.

Do not fetch all sales records and calculate everything in Angular.

---

# 28. REPORTS

Create:

## Sales Reports

- Daily sales
- Monthly sales
- Date-range sales
- Product-wise sales
- Customer-wise sales
- Payment-wise sales

## Purchase Reports

- Daily purchases
- Monthly purchases
- Supplier-wise purchases
- Date-range purchases

## Inventory Reports

- Current stock
- Low stock
- Stock movement
- Product stock history

## Profit Reports

Calculate profit correctly based on transaction data.

Do not simply calculate:

```text
sellingPrice - currentPurchasePrice
```

for historical transactions.

Use the purchase cost recorded at the time of sale.

---

# 29. SEARCH / FILTER / PAGINATION

All large lists must support server-side:

```text
Search
Filter
Sort
Pagination
```

Example:

```text
?page=0
&size=20
&sort=name,asc
&search=mobile
```

Do not load thousands of records into Angular.

---

# 30. GLOBAL API RESPONSE

Create standardized responses.

Success:

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Product not found",
  "data": null,
  "timestamp": "..."
}
```

Paginated:

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": [],
  "page": 0,
  "size": 20,
  "totalElements": 100,
  "totalPages": 5
}
```

---

# 31. GLOBAL EXCEPTION HANDLING

Use:

```text
@RestControllerAdvice
```

Handle:

```text
ValidationException
MethodArgumentNotValidException
EntityNotFoundException
DuplicateDataException
BusinessException
AuthenticationException
AccessDeniedException
DataIntegrityViolationException
DatabaseException
GenericException
```

Never expose:

- Stack traces
- SQL queries
- Passwords
- JWT tokens
- Internal server information

---

# 32. VALIDATION

Use backend:

```text
@NotNull
@NotBlank
@Size
@Email
@Pattern
@Positive
@PositiveOrZero
@DecimalMin
```

Use appropriate validation for every DTO.

Frontend validation is also required.

Backend validation is authoritative.

---

# 33. DATABASE INDEXING

Create indexes for frequently searched fields:

```text
productCode
barcode
product.name
customer.mobile
customer.customerCode
supplier.mobile
sale.saleNumber
purchase.purchaseNumber
invoice.invoiceNumber
createdAt
```

Review indexes after implementing queries.

Avoid unnecessary indexes.

---

# 34. TRANSACTIONS

Use:

```java
@Transactional
```

for operations such as:

```text
Create purchase
Complete sale
Sale return
Purchase return
Inventory adjustment
Payment processing
Invoice generation
```

Ensure atomic operations.

---

# 35. CONCURRENCY

Consider concurrent billing.

Two cashiers must not be able to sell the same last item simultaneously and create invalid negative stock.

Use appropriate database locking/transaction isolation where required.

Do not solve concurrency only in Angular.

---

# 36. AUDIT LOGGING

Create audit logs for:

```text
LOGIN
CREATE_PRODUCT
UPDATE_PRODUCT
DEACTIVATE_PRODUCT
CREATE_CUSTOMER
CREATE_SUPPLIER
CREATE_PURCHASE
CREATE_SALE
CANCEL_SALE
SALES_RETURN
PURCHASE_RETURN
INVENTORY_ADJUSTMENT
CREATE_USER
UPDATE_USER
UPDATE_SETTINGS
```

Store:

```text
user
action
entity
entityId
description
timestamp
```

Never store:

```text
password
JWT token
sensitive credentials
```

---

# 37. SHOP SETTINGS

Create shop configuration:

```text
shopName
shopAddress
mobile
email
gstNumber
logo
invoicePrefix
currency
taxConfiguration
invoiceFooter
```

Use these values dynamically in invoices.

---

# 38. SWAGGER / OPENAPI

Implement Swagger UI using Springdoc OpenAPI.

Document every endpoint.

Add:

```text
Authentication
Products
Categories
Brands
Customers
Suppliers
Purchases
Sales
Returns
Inventory
Invoices
Payments
Reports
Dashboard
Users
Settings
```

Swagger must support JWT Bearer authentication.

---

# 39. ANGULAR ARCHITECTURE

Create:

```text
src/app/
│
├── core/
│   ├── guards/
│   ├── interceptors/
│   ├── services/
│   └── models/
│
├── shared/
│   ├── components/
│   ├── directives/
│   ├── pipes/
│   └── services/
│
├── layout/
│
├── auth/
│
├── dashboard/
├── products/
├── categories/
├── brands/
├── customers/
├── suppliers/
├── purchases/
├── sales/
├── inventory/
├── invoices/
├── reports/
├── users/
└── settings/
```

Use lazy loading where appropriate.

---

# 40. ANGULAR SERVICES

Create dedicated services:

```text
AuthService
ProductService
CategoryService
BrandService
CustomerService
SupplierService
PurchaseService
SaleService
InventoryService
InvoiceService
ReportService
DashboardService
UserService
SettingsService
```

Do not put all API calls in one service.

---

# 41. ANGULAR SECURITY

Create:

```text
AuthGuard
RoleGuard
JwtInterceptor
```

Interceptor:

```text
Authorization: Bearer JWT
```

Handle:

```text
401 → logout / authentication handling
403 → access denied
```

Never store passwords.

Never put JWT secrets in Angular.

---

# 42. RESPONSIVE UI

The UI MUST work correctly on:

```text
Desktop
Laptop
Tablet
Android
iPhone
```

Use mobile-first responsive design.

Desktop:

```text
Sidebar
Header
Main content
```

Mobile:

```text
Compact header
Hamburger navigation
Full-width content
Touch-friendly controls
Responsive tables/cards
```

Do NOT simply scale the desktop UI down.

Create proper responsive layouts.

---

# 43. MOBILE POS

POS billing must work especially well on mobile.

Requirements:

- Large touch targets
- Product search
- Barcode input
- Cart cards
- Quantity controls
- Sticky total
- Easy payment button
- Responsive customer selection
- Responsive payment modal

No horizontal page overflow.

---

# 44. RESPONSIVE TABLES

Tables must work on mobile.

Use:

```text
Responsive table
Horizontal scrolling where appropriate
Card layout where appropriate
```

Never allow important data to become unreadable.

---

# 45. UI DESIGN

Create a professional retail application.

Style:

```text
Modern
Clean
Professional
Minimal
Readable
Fast
Consistent
```

Use consistent:

- Typography
- Buttons
- Forms
- Cards
- Tables
- Modals
- Toasts
- Icons
- Spacing

Do not overuse animations.

---

# 46. LOADING / ERROR / EMPTY STATES

Every major screen must handle:

```text
Loading
Success
Empty
Validation error
Unauthorized
Forbidden
Not found
Server error
Network error
```

Use proper loading indicators.

Use user-friendly error messages.

Never show raw backend exceptions.

---

# 47. ACCESSIBILITY

Implement:

- Proper labels
- Keyboard navigation
- Focus states
- Accessible buttons
- ARIA where appropriate
- Good contrast
- Meaningful validation messages

---

# 48. BARCODE SUPPORT

Implement barcode search.

POS should allow:

```text
Enter barcode
Scan barcode
Find product
Add product to cart
```

Design the input so physical barcode scanners that behave like keyboard input work correctly.

---

# 49. INVOICE PDF

Implement server-side invoice PDF generation.

Use a maintained PDF library compatible with Java 21/Spring Boot.

The PDF must contain:

```text
Shop logo/name
Address
GST
Invoice number
Date
Customer
Items
Quantity
Price
Discount
Tax
Total
Payment
Footer
```

Keep invoice layout professional.

---

# 50. DATABASE MIGRATION

Use Flyway.

Create migrations such as:

```text
V1__create_roles.sql
V2__create_users.sql
V3__create_categories.sql
V4__create_brands.sql
V5__create_products.sql
V6__create_customers.sql
V7__create_suppliers.sql
V8__create_purchases.sql
V9__create_sales.sql
V10__create_inventory.sql
V11__create_invoices.sql
V12__create_payments.sql
V13__create_returns.sql
V14__create_audit_logs.sql
V15__create_shop_settings.sql
```

Use proper foreign keys and indexes.

---

# 51. SEED DATA

Create development seed data.

Users:

```text
admin
manager
cashier
```

Also create sample:

```text
Categories
Brands
Products
Customers
Suppliers
```

Clearly document development login credentials.

Do not use production credentials.

---

# 52. CONFIGURATION

Use:

```text
application.yml
application-dev.yml
application-prod.yml
```

Use environment variables for:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD
JWT_SECRET
JWT_EXPIRATION
FRONTEND_URL
```

Never commit production secrets.

Create:

```text
.env.example
```

where appropriate.

---

# 53. DOCKER

Create Docker support if practical.

Provide:

```text
Backend Dockerfile
Frontend Dockerfile
MySQL Docker configuration
docker-compose.yml
```

Docker should allow local development with minimal setup.

Do not put real passwords/secrets into committed Docker files.

---

# 54. TESTING

Backend tests:

```text
Authentication
JWT
Authorization
Product CRUD
Customer CRUD
Supplier CRUD
Purchase
Sale
Inventory
Returns
Invoice
Reports
Validation
Exception handling
```

Use:

```text
JUnit 5
Mockito
Spring Boot Test
```

Create integration tests for critical transaction flows.

---

# 55. CRITICAL BUSINESS TEST

Create an end-to-end business test:

```text
Create Product
 ↓
Create Supplier
 ↓
Create Purchase
 ↓
Stock increases
 ↓
Create Customer
 ↓
Create Sale
 ↓
Stock decreases
 ↓
Invoice generated
 ↓
Payment recorded
 ↓
Sales return
 ↓
Stock increases again
```

Verify every step.

---

# 56. FRONTEND TESTING

Test important:

```text
Services
Authentication
Guards
Interceptors
Forms
POS calculations/UI behavior
Product screens
Customer screens
```

Use the Angular testing tools compatible with the selected Angular LTS version.

---

# 57. CODE QUALITY

Before finalizing, search for:

```text
TODO
FIXME
console.log
System.out.println
hardcoded password
hardcoded JWT secret
duplicate code
unused imports
unused variables
unused services
unused components
duplicate APIs
duplicate models
dead code
```

Remove or fix them where appropriate.

---

# 58. SECURITY REVIEW

Perform a security review for:

```text
JWT
Password storage
Authorization
CORS
Input validation
SQL injection
XSS
Sensitive data exposure
Secrets
Logging
File uploads if implemented
IDOR / object-level authorization
```

Users must only access records they are authorized to access.

---

# 59. PERFORMANCE REVIEW

Check:

```text
N+1 queries
Unnecessary database calls
Missing indexes
Large API responses
Unnecessary Angular API calls
Unnecessary component rendering
Large lists
Dashboard queries
Invoice loading
```

Use pagination.

Use optimized queries.

Use projections where appropriate.

---

# 60. README

Create a complete README containing:

```text
Project Overview
Features
Architecture
Technology Stack
Requirements
Installation
Database Setup
Environment Variables
Backend Setup
Frontend Setup
Docker Setup
Running Instructions
Swagger URL
Default Development Login
API Documentation
Database Structure
Testing
Build
Deployment
Troubleshooting
```

Also create separate README files for backend and frontend.

---

# 61. GITIGNORE

Create a proper `.gitignore`.

Never commit:

```text
.env
application-prod.yml
real passwords
JWT secrets
node_modules
target
dist
IDE configuration
logs
```

---

# 62. API URL CONFIGURATION

Frontend API URL must NOT be hardcoded throughout the Angular code.

Use Angular environment/configuration.

Example:

```text
API_BASE_URL
```

All services must use the centralized API configuration.

---

# 63. NO DUPLICATION

Before creating a new:

```text
Component
Service
DTO
Entity
Repository
Utility
API
```

search the project first.

If equivalent functionality already exists, reuse or refactor it.

Do not create duplicate implementations.

---

# 64. DEVELOPMENT WORKFLOW

Do NOT generate the entire application blindly in one step.

Follow this sequence.

## Phase 1 — Analysis

Inspect workspace.

Determine:

- Existing files
- Existing configuration
- Existing dependencies

If the workspace is empty, create the project from scratch.

Create architecture plan.

---

## Phase 2 — Backend Foundation

Implement:

- Spring Boot
- Maven
- Configuration
- MySQL
- Flyway
- Base packages
- Exception handling
- API response structure
- Logging

Build and verify.

---

## Phase 3 — Security

Implement:

- User
- Role
- BCrypt
- JWT
- Spring Security
- Login
- Authorization
- CORS

Build and test.

---

## Phase 4 — Master Data

Implement:

- Categories
- Brands
- Products
- Customers
- Suppliers

Test CRUD.

---

## Phase 5 — Inventory

Implement:

- Inventory
- Inventory transactions
- Stock adjustments
- Low stock

Test stock calculations.

---

## Phase 6 — Purchases

Implement:

- Purchase
- Purchase items
- Supplier
- Payment
- Stock increase

Test transaction rollback.

---

## Phase 7 — Sales/POS

Implement:

- Cart
- Product search
- Barcode
- Sale
- Sale items
- Payment
- Stock decrease
- Invoice

This is a critical phase.

Test thoroughly.

---

## Phase 8 — Returns

Implement:

- Sales return
- Purchase return
- Stock restoration
- Refund calculations

Test edge cases.

---

## Phase 9 — Invoice

Implement:

- Invoice numbering
- Invoice API
- PDF
- Printing
- Reprint

---

## Phase 10 — Dashboard and Reports

Implement:

- Dashboard
- Sales reports
- Purchase reports
- Inventory reports
- Profit reports

Optimize queries.

---

## Phase 11 — Angular

Implement:

- Angular architecture
- Layout
- Login
- Authentication
- Guards
- Interceptor
- Dashboard
- Master data
- POS
- Inventory
- Reports
- Settings

---

## Phase 12 — Responsive UI

Test:

```text
1920x1080
1366x768
1024x768
768x1024
390x844
360x800
```

Fix:

- Overflow
- Broken tables
- Small buttons
- Form layout
- Navigation
- POS layout

---

## Phase 13 — Testing

Run:

```text
Backend tests
Frontend tests
Integration tests
```

Fix failures.

---

## Phase 14 — Build Verification

Run backend build.

Run frontend build.

Fix all compilation errors.

Fix warnings where appropriate.

---

## Phase 15 — Final Code Review

Review entire codebase for:

```text
Security
Performance
Architecture
Duplicate code
Dead code
Validation
Database
Transactions
API design
UI/UX
Responsive design
Accessibility
Testing
Documentation
```

---

# 65. IMPORTANT ANTIGRAVITY BEHAVIOR

Before changing any existing file:

1. Read it.
2. Understand its purpose.
3. Check dependencies.
4. Check whether another module depends on it.
5. Make the smallest safe change.

Never overwrite working code blindly.

Never create duplicate classes.

Never create duplicate APIs.

Never create duplicate Angular components.

Never remove functionality without checking dependencies.

---

# 66. BUILD AFTER EACH MAJOR PHASE

After backend changes:

```text
mvn clean test
mvn clean package
```

After frontend changes:

```text
npm install
npm run build
```

Use the correct Angular CLI commands for the selected Angular LTS version.

If a build fails:

1. Read the complete error.
2. Identify the root cause.
3. Fix it.
4. Run the build again.
5. Continue only after successful verification.

Do not ignore build errors.

---

# 67. FINAL SYSTEM VERIFICATION

Before declaring completion, verify:

### Backend

- [ ] Java 21 LTS
- [ ] Spring Boot compatible stable/LTS release
- [ ] Maven build successful
- [ ] Tests passing
- [ ] MySQL connection working
- [ ] Flyway migrations working
- [ ] JWT working
- [ ] RBAC working
- [ ] Swagger working
- [ ] Validation working
- [ ] Exception handling working

### Business

- [ ] Product CRUD
- [ ] Category CRUD
- [ ] Brand CRUD
- [ ] Customer CRUD
- [ ] Supplier CRUD
- [ ] Purchase
- [ ] Inventory
- [ ] POS billing
- [ ] Payment
- [ ] Invoice
- [ ] Sales return
- [ ] Purchase return
- [ ] Reports
- [ ] Dashboard

### Frontend

- [ ] Login
- [ ] JWT interceptor
- [ ] Guards
- [ ] Dashboard
- [ ] Products
- [ ] Customers
- [Suppliers
- [ ] Purchases
- [ ] POS
- [ ] Inventory
- [ ] Invoices
- [ ] Reports
- [ ] Settings

### Responsive

- [ ] Desktop
- [ ] Laptop
- [ ] Tablet
- [ ] Android
- [ ] iPhone
- [ ] No horizontal overflow
- [ ] POS usable on mobile

### Security

- [ ] No plaintext passwords
- [ ] No JWT secrets in source
- [ ] No production credentials
- [ ] Backend authorization
- [ ] CORS configured
- [ ] Input validation
- [ ] Sensitive information not logged

### Quality

- [ ] No duplicate code
- [ ] No unused files
- [ ] No unused imports
- [ ] No TODO/FIXME left unnecessarily
- [ ] No critical console errors
- [ ] No critical backend errors
- [ ] README complete
- [ ] Build successful

---

# 68. FINAL RULE

Do not tell me that the project is complete simply because files were generated.

The project is complete only when the application:

```text
Builds
Starts
Connects to MySQL
Authenticates users
Authorizes roles
Creates products
Creates purchases
Updates inventory
Creates sales
Updates inventory
Creates payments
Generates invoices
Processes returns
Shows dashboard
Generates reports
Works through Swagger
Works on desktop
Works on mobile
Passes important tests
```

If something cannot be implemented because of a missing dependency or environmental limitation, clearly identify:

```text
What is missing
Why it is required
What has already been implemented
What command/configuration is needed
```

Do not hide incomplete functionality.

---

# START

First inspect the current workspace.

Then:

1. Confirm the workspace state.
2. Present the architecture and implementation phases.
3. Verify the selected LTS versions and compatibility.
4. Create the project structure.
5. Start Phase 1.
6. Build and test after each major phase.
7. Continue until the complete application is working.

Do not ask unnecessary questions when a reasonable production-standard decision can be made.

Make sensible technical decisions and document them in the README.