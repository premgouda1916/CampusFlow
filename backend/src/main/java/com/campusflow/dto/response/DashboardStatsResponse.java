package com.campusflow.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentDashboard {
        private long totalAvailableJobs;
        private long eligibleJobsCount;
        private long applicationsSubmitted;
        private long shortlistedApplications;
        private long upcomingInterviews;
        private long offersReceived;
        private double profileCompletionPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecruiterDashboard {
        private long totalJobsPosted;
        private long activeJobs;
        private long totalApplicants;
        private long shortlistedCandidates;
        private long scheduledInterviews;
        private long offersIssued;
        private long offersAccepted;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlacementOfficerDashboard {
        private long totalRegisteredStudents;
        private long totalPlacedStudents;
        private double placementPercentage;
        private double averageSalaryPackageLpa;
        private double highestSalaryPackageLpa;
        private long activeRecruiterCompanies;
        private long totalJobsPublished;
        private long totalOffersIssued;
        private List<DepartmentPlacementStat> departmentStats;
        private List<CompanyPlacementStat> topHiringCompanies;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentPlacementStat {
        private String departmentCode;
        private String departmentName;
        private long totalStudents;
        private long placedStudents;
        private double placementRate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyPlacementStat {
        private String companyName;
        private long offersCount;
        private String averagePackage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDashboard {
        private long totalUsers;
        private long totalStudents;
        private long totalRecruiters;
        private long verifiedCompanies;
        private long pendingCompanyApprovals;
        private long pendingRecruiterApprovals;
        private long totalJobs;
        private long totalApplications;
        private long totalAuditLogs;
        private List<AuditLogResponse> recentActivity;
    }
}
