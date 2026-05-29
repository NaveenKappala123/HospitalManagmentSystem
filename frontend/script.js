// ============================================
// CONFIGURATION - ADD YOUR BACKEND URL HERE
// ============================================
const API_BASE_URL = 'http://localhost:1919'; // Change this to your Spring Boot URL
// Example: const API_BASE_URL = 'https://your-backend-domain.com';

// API Endpoints
const API_ENDPOINTS = {
    // Patient endpoints
    patientSignup: `${API_BASE_URL}/api/patients/signup`,
    patientLogin: `${API_BASE_URL}/api/patients/login`,
    getPatientAppointments: (patientId) => `${API_BASE_URL}/api/appointments/patient/${patientId}`,
    bookAppointment: `${API_BASE_URL}/api/appointments/book`,
    
    // Doctor endpoints
    doctorSignup: `${API_BASE_URL}/api/doctors/signup`,
    doctorLogin: `${API_BASE_URL}/api/doctors/login`,
    getDoctors: `${API_BASE_URL}/api/doctors/list`,
    getDoctorById: (id) => `${API_BASE_URL}/api/doctors/${id}`,
    getAppointmentsByDoctor: (doctorId) => `${API_BASE_URL}/api/appointments/doctor/${doctorId}`,
    
    // Appointment endpoints
    getAllAppointments: `${API_BASE_URL}/api/appointments`,
    getAppointmentById: (id) => `${API_BASE_URL}/api/appointments/${id}`,
    updateAppointment: (id) => `${API_BASE_URL}/api/appointments/update/${id}`,
    updateAppointmentStatus: (id) => `${API_BASE_URL}/api/appointments/${id}/status`,
    deleteAppointment: (id) => `${API_BASE_URL}/api/appointments/${id}`,
    getAppointmentsByDate: `${API_BASE_URL}/api/appointments/by-date`
};

// Data storage (using localStorage)
let patientData = JSON.parse(localStorage.getItem('patientData')) || {};
let doctorData = JSON.parse(localStorage.getItem('doctorData')) || {};
let appointmentsData = JSON.parse(localStorage.getItem('appointmentsData')) || [];
let currentPatient = null;
let currentDoctor = null;
let authToken = localStorage.getItem('authToken') || null;

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function goToHome() {
    showPage('homePage');
}

function goToLogin() {
    showPage('loginSelectionPage');
}

function backToLoginSelection() {
    showPage('loginSelectionPage');
}

function showPatientLogin() {
    document.getElementById('patientEmail').value = '';
    document.getElementById('patientPassword').value = '';
    showPage('patientLoginPage');
}

function showDoctorLogin() {
    document.getElementById('doctorEmail').value = '';
    document.getElementById('doctorPassword').value = '';
    showPage('doctorLoginPage');
}

function showPatientSignup() {
    document.getElementById('patientName').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('patientDOB').value = '';
    document.getElementById('patientGender').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('patientSignupEmail').value = '';
    document.getElementById('patientSignupPassword').value = '';
    showPage('patientSignupPage');
}

function showDoctorSignup() {
    document.getElementById('doctorName').value = '';
    document.getElementById('doctorSpecialization').value = '';
    document.getElementById('doctorPhone').value = '';
    document.getElementById('doctorLicense').value = '';
    document.getElementById('doctorSignupEmail').value = '';
    document.getElementById('doctorSignupPassword').value = '';
    showPage('doctorSignupPage');
}

function backToPatientLogin() {
    showPage('patientLoginPage');
}

function backToDoctorLogin() {
    showPage('doctorLoginPage');
}

