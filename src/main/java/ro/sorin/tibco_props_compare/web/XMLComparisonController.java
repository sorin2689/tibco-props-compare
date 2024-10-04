package ro.sorin.tibco_props_compare.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import ro.sorin.tibco_props_compare.service.XMLService;

import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/xml")
@CrossOrigin(origins = {"null", "http://localhost"})
public class XMLComparisonController {

    @Autowired
    private XMLService xmlService;

    @Value("${xml.files.directory}")
    private String xmlFilesDirectory;

    @PostMapping("/compare")
    public ResponseEntity<?> compareXmlFiles(@RequestParam("environment") String environment,
                                         @RequestParam("application") String application,
                                         @RequestParam("file1Name") String file1Name,
                                         @RequestParam("file2Name") String file2Name) throws Exception {
    File file1 = new File(xmlFilesDirectory + "/" + environment + "/" + application + "/" + file1Name);
    File file2 = new File(xmlFilesDirectory + "/" + environment + "/" + application + "/" + file2Name);


    
        
        if (!file1.exists() || !file2.exists()) {
            return ResponseEntity.badRequest().body("One or both files not found.");
        }
    
        // Validate the XML files against XSD
        xmlService.validateXmlAgainstXsd(file1);
        xmlService.validateXmlAgainstXsd(file2);
    
        // Parse XML files
        Document doc1 = xmlService.parseXmlFile(file1);
        Document doc2 = xmlService.parseXmlFile(file2);
    
        // Extract globalVariables
        List<Element> variables1 = xmlService.extractGlobalVariables(doc1);
        List<Element> variables2 = xmlService.extractGlobalVariables(doc2);
    
        // Compare globalVariables and get differences
        List<Map<String, String>> differences = xmlService.compareGlobalVariables(variables1, variables2);

        return ResponseEntity.ok(differences);
    }

}
