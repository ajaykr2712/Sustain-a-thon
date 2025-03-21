require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // For parsing JSON requests

const API_KEY = process.env.API_KEY;  // Get your API Key from the .env file
const MODEL_NAME = "gemini-pro";  // Use Google Gemini AI model

if (!API_KEY) {
  console.error("❌ Missing API_KEY in .env file");
  process.exit(1);
}

// Serve static files (index.html) for the frontend
app.use(express.static(path.join(__dirname)));

// Serve the index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Wildlife Sanctuary API Integration (exact questions and answers)
async function fetchWildlifeSanctuaryInfo(query) {
  const wildlifeData = {
    // Wildlife Sanctuary specific Q&A
    'What is a wildlife sanctuary?': "A protected area for conserving wildlife and their habitats.",
    'Purpose of a wildlife sanctuary': "To protect wildlife species and their natural environments.",
    'Difference between wildlife sanctuary and national park': "Sanctuaries allow limited human activity; national parks have stricter regulations.",
    'Activities restricted in wildlife sanctuaries': "Hunting, poaching, logging, land development.",
    'Can visitors access wildlife sanctuaries': "Yes, often through guided tours.",
    'Role of sanctuaries in conservation': "Provide safe habitats, support biodiversity, facilitate research.",
    'How do sanctuaries support biodiversity': "By preserving various habitats for diverse species.",
    'Largest wildlife sanctuary globally': "Northeast Greenland National Park.",
    'Establishment of wildlife sanctuaries': "Designated by governments through legislation.",
    'Significance of Arctic National Wildlife Refuge': "Largest U.S. wildlife refuge, crucial for Arctic conservation.",
    'How do sanctuaries aid endangered species': "Provide protected habitats for recovery.",
    'What is ecotourism': "Responsible travel to natural areas promoting conservation.",
    'Sanctuaries role in climate change mitigation': "Act as carbon sinks by preserving forests and wetlands.",
    'Challenges faced by sanctuaries': "Poaching, encroachment, invasive species, funding issues.",
    'Benefits of sanctuaries to local communities': "Employment, ecotourism, ecosystem services.",
    'What is habitat restoration': "Repairing degraded habitats to support wildlife.",
    'Sanctuaries contribution to research': "Offer environments for studying species and ecology.",
    'Educational role of sanctuaries': "Serve as outdoor classrooms on ecology and conservation.",
    'Funding sources for sanctuaries': "Government budgets, donations, tourism fees, grants.",
    'What is a marine wildlife sanctuary': "Protected ocean or sea area for marine conservation.",
    'Handling invasive species in sanctuaries': "Monitoring, removal programs, public awareness.",
    'Difference between sanctuary and refuge': "Terms often used interchangeably; slight contextual differences.",
    'Sanctuaries role in species rehabilitation': "Provide care until animals can return to the wild.",
    'Importance of community involvement': "Ensures sustainable conservation efforts.",
    'Example of a wildlife sanctuary in India': "Chinnar Wildlife Sanctuary in Kerala.",
    
    // Additional conservation and environmental terms
    'Wildlife conservation': "Protecting wild animals and their habitats.",
    'Biodiversity': "Variety of life on Earth, encompassing all species and ecosystems.",
    'Sustainability': "Using resources responsibly to ensure availability for future generations.",
    'Habitat': "Natural environment where an organism lives.",
    'Endangered species': "Species at risk of extinction.",
    'Poaching': "Illegal hunting of wildlife.",
    'Deforestation': "Clearing of forests for non-forest use.",
    'Climate change': "Long-term alterations in Earth's climate patterns.",
    'Renewable energy': "Energy from sources that naturally replenish, like solar or wind.",
    'Recycling': "Converting waste into reusable material.",
    'Carbon footprint': "Total greenhouse gases emitted by an individual or organization.",
    'Ecosystem': "Community of living organisms and their environment.",
    'Overfishing': "Catching too many fish, leading to population decline.",
    'Pollution': "Introduction of harmful substances into the environment.",
    'Wildlife corridor': "Natural route that allows animals to move between habitats.",
    'Reforestation': "Planting trees to restore forests.",
    'Invasive species': "Non-native species that harm the environment.",
    'Organic farming': "Agriculture without synthetic chemicals.",
    'Food chain': "Sequence of organisms each dependent on the next as a food source.",
    'Keystone species': "Species on which other species largely depend; its removal can affect the ecosystem.",
    'Sustainable development': "Development that meets current needs without compromising future generations.",
    'Carbon sink': "Natural reservoir that absorbs carbon dioxide, like forests.",
    'Ecotourism': "Responsible travel to natural areas that conserves the environment.",
    'Protected area': "Region designated for the conservation of nature.",
    'Wildlife sanctuary': "Protected area for the conservation of wildlife."
  };

  return wildlifeData[query] || "Sorry, I will learn.";
}

// Chat endpoint to process user input
app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body. Provide { userInput: "your text" }' });
    }

    console.log('📩 Incoming user message:', userInput);

    // Simple check if the input is about wildlife and respond accordingly
    const response = await fetchWildlifeSanctuaryInfo(userInput);

    res.json({ response });

  } catch (error) {
    console.error('❌ Error in chat:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
