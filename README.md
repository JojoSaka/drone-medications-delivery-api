# 🚀 Drone Medication Delivery API

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)](https://expressjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle%20ORM-TypeSafe-blueviolet)](https://orm.drizzle.team/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **RESTful API** for managing **drones, medications, and deliveries** — built with **Node.js**, **Express**, and **Drizzle ORM**.

---

## 🧭 Overview

The **Drone Medication Delivery API** streamlines the process of managing drone operations such as:

- 🛩️ Registering drones  
- 💊 Loading drones with medications  
- 🔋 Checking drone battery levels  
- 🚚 Tracking deliveries and medications

---

## 🧩 System Requirements

### **Entities**

1. **Drone**
   - `id`: Auto-generated unique ID  
   - `serial_number`: String (max 100 chars)  
   - `model`: Enum (Lightweight, Middleweight, Cruiserweight, Heavyweight)  
   - `weight_limit`: Integer (max 500 grams)  
   - `battery_capacity`: Integer (percentage 0–100)  
   - `state`: Enum (IDLE, LOADING, LOADED, DELIVERING, DELIVERED, RETURNING)

2. **Medication**
   - `id`: Auto-generated unique ID  
   - `name`: String (allowed only letters, numbers, underscores, and hyphens)  
   - `weight`: Float  
   - `code`: String (allowed only uppercase letters, numbers, and underscores)  
   - `image`: Image field (optional)

3. **DroneLoad (relationship)**
   - `drone`: Foreign key to Drone  
   - `medication`: Foreign key to Medication  
   - `loaded_at`: DateTime auto field  

### **Relationships**
- A **Drone** can carry **multiple medications** (many-to-many through DroneLoad).
- A **Medication** can be loaded onto one **Drone** at a time.

### **Rules**
- Drones cannot be loaded if battery < 25%.
- Total medication weight cannot exceed the drone’s weight limit.
- Only drones in `LOADING` state can accept new medications.

---

## 🔄 Workflows

### 1. Register Drone
Create and register a new drone to the system.

### 2. Load Drone with Medications
Add one or more medications to a drone — validation ensures weight and battery rules are respected.

### 3. Check Drone Battery
Fetch the current battery capacity for a given drone.

### 4. View Loaded Medications
List all medications currently loaded onto a drone.


---

## ⚙️ Base URL


---

## 📦 API Endpoints

### 🛩️ 1. Drones

#### ➤ Create a New Drone

**Endpoint:**

POST /drones/add


**Request Body:**

```json
{
  "serialNumber": "DRN005",
  "weight": 400,
  "model": "Middleweight",
  "batteryCapacity": 0.65
}

Response:
{
  "success": true,
  "message": "Drone added successfully",
  "data": [
    {
      "id": "d5f453ac-712c-4f7c-965d-0d73fdb39422",
      "serialNumber": "DRN005",
      "weight": "400.00",
      "model": "Middleweight",
      "state": "IDLE",
      "batteryCapacity": "0.65",
      "createdAt": "2025-10-06T19:56:43.485Z",
      "updatedAt": "2025-10-06T19:56:43.485Z"
    }
  ]
}
```

➤ Get All Drones

**Endpoint:**

GET /drones

**Response:**

```json
{
  "success": true,
  "message": "All drones fetched successfully",
  "data": [
    {
      "id": "6517207b-a3fc-4d29-b720-1add768fd142",
      "serialNumber": "DRN-003",
      "weight": "350.00",
      "model": "Cruiserweight",
      "state": "IDLE",
      "batteryCapacity": "0.90",
      "createdAt": "2025-10-05T17:23:43.360Z",
      "updatedAt": "2025-10-05T17:23:43.360Z"
    },
    {
      "id": "d5f453ac-712c-4f7c-965d-0d73fdb39422",
      "serialNumber": "DRN005",
      "weight": "400.00",
      "model": "Middleweight",
      "state": "IDLE",
      "batteryCapacity": "0.65",
      "createdAt": "2025-10-06T19:56:43.485Z",
      "updatedAt": "2025-10-06T19:56:43.485Z"
    }
  ]
}
```

➤ # Get Drone Battery Level

**Endpoint:**

GET /drones/battery/:serialNumber


**Example:**

GET http://localhost:5000/api/drones/battery/DRN005

**Response:**

{
  "success": true,
  "message": "Drone battery capacity fetched successfully",
  "data": "0.65"
}

# 💊 2. Load Drone with Medications


**Endpoint:**

POST /drones/load/:serialNumber


**Example:**

POST http://localhost:5000/api/drones/load/DRN005

**Request body:**

```json
[
  {
    "name": "Nugel",
    "code": "N645",
    "weight": 100,
    "quantity": 2,
    "image": "nugel.png"
  },
  {
    "name": "Mucolex",
    "code": "M234",
    "weight": 150,
    "quantity": 1,
    "image": "mucolex.png"
  }
]
```

**Response:**

{
  "success": true,
  "message": "Drone successfully loaded and medications are being delivered",
  "delivery_id": "ea98a338-4d50-4783-a2c9-42f7ed30ffda"
}


# 🗺️ API Flow Diagram

# graph TD
    A[Register Drone] --> B[Check Battery Level]
    B --> C[Load Drone with Medications]
    C --> D[Create Delivery Record]
    D --> E[Monitor Delivery Status]

| Tool                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| **Node.js**             | Runtime environment                  |
| **Express.js**          | Web framework                        |
| **Drizzle ORM**         | Type-safe database ORM               |
| **PostgreSQL**          | Database                             |
| **Javascript**          | Strong typing & developer experience |


# 🧪 Setup & Installation

# Clone the repository

  git clone https://github.com/your-username/drone-medication-api.git

# Navigate to the project directory

  cd drone-medication-api

# Install dependencies

  npm install

# Run database generation

  npm run db:generate

# Run database migrations

  npm run db:migrate

# Start the server

  npm run dev

# Acess the API 

  http://localhost:5000/api



# 👨‍💻 Author

Kwadwo Ofosu Saka-Yeboah
Full Stack Developer
📧 sakajojo8@gmail.com

