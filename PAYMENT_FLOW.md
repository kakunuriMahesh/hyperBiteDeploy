# Payment & ShipRocket Flow Documentation

## Architecture Overview

```
Frontend (HYPE/src)          Backend (hyperbite-backend)         External Services
─────────────────           ─────────────────────────           ─────────────────
Cart.jsx                     server.js                           Razorpay API
CartContext.jsx               ├── routes/paymentRoutes.js        ShipRocket API
                              ├── controllers/paymentController.js
                              ├── controllers/shiprocketController.js
                              ├── utils/shiprocketService.js
                              ├── models/Order.js
                              └── routes/adminRoutes.js
```

---

## Step-by-Step Flow

### Step 1: Cart Management (Frontend)

**Files:** `HYPE/src/context/CartContext.jsx`, `HYPE/src/pages/Cart.jsx`

- Cart items stored in `localStorage` via `CartContext`.
- Two item types: **products** (`cartItems[]`) and **packs/combos** (`packItems[]`).
- Pincode whitelist validation exists in `allowedPincodes.js` but is **currently commented out** (all pincodes accepted).

---

### Step 2: Checkout Form (Frontend — Cart.jsx)

User fills delivery details:
- name, phone, email, whatsapp, pincode, city, state, country, address

Two ordering paths offered:
1. **"Place via WhatsApp"** — sends formatted order message via WhatsApp (manual, no payment gateway).
2. **"Pay Securely"** — initiates Razorpay payment flow (described below).

---

### Step 3: Create Razorpay Order

**Client:** `Cart.jsx` → `POST /api/payment/create-order`

**Payload:**
```json
{
  "customer": { "name", "email", "phone", "whatsapp", "address", "city", "state", "country", "pincode" },
  "items": [ { "productId", "id", "name", "price", "quantity", "type", "subItems" } ]
}
```

**Server:** `paymentController.createOrder` (paymentController.js:15-63)

| Action | Detail |
|--------|--------|
| Calculate total | `price × quantity` for each item |
| Init Razorpay SDK | Uses `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` from env |
| Create Razorpay order | `razorpay.orders.create({ amount: total×100 (paise), currency: "INR", receipt })` |
| Save to MongoDB | `Order.create({ customer, items, totalAmount, razorpayOrderId, paymentStatus: "pending" })` |
| Respond | `{ razorpayOrder, orderId, keyId }` |

**Key detail:** Order is saved with `paymentStatus: "pending"` before payment is completed.

---

### Step 4: Razorpay Checkout (Frontend — Cart.jsx)

- Loads Razorpay SDK from `https://checkout.razorpay.com/v1/checkout.js`
- Opens modal with `key`, `amount`, `order_id`, customer prefills
- User completes/fails payment inside Razorpay modal

---

### Step 5: Payment Verification

**Client:** Razorpay `handler` callback → `POST /api/payment/verify`

**Payload:**
```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "..."
}
```

**Server:** `paymentController.verifyPayment` (paymentController.js:65-115)

| Action | Detail |
|--------|--------|
| Compute HMAC | `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(order_id + "|" + payment_id).digest("hex")` |
| Verify signature | Compare computed HMAC vs received `razorpay_signature` |
| Update DB | `Order.findOneAndUpdate({ razorpayOrderId }, { paymentStatus: "paid", razorpayPaymentId })` |
| **Trigger ShipRocket** | `await shiprocketController.createShiprocketOrder(updated)` |
| Respond | `{ success: true }` |

**On signature mismatch:** Returns `400 { success: false }` — ShipRocket **not** triggered.

---

### Step 6: ShipRocket Order Creation

Trigger chain (synchronous, within `/verify` request):

```
verifyPayment (paymentController.js:98)
  → shiprocketController.createShiprocketOrder(order)  (shiprocketController.js:4)
    → shiprocketService.createShiprocketOrder(payload)  (shiprocketService.js:15)
```

#### 6a. Generate Auth Token — `shiprocketService.generateToken()` (shiprocketService.js:3-13)

```
POST https://apiv2.shiprocket.in/v1/external/auth/login
Body: { email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD }
Returns: { token: "jwt..." }
```

#### 6b. Build Payload — `shiprocketService.createShiprocketOrder()` (shiprocketService.js:15-115)