// Patient Functions
function patientSignupHandler(event) {
    event.preventDefault();
    
    const name = document.getElementById('patientName').value;
    const phone = document.getElementById('patientPhone').value;
    const dob = document.getElementById('patientDOB').value;
    const gender = document.getElementById('patientGender').value;
    const age = document.getElementById('patientAge').value;
    const email = document.getElementById('patientSignupEmail').value;
    const password = document.getElementById('patientSignupPassword').value;

    const signupData = {
        name: name,
        phone: phone,
        dateOfBirth: dob,
        age: age,
        gender: gender,
        email: email,
        password: password
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    fetch(API_ENDPOINTS.patientSignup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Signup failed');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Account created successfully! Please login.');
        localStorage.setItem('patientData', JSON.stringify(signupData));
        showPatientLogin();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function patientLoginHandler(event) {
    event.preventDefault();
    
    const email = document.getElementById('patientEmail').value;
    const password = document.getElementById('patientPassword').value;

    const loginData = {
        email: email,
        password: password
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    fetch(API_ENDPOINTS.patientLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Login failed');
            });
        }
        return response.json();
    })
    .then(data => {
        // Store token and patient data
        if (data.token) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
        }
        const savedPatient = JSON.parse(localStorage.getItem('patientData')) || {};
        currentPatient = {
            id: data.id || data.patientId,
            name: data.name || savedPatient.name || '',
            email: data.email || savedPatient.email || '',
            phone: data.phone || savedPatient.phone || '',
            age: data.age || savedPatient.age || '',
            gender: data.gender || savedPatient.gender || ''
        };
        
        localStorage.setItem('currentPatient', JSON.stringify(currentPatient));
        loadPatientDashboard();
        showPage('patientDashboard');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function loadPatientDashboard() {
    document.getElementById('patientNameDisplay').textContent = currentPatient.name;
    document.getElementById('patientIDDisplay').textContent = currentPatient.id;
    document.getElementById('patientWelcome').textContent = currentPatient.name.split(' ')[0];
    if (currentPatient.age !== undefined) {
        document.getElementById('patientAgeDisplay').textContent = currentPatient.age || '--';
    }
    if (currentPatient.gender !== undefined) {
        document.getElementById('patientGenderDisplay').textContent = currentPatient.gender || '--';
    }
    
    loadAppointmentsData();
    showDashboardHome();
}

function loadAppointmentsData() {
    if (!currentPatient || !currentPatient.id) return;

    // Show loading state
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '<p class="no-data">Loading appointments...</p>';

    fetch(API_ENDPOINTS.getPatientAppointments(currentPatient.id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load appointments');
        }
        return response.json();
    })
    .then(data => {
        appointmentsData = Array.isArray(data) ? data : (data.data || []);
        loadAppointmentsDisplay();
        updateDashboardInfo();
    })
    .catch(error => {
        console.error('Error:', error);
        appointmentsList.innerHTML = '<p class="no-data">Failed to load appointments. Please try again.</p>';
    });
}

function updateDashboardInfo() {
    if (!currentPatient) return;
    
    document.getElementById('appointmentCount').textContent = appointmentsData.length;
    
    // Show next appointment
    if (appointmentsData.length > 0) {
        const nextApt = appointmentsData[0];
        const doctorName = nextApt.doctor?.name || nextApt.doctorName || 'Doctor';
        const date = nextApt.appointmentDate || '';
        
        document.getElementById('nextAppointmentInfo').innerHTML = 
            `<strong>${doctorName}</strong><br>
             ${date}`;
    }
}

function showDashboardHome() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('dashboardHome').classList.add('active');
    updateNavActive('Dashboard');
}

function showAppointmentBooking() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('appointmentBooking').classList.add('active');
    updateNavActive('Book Appointment');
    setMinDate();
}

function showMyAppointments() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('myAppointments').classList.add('active');
    updateNavActive('My Appointments');
    loadAppointmentsDisplay();
}

function showHealthRecords() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('healthRecords').classList.add('active');
    updateNavActive('Health Records');
}

function updateNavActive(label) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.includes(label)) {
            item.classList.add('active');
        }
    });
}

function setMinDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    document.getElementById('appointmentDate').min = today.toISOString().split('T')[0];
}

function loadDoctorDetails() {
    const doctorId = document.getElementById('doctorSelect').value;
    const doctorDetailsCard = document.getElementById('doctorDetailsCard');

    // Hide card if no doctor selected
    if (!doctorId) {
        doctorDetailsCard.style.display = 'none';
        return;
    }

    // Show loading state
    doctorDetailsCard.style.display = 'block';
    document.getElementById('doctorDetailName').textContent = 'Loading...';
    document.getElementById('doctorDetailSpecialization').textContent = '-';
    document.getElementById('doctorDetailPhone').textContent = '-';
    document.getElementById('doctorDetailEmail').textContent = '-';

    // Fetch doctor details from backend
    fetch(API_ENDPOINTS.getDoctorById(doctorId), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load doctor details');
        }
        return response.json();
    })
    .then(data => {
        // Display doctor details
        document.getElementById('doctorDetailName').textContent = data.name || '-';
        document.getElementById('doctorDetailSpecialization').textContent = data.specialization || '-';
        document.getElementById('doctorDetailPhone').textContent = data.phone || '-';
        document.getElementById('doctorDetailEmail').textContent = data.email || '-';
    })
    .catch(error => {
        console.error('Error loading doctor details:', error);
        document.getElementById('doctorDetailName').textContent = 'Error loading details';
        document.getElementById('doctorDetailSpecialization').textContent = 'Please try again';
        document.getElementById('doctorDetailPhone').textContent = '-';
        document.getElementById('doctorDetailEmail').textContent = '-';
    });
}

