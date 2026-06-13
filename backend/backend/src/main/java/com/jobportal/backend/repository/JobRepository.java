package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByActiveTrue();
    List<Job> findByEmployer(User employer);
    List<Job> findByTitleContainingIgnoreCaseAndActiveTrue(String title);
    List<Job> findByLocationContainingIgnoreCaseAndActiveTrue(String location);
}