package com.campusflow.repository;

import com.campusflow.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByUsn(String usn);
    boolean existsByUsn(String usn);
    long countByPlacedTrue();
    long countByDepartmentId(Long departmentId);

    @Query("SELECT s FROM Student s WHERE " +
           "(:departmentId IS NULL OR s.department.id = :departmentId) AND " +
           "(:graduationYear IS NULL OR s.graduationYear = :graduationYear) AND " +
           "(:isPlaced IS NULL OR s.placed = :isPlaced) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(s.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.usn) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.user.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.skills) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> findStudentsWithFilter(Long departmentId, Integer graduationYear, Boolean isPlaced, String search, Pageable pageable);
}

