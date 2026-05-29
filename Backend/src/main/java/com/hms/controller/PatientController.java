package com.hms.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.entity.Patient;
import com.hms.service.PatientService;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    // Constructor Injection (Best Practice)
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // 1. Register New Patient
    @PostMapping("/signup")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient savedPatient = patientService.registerPatient(patient);
        return ResponseEntity.ok(savedPatient);
    }
    
    
    // 2. Get All Patients
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }

    // 3. Get Patient By ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(patient);
    }

    // 4. Update Patient Details
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient) {

        Patient updatedPatient = patientService.updatePatient(id, patient);
        return ResponseEntity.ok(updatedPatient);
    }

    // 5. Delete Patient
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok("Patient deleted successfully");
    }
    
    //6.Patient login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Patient loginRequest) {

        Patient patient = patientService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (patient != null) {
            return ResponseEntity.ok(patient);
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}