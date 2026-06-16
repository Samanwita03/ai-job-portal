package com.jobportal.backend.service;

import com.jobportal.backend.entity.*;
import com.jobportal.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final GeminiAiService geminiAiService;

    public Application applyToJob(Long jobId, String applicantEmail,
                                   String resumeText) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (applicationRepository.existsByJobAndApplicant(job, applicant)) {
            throw new RuntimeException("Already applied to this job");
        }

        // Call Gemini AI for match analysis
        Map<String, Object> aiResult = geminiAiService.matchResumeToJob(
                resumeText,
                job.getDescription(),
                job.getSkillsRequired()
        );

        Application application = Application.builder()
        .job(job)
        .applicant(applicant)
        .aiMatchScore((Integer) aiResult.get("matchScore"))
        .aiSkillGaps(aiResult.get("missingSkills").toString())
        .aiSummary(aiResult.get("summary").toString())
        .jobTitle(job.getTitle())        
        .jobCompany(job.getCompany())    
        .build();
        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications(String applicantEmail) {
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return applicationRepository.findByApplicant(applicant);
    }

    public List<Application> getApplicationsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJob(job);
    }
    public Application updateStatus(Long applicationId, String status) {
    Application application = applicationRepository.findById(applicationId)
            .orElseThrow(() -> new RuntimeException("Application not found"));
    application.setStatus(Application.Status.valueOf(status.toUpperCase()));
    return applicationRepository.save(application);
}

}