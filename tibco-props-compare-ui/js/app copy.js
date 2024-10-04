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
// Call the function to load environments on page load
document.addEventListener('DOMContentLoaded', loadEnvironments);

document.getElementById('environment').addEventListener('change', function () {
    const environment = this.value;

    if (environment) {
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
});

document.getElementById('application').addEventListener('change', function () {
    const environment = document.getElementById('environment').value;
    const application = this.value;

    if (environment && application) {
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
});


document.addEventListener('DOMContentLoaded', function () {
    // Populate dropdowns with available XML files
    loadFileDropdowns();

    document.getElementById('compare-btn').addEventListener('click', function () {
        const file1Name = document.getElementById('file1').value;
        const file2Name = document.getElementById('file2').value;

        if (!file1Name || !file2Name) {
            alert('Please select both files.');
            return;
        }

        // Send the file names to the backend for comparison
        axios.post('http://localhost:8080/api/xml/compare', null, {
            params: {
                file1Name: file1Name,
                file2Name: file2Name
            }
        })
        .then(response => {
            console.log(response.data);
            if (response.data && Array.isArray(response.data)) {
                displayResult(response.data);
            } else {
                console.log('No response data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});

// Function to load the XML files into dropdowns
function loadFileDropdowns() {
    axios.get('http://localhost:8080/api/files')
        .then(response => {
            const files = response.data;
            const file1Dropdown = document.getElementById('file1');
            const file2Dropdown = document.getElementById('file2');

            // Clear existing options
            file1Dropdown.innerHTML = '<option value="">Select a file</option>';
            file2Dropdown.innerHTML = '<option value="">Select a file</option>';

            files.forEach(file => {
                const option1 = document.createElement('option');
                option1.value = file;
                option1.text = file;
                file1Dropdown.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = file;
                option2.text = file;
                file2Dropdown.appendChild(option2);
            });
        })
        .catch(error => {
            console.error('Error loading file list:', error);
        });
}

// Function to display the comparison result in a table
function displayResult(data) {
    const comparisonBody = document.getElementById('comparison-body');
    comparisonBody.innerHTML = ''; // Clear previous results

    data.forEach(element => {
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