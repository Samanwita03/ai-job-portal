package com.jobportal.backend.controller;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.service.ApplicationService;
import com.jobportal.backend.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final GeminiAiService geminiAiService;

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> applyToJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserDetails userDetails) {
        Application application = applicationService.applyToJob(
                jobId,
                userDetails.getUsername(),
                body.get("resumeText")
        );
        return ResponseEntity.ok(application);
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            applicationService.getMyApplications(userDetails.getUsername()));
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsForJob(
            @PathVariable Long jobId) {
        return ResponseEntity.ok(
            applicationService.getApplicationsForJob(jobId));
    }

    // Quick AI test endpoint - no auth needed for testing
    @PostMapping("/ai-match-test")
    public ResponseEntity<Map<String, Object>> testAiMatch(
            @RequestBody Map<String, String> body) {
        Map<String, Object> result = geminiAiService.matchResumeToJob(
                body.get("resumeText"),
                body.get("jobDescription"),
                body.get("skillsRequired")
        );
        return ResponseEntity.ok(result);
    }
    @PutMapping("/{applicationId}/status")
public ResponseEntity<Application> updateStatus(
        @PathVariable Long applicationId,
        @RequestBody Map<String, String> body) {
    Application updated = applicationService.updateStatus(
        applicationId, body.get("status"));
    return ResponseEntity.ok(updated);
}

@GetMapping("/job/{jobId}/applicants")
public ResponseEntity<List<Application>> getApplicantsForJob(
        @PathVariable Long jobId) {
    return ResponseEntity.ok(
        applicationService.getApplicationsForJob(jobId));
}
}