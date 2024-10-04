document.getElementById('compare-btn').addEventListener('click', function () {
    const file1 = document.getElementById('file1').files[0];
    const file2 = document.getElementById('file2').files[0];

    if (!file1 || !file2) {
        alert('Please select both files.');
        return;
    }

    // Prepare the FormData object to send the files
    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    // Send the files to the backend using Axios
    axios.post('http://localhost:8080/api/xml/compare', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log(response.data); // Log the response data
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

// Function to display the comparison result in the UI
function displayResult(data) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    data.forEach(element => {
        const div = document.createElement('div');
        div.className = element.status === 'matched' ? 'matched' : 'different';
        div.innerHTML = `
            <strong>Element:</strong> ${element.name} <br>
            <strong>File 1 Value:</strong> ${element.valueFile1} <br>
            <strong>File 2 Value:</strong> ${element.valueFile2}
        `;
        resultDiv.appendChild(div);
    });

}
