// OpenRouter Service
const openRouterService = {
    // Generate report using OpenRouter API
    async generateReport(formData) {
        // Get API key from localStorage
        const apiKey = localStorage.getItem('reha_apiKey');
        if (!apiKey) {
            throw new Error('API key not found');
        }

        // Get model and system prompt from localStorage
        const model = localStorage.getItem('reha_model') || 'gpt-3.5-turbo';
        const systemPrompt = localStorage.getItem('reha_systemPrompt') || 
            'Du bist ein erfahrener Physiotherapeut, der professionelle Abschlussberichte verfasst. Deine Berichte sind klar strukturiert, fachlich korrekt und verwenden physiotherapeutische Fachsprache.';

        // Prepare user prompt
        const userPrompt = `Erstelle einen professionellen Abschlussbericht für eine Physiotherapie-Behandlung mit folgenden Informationen:

Zeitpunkt: ${formData.time}
Physiotherapie-Ziel: ${formData.goalStatus}
Compliance: ${formData.compliance}
Therapieziel des Patienten: ${formData.therapyGoal}
Hypothese: ${formData.hypothesis}

Der Bericht sollte folgende Struktur haben:
1. Einleitung mit Behandlungszeitraum und Diagnose
2. Befund und Beobachtungen
3. Durchgeführte Maßnahmen
4. Ergebnisse und Fortschritte
5. Empfehlungen für weitere Behandlungen oder Eigenübungen

Verwende physiotherapeutische Fachsprache und halte den Bericht professionell und sachlich.`;

        // Prepare request to OpenRouter API
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': window.location.href,
                'X-Title': 'Physiotherapie Abschlussbericht Generator'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ]
            })
        });

        // Check if response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
        }

        // Parse response
        const data = await response.json();
        return data.choices[0].message.content;
    }
};