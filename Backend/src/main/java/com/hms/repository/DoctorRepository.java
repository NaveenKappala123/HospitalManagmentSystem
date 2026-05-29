package com.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.entity.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

	Doctor findByEmailAndPassword(String email, String password);
}
