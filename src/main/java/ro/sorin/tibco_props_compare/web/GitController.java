package ro.sorin.tibco_props_compare.web;

import java.io.IOException;

import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import ro.sorin.tibco_props_compare.service.GitService;

@RestController
@CrossOrigin(origins = {"null", "http://localhost"})
public class GitController {

    @Autowired
    private GitService gitService;

    @PostMapping("/api/git/refresh")
    public String refreshEnvironments() {
        try {
            gitService.refreshAllEnvironments();
            return "Repositories refreshed successfully.";
        } catch (GitAPIException | IOException e) {
            e.printStackTrace();
            return "Error occurred while refreshing repositories.";
        }
    }
}
