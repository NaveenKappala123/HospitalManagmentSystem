package com.hms.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AppointmentResponse {

	private Long id;
	private Long patientId;
	private Long doctorId;
	private LocalDate appointmentDate;
	private String status;
}
