# API Documentation

**Base URL:** `http://localhost:5000/api`

All request and response bodies are JSON. Protected endpoints require:

```
Authorization: Bearer <token>
```

Every error response uses the same shape:

```json
{ "message": "Human readable message" }
```

---

## Health

### `GET /api/health`

No authentication. Confirms the API process is running.

**Response — 200**
```json
{ "message": "Inventory API is running" }
```

---

## Authentication

### `POST /api/auth/register`

Creates an account and returns a token, so the user is logged in immediately.

**Body**

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `email` | string | required, unique, stored lowercase |
| `password` | string | required, minimum 6 characters |

**Request**
```json
{ "name": "Test User", "email": "test@example.com", "password": "secret123" }
```

**Response — 201**
```json
{
  "_id": "6a737780913da4f0019c0c40",
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The password is never returned — the schema field is `select: false`.

**Errors**

| Code | When | Message |
|---|---|---|
| 400 | Missing field | `Please provide name, email and password` |
| 400 | Password too short | `Password must be at least 6 characters` |
| 409 | Email taken | `Email already registered` |

---

### `POST /api/auth/login`

**Request**
```json
{ "email": "test@example.com", "password": "secret123" }
```

**Response — 200**
```json
{
  "_id": "6a737780913da4f0019c0c40",
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**

| Code | When | Message |
|---|---|---|
| 400 | Missing field | `Please provide email and password` |
| 401 | Wrong password **or** unknown email | `Invalid email or password` |

Both failure modes return an identical message on purpose. Different messages would let an attacker discover which emails are registered (user enumeration).

---

### `GET /api/auth/me` 🔒

Returns the user identified by the token. Used by the frontend on mount to restore a session after a page refresh, because a JWT payload must never be trusted client-side.

**Response — 200**
```json
{
  "_id": "6a737780913da4f0019c0c40",
  "name": "Test User",
  "email": "test@example.com",
  "createdAt": "2026-08-05T17:48:48.653Z",
  "updatedAt": "2026-08-05T17:48:48.653Z"
}
```

**Errors**

| Code | When | Message |
|---|---|---|
| 401 | No / malformed header | `Not authorized, no token` |
| 401 | Invalid or expired token | `Not authorized, token failed` |
| 401 | User deleted since token issued | `Not authorized, user no longer exists` |

---

## Categories

All category endpoints are protected.

### `POST /api/categories` 🔒

**Body**

| Field | Type | Rules |
|---|---|---|
| `name` | string | required, unique (case-insensitive) |
| `description` | string | optional |

**Request**
```json
{ "name": "Electronics", "description": "Phones, laptops and accessories" }
```

**Response — 201**
```json
{
  "_id": "6a737c231087cf167acb3c3b",
  "name": "Electronics",
  "description": "Phones, laptops and accessories",
  "createdBy": "6a737780913da4f0019c0c40",
  "createdAt": "2026-08-05T18:07:39.167Z",
  "updatedAt": "2026-08-05T18:07:39.167Z"
}
```

`createdBy` is taken from the token, never from the request body.

**Errors**

| Code | When | Message |
|---|---|---|
| 400 | Name missing | `Category name is required` |
| 409 | Name exists (any casing) | `Category already exists` |

---

### `GET /api/categories` 🔒

Returns all categories, newest first, each with a live product count.

**Response — 200**
```json
[
  {
    "_id": "6a737c231087cf167acb3c3b",
    "name": "Electronics",
    "description": "Phones, laptops and accessories",
    "createdBy": "6a737780913da4f0019c0c40",
    "createdAt": "2026-08-05T18:07:39.167Z",
    "updatedAt": "2026-08-05T18:07:39.167Z",
    "productCount": 6
  }
]
```

Counts come from a single `$group` aggregation, not one query per category.

---

### `GET /api/categories/:id` 🔒

**Response — 200** — a single category object.

**Errors:** `400 Invalid id format` · `404 Category not found`

---

### `PUT /api/categories/:id` 🔒

**Request**
```json
{ "name": "Electronics", "description": "Updated description" }
```

**Response — 200** — the updated category.

**Errors**

| Code | When | Message |
|---|---|---|
| 400 | Name missing | `Category name is required` |
| 400 | Malformed id | `Invalid id format` |
| 404 | Not found | `Category not found` |
| 409 | Name owned by another category | `Category already exists` |

The duplicate check excludes the category being edited (`_id: { $ne: id }`), so saving without renaming works.

---

### `DELETE /api/categories/:id` 🔒

Blocked while any product references the category.

**Response — 200**
```json
{ "message": "Category deleted" }
```

**Errors**

| Code | When | Message |
|---|---|---|
| 404 | Not found | `Category not found` |
| 409 | Still in use | `Cannot delete. 3 product(s) use this category` |

MongoDB has no foreign keys, so this guard is the application-level equivalent of SQL's `ON DELETE RESTRICT`.

---

## Products

All product endpoints are protected.

### `POST /api/products` 🔒

**Body**

| Field | Type | Rules |
|---|---|---|
| `name` | string | required |
| `sku` | string | required, unique, stored uppercase |
| `category` | ObjectId | required, must exist |
| `quantity` | number | required, ≥ 0 |
| `unitPrice` | number | required, ≥ 0 |
| `supplier` | string | optional |
| `description` | string | optional |

**Request**
```json
{
  "name": "Wireless Mouse",
  "sku": "el-mou-001",
  "category": "6a737c231087cf167acb3c3b",
  "quantity": 50,
  "unitPrice": 799,
  "supplier": "Logi Distributors"
}
```

**Response — 201**
```json
{
  "_id": "6a7380ff375112f97ee96792",
  "name": "Wireless Mouse",
  "sku": "EL-MOU-001",
  "category": "6a737c231087cf167acb3c3b",
  "description": "",
  "quantity": 50,
  "unitPrice": 799,
  "supplier": "Logi Distributors",
  "status": "In Stock",
  "createdBy": "6a737780913da4f0019c0c40",
  "createdAt": "2026-08-05T18:29:19.584Z",
  "updatedAt": "2026-08-05T18:29:19.584Z"
}
```

Note `el-mou-001` was stored as `EL-MOU-001`, and `status` was derived from `quantity` — neither is supplied by the client.

**Errors**

| Code | When | Message |
|---|---|---|
| 400 | Missing field | `Name, SKU, category and unit price are required` |
| 400 | Negative number | `Quantity and unit price cannot be negative` |
| 400 | Category does not exist | `Selected category not found` |
| 409 | SKU taken | `SKU already exists` |

---

### `GET /api/products` 🔒

Supports search, filtering, sorting and server-side pagination.

**Query parameters**

| Param | Type | Default | Notes |
|---|---|---|---|
| `search` | string | — | Case-insensitive partial match on name **or** SKU |
| `category` | ObjectId | — | Filter by category |
| `status` | enum | — | `In Stock` · `Low Stock` · `Out of Stock` |
| `sortBy` | string | `createdAt` | `name` · `unitPrice` · `quantity` · `createdAt` (anything else falls back to the default) |
| `order` | string | `desc` | `asc` · `desc` |
| `page` | number | `1` | 1-indexed |
| `limit` | number | `10` | Items per page |

**Example**
```
GET /api/products?search=mouse&status=Low%20Stock&sortBy=unitPrice&order=asc&page=1&limit=10
```

**Response — 200**
```json
{
  "products": [
    {
      "_id": "6a7380ff375112f97ee96792",
      "name": "Wireless Mouse",
      "sku": "EL-MOU-001",
      "category": { "_id": "6a737c231087cf167acb3c3b", "name": "Electronics" },
      "quantity": 8,
      "unitPrice": 899,
      "supplier": "Logi Distributors",
      "status": "Low Stock",
      "createdAt": "2026-08-05T18:29:19.584Z",
      "updatedAt": "2026-08-05T18:31:02.117Z"
    }
  ],
  "page": 1,
  "totalPages": 2,
  "totalProducts": 15
}
```

`category` is populated with only `_id` and `name`. The count uses the same filter as the query, otherwise page counts would be wrong.

---

### `GET /api/products/:id` 🔒

**Response — 200** — one product with `category` populated.

**Errors:** `400 Invalid id format` · `404 Product not found`

---

### `PUT /api/products/:id` 🔒

Same body as create. `status` is recalculated from the new quantity.

**Errors:** `400` (validation / bad id / missing category) · `404 Product not found` · `409 SKU already exists`

---

### `DELETE /api/products/:id` 🔒

**Response — 200**
```json
{ "message": "Product deleted" }
```

---

## Inventory

### `POST /api/inventory/:productId` 🔒

Records a stock movement, updates the product quantity and status, and writes an audit entry.

**Body**

| Field | Type | Rules |
|---|---|---|
| `type` | string | required, `IN` or `OUT` |
| `quantity` | number | required, ≥ 1, always positive |
| `note` | string | optional |

**Request**
```json
{ "type": "IN", "quantity": 20, "note": "Received from supplier" }
```

**Response — 200** — the updated product:
```json
{
  "_id": "6a7380ff375112f97ee96792",
  "name": "USB-C Cable",
  "sku": "EL-CAB-002",
  "quantity": 25,
  "status": "In Stock"
}
```

**Errors**

| Code | When | Message |
|---|---|---|
| 400 | Bad type | `Type must be IN or OUT` |
| 400 | Quantity 0, negative or not a number | `Quantity must be at least 1` |
| 400 | Would go below zero | `Cannot remove 999. Only 7 left in stock` |
| 404 | Product missing | `Product not found` |

Over-removal is **rejected**, not clamped to zero. Clamping would silently lose data — the user would believe 999 units left the building.

---

### `GET /api/inventory` 🔒

All stock movements across all products, newest first, paginated.

**Query parameters:** `page` (default `1`), `limit` (default `10`)

**Response — 200**
```json
{
  "transactions": [
    {
      "_id": "6a7381aa375112f97ee967a5",
      "product": { "_id": "6a7380ff375112f97ee96792", "name": "USB-C Cable", "sku": "EL-CAB-002" },
      "type": "IN",
      "quantity": 20,
      "previousQuantity": 5,
      "newQuantity": 25,
      "note": "Received from supplier",
      "createdBy": { "_id": "6a737780913da4f0019c0c40", "name": "Test User" },
      "createdAt": "2026-08-05T18:35:10.221Z"
    }
  ],
  "page": 1,
  "totalPages": 1,
  "totalTransactions": 5
}
```

---

### `GET /api/inventory/:productId` 🔒

The last 10 movements for one product, newest first. Served by the compound index `{ product: 1, createdAt: -1 }`.

**Response — 200** — an array of transaction objects.

---

## Dashboard

### `GET /api/dashboard/stats` 🔒

Runs seven queries concurrently with `Promise.all`.

**Response — 200**
```json
{
  "totalProducts": 15,
  "totalCategories": 3,
  "totalStock": 452,
  "lowStock": 7,
  "outOfStock": 2,
  "recentProducts": [ /* 6 newest, category populated */ ],
  "lowStockProducts": [ /* 5 lowest-quantity low/out-of-stock items */ ]
}
```

`totalStock` is the **sum** of every product's `quantity`, produced by an aggregation pipeline:

```js
Product.aggregate([{ $group: { _id: null, total: { $sum: '$quantity' } } }])
```

`countDocuments` counts documents; it cannot sum a field. Loading every product and reducing in JavaScript would work at this size but would not scale.

---

## Testing with Postman

1. Import `docs/Inventory-Management.postman_collection.json`.
2. Run **Auth → Login**. A test script stores the returned token in the `token` collection variable automatically.
3. Every other request inherits `Authorization: Bearer {{token}}` — no manual copying needed.

Collection variables:

| Variable | Default |
|---|---|
| `baseUrl` | `http://localhost:5000/api` |
| `token` | *(set automatically by Login/Register)* |
| `categoryId` | *(set automatically by Create Category)* |
| `productId` | *(set automatically by Create Product)* |

Suggested order for a full run: Register or Login → Create Category → Create Product → Stock In → Get Products → Dashboard Stats.
