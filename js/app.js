document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const dateInput = document.getElementById('date');
    const goalSelect = document.getElementById('goal');
    const complianceSelect = document.getElementById('compliance');
    const therapyGoalInput = document.getElementById('therapyGoal');
    const hypothesisInput = document.getElementById('hypothesis');
    const clearBtn = document.getElementById('clearBtn');
    const submitBtn = document.getElementById('submitBtn');
    const resultContainer = document.getElementById('resultContainer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const reportContent = document.getElementById('reportContent');
    const copyBtn = document.getElementById('copyBtn');
    const newReportBtn = document.getElementById('newReportBtn');

    // Set current date and time
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    dateInput.value = formattedDate;

    // Event listeners
    clearBtn.addEventListener('click', clearForm);
    submitBtn.addEventListener('click', generateReport);
    copyBtn.addEventListener('click', copyToClipboard);
    newReportBtn.addEventListener('click', resetForm);

    // Clear form fields
    function clearForm() {
        goalSelect.value = '';
        complianceSelect.value = '';
        therapyGoalInput.value = '';
        hypothesisInput.value = '';
        
        // Reset current date and time
        const now = new Date();
        const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        dateInput.value = formattedDate;
    }

    // Generate report
    async function generateReport() {
        // Validate required fields
        if (!goalSelect.value) {
            alert('Bitte wählen Sie ein Physiotherapie-Ziel aus.');
            return;
        }

        // Show loading indicator and result container
        resultContainer.style.display = 'block';
        loadingIndicator.style.display = 'flex';
        reportContent.style.display = 'none';
        reportContent.textContent = '';

        // Scroll to result container
        resultContainer.scrollIntoView({ behavior: 'smooth' });

        // Prepare data for the report
        const formData = {
            time: dateInput.value,
            goalStatus: goalSelect.value,
            compliance: complianceSelect.value || 'Keine Angabe',
            therapyGoal: therapyGoalInput.value || 'Keine spezifischen Ziele angegeben',
            hypothesis: hypothesisInput.value || 'Keine Hypothese angegeben'
        };

        try {
            // Generate report using OpenRouter API
            const report = await openRouterService.generateReport(formData);
            
            // Hide loading indicator and show report
            loadingIndicator.style.display = 'none';
            reportContent.style.display = 'block';
            reportContent.textContent = report;
        } catch (error) {
            // Handle error
            loadingIndicator.style.display = 'none';
            reportContent.style.display = 'block';
            
            let errorMessage = 'Es ist ein Fehler bei der Generierung des Berichts aufgetreten. ';
            
            if (error.message.includes('API key')) {
                errorMessage += 'API-Schlüssel ungültig oder nicht vorhanden. Bitte überprüfen Sie die API-Einstellungen im Admin-Bereich.';
            } else {
                errorMessage += 'Bitte versuchen Sie es erneut oder überprüfen Sie die API-Einstellungen.';
            }
            
            reportContent.textContent = errorMessage;
            console.error('Error generating report:', error);
        }
    }

    // Copy report to clipboard
    function copyToClipboard() {
        if (!reportContent.textContent) return;
        
        navigator.clipboard.writeText(reportContent.textContent)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Kopiert!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }

    // Reset form and hide result
    function resetForm() {
        clearForm();
        resultContainer.style.display = 'none';
    }
});