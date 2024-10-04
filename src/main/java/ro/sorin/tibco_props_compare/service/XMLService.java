package ro.sorin.tibco_props_compare.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.validation.Schema;
import javax.xml.validation.SchemaFactory;
import javax.xml.transform.stream.StreamSource;
import javax.xml.validation.Validator;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class XMLService {

    private static final String XSD_PATH = "src/main/resources/repository.xsd";
    private static final Logger logger = LogManager.getLogger(XMLService.class);

    public Document parseXmlFile(File xmlFile) throws Exception {
        logger.info("Parsing XML file: {}", xmlFile.getName());

        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(false);  // Disable namespace awareness
        factory.setIgnoringElementContentWhitespace(true);  // Ignore white spaces in elements
        DocumentBuilder builder = factory.newDocumentBuilder();

        Document document;
        try {
            document = builder.parse(xmlFile);
            logger.info("Successfully parsed XML file: {}", xmlFile.getName());
        } catch (Exception e) {
            logger.error("Error parsing XML file: {}", xmlFile.getName(), e);
            throw e;
        }
        return document;
    }

    public void validateXmlAgainstXsd(File xmlFile) throws SAXException, IOException {
        logger.info("Validating XML file {} against XSD {}", xmlFile.getName(), XSD_PATH);

        SchemaFactory schemaFactory = SchemaFactory.newInstance("http://www.w3.org/2001/XMLSchema");
        Schema schema = schemaFactory.newSchema(new File(XSD_PATH));
        Validator validator = schema.newValidator();

        try {
            validator.validate(new StreamSource(xmlFile));
            logger.info("XML file {} is valid according to the XSD.", xmlFile.getName());
        } catch (SAXException | IOException e) {
            logger.error("Validation failed for XML file: {}", xmlFile.getName(), e);
            throw e;
        }
    }

    public List<Element> extractGlobalVariables(Document doc) {
        logger.info("Extracting globalVariable elements from XML document.");

        List<Element> globalVariableList = new ArrayList<>();
        NodeList nodeList = doc.getElementsByTagName("globalVariable");

        if (nodeList == null || nodeList.getLength() == 0) {
            logger.error("No globalVariable elements found in the XML document.");
            return globalVariableList;  // Return empty list if no globalVariable is found
        }

        logger.info("Found {} globalVariable elements.", nodeList.getLength());

        for (int i = 0; i < nodeList.getLength(); i++) {
            Node node = nodeList.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element globalVariableElement = (Element) node;
                globalVariableList.add(globalVariableElement);
                // Print the content of the globalVariable node for debugging
                logger.info("Extracted globalVariable element: {}", globalVariableElement.getTextContent());
            } else {
                logger.error("Unexpected node type at index {}: {}", i, node.getNodeType());
            }
        }

        logger.info("Successfully extracted {} globalVariable elements.", globalVariableList.size());
        logger.info(globalVariableList);
        return globalVariableList;
    }

    public List<Map<String, String>> compareGlobalVariables(List<Element> variables1, List<Element> variables2) {
        List<Map<String, String>> comparisonResult = new ArrayList<>();
    
        // Create a map of name -> Element for both variables lists for easy lookup
        Map<String, Element> variablesMap1 = new HashMap<>();
        Map<String, Element> variablesMap2 = new HashMap<>();
    
        // Populate the maps with the name as the key
        for (Element var : variables1) {
            String name = var.getElementsByTagName("name").item(0).getTextContent();
            variablesMap1.put(name, var);
        }
    
        for (Element var : variables2) {
            String name = var.getElementsByTagName("name").item(0).getTextContent();
            variablesMap2.put(name, var);
        }
    
        // Get the union of all names from both maps
        Set<String> allNames = new TreeSet<>();
        allNames.addAll(variablesMap1.keySet());
        allNames.addAll(variablesMap2.keySet());
    
        // Iterate through the union of names and compare elements
        for (String name : allNames) {
            Map<String, String> resultMap = new HashMap<>();
            resultMap.put("name", name);
    
            Element var1 = variablesMap1.get(name);
            Element var2 = variablesMap2.get(name);
    
            // If the element is missing in one of the files, mark it as "missing"
            if (var1 == null) {
                resultMap.put("valueFile1", "");
                resultMap.put("valueFile2", var2.getElementsByTagName("value").item(0).getTextContent());
                resultMap.put("status", "missing in file 1");
            } else if (var2 == null) {
                resultMap.put("valueFile1", var1.getElementsByTagName("value").item(0).getTextContent());
                resultMap.put("valueFile2", "");
                resultMap.put("status", "missing in file 2");
            } else {
                // Compare values
                String value1 = var1.getElementsByTagName("value").item(0).getTextContent();
                String value2 = var2.getElementsByTagName("value").item(0).getTextContent();
    
                resultMap.put("valueFile1", value1);
                resultMap.put("valueFile2", value2);
    
                if (value1.equals(value2)) {
                    resultMap.put("status", "matched");
                } else {
                    resultMap.put("status", "different");
                }
            }
    
            // Add the result map to the comparison result
            comparisonResult.add(resultMap);
        }
    
        return comparisonResult;
    }
}