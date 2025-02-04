package com.example.scrum.controller;

import com.example.scrum.model.Task;
import com.example.scrum.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Permitir solicitudes del frontend
@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Task> getTasks() {
        return taskRepository.findAll();
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PutMapping("/{id}")
    public Task updateTaskStatus(@PathVariable Long id, @RequestBody Task task) {
        return taskRepository.findById(id)
            .map(existingTask -> {
                existingTask.setStatus(task.getStatus());
                return taskRepository.save(existingTask);
            })
            .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @DeleteMapping("/{id}")
        public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

}
