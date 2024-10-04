package ro.sorin.tibco_props_compare.service;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.transport.UsernamePasswordCredentialsProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class GitService {

    @Value("${git.repo.production}")
    private String productionRepoUrl;

    @Value("${git.repo.uat}")
    private String uatRepoUrl;

    @Value("${git.repo.sit}")
    private String sitRepoUrl;

    @Value("${git.local.directory}")
    private String localDirectory;

    @Value("${git.auth.token}")
    private String gitAuthToken;

    // Clone or pull for each environment
    public void refreshAllEnvironments() throws GitAPIException, IOException {
        refreshEnvironment("Production", productionRepoUrl);
        refreshEnvironment("UAT", uatRepoUrl);
        refreshEnvironment("SIT", sitRepoUrl);
    }

    // Clone or pull a specific environment's repository
    private void refreshEnvironment(String environment, String repoUrl) throws GitAPIException, IOException {
        File localRepoDir = new File(localDirectory + "/" + environment);

        if (localRepoDir.exists()) {
            // Perform git pull if the repo is already cloned
            Git git;
            try {
                git = Git.open(localRepoDir);
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                throw e;
            }
            git.pull()
                .setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitAuthToken, ""))
                .call();
            System.out.println(environment + " repository updated with pull.");
        } else {
            // Perform git clone if the repo is not yet cloned
            Git.cloneRepository()
                .setURI(repoUrl)
                .setDirectory(localRepoDir)
                .setCredentialsProvider(new UsernamePasswordCredentialsProvider(gitAuthToken, ""))
                .call();
            System.out.println(environment + " repository cloned.");
        }
    }
}