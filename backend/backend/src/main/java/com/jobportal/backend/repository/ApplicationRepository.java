package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicant(User applicant);
    List<Application> findByJob(Job job);
    Optional<Application> findByJobAndApplicant(Job job, User applicant);
    boolean existsByJobAndApplicant(Job job, User applicant);
}