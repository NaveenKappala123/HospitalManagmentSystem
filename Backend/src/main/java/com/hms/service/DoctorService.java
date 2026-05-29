package com.hms.service;

import org.springframework.stereotype.Service;

import com.hms.entity.Doctor;
import com.hms.repository.DoctorRepository;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // 1. Add Doctor
    public Doctor addDoctor(Doctor doctor) {
        if (doctor.getName() == null || doctor.getName().isEmpty()) {
            throw new RuntimeException("Doctor name is required");
        }
        if (doctor.getSpecialization() == null) {
            throw new RuntimeException("Specialization is required");
        }
        return doctorRepository.save(doctor);
    }

    // 2. Get All Doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 3. Get Doctor By ID
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // 4. Update Doctor Details
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor doctor = getDoctorById(id);

        if(updatedDoctor.getName() != null)
            doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(updatedDoctor.getSpecialization());
        doctor.setEmail(updatedDoctor.getEmail());
        return doctorRepository.save(doctor);
    }

    // 5. Delete Doctor
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctorRepository.delete(doctor);
    }
    // 6.LogIn Doctor
    public Doctor login(String email, String password) {
      return   doctorRepository.findByEmailAndPassword(email,password);
    }
}