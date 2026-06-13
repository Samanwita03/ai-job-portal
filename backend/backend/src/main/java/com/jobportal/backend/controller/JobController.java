package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllActiveJobs());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(
            @RequestParam String title) {
        return ResponseEntity.ok(jobService.searchByTitle(title));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Job> createJob(
            @RequestBody Job job,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            jobService.createJob(job, userDetails.getUsername()));
    }

    @GetMapping("/my-jobs")
    public ResponseEntity<List<Job>> getMyJobs(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            jobService.getJobsByEmployer(userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok("Job deleted successfully");
    }
}