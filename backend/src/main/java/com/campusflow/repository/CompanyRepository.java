package com.campusflow.repository;

import com.campusflow.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findByName(String name);
    boolean existsByName(String name);
    List<Company> findByVerified(boolean verified);
    Page<Company> findByVerified(boolean verified, Pageable pageable);
    long countByVerifiedTrue();
}
