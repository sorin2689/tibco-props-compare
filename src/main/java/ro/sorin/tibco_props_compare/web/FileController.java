package ro.sorin.tibco_props_compare.web;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"null", "http://localhost"})
public class FileController {

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
}
