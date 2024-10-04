// Function to load available environments
function loadEnvironments() {
    axios.get('http://localhost:8080/api/files/environments')
        .then(response => {
            const environmentDropdown = document.getElementById('environment');
            environmentDropdown.innerHTML = '<option value="">Select an environment</option>';

            response.data.forEach(env => {
                const option = document.createElement('option');
                option.value = env;
                option.text = env;
                environmentDropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading environments:', error));
}

// Function to load available applications based on selected environment
function loadApplications(environment) {
    axios.get('http://localhost:8080/api/files/applications', {
        params: { environment: environment }
    })
    .then(response => {
        const applicationDropdown = document.getElementById('application');
        applicationDropdown.innerHTML = '<option value="">Select an application</option>';

        response.data.forEach(app => {
            const option = document.createElement('option');
            option.value = app;
            option.text = app;
            applicationDropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Error loading applications:', error));
}

// Function to load XML files based on selected environment and application
function loadXmlFiles(environment, application) {
    axios.get('http://localhost:8080/api/files/xml-files', {
        params: {
            environment: environment,
            application: application
        }
    })
    .then(response => {
        const file1Dropdown = document.getElementById('file1');
        const file2Dropdown = document.getElementById('file2');

        file1Dropdown.innerHTML = '<option value="">Select a file</option>';
        file2Dropdown.innerHTML = '<option value="">Select a file</option>';

        response.data.forEach(file => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');

            option1.value = file;
            option1.text = file;
            file1Dropdown.appendChild(option1);

            option2.value = file;
            option2.text = file;
            file2Dropdown.appendChild(option2);
        });
    })
    .catch(error => console.error('Error loading XML files:', error));
}

// Function to display the comparison results in a table
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

// Event listener for when the environment changes
document.getElementById('environment').addEventListener('change', function () {
    const environment = this.value;
    if (environment) {
        loadApplications(environment);
    }
});

// Event listener for when the application changes
document.getElementById('application').addEventListener('change', function () {
    const environment = document.getElementById('environment').value;
    const application = this.value;

    if (environment && application) {
        loadXmlFiles(environment, application);
    }
});

// Event listener for the Compare button
document.getElementById('compare-btn').addEventListener('click', function () {
    const environment = document.getElementById('environment').value;
    const application = document.getElementById('application').value;
    const file1Name = document.getElementById('file1').value;
    const file2Name = document.getElementById('file2').value;

    if (!environment || !application || !file1Name || !file2Name) {
        alert('Please select environment, application, and both files.');
        return;
    }

    // Send the request to the backend for comparison
    axios.post('http://localhost:8080/api/xml/compare', null, {
        params: {
            environment: environment,
            application: application,
            file1Name: file1Name,
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

// Load environments when the page loads
document.addEventListener('DOMContentLoaded', loadEnvironments);
