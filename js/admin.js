// Admin configuration
const adminConfig = {
    password: 'admin123',  // Simple password for demo purposes
    defaultSystemPrompt: 'Du bist ein erfahrener Physiotherapeut, der professionelle Abschlussberichte verfasst. Deine Berichte sind klar strukturiert, fachlich korrekt und verwenden physiotherapeutische Fachsprache.'
};

// Global variables
let adminLink;
let adminModal;
let modalContent;
let adminForm;
let systemPromptTextarea;
let modelSelect;
let passwordInput;
let currentApiKey = '';
let apiKeyInput;
let saveButton;
let closeButton;
let statusMessage;

// Initialize admin functionality
function initAdminPanel() {
    createAdminLink();
    createAdminModal();
    loadSavedSettings();
}

// Create admin link in the footer
function createAdminLink() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    adminLink = document.createElement('a');
    adminLink.href = '#';
    adminLink.textContent = 'Admin';
    adminLink.style.marginLeft = '10px';
    adminLink.style.color = 'inherit';
    adminLink.style.textDecoration = 'none';
    adminLink.addEventListener('click', showPasswordPrompt);

    footer.appendChild(adminLink);
}

// Create admin modal
function createAdminModal() {
    // Create modal container
    adminModal = document.createElement('div');
    adminModal.className = 'admin-modal';
    adminModal.id = 'admin-modal';

    // Create modal content
    modalContent = document.createElement('div');
    modalContent.className = 'admin-modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.margin = '2% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.borderRadius = '5px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '90vh';
    modalContent.style.overflow = 'auto';

    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'admin-modal-header';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    modalHeader.style.marginBottom = '20px';
    modalHeader.style.paddingBottom = '10px';
    modalHeader.style.borderBottom = '1px solid #eee';

    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Admin-Bereich';
    modalTitle.style.margin = '0';
    modalTitle.style.color = '#4a90e2';

    closeButton = document.createElement('span');
    closeButton.className = 'close-button';
    closeButton.innerHTML = '&times;';
    closeButton.style.fontSize = '28px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', closeModal);

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Create password prompt
    const passwordPrompt = document.createElement('div');
    passwordPrompt.id = 'password-prompt';

    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Passwort:';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginBottom = '10px';
    passwordLabel.style.fontWeight = 'bold';

    passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '8px';
    passwordInput.style.marginBottom = '15px';
    passwordInput.style.boxSizing = 'border-box';
    passwordInput.style.border = '1px solid #ddd';
    passwordInput.style.borderRadius = '4px';
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });

    const submitPasswordButton = document.createElement('button');
    submitPasswordButton.textContent = 'Anmelden';
    submitPasswordButton.style.backgroundColor = '#4a90e2';
    submitPasswordButton.style.color = 'white';
    submitPasswordButton.style.border = 'none';
    submitPasswordButton.style.borderRadius = '4px';
    submitPasswordButton.style.padding = '8px 15px';
    submitPasswordButton.style.cursor = 'pointer';
    submitPasswordButton.addEventListener('click', validatePassword);

    passwordPrompt.appendChild(passwordLabel);
    passwordPrompt.appendChild(passwordInput);
    passwordPrompt.appendChild(submitPasswordButton);

    // Create admin form
    adminForm = document.createElement('form');
    adminForm.id = 'admin-form';
    adminForm.style.display = 'none';

    // System prompt
    const promptGroup = document.createElement('div');
    promptGroup.style.marginBottom = '15px';

    const promptLabel = document.createElement('label');
    promptLabel.textContent = 'System Prompt:';
    promptLabel.style.display = 'block';
    promptLabel.style.marginBottom = '5px';
    promptLabel.style.fontWeight = 'bold';

    systemPromptTextarea = document.createElement('textarea');
    systemPromptTextarea.style.width = '100%';
    systemPromptTextarea.style.height = '150px';
    systemPromptTextarea.style.padding = '8px';
    systemPromptTextarea.style.boxSizing = 'border-box';
    systemPromptTextarea.style.border = '1px solid #ddd';
    systemPromptTextarea.style.borderRadius = '4px';
    systemPromptTextarea.style.resize = 'vertical';

    promptGroup.appendChild(promptLabel);
    promptGroup.appendChild(systemPromptTextarea);

    // Model selection
    const modelGroup = document.createElement('div');
    modelGroup.style.marginBottom = '15px';

    const modelLabel = document.createElement('label');
    modelLabel.textContent = 'Sprachmodell:';
    modelLabel.style.display = 'block';
    modelLabel.style.marginBottom = '5px';
    modelLabel.style.fontWeight = 'bold';

    modelSelect = document.createElement('select');
    modelSelect.style.width = '100%';
    modelSelect.style.padding = '8px';
    modelSelect.style.boxSizing = 'border-box';
    modelSelect.style.border = '1px solid #ddd';
    modelSelect.style.borderRadius = '4px';

    // Add model options
    const models = [
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
        { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
    ];

    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        modelSelect.appendChild(option);
    });

    modelGroup.appendChild(modelLabel);
    modelGroup.appendChild(modelSelect);

    // API Key
    const apiKeyGroup = document.createElement('div');
    apiKeyGroup.style.marginBottom = '20px';
    apiKeyGroup.style.marginTop = '30px';
    apiKeyGroup.style.paddingTop = '20px';
    apiKeyGroup.style.borderTop = '1px solid #eee';

    // Add a heading for the API key section
    const apiKeyHeading = document.createElement('h3');
    apiKeyHeading.textContent = 'API-Einstellungen';
    apiKeyHeading.style.marginBottom = '15px';
    apiKeyHeading.style.color = '#4a90e2';

    const apiKeyLabel = document.createElement('label');
    apiKeyLabel.textContent = 'OpenRouter API-Schlüssel:';
    apiKeyLabel.style.display = 'block';
    apiKeyLabel.style.marginBottom = '5px';
    apiKeyLabel.style.fontWeight = 'bold';

    // Create API key input with password type
    apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'password';
    apiKeyInput.style.width = '100%';
    apiKeyInput.style.padding = '8px';
    apiKeyInput.style.boxSizing = 'border-box';
    apiKeyInput.style.border = '2px solid #4a90e2';
    apiKeyInput.style.borderRadius = '4px';

    // Add help text for API key
    const apiKeyHelp = document.createElement('div');
    apiKeyHelp.style.fontSize = '0.85em';
    apiKeyHelp.style.color = '#666';
    apiKeyHelp.style.marginTop = '5px';
    apiKeyHelp.innerHTML = 'Geben Sie hier Ihren OpenRouter API-Schlüssel ein. Ohne gültigen API-Schlüssel kann kein Bericht generiert werden.';

    apiKeyGroup.appendChild(apiKeyHeading);
    apiKeyGroup.appendChild(apiKeyLabel);
    apiKeyGroup.appendChild(apiKeyInput);
    apiKeyGroup.appendChild(apiKeyHelp);

    // Status message
    statusMessage = document.createElement('div');
    statusMessage.style.marginBottom = '15px';
    statusMessage.style.padding = '10px';
    statusMessage.style.borderRadius = '4px';
    statusMessage.style.display = 'none';

    // Save button
    saveButton = document.createElement('button');
    saveButton.type = 'button';
    saveButton.textContent = 'Einstellungen speichern';
    saveButton.addEventListener('click', saveSettings);
    saveButton.style.backgroundColor = '#4a90e2';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.padding = '10px 15px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.marginTop = '15px';
    saveButton.style.marginBottom = '10px';

    // Add elements to form
    adminForm.appendChild(promptGroup);
    adminForm.appendChild(modelGroup);
    adminForm.appendChild(apiKeyGroup);
    adminForm.appendChild(statusMessage);
    adminForm.appendChild(saveButton);

    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(passwordPrompt);
    modalContent.appendChild(adminForm);
    adminModal.appendChild(modalContent);

    // Add to document
    document.body.appendChild(adminModal);
}

