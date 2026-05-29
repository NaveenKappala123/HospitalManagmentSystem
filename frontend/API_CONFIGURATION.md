# Hospital Management System - Frontend Setup

## Configuration Steps

### 1. **Add Your Spring Boot Backend URL**

Open `script.js` and find the configuration section at the top:

```javascript
// ============================================
// CONFIGURATION - ADD YOUR BACKEND URL HERE
// ============================================
const API_BASE_URL = 'http://localhost:1919'; // Change this to your Spring Boot URL
```

**Replace with your actual backend URL:**
- If running locally: `http://localhost:8080`
- If deployed: `https://your-backend-domain.com`

### 2. **Update API Endpoints (if needed)**

If your Spring Boot endpoints are different from the defaults, update them in the `API_ENDPOINTS` object:

```javascript
const API_ENDPOINTS = {
    // Patient endpoints
    patientSignup: `${API_BASE_URL}/api/patients/signup`,
    patientLogin: `${API_BASE_URL}/api/patients/login`,
    getPatientAppointments: `${API_BASE_URL}/api/appointments/patient`,
    bookAppointment: `${API_BASE_URL}/api/appointments/book`,
    
    // Doctor endpoints
    doctorSignup: `${API_BASE_URL}/api/doctors/signup`,
    doctorLogin: `${API_BASE_URL}/api/doctors/login`,
    getDoctors: `${API_BASE_URL}/api/doctors/list`,
    getDoctorAppointments: `${API_BASE_URL}/api/appointments/doctor`,
    
    // Appointment endpoints
    getAllAppointments: `${API_BASE_URL}/api/appointments`,
    updateAppointment: `${API_BASE_URL}/api/appointments/update`,
    cancelAppointment: `${API_BASE_URL}/api/appointments/cancel`
};
```

---

## Expected API Responses

### Patient Signup
**POST** `/api/patients/signup`

**Request:**
```json
{
    "name": "John Doe",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-15",
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "id": "P001",
    "name": "John Doe",
    "email": "john@example.com",
    "token": "jwt_token_here"
}
```

---

### Patient Login
**POST** `/api/patients/login`

**Request:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "id": "P001",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "token": "jwt_token_here"
}
```

---

### Book Appointment
**POST** `/api/appointments/book`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Request:**
```json
{
    "doctorId": "D001",
    "patientId": "P001",
    "appointmentDate": "2026-02-10",
    "appointmentTime": "10:00 AM",
    "symptoms": "Chest pain",
    "notes": "Chest pain"
}
```

**Response:**
```json
{
    "id": "APT001",
    "doctorId": "D001",
    "patientId": "P001",
    "appointmentDate": "2026-02-10",
    "appointmentTime": "10:00 AM",
    "status": "Confirmed",
    "symptoms": "Chest pain"
}
```

---

### Get Patient Appointments
**GET** `/api/appointments/patient/{patientId}`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
[
    {
        "id": "APT001",
        "doctor": "Dr. John Smith",
        "date": "2026-02-10",
        "time": "10:00 AM",
        "status": "Confirmed",
        "symptoms": "Chest pain"
    }
]
```

---

### Doctor Signup
**POST** `/api/doctors/signup`

**Request:**
```json
{
    "name": "Dr. Jane Smith",
    "specialization": "Cardiology",
    "phone": "9876543210",
    "licenseNumber": "DOC123456",
    "email": "jane@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "id": "D001",
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "token": "jwt_token_here"
}
```

---

### Doctor Login
**POST** `/api/doctors/login`

**Request:**
```json
{
    "email": "jane@example.com",
    "password": "password123"
}
```

**Response:**
```json
{
    "id": "D001",
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "specialization": "Cardiology",
    "token": "jwt_token_here"
}
```

---

## CORS Configuration

Make sure your Spring Boot backend has CORS enabled:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000", "file://") // Add your frontend URL
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

---

## How It Works

1. **Frontend sends requests** to your Spring Boot backend using the configured API URLs
2. **Backend processes requests** and returns JSON responses
3. **Frontend displays data** in the user interface
4. **Authentication tokens** are stored in browser's localStorage for subsequent requests

All API calls include proper error handling and loading states.
