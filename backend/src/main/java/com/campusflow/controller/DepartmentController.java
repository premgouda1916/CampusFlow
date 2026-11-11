package com.campusflow.controller;

import com.campusflow.dto.response.ApiResponse;
import com.campusflow.entity.Department;
import com.campusflow.repository.DepartmentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/departments")
@RequiredArgsConstructor
@Tag(name = "Departments", description = "Endpoints for academic department taxonomy")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    @Operation(summary = "Get list of active academic departments")
    public ResponseEntity<ApiResponse<List<Department>>> getActiveDepartments() {
        List<Department> departments = departmentRepository.findByActiveTrue();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }
}
