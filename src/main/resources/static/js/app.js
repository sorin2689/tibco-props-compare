// Load environments for both sets
function loadEnvironments() {
    axios.get('http://localhost:8080/api/files/environments')
        .then(response => {
            const environment1Dropdown = document.getElementById('environment1');
            const environment2Dropdown = document.getElementById('environment2');
            environment1Dropdown.innerHTML = '<option value="">Select an environment</option>';
            environment2Dropdown.innerHTML = '<option value="">Select an environment</option>';

            response.data.forEach(env => {
                const option1 = document.createElement('option');
                const option2 = document.createElement('option');
                option1.value = env;
                option1.text = env;
                option2.value = env;
                option2.text = env;
                environment1Dropdown.appendChild(option1);
                environment2Dropdown.appendChild(option2);
            });
        })
        .catch(error => console.error('Error loading environments:', error));
}

// Load applications for a specific environment
function loadApplications(environmentDropdownId, applicationDropdownId) {
    const environment = document.getElementById(environmentDropdownId).value;
    if (environment) {
        axios.get('http://localhost:8080/api/files/applications', {
            params: { environment: environment }
        })
        .then(response => {
            const applicationDropdown = document.getElementById(applicationDropdownId);
            applicationDropdown.innerHTML = '<option value="">Select an application</option>';
            response.data.forEach(app => {
                const option = document.createElement('option');
                option.value = app;
                option.text = app;
                applicationDropdown.appendChild(option);
            });

             // Reinitialize Select2 after options are loaded
             $('#' + applicationDropdownId).select2({
                placeholder: "Select an application"
            });
        })
        .catch(error => console.error('Error loading applications:', error));
    }
}

// Load XML files for a specific environment and application
function loadXmlFiles(environmentDropdownId, applicationDropdownId, fileDropdownId) {
    const environment = document.getElementById(environmentDropdownId).value;
    const application = document.getElementById(applicationDropdownId).value;
    if (environment && application) {
        axios.get('http://localhost:8080/api/files/xml-files', {
            params: {
                environment: environment,
                application: application
            }
        })
        .then(response => {
            const fileDropdown = document.getElementById(fileDropdownId);
            fileDropdown.innerHTML = '<option value="">Select a file</option>';
            response.data.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.text = file;
                fileDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading XML files:', error));
    }
}

// Event listeners for loading applications and files
document.getElementById('environment1').addEventListener('change', function () {
    loadApplications('environment1', 'application1');
});
document.getElementById('environment2').addEventListener('change', function () {
    loadApplications('environment2', 'application2');
});
$('#application1').on('change', function () {
    loadXmlFiles('environment1', 'application1', 'file1');
});

$('#application2').on('change', function () {
    loadXmlFiles('environment2', 'application2', 'file2');
});

// Function to display comparison results in the table
function displayResult(comparisonResult) {
    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = '';  // Clear previous results

    if (comparisonResult.length === 0) {
        comparisonBody.innerHTML = '<tr><td colspan="3">No differences found</td></tr>';
        return;
    }

    comparisonResult.forEach(element => {
        const row = document.createElement('tr');
        const statusClass = element.status === 'matched' ? 'table-success' : 'table-danger';

        row.innerHTML = `
            <td>${element.name}</td>
            <td class="${statusClass}">${element.valueFile1}</td>
            <td class="${statusClass}">${element.valueFile2}</td>
        `;
        comparisonBody.appendChild(row);
    });
}

// Event listener for Compare button
document.getElementById('compare-btn').addEventListener('click', function () {
    const environment1 = document.getElementById('environment1').value;
    const application1 = document.getElementById('application1').value;
    const file1Name = document.getElementById('file1').value;
    const environment2 = document.getElementById('environment2').value;
    const application2 = document.getElementById('application2').value;
    const file2Name = document.getElementById('file2').value;

    if (!environment1 || !application1 || !file1Name || !environment2 || !application2 || !file2Name) {
        alert('Please select environment, application, and files for both sets.');
        return;
    }

    // Send both sets of selections to the backend for comparison
    axios.post('http://localhost:8080/api/xml/compare', null, {
        params: {
            environment1: environment1,
            application1: application1,
            file1Name: file1Name,
            environment2: environment2,
            application2: application2,
            file2Name: file2Name
        }
    })
    .then(response => {
        if (Array.isArray(response.data)) {
            displayResult(response.data);
        } else {
            console.log('Unexpected response format');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Add event listener for the refresh button
document.getElementById('refresh-btn').addEventListener('click', function () {
    axios.post('http://localhost:8080/api/git/refresh')
        .then(response => {
            alert(response.data);
        })
        .catch(error => {
            console.error('Error refreshing repositories:', error);
            alert('Error refreshing repositories.');
        });
});

// Load environments when the page loads
document.addEventListener('DOMContentLoaded', loadEnvironments);
