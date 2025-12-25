Hotel Booking API Documentation
===============================

Table of Contents
-----------------

-   [Project Overview](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#project-overview)
-   [Features](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#features)
-   [Tech Stack](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#tech-stack)
-   [Installation & Setup](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#installation--setup)
-   [Authentication](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#authentication)
-   [API Endpoints](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#api-endpoints)
-   [Error Handling](https://claude.ai/chat/d287e8df-974a-4c6e-bbb5-ad8e6e24b302#error-handling)

* * * * *

Project Overview
----------------

A RESTful API for a hotel booking system built with Node.js, Express, MongoDB, and JWT authentication. The system supports three user roles:

-   **Users**: Browse hotels, create bookings, and manage profiles
-   **Owners**: Create and manage hotels, view bookings for their properties
-   **Admin**: View all data across the platform

Features
--------

-   JWT-based authentication and authorization
-   Role-based access control (User, Owner, Admin)
-   Secure password hashing with bcrypt
-   CRUD operations for Users, Owners, Hotels, and Bookings
-   Hotel ownership management
-   Booking validation and date checking
-   Comprehensive error handling
-   RESTful API design principles

Tech Stack
----------

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JSON Web Tokens (JWT)
-   **Password Security**: bcryptjs
-   **Environment Variables**: dotenv
-   **CORS**: Enabled for cross-origin requests

Installation & Setup
--------------------

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB (local or Atlas)
-   npm or yarn

### Installation Steps

1.  Clone the repository

```
git clone <repository-url>
cd hotel-booking-api

```

1.  Install dependencies

```
npm install

```

1.  Create `.env` file in root directory

```
MONGO_URI=mongodb://localhost:27017/hotel-booking
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000

```

1.  Start the server

```
npm run dev  # Development mode
npm start    # Production mode

```

1.  Verify server is running at `http://localhost:5000`

Authentication
--------------

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>

```

### Obtaining a Token

1.  Register via `/api/auth/user/register` or `/api/auth/owner/register`
2.  Login via `/api/auth/user/login` or `/api/auth/owner/login`
3.  Copy the token from the response
4.  Include it in the Authorization header for protected requests

API Endpoints
-------------

**Base URL**: `http://localhost:5000`

### Authentication Routes

#### 1\. Register User

-   **Endpoint**: `POST /api/auth/user/register`
-   **Access**: Public

Request Body:

```
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

```

Response (201):

```
{
  "message": "User registered",
  "user": {
    "id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

```

#### 2\. Login User

-   **Endpoint**: `POST /api/auth/user/login`
-   **Access**: Public

Request Body:

```
{
  "email": "john@example.com",
  "password": "password123"
}

```

Response (200):

```
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

```

#### 3\. Register Owner

-   **Endpoint**: `POST /api/auth/owner/register`
-   **Access**: Public

Request Body:

```
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "password123"
}

```

Response (201):

```
{
  "message": "Owner registered",
  "owner": {
    "id": "694c377b33aa48f870303325",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "owner"
  }
}

```

#### 4\. Login Owner

-   **Endpoint**: `POST /api/auth/owner/login`
-   **Access**: Public

Request Body:

```
{
  "email": "alice@example.com",
  "password": "password123"
}

```

Response (200):

```
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "owner": {
    "id": "694c377b33aa48f870303325",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "owner"
  }
}

```

### User Routes

#### 5\. Get User by ID

-   **Endpoint**: `GET /api/users/:id`
-   **Access**: Protected (User must be authenticated)
-   **Authorization**: User can only view their own profile

Headers:

```
Authorization: Bearer <user_token>

```

Response (200):

```
{
  "_id": "694c3e77d5f5e086ae0f2df3",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-12-24T19:26:47.388Z",
  "updatedAt": "2025-12-24T19:26:47.388Z"
}

```

#### 6\. Update User

-   **Endpoint**: `PUT /api/users/:id`
-   **Access**: Protected (User must be authenticated)
-   **Authorization**: User can only update their own profile

Headers:

```
Authorization: Bearer <user_token>

```

Request Body:

```
{
  "name": "John Updated"
}

```

Response (200):

```
{
  "_id": "694c3e77d5f5e086ae0f2df3",
  "name": "John Updated",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2025-12-24T19:26:47.388Z",
  "updatedAt": "2025-12-24T19:32:27.617Z"
}

```

Note: Password and role cannot be updated through this endpoint.

#### 7\. Delete User

-   **Endpoint**: `DELETE /api/users/:id`
-   **Access**: Protected (User must be authenticated)
-   **Authorization**: User can only delete their own account

Headers:

```
Authorization: Bearer <user_token>

```

Response (200):

```
{
  "message": "User deleted successfully"
}

```

### Owner Routes

#### 8\. Get All Owners

-   **Endpoint**: `GET /api/owners`
-   **Access**: Protected (Owner only)

Headers:

```
Authorization: Bearer <owner_token>

```

Response (200):

```
[
  {
    "_id": "694ae0a2fe6e897248138201",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "role": "owner",
    "hotels": [
      {
        "_id": "694ae204fe6e897248138205",
        "name": "Seaside Hotel",
        "location": "Miami Beach",
        "pricePerNight": 120
      }
    ]
  }
]

```

#### 9\. Get Owner by ID

-   **Endpoint**: `GET /api/owners/:id`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner can only view own profile

Headers:

```
Authorization: Bearer <owner_token>

```

Response (200):

```
{
  "_id": "694c377b33aa48f870303325",
  "name": "Alice Smith",
  "email": "alice@example.com",
  "role": "owner",
  "hotels": []
}

```

#### 10\. Update Owner

-   **Endpoint**: `PUT /api/owners/:id`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner can only update own profile

Headers:

```
Authorization: Bearer <owner_token>

```

Request Body:

```
{
  "name": "Alice Updated"
}

```

Response (200):

```
{
  "_id": "694c377b33aa48f870303325",
  "name": "Alice Updated",
  "email": "alice@example.com",
  "role": "owner",
  "hotels": []
}

```

#### 11\. Create Hotel

-   **Endpoint**: `POST /api/owners/:ownerId/hotels`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner can only create hotels for themselves

Headers:

```
Authorization: Bearer <owner_token>

```

Request Body:

```
{
  "name": "Grand Plaza Hotel",
  "location": "New York",
  "pricePerNight": 150
}

```

Response (201):

```
{
  "_id": "694c3a6333aa48f87030332c",
  "name": "Grand Plaza Hotel",
  "location": "New York",
  "pricePerNight": 150,
  "owner": {
    "_id": "694c377b33aa48f870303325",
    "name": "Alice Updated",
    "email": "alice@example.com"
  }
}

```

#### 12\. Get Owner's Hotels

-   **Endpoint**: `GET /api/owners/:ownerId/hotels`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner can only view own hotels

Headers:

```
Authorization: Bearer <owner_token>

```

Response (200):

```
[
  {
    "_id": "694c3a6333aa48f87030332c",
    "name": "Grand Plaza Hotel",
    "location": "New York",
    "pricePerNight": 150,
    "owner": "694c377b33aa48f870303325"
  }
]

```

#### 13\. Delete Owner

-   **Endpoint**: `DELETE /api/owners/:id`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner can only delete own account

Headers:

```
Authorization: Bearer <owner_token>

```

Response (200):

```
{
  "message": "Owner deleted successfully"
}

```

Note: Deleting an owner cascades to delete all associated hotels.

### Hotel Routes

#### 14\. Get All Hotels

-   **Endpoint**: `GET /api/hotels`
-   **Access**: Public

Response (200):

```
[
  {
    "_id": "694ae204fe6e897248138205",
    "name": "Seaside Hotel",
    "location": "Miami Beach",
    "pricePerNight": 120,
    "owner": {
      "_id": "694ae0a2fe6e897248138201",
      "name": "Alice Smith",
      "email": "alice@example.com"
    }
  }
]

```

#### 15\. Get Hotel by ID

-   **Endpoint**: `GET /api/hotels/:id`
-   **Access**: Public

Response (200):

```
{
  "_id": "694ae204fe6e897248138205",
  "name": "Seaside Hotel",
  "location": "Miami Beach",
  "pricePerNight": 120,
  "owner": {
    "_id": "694ae0a2fe6e897248138201",
    "name": "Alice Smith",
    "email": "alice@example.com"
  }
}

```

#### 16\. Update Hotel

-   **Endpoint**: `PUT /api/hotels/:id`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner must own the hotel

Headers:

```
Authorization: Bearer <owner_token>

```

Request Body:

```
{
  "name": "Seaside Hotel Updated",
  "location": "Miami Beach",
  "pricePerNight": 140
}

```

Response (200):

```
{
  "_id": "694ae204fe6e897248138205",
  "name": "Seaside Hotel Updated",
  "location": "Miami Beach",
  "pricePerNight": 140,
  "owner": {
    "_id": "694ae0a2fe6e897248138201",
    "name": "Alice Smith",
    "email": "alice@example.com"
  }
}

```

#### 17\. Delete Hotel

-   **Endpoint**: `DELETE /api/hotels/:id`
-   **Access**: Protected (Owner only)
-   **Authorization**: Owner must own the hotel

Headers:

```
Authorization: Bearer <owner_token>

```

Response (200):

```
{
  "message": "Hotel deleted successfully"
}

```

### Booking Routes

#### 18\. Create Booking

-   **Endpoint**: `POST /api/bookings`
-   **Access**: Protected (User only)

Headers:

```
Authorization: Bearer <user_token>

```

Request Body:

```
{
  "hotel": "694ae3bffe6e89724813820d",
  "checkInDate": "2025-01-15",
  "checkOutDate": "2025-01-20"
}

```

Response (201):

```
{
  "_id": "694c40edd5f5e086ae0f2dff",
  "user": {
    "_id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "hotel": {
    "_id": "694ae3bffe6e89724813820d",
    "name": "Mountain Inn",
    "location": "Colorado",
    "pricePerNight": 150
  },
  "checkInDate": "2025-01-15T00:00:00.000Z",
  "checkOutDate": "2025-01-20T00:00:00.000Z"
}

```

Validation: Check-out date must be after check-in date.

#### 19\. Get All Bookings

-   **Endpoint**: `GET /api/bookings`
-   **Access**: Protected (User/Owner/Admin)
-   **Authorization**:
    -   Users: See only their bookings
    -   Owners: See bookings for their hotels
    -   Admin: See all bookings

Headers:

```
Authorization: Bearer <token>

```

Response (200):

```
[
  {
    "_id": "694c40edd5f5e086ae0f2dff",
    "user": {
      "_id": "694c3e77d5f5e086ae0f2df3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "hotel": {
      "_id": "694ae3bffe6e89724813820d",
      "name": "Mountain Inn",
      "location": "Colorado",
      "pricePerNight": 150
    },
    "checkInDate": "2025-01-15T00:00:00.000Z",
    "checkOutDate": "2025-01-20T00:00:00.000Z"
  }
]

```

#### 20\. Get Booking by ID

-   **Endpoint**: `GET /api/bookings/:id`
-   **Access**: Protected (User/Owner)
-   **Authorization**:
    -   Users: Can only view their own bookings
    -   Owners: Can view bookings for their hotels

Headers:

```
Authorization: Bearer <token>

```

Response (200):

```
{
  "_id": "694c45b8d5f5e086ae0f2e20",
  "user": {
    "_id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "hotel": {
    "_id": "694c457ed5f5e086ae0f2e1a",
    "name": "Pradhan Villa",
    "location": "pedong",
    "pricePerNight": 100
  },
  "checkInDate": "2025-01-18T00:00:00.000Z",
  "checkOutDate": "2025-01-25T00:00:00.000Z"
}

```

#### 21\. Update Booking

-   **Endpoint**: `PUT /api/bookings/:id`
-   **Access**: Protected (User only)
-   **Authorization**: User must own the booking

Headers:

```
Authorization: Bearer <user_token>

```

Request Body:

```
{
  "checkInDate": "2025-01-20",
  "checkOutDate": "2025-01-25"
}

```

Response (200):

```
{
  "_id": "694c45b8d5f5e086ae0f2e20",
  "user": {
    "_id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "hotel": {
    "_id": "694c457ed5f5e086ae0f2e1a",
    "name": "Pradhan Villa",
    "location": "pedong",
    "pricePerNight": 100
  },
  "checkInDate": "2025-01-20T00:00:00.000Z",
  "checkOutDate": "2025-01-25T00:00:00.000Z"
}

```

#### 22\. Delete Booking

-   **Endpoint**: `DELETE /api/bookings/:id`
-   **Access**: Protected (User only)
-   **Authorization**: User must own the booking

Headers:

```
Authorization: Bearer <user_token>

```

Response (200):

```
{
  "message": "Booking deleted successfully"
}

```

Error Handling
--------------

### HTTP Status Codes

| Code | Meaning | Description |
| --- | --- | --- |
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

All errors return JSON in this format:

```
{
  "error": "Error message description"
}

```

### Common Error Examples

Authentication errors:

```
{ "error": "No token provided" }
{ "error": "Invalid token" }

```

Authorization errors:

```
{ "error": "Access denied" }
{ "error": "Forbidden" }

```

Validation errors:

```
{ "error": "All fields required" }
{ "error": "Email already exists" }
{ "error": "Check-out date must be after check-in date" }

```

Security Features
-----------------

-   JWT token-based authentication
-   Password hashing with bcrypt (10 salt rounds)
-   Role-based authorization
-   Input validation on all routes
-   Protected routes with middleware
-   CORS enabled for cross-origin requests
-   Passwords excluded from all API responses
-   Token expiration after 24 hours

Notes
-----

-   JWT tokens expire after 24 hours
-   Deleting an owner cascades to delete all their hotels
-   Check-out date must be after check-in date for bookings
-   Users can only access/modify their own resources
-   Owners can only access/modify their own hotels and view bookings for their properties

### 18\. Create Booking

**Endpoint**: `POST /api/bookings`\
**Access**: Protected (User only)\
**Description**: Create a new hotel booking

**Headers**:

```
Authorization: Bearer <user_token>

```

**Request Body**:

```
{
  "hotel": "694ae3bffe6e89724813820d",
  "checkInDate": "2025-01-15",
  "checkOutDate": "2025-01-20"
}

```

**Success Response (201)**:

```
{
  "_id": "694c40edd5f5e086ae0f2dff",
  "user": {
    "_id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "hotel": {
    "_id": "694ae3bffe6e89724813820d",
    "name": "Mountain Inn",
    "location": "Colorado",
    "pricePerNight": 150,
    "owner": "694ae0a2fe6e897248138201",
    "createdAt": "2025-12-23T18:47:27.293Z",
    "updatedAt": "2025-12-23T18:47:27.293Z",
    "__v": 0
  },
  "checkInDate": "2025-01-15T00:00:00.000Z",
  "checkOutDate": "2025-01-20T00:00:00.000Z",
  "createdAt": "2025-12-24T19:37:17.516Z",
  "updatedAt": "2025-12-24T19:37:17.516Z",
  "__v": 0
}

```

**Error Responses**:

-   `400`: Missing fields or invalid dates (checkout must be after checkin)
-   `404`: Hotel not found

* * * * *

### 19\. Get All Bookings

**Endpoint**: `GET /api/bookings`\
**Access**: Protected (User/Owner/Admin)\
**Description**: Get bookings based on user role

-   **Users**: See only their bookings
-   **Owners**: See bookings for their hotels
-   **Admin**: See all bookings

**Headers**:

```
Authorization: Bearer <token>

```

**Success Response (200) - User**:

```
[
  {
    "_id": "694c40edd5f5e086ae0f2dff",
    "user": {
      "_id": "694c3e77d5f5e086ae0f2df3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "hotel": {
      "_id": "694ae3bffe6e89724813820d",
      "name": "Mountain Inn",
      "location": "Colorado",
      "pricePerNight": 150,
      "owner": "694ae0a2fe6e897248138201"
    },
    "checkInDate": "2025-01-15T00:00:00.000Z",
    "checkOutDate": "2025-01-20T00:00:00.000Z",
    "createdAt": "2025-12-24T19:37:17.516Z",
    "updatedAt": "2025-12-24T19:37:17.516Z"
  }
]

```

**Success Response (200) - Owner**:

```
[
  {
    "_id": "694c45b8d5f5e086ae0f2e20",
    "user": {
      "_id": "694c3e77d5f5e086ae0f2df3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "hotel": {
      "_id": "694c457ed5f5e086ae0f2e1a",
      "name": "Pradhan Villa",
      "location": "pedong",
      "pricePerNight": 100,
      "owner": "694b323378be28544d235978"
    },
    "checkInDate": "2025-01-18T00:00:00.000Z",
    "checkOutDate": "2025-01-25T00:00:00.000Z",
    "createdAt": "2025-12-24T19:57:44.856Z",
    "updatedAt": "2025-12-24T19:57:44.856Z"
  }
]

```

* * * * *

### 20\. Get Booking by ID

**Endpoint**: `GET /api/bookings/:id`\
**Access**: Protected (User/Owner)\
**Description**: Get specific booking details

-   **Users**: Can only view their own bookings
-   **Owners**: Can view bookings for their hotels

**Headers**:

```
Authorization: Bearer <token>

```

**Success Response (200)**:

```
{
  "_id": "694c45b8d5f5e086ae0f2e20",
  "user": {
    "_id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "hotel": {
    "_id": "694c457ed5f5e086ae0f2e1a",
    "name": "Pradhan Villa",
    "location": "pedong",
    "pricePerNight": 100,
    "owner": "694b323378be28544d235978"
  },
  "checkInDate": "2025-01-18T00:00:00.000Z",
  "checkOutDate": "2025-01-25T00:00:00.000Z",
  "createdAt": "2025-12-24T19:57:44.856Z",
  "updatedAt": "2025-12-24T19:57:44.856Z"
}

```

**Error Responses**:

-   `403`: Forbidden (not your booking or not your hotel's booking)
-   `404`: Booking not found

* * * * *

### 21\. Update Booking

**Endpoint**: `PUT /api/bookings/:id`\
**Access**: Protected (User only - must own the booking)\
**Description**: Update booking dates

**Headers**:

```
Authorization: Bearer <user_token>

```

**Request Body**:

```
{
  "checkInDate": "2025-01-20",
  "checkOutDate": "2025-01-25"
}

```

**Success Response (200)**:

```
{
  "_id": "694c45b8d5f5e086ae0f2e20",
  "user": {
    "_id": "694c3e77d5f5e086ae0f2df3",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "hotel": {
    "_id": "694c457ed5f5e086ae0f2e1a",
    "name": "Pradhan Villa",
    "location": "pedong",
    "pricePerNight": 100
  },
  "checkInDate": "2025-01-20T00:00:00.000Z",
  "checkOutDate": "2025-01-25T00:00:00.000Z",
  "createdAt": "2025-12-24T19:57:44.856Z",
  "updatedAt": "2025-12-24T20:30:00.000Z"
}

```

**Error Responses**:

-   `400`: Invalid dates (checkout must be after checkin)
-   `403`: Forbidden (not your booking)
-   `404`: Booking not found

* * * * *

### 22\. Delete Booking

**Endpoint**: `DELETE /api/bookings/:id`\
**Access**: Protected (User only - must own the booking)\
**Description**: Cancel/delete a booking

**Headers**:

```
Authorization: Bearer <user_token>

```

**Success Response (200)**:

```
{
  "message": "Booking deleted successfully"
}

```

**Error Responses**:

-   `403`: Forbidden (not your booking)
-   `404`: Booking not found

* * * * *

🧪 Testing with Postman/Thunder Client
--------------------------------------

### Step 1: Register a User

1.  **Method**: POST
2.  **URL**: `http://localhost:5000/api/auth/user/register`
3.  **Body** (JSON):

```
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123"
}

```

### Step 2: Login User

1.  **Method**: POST
2.  **URL**: `http://localhost:5000/api/auth/user/login`
3.  **Body** (JSON):

```
{
  "email": "test@example.com",
  "password": "test123"
}

```

1.  **Copy the token** from response

### Step 3: Use Protected Routes

1.  Add header to all protected requests:
    -   **Key**: `Authorization`
    -   **Value**: `Bearer <your_copied_token>`

### Example Test Flow

#### Test User Flow:

```
1\. POST /api/auth/user/register → Get user created
2. POST /api/auth/user/login → Get token
3. GET /api/hotels → Browse hotels
4. POST /api/bookings → Create booking (with token)
5. GET /api/bookings → View your bookings (with token)
6. GET /api/bookings/:id → View specific booking (with token)
7. PUT /api/bookings/:id → Update booking (with token)
8. DELETE /api/bookings/:id → Cancel booking (with token)

```

#### Test Owner Flow:

```
1\. POST /api/auth/owner/register → Get owner created
2. POST /api/auth/owner/login → Get token
3. POST /api/owners/:ownerId/hotels → Create hotel (with token)
4. GET /api/owners/:ownerId/hotels → View your hotels (with token)
5. PUT /api/hotels/:id → Update hotel (with token)
6. GET /api/bookings → View bookings for your hotels (with token)
7. DELETE /api/hotels/:id → Delete hotel (with token)

```

* * * * *

⚠️ Error Handling
-----------------

### Common HTTP Status Codes

| Code | Meaning | Description |
| --- | --- | --- |
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or missing fields |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Server-side error |

### Error Response Format

All errors follow this format:

```
{
  "error": "Error message description"
}

```

### Common Errors

**Authentication Errors**:

```
{
  "error": "No token provided"
}

```

```
{
  "error": "Invalid token"
}

```

**Authorization Errors**:

```
{
  "error": "Access denied"
}

```

```
{
  "error": "Forbidden"
}

```

**Validation Errors**:

```
{
  "error": "All fields required"
}

```

```
{
  "error": "Email already exists"
}

```

* * * * *

📝 Notes
--------

1.  **Token Expiration**: JWT tokens expire after 24 hours
2.  **Password Security**: Passwords are hashed using bcrypt with 10 salt rounds
3.  **Cascading Deletes**: Deleting an owner deletes all their hotels
4.  **Date Validation**: Check-out date must be after check-in date
5.  **Role-Based Access**: Each route has specific role requirements

* * * * *

🔒 Security Features
--------------------

-   ✅ JWT token-based authentication
-   ✅ Password hashing with bcrypt
-   ✅ Role-based authorization
-   ✅ Input validation
-   ✅ Protected routes
-   ✅ CORS enabled
-   ✅ No password exposure in responses

* * * * *

