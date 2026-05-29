package com.hms.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.hms.entity.Patient;
import com.hms.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // 1. Register New Patient
    public Patient registerPatient(Patient patient) {
        // Business Validation
        if (patient.getName() == null || patient.getName().isEmpty()) {
            throw new RuntimeException("Patient name cannot be empty");
        }
        if (patient.getAge() <= 0) {
            throw new RuntimeException("Invalid age");
        }

        return patientRepository.save(patient);
    }

    // 2. Get All Patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // 3. Get Patient By ID (with validation)
    public Patient getPatientById(Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isEmpty()) {
            throw new RuntimeException("Patient not found with ID: " + id);
        }
        return patient.get();
    }

    // 4. Update Patient Details
    public Patient updatePatient(Long id, Patient updatedPatient) {
        Patient existing = getPatientById(id);

        existing.setName(updatedPatient.getName());
        existing.setAge(updatedPatient.getAge());
        existing.setGender(updatedPatient.getGender());
        existing.setContact(updatedPatient.getContact());

        return patientRepository.save(existing);
    }

    // 5. Delete Patient
    public void deletePatient(Long id) {
        Patient patient = getPatientById(id);
        patientRepository.delete(patient);
    }
    
    //6 Patient Login
    public Patient login(String email, String password) {
        return patientRepository.findByEmailAndPassword(email, password);
    }
}