// Show password prompt
function showPasswordPrompt() {
    adminModal.style.display = 'block';
    passwordInput.value = '';
    document.getElementById('password-prompt').style.display = 'block';
    adminForm.style.display = 'none';
    passwordInput.focus();

    // Reload saved settings to ensure fresh data
    loadSavedSettings();
}

// Close modal
function closeModal() {
    adminModal.style.display = 'none';
}

// Validate password
function validatePassword() {
    if (passwordInput.value === adminConfig.password) {
        document.getElementById('password-prompt').style.display = 'none';
        adminForm.style.display = 'block';
    } else {
        alert('Falsches Passwort!');
    }
}

// Save settings
function saveSettings() {
    const systemPrompt = systemPromptTextarea.value;
    const model = modelSelect.value;
    const apiKey = apiKeyInput.value;

    // Save to localStorage
    localStorage.setItem('reha_systemPrompt', systemPrompt);
    localStorage.setItem('reha_model', model);
    
    // Only save API key if it's not empty
    if (apiKey) {
        localStorage.setItem('reha_apiKey', apiKey);
        currentApiKey = apiKey;
    }

    // Show success message
    statusMessage.textContent = 'Einstellungen wurden gespeichert!';
    statusMessage.className = 'status-success';
    statusMessage.style.display = 'block';

    // Hide message after 3 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// Load saved settings
function loadSavedSettings() {
    const savedSystemPrompt = localStorage.getItem('reha_systemPrompt');
    const savedModel = localStorage.getItem('reha_model');
    currentApiKey = localStorage.getItem('reha_apiKey') || '';

    // Set values if they exist
    if (savedSystemPrompt) {
        systemPromptTextarea.value = savedSystemPrompt;
    } else {
        systemPromptTextarea.value = adminConfig.defaultSystemPrompt;
    }

    if (savedModel) {
        modelSelect.value = savedModel;
    } else {
        modelSelect.value = 'gpt-3.5-turbo'; // Default model
    }

    // Don't show the API key, but indicate if it's set
    if (currentApiKey) {
        apiKeyInput.value = '••••••••••••••••••••••••••';
        apiKeyInput.placeholder = 'API-Schlüssel ist gespeichert';
    } else {
        apiKeyInput.value = '';
        apiKeyInput.placeholder = 'Geben Sie Ihren API-Schlüssel ein';
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminPanel);