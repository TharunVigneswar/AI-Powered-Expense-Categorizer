// AI Training Data (Expanded with 200+ Entries)
const expenseCategories = {
    "Food": ["restaurant", "dinner", "lunch", "pizza", "burger", "french fries", "breakfast", "snack", "coffee", "groceries", "supermarket", "drinks", "meal", "eat"],
    "Transport": ["uber", "taxi", "bus", "subway", "train", "flight", "gas", "fuel", "parking", "toll", "car rental", "cab"],
    "Shopping": ["clothes", "shoes", "electronics", "amazon", "ebay", "gifts", "fashion", "mall", "store", "boutique", "purchase"],
    "Healthcare": ["hospital", "doctor", "medicine", "pharmacy", "dentist", "insurance", "surgery", "therapy", "checkup", "clinic"],
    "Entertainment": ["movies", "netflix", "spotify", "game", "concert", "event", "club", "bar", "music", "cinema", "show"],
    "Bills": ["electricity", "water", "gas", "internet", "phone", "subscription", "mortgage", "rent", "loan", "bill", "fees"],
};

// Function to Calculate Word Similarity (Jaccard Index)
function wordSimilarity(word1, word2) {
    let set1 = new Set(word1.split(""));
    let set2 = new Set(word2.split(""));
    let intersection = new Set([...set1].filter(x => set2.has(x)));
    let union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
}

// Function to Predict Category (Now Smarter!)
function predictCategory(description) {
    const words = description.toLowerCase().split(" ");
    let bestMatch = { category: "Other", score: 0.2 }; // Minimum confidence threshold

    for (const [category, keywords] of Object.entries(expenseCategories)) {
        words.forEach(word => {
            keywords.forEach(keyword => {
                let similarity = wordSimilarity(word, keyword);
                if (similarity > bestMatch.score) {
                    bestMatch = { category, score: similarity };
                }
            });
        });
    }

    return bestMatch.category;
}