function bookAppointmentHandler(event) {
    event.preventDefault();
    
    const doctorId = document.getElementById('doctorSelect').value;
    const appointmentDate = document.getElementById('appointmentDate').value;

    // Validate inputs
    if (!doctorId || !appointmentDate) {
        alert('Please select a doctor and appointment date');
        return;
    }

    if (!currentPatient || !currentPatient.id) {
        alert('Patient information not found. Please login again.');
        return;
    }

    // Format the appointment data according to entity structure
    const appointmentData = {
        patientId: currentPatient.id,
        doctorId: parseInt(doctorId),
        date: appointmentDate,
        status: 'PENDING'  // Default status
    };

    console.log('Booking appointment with data:', appointmentData);

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Booking...';
    submitBtn.disabled = true;

    fetch(API_ENDPOINTS.bookAppointment, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        },
        body: JSON.stringify(appointmentData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Appointment booking failed');
            }).catch(() => {
                throw new Error('Appointment booking failed');
            });
        }
        return response.json();
    })
    .then(data => {
        alert(`Appointment booked successfully!\nAppointment ID: ${data.id}`);
        document.getElementById('appointmentBooking').querySelector('form').reset();
        loadAppointmentsData();
        showMyAppointments();
    })
    .catch(error => {
        console.error('Booking error:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function loadAppointmentsDisplay() {
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (appointmentsData.length === 0) {
        appointmentsList.innerHTML = '<p class="no-data">No appointments yet. <a href="#" onclick="showAppointmentBooking()">Book one now</a></p>';
        return;
    }

    appointmentsList.innerHTML = appointmentsData.map(apt => {
        const status = apt.status || 'PENDING';
        const doctorName = apt.doctor || 'Doctor';
        const date = apt.date || '';
        const aptId = apt.id || '';
        
        return `
            <div class="appointment-item">
                <h4>${doctorName}</h4>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Appointment ID:</strong> ${aptId}</p>
                <span class="appointment-status status-${status.toLowerCase()}">${status}</span>
            </div>
        `;
    }).join('');
}

function logoutPatient() {
    if (confirm('Are you sure you want to logout?')) {
        currentPatient = null;
        goToHome();
    }
}

// Doctor Functions
function doctorSignupHandler(event) {
    event.preventDefault();
    
    const name = document.getElementById('doctorName').value;
    const specialization = document.getElementById('doctorSpecialization').value;
    const phone = document.getElementById('doctorPhone').value;
    const license = document.getElementById('doctorLicense').value;
    const email = document.getElementById('doctorSignupEmail').value;
    const password = document.getElementById('doctorSignupPassword').value;

const signupData = {
    name,
    specialization,
    phone: phone || null,
    licenseNumber: license ? Number(license) : null,
    email,
    password
};

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    fetch(API_ENDPOINTS.doctorSignup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || 'Signup failed');
            });
        }
        return response.json();
    })
    .then(data => {
        alert('Account created successfully! Please login.');
        showDoctorLogin();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function doctorLoginHandler(event) {
    event.preventDefault();
    console.log('doctorLoginHandler called');
    
    const email = document.getElementById('doctorEmail').value;
    const password = document.getElementById('doctorPassword').value;

    const loginData = {
        email: email,
        password: password
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    console.log('Doctor login request:', API_ENDPOINTS.doctorLogin, loginData);

    fetch(API_ENDPOINTS.doctorLogin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Doctor login failed response text:', text);
                let message = 'Login failed';
                try {
                    const json = JSON.parse(text);
                    message = json.message || message;
                } catch (e) {
                    // not JSON
                }
                throw new Error(message);
            });
        }
        return response.json();
    })
    .then(data => {
        // Store token and doctor data
        if (data.token) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
        }
        
        currentDoctor = {
            id: data.id || data.doctorId,
            name: data.name,
            email: data.email,
            specialization: data.specialization
        };
        
        localStorage.setItem('currentDoctor', JSON.stringify(currentDoctor));
        loadDoctorDashboard();
        showPage('doctorDashboard');
    })
    .catch(error => {
        console.error('Doctor login error:', error);
        alert(`Error: ${error.message}`);
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

// Doctor Dashboard Functions
function loadDoctorDashboard() {
    document.getElementById('doctorNameDisplay').textContent = currentDoctor.name;
    document.getElementById('doctorSpecializationDisplay').textContent = currentDoctor.specialization || 'General Medicine';
    document.getElementById('doctorIDDisplay').textContent = currentDoctor.id;
    document.getElementById('doctorWelcome').textContent = currentDoctor.name.split(' ')[0];
    
    loadDoctorAppointments();
    loadDoctorStats();
    showDoctorDashboardHome();
}

function showDoctorDashboardHome() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('doctorDashboardHome').classList.add('active');
    updateDoctorNavActive('Dashboard');
}

function showDoctorAppointments() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('doctorAppointments').classList.add('active');
    updateDoctorNavActive('My Appointments');
    loadDoctorAppointments();
}

