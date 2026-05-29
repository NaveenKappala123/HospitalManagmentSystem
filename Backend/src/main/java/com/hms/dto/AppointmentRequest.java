package com.hms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

	@Getter
	@Setter
	public class AppointmentRequest {

	    @NotNull(message = "Patient ID is required")
	    private Long patientId;

	    @NotNull(message = "Doctor ID is required")
	    private Long doctorId;

	    @NotBlank(message = "Date is required")
	    private String date; // format: yyyy-MM-dd
	}
