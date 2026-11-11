package com.campusflow.dto.request;

import com.campusflow.entity.DriveStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlacementDriveRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Academic year is required (e.g. 2026-2027)")
    private String academicYear;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private DriveStatus status;

    private String description;
}

