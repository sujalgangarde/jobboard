package com.jobboard;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.util.List;

@RestController @RequestMapping("/api/jobs") @RequiredArgsConstructor
public class JobController {
    private final JobRepository repo;

    @GetMapping
    public List<Job> all(@RequestParam(defaultValue = "") String q,
                         @RequestParam(defaultValue = "") String type) {
        return repo.search(q.trim(), type.trim());
    }

    @GetMapping("/{id}")
    public Job one(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
    }

    @PostMapping
    public Job add(@Valid @RequestBody Job j) {
        j.setId(null);
        j.setPostedOn(LocalDate.now());
        return repo.save(j);
    }

    @PutMapping("/{id}")
    public Job update(@PathVariable Long id, @Valid @RequestBody Job j) {
        Job old = repo.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));
        j.setId(id);
        j.setPostedOn(old.getPostedOn());
        return repo.save(j);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }
}