function showDoctorSchedule() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('doctorSchedule').classList.add('active');
    updateDoctorNavActive('Schedule');
}

function showDoctorPatients() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('doctorPatients').classList.add('active');
    updateDoctorNavActive('My Patients');
    loadDoctorPatients();
}

function showDoctorProfile() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('doctorProfile').classList.add('active');
    updateDoctorNavActive('Profile');
    loadDoctorProfile();
}

function updateDoctorNavActive(label) {
    document.querySelectorAll('#doctorDashboard .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.includes(label)) {
            item.classList.add('active');
        }
    });
}

function loadDoctorAppointments() {
    if (!currentDoctor || !currentDoctor.id) return;

    const appointmentsList = document.getElementById('doctorAppointmentsList');
    appointmentsList.innerHTML = '<p class="no-data">Loading appointments...</p>';

    fetch(API_ENDPOINTS.getAppointmentsByDoctor(currentDoctor.id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load appointments');
        }
        return response.json();
    })
    .then(data => {
        doctorAppointmentsData = Array.isArray(data) ? data : (data.data || []);
        displayDoctorAppointments('all');
        updateDoctorStats();
    })
    .catch(error => {
        console.error('Error:', error);
        appointmentsList.innerHTML = '<p class="no-data">Failed to load appointments. Please try again.</p>';
    });
}

function displayDoctorAppointments(filter = 'all') {
    const appointmentsList = document.getElementById('doctorAppointmentsList');
    
    if (!doctorAppointmentsData || doctorAppointmentsData.length === 0) {
        appointmentsList.innerHTML = '<p class="no-data">No appointments found.</p>';
        return;
    }

    let filteredAppointments = doctorAppointmentsData;

    const today = new Date().toISOString().split('T')[0];
    
    switch(filter) {
        case 'today':
            filteredAppointments = doctorAppointmentsData.filter(apt => 
                apt.appointmentDate === today
            );
            break;
        case 'upcoming':
            filteredAppointments = doctorAppointmentsData.filter(apt => 
                apt.appointmentDate >= today && apt.status !== 'COMPLETED'
            );
            break;
        case 'completed':
            filteredAppointments = doctorAppointmentsData.filter(apt => 
                apt.status === 'COMPLETED'
            );
            break;
        default:
            filteredAppointments = doctorAppointmentsData;
    }

    if (filteredAppointments.length === 0) {
        appointmentsList.innerHTML = '<p class="no-data">No appointments found for this filter.</p>';
        return;
    }

    appointmentsList.innerHTML = filteredAppointments.map(apt => {
        const status = apt.status || 'PENDING';
        const patientName = apt.patient?.name || apt.patientName || 'Patient';
        const date = apt.appointmentDate || '';
        const aptId = apt.id || '';
        
        return `
            <div class="appointment-item">
                <h4>${patientName}</h4>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Appointment ID:</strong> ${aptId}</p>
                <div class="appointment-status doctor-view status-${status.toLowerCase()}">
                    <span>${status}</span>
                    <div class="status-actions">
                        ${status === 'CONFIRMED' ? `
                            <button onclick="updateAppointmentStatus(${aptId}, 'COMPLETED')" class="btn-status btn-complete">Complete</button>
                            <button onclick="updateAppointmentStatus(${aptId}, 'CANCELLED')" class="btn-status btn-cancel">Cancel</button>
                        ` : ''}
                        ${status === 'PENDING' ? `
                            <button onclick="updateAppointmentStatus(${aptId}, 'CONFIRMED')" class="btn-status btn-confirm">Confirm</button>
                            <button onclick="updateAppointmentStatus(${aptId}, 'CANCELLED')" class="btn-status btn-cancel">Cancel</button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterAppointments(filterType) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`).classList.add('active');
    
    displayDoctorAppointments(filterType);
}

function updateAppointmentStatus(appointmentId, newStatus) {
    if (!confirm(`Are you sure you want to ${newStatus.toLowerCase()} this appointment?`)) {
        return;
    }

    fetch(`${API_ENDPOINTS.updateAppointmentStatus(appointmentId)}?status=${encodeURIComponent(newStatus)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update appointment status');
        }
        return response.json();
    })
    .then(data => {
        alert(`Appointment ${newStatus.toLowerCase()} successfully!`);
        loadDoctorAppointments(); // Refresh the list
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    });
}

