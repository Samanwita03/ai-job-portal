package com.jobportal.backend.service;

import com.jobportal.backend.entity.*;
import com.jobportal.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public Job createJob(Job job, String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        job.setEmployer(employer);
        return jobRepository.save(job);
    }

    public List<Job> getAllActiveJobs() {
        return jobRepository.findByActiveTrue();
    }

    public List<Job> searchByTitle(String title) {
        return jobRepository
            .findByTitleContainingIgnoreCaseAndActiveTrue(title);
    }

    public List<Job> getJobsByEmployer(String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new RuntimeException("Employer not found"));
        return jobRepository.findByEmployer(employer);
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public void deleteJob(Long id) {
        Job job = getJobById(id);
        job.setActive(false);
        jobRepository.save(job);
    }
}