package com.campusflow.service;

import com.campusflow.dto.request.CompanyCreateRequest;
import com.campusflow.dto.response.CompanyResponse;
import com.campusflow.entity.Company;
import com.campusflow.exception.DuplicateResourceException;
import com.campusflow.exception.ResourceNotFoundException;
import com.campusflow.mapper.EntityMapper;
import com.campusflow.repository.CompanyRepository;
import com.campusflow.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public CompanyResponse createCompany(CompanyCreateRequest req, Long actorUserId, String actorEmail) {
        if (companyRepository.existsByName(req.getName().trim())) {
            throw new DuplicateResourceException("Company with name '" + req.getName() + "' already exists");
        }

        Company company = Company.builder()
                .name(req.getName().trim())
                .website(req.getWebsite())
                .industry(req.getIndustry())
                .location(req.getLocation())
                .description(req.getDescription())
                .verified(false)
                .build();
        company = companyRepository.save(company);

        auditLogService.record(actorUserId, actorEmail, "CREATE_COMPANY", "COMPANY", company.getId().toString(),
                "Registered company " + company.getName(), "127.0.0.1");

        return EntityMapper.toCompanyResponse(company, 0);
    }

    @Transactional(readOnly = true)
    public Page<CompanyResponse> getCompanies(Boolean verified, Pageable pageable) {
        if (verified != null) {
            return companyRepository.findByVerified(verified, pageable)
                    .map(c -> EntityMapper.toCompanyResponse(c, jobRepository.countByCompanyId(c.getId())));
        }
        return companyRepository.findAll(pageable)
                .map(c -> EntityMapper.toCompanyResponse(c, jobRepository.countByCompanyId(c.getId())));
    }

    @Transactional(readOnly = true)
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        long jobsCount = jobRepository.countByCompanyId(id);
        return EntityMapper.toCompanyResponse(company, jobsCount);
    }

    @Transactional
    public CompanyResponse verifyCompany(Long id, boolean verified, Long actorUserId, String actorEmail) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        company.setVerified(verified);
        company.setUpdatedAt(LocalDateTime.now());
        company = companyRepository.save(company);

        auditLogService.record(actorUserId, actorEmail, verified ? "VERIFY_COMPANY" : "UNVERIFY_COMPANY",
                "COMPANY", company.getId().toString(),
                (verified ? "Verified" : "Unverified") + " company " + company.getName(), "127.0.0.1");

        long jobsCount = jobRepository.countByCompanyId(id);
        return EntityMapper.toCompanyResponse(company, jobsCount);
    }
}