function loadDoctorPatients() {
    if (!currentDoctor || !currentDoctor.id) return;

    const patientsList = document.getElementById('doctorPatientsList');
    patientsList.innerHTML = '<p class="no-data">Loading patients...</p>';

    // Get unique patients from appointments
    fetch(API_ENDPOINTS.getAppointmentsByDoctor(currentDoctor.id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authToken ? `Bearer ${authToken}` : ''
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load patients');
        }
        return response.json();
    })
    .then(data => {
        const appointments = Array.isArray(data) ? data : (data.data || []);
        
        // Extract unique patients from appointment objects
        const patientsMap = new Map();
        appointments.forEach(apt => {
            const patientId = apt.patient?.id || apt.patientId;
            const patientName = apt.patient?.name || apt.patientName;
            const patientEmail = apt.patient?.email || apt.patientEmail || '';
            const patientPhone = apt.patient?.phone || apt.patientPhone || '';
            
            if (patientId && patientName) {
                if (!patientsMap.has(patientId)) {
                    patientsMap.set(patientId, {
                        id: patientId,
                        name: patientName,
                        email: patientEmail,
                        phone: patientPhone,
                        lastVisit: apt.appointmentDate || '',
                        totalAppointments: 0
                    });
                }
                
                // Count appointments per patient
                patientsMap.get(patientId).totalAppointments++;
                // Update last visit to most recent date
                if (apt.appointmentDate) {
                    const currentLastVisit = patientsMap.get(patientId).lastVisit;
                    if (!currentLastVisit || new Date(apt.appointmentDate) > new Date(currentLastVisit)) {
                        patientsMap.get(patientId).lastVisit = apt.appointmentDate;
                    }
                }
            }
        });

        const patients = Array.from(patientsMap.values());
        displayDoctorPatients(patients);
    })
    .catch(error => {
        console.error('Error:', error);
        patientsList.innerHTML = '<p class="no-data">Failed to load patients. Please try again.</p>';
    });
}

function displayDoctorPatients(patients) {
    const patientsList = document.getElementById('doctorPatientsList');
    
    if (!patients || patients.length === 0) {
        patientsList.innerHTML = '<p class="no-data">No patients found.</p>';
        return;
    }

    patientsList.innerHTML = patients.map(patient => `
        <div class="patient-card">
            <div class="patient-info">
                <h4>${patient.name}</h4>
                <p><strong>ID:</strong> ${patient.id}</p>
                <p><strong>Email:</strong> ${patient.email}</p>
                <p><strong>Phone:</strong> ${patient.phone}</p>
                <p><strong>Last Visit:</strong> ${patient.lastVisit}</p>
                <p><strong>Total Appointments:</strong> ${patient.totalAppointments}</p>
            </div>
            <div class="patient-actions">
                <button onclick="viewPatientDetails('${patient.id}')" class="btn-small btn-view">View Details</button>
                <button onclick="messagePatient('${patient.id}')" class="btn-small btn-message">Message</button>
            </div>
        </div>
    `).join('');
}

