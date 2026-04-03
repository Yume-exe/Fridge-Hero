const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=AIzaSyCufKDHXB6dwbCwpilwo5efCpjBtnyv0WU';
const payload = {
    contents: [{
        parts: [{
            text: "You are a Michelin-star chef. User inputs: [Chicken, Rice, Soy Sauce]. Output exactly a JSON object with two keys: dishName and recipeSteps (an array of 3 strings). Return raw JSON without markdown."
        }]
    }]
};

fetch(endpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
})
.then(res => res.json().then(data => ({status: res.status, ok: res.ok, data})))
.then(res => console.log(JSON.stringify(res, null, 2)))
.catch(console.error);
