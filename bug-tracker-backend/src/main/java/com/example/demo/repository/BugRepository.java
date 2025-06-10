package com.example.demo.repository;

import com.example.demo.model.Bug;
import com.example.demo.model.Project;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BugRepository extends JpaRepository<Bug, Long> {

    // For TESTER: Get bugs created by a specific user
    List<Bug> findByCreatedBy(User user);

    // For DEVELOPER: Get bugs assigned to a developer
    List<Bug> findByAssignedTo(User user);

    // For filtering by status
    List<Bug> findByStatus(String status);

    // For filtering by project
    List<Bug> findByProject(Project project);
    
    @Query("SELECT b FROM Bug b WHERE b.project.createdBy = :admin")
    List<Bug> findBugsByProjectCreator(@Param("admin") User admin);

    // Optional: For filtering by priority
    List<Bug> findByPriorityOrderByIdAsc(String priority);

    // Combined filter example (status + project + priority)
    List<Bug> findByStatusAndProjectAndPriorityOrderByPriorityDescIdAsc(String status, Project project, String priority);
    List<Bug> findByStatusOrderByPriorityDescIdAsc(String status);
}