function searchPatients() {
    const searchTerm = document.getElementById('patientSearch').value.toLowerCase();
    const patientCards = document.querySelectorAll('.patient-card');
    
    patientCards.forEach(card => {
        const patientName = card.querySelector('h4').textContent.toLowerCase();
        const patientEmail = card.querySelector('p:nth-child(3)').textContent.toLowerCase();
        
        if (patientName.includes(searchTerm) || patientEmail.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function loadDoctorProfile() {
    document.getElementById('profileName').value = currentDoctor.name || '';
    document.getElementById('profileEmail').value = currentDoctor.email || '';
    document.getElementById('profilePhone').value = currentDoctor.phone || '';
    document.getElementById('profileSpecialization').value = currentDoctor.specialization || '';
    document.getElementById('profileLicense').value = currentDoctor.license || '';
    document.getElementById('profileBio').value = currentDoctor.bio || '';
}

function updateDoctorProfile(event) {
    event.preventDefault();
    
    const profileData = {
        name: document.getElementById('profileName').value,
        phone: document.getElementById('profilePhone').value,
        bio: document.getElementById('profileBio').value
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;

    // For now, just update local storage. In a real app, this would call an API
    currentDoctor.name = profileData.name;
    currentDoctor.phone = profileData.phone;
    currentDoctor.bio = profileData.bio;
    
    localStorage.setItem('currentDoctor', JSON.stringify(currentDoctor));
    
    alert('Profile updated successfully!');
    loadDoctorDashboard(); // Refresh dashboard with new name
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
}

function updateDoctorSchedule(event) {
    event.preventDefault();
    
    const workingDays = Array.from(document.getElementById('workingDays').selectedOptions).map(option => option.value);
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    const scheduleData = {
        workingDays: workingDays,
        startTime: startTime,
        endTime: endTime
    };

    // For now, just store in localStorage. In a real app, this would call an API
    localStorage.setItem('doctorSchedule', JSON.stringify(scheduleData));
    
    alert('Schedule updated successfully!');
}

function loadDoctorStats() {
    if (!doctorAppointmentsData) return;

    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const todayAppointments = doctorAppointmentsData.filter(apt => apt.appointmentDate === today);
    const monthlyAppointments = doctorAppointmentsData.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.getMonth() === thisMonth && aptDate.getFullYear() === thisYear;
    });

    // Get unique patients
    const uniquePatients = new Set(doctorAppointmentsData.map(apt => apt.patient?.id || apt.patientId)).size;

    document.getElementById('todayAppointmentsCount').textContent = todayAppointments.length;
    document.getElementById('totalPatientsCount').textContent = uniquePatients;
    document.getElementById('monthlyAppointmentsCount').textContent = monthlyAppointments.length;
    
    // Next appointment
    const upcomingAppointments = doctorAppointmentsData
        .filter(apt => apt.appointmentDate >= today && apt.status !== 'COMPLETED')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
    
    if (upcomingAppointments.length > 0) {
        const nextApt = upcomingAppointments[0];
        const patientName = nextApt.patient?.name || nextApt.patientName || 'Patient';
        document.getElementById('nextDoctorAppointmentInfo').innerHTML = 
            `<strong>${patientName}</strong><br>
             ${nextApt.appointmentDate}`;
    }
}

function viewPatientDetails(patientId) {
    alert(`Patient details for ID: ${patientId}\n\nThis feature would show detailed patient history, medical records, and appointment history.`);
}

function messagePatient(patientId) {
    alert(`Messaging feature for patient ID: ${patientId}\n\nThis would open a messaging interface to communicate with the patient.`);
}

function logoutDoctor() {
    if (confirm('Are you sure you want to logout?')) {
        currentDoctor = null;
        authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentDoctor');
        doctorAppointmentsData = [];
        goToHome();
    }
}

// Global variables for doctor dashboard
let doctorAppointmentsData = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Hospital Management System Loaded');
    
    // Check if patient is already logged in
    const savedPatient = localStorage.getItem('currentPatient');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedPatient && savedToken) {
        currentPatient = JSON.parse(savedPatient);
        authToken = savedToken;
        loadPatientDashboard();
        showPage('patientDashboard');
    }

    // Check if doctor is already logged in
    const savedDoctor = localStorage.getItem('currentDoctor');
    if (savedDoctor && savedToken) {
        currentDoctor = JSON.parse(savedDoctor);
        authToken = savedToken;
        loadDoctorDashboard();
        showPage('doctorDashboard');
    }
});
