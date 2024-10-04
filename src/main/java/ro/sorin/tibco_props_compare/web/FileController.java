package ro.sorin.tibco_props_compare.web;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ro.sorin.tibco_props_compare.service.XMLService;

import java.io.File;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"null", "http://localhost"})
public class FileController {

     private static final Logger logger = LogManager.getLogger(FileController.class);

    @Value("${xml.files.directory}")
    private String xmlFilesDirectory;

    @GetMapping
    public ResponseEntity<List<String>> listXmlFiles() {
        File folder = new File(xmlFilesDirectory);
        if (!folder.exists() || !folder.isDirectory()) {
            return ResponseEntity.badRequest().build();
        }

        List<String> files = Arrays.stream(folder.listFiles())
                .filter(file -> file.isFile() && file.getName().endsWith(".xml"))
                .map(File::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(files);
    }

    @GetMapping("/environments")
    public ResponseEntity<List<String>> listEnvironments() {
        List<String> environments = Arrays.asList("Production", "UAT", "SIT");
        logger.info("/environments request recevied");
        return ResponseEntity.ok(environments);
    }

    @GetMapping("/applications")
    public ResponseEntity<List<String>> listApplications(@RequestParam("environment") String environment) {
        File envDir = new File(xmlFilesDirectory + "/" + environment);
        
        if (!envDir.exists() || !envDir.isDirectory()) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<String> applications = Arrays.stream(envDir.listFiles())
                .filter(File::isDirectory)  // Only list directories
                .map(File::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/xml-files")
    public ResponseEntity<List<String>> listXmlFiles(@RequestParam("environment") String environment,
                                                    @RequestParam("application") String application) {
        File appDir = new File(xmlFilesDirectory + "/" + environment + "/" + application);

        if (!appDir.exists() || !appDir.isDirectory()) {
            return ResponseEntity.badRequest().body(Collections.emptyList());
        }

        List<String> xmlFiles = Arrays.stream(appDir.listFiles())
                .filter(file -> file.isFile() && file.getName().endsWith(".xml"))
                .map(File::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(xmlFiles);
    }
}
