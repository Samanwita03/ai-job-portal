package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User applicant;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "job_company")
    private String jobCompany;

    private Integer aiMatchScore;

    @Column(length = 2000)
    private String aiSkillGaps;

    @Column(length = 2000)
    private String aiSummary;

    private String aiRecommendation;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(updatable = false)
    private LocalDateTime appliedAt;

    @PrePersist
    public void prePersist() {
        this.appliedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = Status.PENDING;
        }
    }

    public enum Status {
        PENDING, REVIEWED, SHORTLISTED, REJECTED
    }
}