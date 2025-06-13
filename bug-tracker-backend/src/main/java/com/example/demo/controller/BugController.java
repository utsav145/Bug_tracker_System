package com.example.demo.controller;

import com.example.demo.model.Bug;
import com.example.demo.model.Project;
import com.example.demo.model.User;
import com.example.demo.repository.BugRepository;
import com.example.demo.repository.ProjectRepository;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bugs")
@RequiredArgsConstructor
@CrossOrigin(origins = "https://bug-tracker-system-1.onrender.com", allowCredentials = "true")
public class BugController {

    private final BugRepository bugRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;

    @GetMapping
    public List<Bug> getAllBugs() {
    	User user = userService.getCurrentUser();
        String role = user.getRole().toUpperCase();

        switch (role) {
            case "ADMIN":
                User currentUser = userService.getCurrentUser();
                return bugRepository.findBugsByProjectCreator(currentUser);
            case "TESTER":
                return bugRepository.findByCreatedBy(user);
            case "DEVELOPER":
                return bugRepository.findByAssignedTo(user);
            default:
                throw new RuntimeException("Unauthorized role");
        }
    }

    @PostMapping
    public Bug createBug(@RequestBody Bug bug ) {
    	 User user1 = userService.getCurrentUser();
        if (!"TESTER".equalsIgnoreCase(user1.getRole())) {
            throw new RuntimeException("Only testers can create bugs.");
        }

        Project project = projectRepository.findById(bug.getProject().getId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        bug.setProject(project);
        bug.setCreatedBy(user1);
        bug.setStatus("OPEN");
        bug.setCreatedAt(new Date());

        return bugRepository.save(bug);
    }

@PutMapping("/{bugId}/assign/{developerId}")
public Bug assignBugToDeveloper(@PathVariable Long bugId,
                                @PathVariable Long developerId) {
    User user = userService.getCurrentUser();
    if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
        throw new RuntimeException("Only admins can assign bugs.");
    }

    Bug bug = bugRepository.findById(bugId)
            .orElseThrow(() -> new RuntimeException("Bug not found"));

    // Prevent reassignment if status is IN_PROGRESS or RESOLVED
    String status = bug.getStatus().toUpperCase();
    if ("IN_PROGRESS".equals(status) || "RESOLVED".equals(status)) {
        throw new RuntimeException("Cannot reassign a bug that is already " + status + ".");
    }

    User developer = userService.getUserByUserId(developerId);
    if (!"DEVELOPER".equalsIgnoreCase(developer.getRole())) {
        throw new RuntimeException("Assigned user must be a developer.");
    }

    bug.setAssignedTo(developer);
    bug.setStatus("ASSIGNED");
    System.out.println("Assigning bug " + bugId + " to developer " + developerId);

    return bugRepository.save(bug);
}

    @PutMapping("/{bugId}/status")
    public ResponseEntity<?> updateBugStatus(@PathVariable Long bugId,
                                             @RequestBody Map<String, String> body) {
        User currentUser = userService.getCurrentUser();

        Bug bug = bugRepository.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug not found"));

        if (!"DEVELOPER".equalsIgnoreCase(currentUser.getRole()) ||
            bug.getAssignedTo() == null ||
            !bug.getAssignedTo().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized: You are not allowed to update this bug.");
        }

        String newStatus = body.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required.");
        }

        // ✅ Always set the status
        bug.setStatus(newStatus.toUpperCase());

        // ✅ Conditionally set resolution
        if ("RESOLVED".equalsIgnoreCase(newStatus)) {
            String resolution = body.get("resolution");
            if (resolution == null || resolution.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Resolution is required when resolving a bug.");
            }
            bug.setResolution(resolution);
        }


        System.out.println("Updating bug " + bugId + " to status: " + bug.getStatus());

        bugRepository.save(bug);

        return ResponseEntity.ok("Bug status updated successfully.");
    }


    
    @GetMapping("/assigned")
    public List<Bug> getAssignedBugsForDeveloper() {
        User currentUser = userService.getCurrentUser();
        
        if (!"DEVELOPER".equalsIgnoreCase(currentUser.getRole())) {
            throw new RuntimeException("Only developers can access this endpoint.");
        }

        return bugRepository.findByAssignedTo(currentUser);
    }
    
    @GetMapping("/filter")
    public List<Bug> filterBugs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String priority,
            @AuthenticationPrincipal User user) {

        String role = user.getRole().toUpperCase();
        List<Bug> bugs;

        switch (role) {
            case "ADMIN":
                bugs = bugRepository.findAll();
                break;
            case "TESTER":
                bugs = bugRepository.findByCreatedBy(user);
                break;
            case "DEVELOPER":
                bugs = bugRepository.findByAssignedTo(user);
                break;
            default:
                throw new RuntimeException("Unauthorized role");
        }

        return bugs.stream()
                .filter(b -> status == null || b.getStatus().equalsIgnoreCase(status))
                .filter(b -> projectId == null || (b.getProject() != null && b.getProject().getId().equals(projectId)))
                .filter(b -> priority == null || b.getPriority().equalsIgnoreCase(priority))
                .sorted((b1, b2) -> {
                    int p1 = mapPriority(b1.getPriority());
                    int p2 = mapPriority(b2.getPriority());
                    return p1 != p2 ? Integer.compare(p1, p2) : Long.compare(b1.getId(), b2.getId());
                })
                .collect(Collectors.toList());
    }

    private int mapPriority(String priority) {
        return switch (priority.toUpperCase()) {
            case "HIGH" -> 1;
            case "MEDIUM" -> 2;
            case "LOW" -> 3;
            default -> 4;
        };
    }
}
