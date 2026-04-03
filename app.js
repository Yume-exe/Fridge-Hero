document.addEventListener('DOMContentLoaded', () => {
    const cookBtn = document.getElementById('cook-magic-btn');
    const ingredient1 = document.getElementById('ingredient-1');
    const ingredient2 = document.getElementById('ingredient-2');
    const ingredient3 = document.getElementById('ingredient-3');
    const recipeOutput = document.getElementById('recipe-output');

    cookBtn.addEventListener('click', async () => {
        const i1 = ingredient1.value.trim();
        const i2 = ingredient2.value.trim();
        const i3 = ingredient3.value.trim();

        if (!i1 && !i2 && !i3) {
            recipeOutput.innerHTML = '<p style="color: #ffe66d; text-align: center;">Please add at least one ingredient to perform some magic! 🪄</p>';
            return;
        }

        const ingredients = [i1, i2, i3].filter(i => i).join(', ');

        // Add a simple loading state
        const originalText = cookBtn.innerHTML;
        cookBtn.innerHTML = '<span>Mixing potions... 🧪</span>';
        cookBtn.style.opacity = '0.8';
        cookBtn.disabled = true;
        recipeOutput.innerHTML = '';

        try {
            const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=(API)'; //API HERE
            const payload = {
                contents: [{
                    parts: [{
                        text: `You are a Michelin-star chef. User inputs: [${ingredients}]. Output exactly a JSON object with two keys: dishName and recipeSteps (an array of 3 strings). Return raw JSON without markdown.`
                    }]
                }]
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('You are casting spells too fast! The API rate limit has been exceeded. Please wait about 30 seconds and try again.');
                }
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();
            const textResponse = data.candidates[0].content.parts[0].text;

            // Clean up potentially returned markdown just in case the model ignored instructions
            const jsonText = textResponse.replace(/^```json/gi, '').replace(/```$/g, '').trim();
            const recipeData = JSON.parse(jsonText);

            const stepsHtml = recipeData.recipeSteps.map(step => `<li>${step}</li>`).join('');

            recipeOutput.innerHTML = `
                <h2 style="color: var(--tertiary-color); margin-bottom: 15px; font-size: 1.3rem;">${recipeData.dishName}</h2>
                <ol style="margin-left: 20px; font-size: 0.95rem; line-height: 1.6; color: rgba(255,255,255,0.9); display: flex; flex-direction: column; gap: 10px;">
                    ${stepsHtml}
                </ol>
            `;
        } catch (error) {
            console.error('Error fetching recipe:', error);
            const userMsg = error.message.includes('casting spells too fast') 
                ? error.message 
                : 'Oops, the spell fizzled out. Please try again! 💥';
            recipeOutput.innerHTML = `<p style="color: #ff4757; text-align: center;">${userMsg}</p>`;
        } finally {
            // Revert button
            cookBtn.innerHTML = originalText;
            cookBtn.style.opacity = '1';
            cookBtn.disabled = false;
        }
    });
});
