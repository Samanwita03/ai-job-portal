package com.jobportal.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false, length = 5000)
    private String description;

    private String skillsRequired;

    private String salaryRange;

    private String jobType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User employer;

    @Column(updatable = false)
    private LocalDateTime postedAt;

    @Builder.Default
    private boolean active = true;

    @PrePersist
    public void prePersist() {
        this.postedAt = LocalDateTime.now();
    }
}