| Field | Value |
|-------|-------|
| `order_id` | MongoDB `_id` (string) |
| `order_date` | `new Date()` |
| `billing_customer_name` | `order.customer.name` |
| `billing_last_name` | `"."` (required by ShipRocket) |
| `billing_address` / `city` / `pincode` / `state` / `country` | From order.customer |
| `billing_email` | From order.customer |
| `billing_phone` | From order.customer |
| `shipping_is_billing` | `true` (same address) |
| `payment_method` | `"Prepaid"` |
| `order_items` | See below |
| `sub_total` | `order.totalAmount` |
| `weight` | `max(0.5, totalUnits × 0.05)` KG — 50g per unit, min 0.5 KG |
| `length` / `breadth` / `height` | `20` / `15` / `10` CM (hardcoded) |

**Order items transformation:**
- Items with `type: "pack"` are grouped into one line item with sub-items listed as ingredients in the name: `"Pack Name [Ingredient1 ×Qty, Ingredient2 ×Qty]"`
- Regular products use their `name`, `sku` (`productId` or `id`), `units`, `selling_price`
- Fallback if items empty: generic `"Order Items"` with `selling_price: totalAmount`

#### 6c. Create Order in ShipRocket

```
POST https://apiv2.shiprocket.in/v1/external/orders/create/adhoc
Headers: { Authorization: "Bearer <token>" }
Body: (payload built above)
```

**ShipRocket response is logged but NOT stored in the Order document.**
The Order model has **no fields** for ShipRocket shipment ID, courier name, AWB, or tracking URL.

---

### Step 7: Success Display (Frontend — Cart.jsx)

- On `verifyRes.ok && verifyJson.success`: clears cart, shows success modal with earned "HyperBite Points".

---

## Data Model — Order (models/Order.js)

```javascript
{
  customer: {
    name: String, email: String, phone: String, whatsapp: String,
    address: String, city: String, state: String, country: String, pincode: String
  },
  items: [{
    productId: String, id: String, name: String, price: Number, quantity: Number,
    type: { String, enum: ["product", "pack"], default: "product" },
    subItems: [{ id: String, name: String, quantity: Number }]
  }],
  totalAmount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  paymentStatus: { String, enum: ["pending", "paid", "failed"], default: "pending" },
  orderStatus: { String, enum: ["placed", "processing", "shipped", "delivered"], default: "placed" }
}
```

No separate `Payment` or `Shipment` models — everything is embedded in `Order`.

---

## API Routes

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| `POST` | `/api/payment/create-order` | `paymentController.createOrder` | Create Razorpay order + save pending Order |
| `POST` | `/api/payment/verify` | `paymentController.verifyPayment` | Verify payment signature + trigger ShipRocket |
| `GET` | `/api/admin/orders` | Inline | List all orders (newest first) |
| `PATCH` | `/api/admin/order/:id` | Inline | Update `orderStatus` (`placed` → `processing` → `shipped` → `delivered`) |

---

## Environment Variables Required

| Variable | Purpose |
|----------|---------|
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `SHIPROCKET_EMAIL` | ShipRocket login email |
| `SHIPROCKET_PASSWORD` | ShipRocket login password |
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Server port (default: 5000) |

---

## Key Observations & Gaps

### 1. ShipRocket Trigger is Synchronous Inline
ShipRocket is called **directly within** the payment verification handler. There is **no webhook, queue, or retry mechanism**. If ShipRocket is down or the request times out, the `/verify` response may be delayed.

### 2. ShipRocket Failure Does Not Block Payment Success
The ShipRocket call is wrapped in a try-catch (paymentController.js:96-102). If ShipRocket fails:
- Payment is still marked `"paid"` in DB
- Frontend still receives `{ success: true }`
- Error is logged but no retry is attempted
- Order will never reach ShipRocket

### 3. ShipRocket Response Not Persisted
The ShipRocket API returns `shipment_id`, `courier_name`, `awb_code`, `tracking_url`, etc., but **none of this is saved** to the Order document. The Order model has no shipment-related fields.

### 4. No Server-to-Server Webhook
Payment verification relies on the frontend calling `/verify` after Razorpay modal closes. If the user closes the browser before this request completes:
- Order stays `"pending"` in DB
- ShipRocket is never triggered
- No reconciliation mechanism exists

### 5. Dual Ordering Paths
- **WhatsApp path:** No payment gateway, no DB record, no ShipRocket.
- **Razorpay path:** Full flow as documented above.

### 6. Pincode Validation Disabled
The `allowedPincodes.js` config exists but validation is commented out in `CartContext.jsx`.
