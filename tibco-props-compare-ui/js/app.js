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