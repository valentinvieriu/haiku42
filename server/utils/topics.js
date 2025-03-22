// Define categories and their elements
const categories = {
  naturalWorld: [
    "mountain path", "flowing river", "cherry blossoms", "morning dew",
    "setting sun", "gentle breeze", "crashing waves", "snow-capped peak",
    "hidden waterfall", "ancient oak", "starry sky", "fireflies dancing",
    "blooming wildflowers", "singing birds", "buzzing bees", "autumn leaves",
    "forest clearing", "desert cactus", "prairie grass", "coastal rock",
    "morning fog", "evening shadow", "moonlit path", "fallen petals", 
    "bamboo grove", "pine needles", "lotus flower", "frog pond",
    "willow branch", "moss garden", "pebble shore", "drifting cloud",
    "sunlit meadow", "distant mountain", "rainbow arc", "misty morning",
    "ocean depth", "desert bloom", "glacial melt", "forest canopy",
    "coral reef", "volcanic steam", "lightning flash", "canyon echo",
    "melting glacier", "urban wildlife", "nature preserve", "pollinator garden",
    "rewilded space", "endangered habitat", "resilient ecosystem", "microplastic shore"
  ],
  
  seasonalMarkers: [
    "cherry blossoms", "summer cicada", "first snow", "harvest moon",
    "falling leaves", "winter solstice", "spring thaw", "summer solstice",
    "autumn equinox", "spring equinox", "migrating birds", "hibernating bear",
    "plum blossoms", "early frost", "summer rain", "autumn wind",
    "winter silence", "spring thunder", "melting snow", "new shoots",
    "dragonfly season", "cricket song", "falling snow", "first thunderstorm",
    "last firefly", "lingering heat", "early darkness", "late sunrise",
    "short day", "long shadow", "thin ice", "budding trees",
    "unseasonable heat", "record rainfall", "extended drought", "early bloom",
    "delayed frost", "shifting migrations", "storm season", "pollen alert",
    "fire season", "air quality day", "extreme weather", "climate anomaly"
  ],
  
  urbanLife: [
    "city skyline", "street lamp", "cafe window", "park bench", 
    "subway entrance", "rooftop garden", "bicycle path", "bridge crossing",
    "morning rush", "evening calm", "shop awning", "alley cat",
    "street vendor", "market stall", "neon sign", "rain puddle",
    "bookstore shelf", "museum quiet", "plaza fountain", "clock tower",
    "street musician", "window display", "sidewalk crack", "bus stop",
    "quiet library", "busy intersection", "empty theater", "corner store",
    "taxi passing", "food truck line", "construction site", "fire escape",
    "food truck", "graffiti wall", "hipster cafe", "farmers market",
    "urban beehive", "community garden", "popup shop", "electric scooter",
    "rideshare waiting", "masked shopper", "security camera", "protest sign",
    "vacant storefront", "bike lane", "public artwork", "charging station"
  ],
  
  sensoryDetails: [
    "scent of pine", "taste of tea", "sound of rain", "warmth of sun",
    "cool breeze", "rough bark", "smooth stone", "bitter herb",
    "sweet honey", "salty air", "whisper of leaves", "cricket chirp",
    "distant thunder", "shadow play", "morning light", "evening glow",
    "water droplet", "fading echo", "cold metal", "warm earth",
    "bird song", "wind chime", "crackling fire", "silent snow",
    "fragrant bloom", "tart berry", "soft moss", "sharp thorn",
    "steam rising", "ice melting", "dust settling", "fog lifting",
    "hand sanitizer scent", "fluorescent hum", "touchscreen texture", "artificial sweetness",
    "synthetic fabric", "noise-cancelling silence", "umami taste", "blue light glow",
    "viral melody", "distant siren", "masked breath", "ultraviolet glow"
  ],
  
  humanMoments: [
    "solitary walk", "shared meal", "chance meeting", "silent prayer",
    "child's laughter", "elder's sigh", "artist's pause", "writer's thought",
    "gardener's hands", "traveler's rest", "fisherman's wait", "reader's smile",
    "morning ritual", "evening reflection", "brief greeting", "long goodbye",
    "first step", "last glance", "empty room", "full table",
    "open door", "closed window", "lost path", "found moment",
    "careful stitch", "gentle touch", "quiet breath", "sudden smile",
    "slow walk", "quick decision", "patient wait", "hurried step",
    "vaccine appointment", "online celebration", "distant reunion", "identity questioning",
    "protest chant", "digital friendship", "social distance", "masked greeting",
    "virtual gathering", "mutual aid", "collective grief", "healthcare clap"
  ],
  
  emotions: [
    "quiet joy", "gentle sadness", "brief wonder", "calm acceptance",
    "sudden hope", "patient waiting", "deep longing", "simple pleasure",
    "old sorrow", "new delight", "familiar comfort", "strange excitement",
    "peaceful content", "restless thought", "grateful heart", "curious mind",
    "tender memory", "sharp realization", "sweet nostalgia", "quiet pride",
    "soft regret", "firm resolve", "light humor", "deep respect",
    "mild surprise", "steady calm", "fleeting worry", "lasting peace",
    "warm affection", "cool detachment", "bright enthusiasm", "soft melancholy",
    "digital anxiety", "climate grief", "zoom fatigue", "notification dread",
    "viral validation", "privacy concern", "technostress", "pandemic exhaustion",
    "overwhelmed silence", "virtual connection", "isolation comfort", "renewed appreciation"
  ],
  
  technology: [
    "phone screen", "keyboard tap", "camera click", "message sent",
    "screen glow", "battery low", "wifi signal", "video call",
    "email ping", "update notice", "power button", "loading circle",
    "digital clock", "smart speaker", "drone buzzing", "earbuds in",
    "forgotten password", "broken link", "saved photo", "deleted text",
    "silent mode", "airplane mode", "voice command", "missed call",
    "app icon", "search result", "online map", "digital memory",
    "virtual meeting", "distant friend", "shared file", "digital art",
    "AI suggestion", "algorithm feed", "crypto mining", "electric vehicle",
    "biometric scan", "solar panel", "smart garden", "wearable tech",
    "facial recognition", "vaccination QR code", "streaming buffer", "contact tracing",
    "data breach", "quantum computing", "neural network", "blockchain transaction",
    "predictive text", "virtual try-on", "deepfake video", "digital twin"
  ],
  
  modernLife: [
    "digital fatigue", "quick coffee", "packed schedule", "quiet notification",
    "deadline looming", "brief pause", "too many tabs", "forgotten task",
    "social distance", "virtual gathering", "remote work", "crowded inbox",
    "delivery waiting", "online queue", "streaming show", "instant message",
    "news overload", "information flow", "planned obsolescence", "mindful moment",
    "urban garden", "local produce", "wellness check", "screen time",
    "digital detox", "slow living", "minimal design", "sustainable choice",
    "climate anxiety", "work-life balance", "gig economy", "zero waste",
    "remote working", "cancel culture", "influencer post", "sustainable fashion",
    "vaccine passport", "misinformation spread", "carbon offset", "subscription fatigue",
    "trigger warning", "greenwashing", "virtual graduation", "essential worker",
    "crisis fatigue", "supply chain", "contactless payment", "algorithmic bias"
  ],
  
  haikuConcepts: [
    "impermanence", "simplicity", "naturalness", "seasonal awareness",
    "present moment", "empty space", "subtle beauty", "hidden meaning",
    "transience", "quiet mind", "direct experience", "ordinary wonder",
    "withering beauty", "fleeting moment", "gentle acceptance", "quiet observation",
    "wabi-sabi", "mono no aware", "yugen", "karumi",
    "nature's voice", "seasonal shift", "fleeting life", "eternal cycle",
    "simple truth", "profound ordinary", "between worlds", "just this",
    "sacred moment", "mindful presence", "silent wisdom", "embraced imperfection"
  ],
  
  transitions: [
    "suddenly", "gradually", "momentarily", "silently",
    "unexpectedly", "finally", "briefly", "slowly",
    "in contrast", "meanwhile", "afterwards", "beforehand",
    "just then", "at that moment", "all at once", "little by little",
    "from afar", "up close", "inside", "outside",
    "above", "below", "between", "beyond",
    "yet", "still", "again", "once more",
    "not yet", "already", "almost", "barely",
    "seamlessly", "abruptly", "intermittently", "simultaneously",
    "ultimately", "initially", "eventually", "immediately"
  ],
  
  unexpected: [
    "sudden rain", "falling leaf", "broken twig", "last train",
    "forgotten key", "found coin", "lost glove", "wrong turn",
    "power outage", "cancelled plan", "surprise gift", "chance meeting",
    "dropped cup", "spilled ink", "torn page", "knocked door",
    "stray cat", "wild deer", "lone cloud", "shooting star",
    "fallen nest", "hidden path", "old letter", "new sprout",
    "bird on wire", "fish jumping", "frog leaping", "butterfly landing",
    "first snowflake", "last firefly", "single raindrop", "lone footprint",
    "server crash", "viral post", "sudden lockdown", "unexpected alert",
    "system failure", "spontaneous protest", "algorithm change", "breaking news",
    "privacy breach", "unexpected kindness", "unanticipated beauty", "surprising connection"
  ],
  
  connection: [
    "old friends", "new neighbors", "family meal", "shared silence",
    "brief encounter", "long distance", "written letter", "spoken word",
    "helping hand", "gentle guidance", "mutual understanding", "common ground",
    "divided opinion", "reconciled view", "missed connection", "renewed bond",
    "teacher student", "parent child", "strangers meeting", "partners working",
    "group effort", "solo journey", "team success", "personal victory",
    "public space", "private moment", "cultural exchange", "language barrier",
    "global concern", "local action", "universal truth", "personal insight",
    "virtual team", "online dating", "contactless delivery", "distance learning",
    "telehealth visit", "cross-platform message", "comment section debate", "authentic engagement",
    "parasocial relationship", "community support", "digital solidarity", "global movement"
  ],
  
  climateChange: [
    "melting ice", "rising tide", "last glacier", "changing patterns",
    "drought field", "record heat", "extreme weather", "dying coral",
    "resilient seed", "adaptation", "renewable energy", "carbon footprint",
    "sustainable choice", "climate anxiety", "forest regrowth", "species migration",
    "ocean plastic", "climate march", "green solution", "weather shift",
    "conservation area", "endangered habitat", "restoration project", "climate hope",
    "ecosystem balance", "biodiversity loss", "climate justice", "adaptation strategy",
    "planetary boundary", "climate resilience", "habitat corridor", "regenerative practice",
    "climate refugee", "carbon neutral", "zero emission", "sixth extinction",
    "thawing permafrost", "acidic ocean", "wildfire smoke", "green infrastructure",
    "solastalgia", "climate activism", "extinction grief", "drought resilience"
  ],
  
  digitalLife: [
    "virtual meeting", "online friends", "digital sunset", "screen reflection",
    "password forgotten", "notification silence", "digital detox", "viral moment",
    "virtual reality", "data stream", "cloud storage", "privacy settings",
    "algorithm choice", "digital footprint", "screen fatigue", "online community",
    "virtual garden", "digital creation", "video memory", "endless scroll",
    "offline moment", "connection lost", "browser history", "digital identity",
    "social media pause", "information overload", "bookmark saved", "digital minimalism",
    "shared document", "virtual background", "avatar smile", "digital nostalgia",
    "doom scrolling", "digital wellbeing", "online harassment", "filter bubble",
    "platform migration", "digital legacy", "content moderation", "echo chamber",
    "NFT artwork", "metaverse meeting", "augmented reality", "digital citizenship"
  ],
  
  mindfulness: [
    "breath focus", "present moment", "mindful step", "meditation cushion",
    "attention return", "conscious choice", "body scan", "thought noting",
    "gentle awareness", "mind wandering", "returning focus", "open awareness",
    "compassion practice", "loving-kindness", "walking meditation", "eating mindfully",
    "sensory awareness", "emotional weather", "beginner's mind", "thought passing",
    "inner silence", "outer noise", "between breaths", "body listening",
    "mental noting", "gentle attention", "judgment suspended", "acceptance practice",
    "impermanence awareness", "gratitude moment", "embodied presence", "now only",
    "digital sabbath", "screen time limit", "attention economy", "context switching",
    "deep work session", "pomodoro timer", "habit stacking", "intention setting",
    "distraction audit", "mindful technology", "conscious consumption", "somatic awareness"
  ],
  
  globalIssues: [
    "refugee crisis", "pandemic response", "vaccine inequality", "food insecurity",
    "water scarcity", "information warfare", "border crossing", "wealth disparity",
    "democratic erosion", "surveillance state", "supply chain", "resource conflict",
    "disinformation", "cyber attack", "authoritarianism", "civil unrest",
    "public health", "economic migration", "cultural preservation", "media literacy",
    "truth decay", "algorithmic bias", "social polarization", "mass automation",
    "data sovereignty", "digital divide", "identity politics", "genetic modification",
    "space militarization", "mass surveillance", "artificial intelligence", "autonomous systems",
    "vaccine diplomacy", "climate migration", "social justice", "fake news",
    "global solidarity", "post-truth era", "misinformation spread", "human rights"
  ],
  
  identityAndSelf: [
    "cultural appropriation", "gender fluidity", "intersectionality", "body neutrality",
    "self-discovery", "ancestral connection", "neurodiversity", "hidden disability",
    "cultural heritage", "authentic expression", "multiple belongings", "diaspora experience",
    "code switching", "reclaimed label", "lost tradition", "indigenous wisdom",
    "erasure resistance", "spiritual seeking", "identity fusion", "liminal space",
    "cultural renaissance", "collective memory", "intergenerational trauma", "sacred practice",
    "cultural preservation", "embodied knowledge", "decolonial thinking", "radical acceptance",
    "sensory processing", "personal mythology", "social construction", "belonging search",
    "digital identity", "chosen family", "pronoun introduction", "cultural reclamation",
    "representation matters", "multiracial experience", "embodied autonomy", "transformative justice"
  ],
  
  artAndCreativity: [
    "blank canvas", "digital collage", "collaborative art", "creative block",
    "found poetry", "public mural", "sound installation", "performance piece",
    "immersive exhibit", "glitch aesthetic", "folk revival", "remix culture",
    "generative design", "analog resurgence", "art therapy", "creative commons",
    "protest song", "viral dance", "cultural fusion", "ephemeral art",
    "virtual gallery", "independent creator", "AI collaboration", "sensory exhibition",
    "participatory theater", "podcasting voice", "data visualization", "streaming premiere",
    "creator economy", "spatial audio", "digital sculpting", "algorithmic art",
    "NFT artwork", "augmented reality", "interactive installation", "user-generated content",
    "guerrilla projection", "open source creation", "bioart", "climate art"
  ],
  
  foodAndCuisine: [
    "farmers market", "plant-based meal", "food sovereignty", "fermentation jar",
    "urban harvest", "seed saving", "forgotten recipe", "fusion flavor",
    "heirloom variety", "local sourcing", "culinary memory", "food desert",
    "shared table", "meal delivery", "ghost kitchen", "food appropriation",
    "food waste", "regenerative farm", "dietary restriction", "carbon footprint",
    "ancestral ingredient", "vertical garden", "food security", "community fridge",
    "flavor profile", "artisanal technique", "kitchen therapy", "mindful eating",
    "seasonal bounty", "food tradition", "culinary diplomacy", "comfort food",
    "sustainable fishing", "foraging expedition", "zero-waste kitchen", "cultured meat",
    "food justice", "indigenous cuisine", "slow food", "indoor growing"
  ],
  
  workAndEconomy: [
    "remote meeting", "digital nomad", "gig economy", "automation fear",
    "essential worker", "universal income", "hustle culture", "career pivot",
    "burnout recovery", "office return", "skill obsolescence", "portfolio career",
    "four-day week", "side hustle", "workspace pod", "workplace surveillance",
    "labor organizer", "late capitalism", "purpose economy", "passion project",
    "quiet quitting", "creator economy", "workplace wellness", "algorithmic management",
    "professional boundaries", "project collaboration", "productivity tracking", "coworking space",
    "hybrid schedule", "income inequality", "job displacement", "ethical consumption",
    "remote onboarding", "work-life integration", "micromanagement", "economic precarity",
    "platform cooperativism", "benefit corporation", "collective bargaining", "great resignation"
  ]
};

// Define category weights for balanced selection
const categoryWeights = {
  naturalWorld: 6,      // Core traditional element
  seasonalMarkers: 6,   // Essential seasonal reference (kigo)
  sensoryDetails: 5,    // Vital for vivid imagery
  humanMoments: 4,      // Human connection element
  emotions: 4,          // Emotional resonance
  haikuConcepts: 3,     // Philosophical depth
  transitions: 3,       // Movement within haiku
  urbanLife: 3,         // Modern setting
  unexpected: 3,        // Element of surprise
  connection: 3,        // Relational aspect
  technology: 3,        // Modern relevance
  modernLife: 3,        // Contemporary concerns
  climateChange: 3,     // Environmental concern
  digitalLife: 3,       // Digital life element
  mindfulness: 3,       // Mindfulness element
  globalIssues: 2,      // New global challenges element
  identityAndSelf: 2,   // New identity and self element
  artAndCreativity: 2,  // New creativity element
  foodAndCuisine: 2,    // New food and cuisine element
  workAndEconomy: 2     // New work patterns element
};

// Weighted random selection function
function weightedRand(weights) {
  const entries = Object.entries(weights);
  const totalWeight = entries.reduce((sum, [_, weight]) => sum + weight, 0);
  let randomNum = Math.random() * totalWeight;
  for (const [category, weight] of entries) {
    if (randomNum < weight) {
      return category;
    }
    randomNum -= weight;
  }
  // Default return in case of rounding errors
  return entries[entries.length - 1][0];
}

// Function to decide inclusion based on probability
const includeProperty = (probability) => Math.random() < probability;

// Random selection from an array
function rand(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Improved templates focused on effective haiku juxtapositions
const templates = [
  // Traditional nature focus (core haiku foundation)
  "[rand(naturalWorld)] — [rand(seasonalMarkers)]",
  "[rand(seasonalMarkers)] brings [rand(sensoryDetails)]",
  "[rand(naturalWorld)] and [rand(sensoryDetails)]",
  "[rand(sensoryDetails)] of [rand(naturalWorld)]",
  "[rand(seasonalMarkers)]: [rand(naturalWorld)] [rand(transitions)]",
  
  // Nature and emotion (traditional pairing)
  "[rand(naturalWorld)] — [rand(emotions)] rises",
  "[rand(sensoryDetails)] evokes [rand(emotions)]",
  "[rand(emotions)] while watching [rand(seasonalMarkers)]",
  "[rand(seasonalMarkers)] — [rand(emotions)] deepens",
  "[rand(naturalWorld)] mirrors [rand(emotions)]",
  
  // Human experience in nature (traditional balance)
  "[rand(humanMoments)] beside [rand(naturalWorld)]",
  "[rand(humanMoments)] under [rand(seasonalMarkers)]",
  "[rand(naturalWorld)] witnesses [rand(humanMoments)]",
  "[rand(sensoryDetails)] during [rand(humanMoments)]",
  "[rand(seasonalMarkers)] — time for [rand(humanMoments)]",
  
  // Haiku philosophy (depth dimension)
  "[rand(naturalWorld)] teaches [rand(haikuConcepts)]",
  "[rand(seasonalMarkers)] reveals [rand(haikuConcepts)]",
  "[rand(haikuConcepts)] in [rand(sensoryDetails)]",
  "[rand(humanMoments)] — [rand(haikuConcepts)] embodied",
  "[rand(emotions)] and [rand(haikuConcepts)]",
  
  // Transition and contrast (movement)
  "[rand(naturalWorld)] [rand(transitions)] [rand(unexpected)]",
  "[rand(transitions)] from [rand(sensoryDetails)] to [rand(emotions)]",
  "[rand(emotions)] [rand(transitions)] to [rand(haikuConcepts)]",
  "[rand(humanMoments)] [rand(transitions)] [rand(naturalWorld)]",
  "[rand(unexpected)] [rand(transitions)] [rand(seasonalMarkers)]",
  
  // Urban nature (bridging traditional and modern)
  "[rand(urbanLife)] meets [rand(naturalWorld)]",
  "[rand(seasonalMarkers)] in [rand(urbanLife)]",
  "Between [rand(urbanLife)], [rand(naturalWorld)]",
  "[rand(sensoryDetails)] amid [rand(urbanLife)]",
  "[rand(unexpected)] at [rand(urbanLife)] — [rand(emotions)]",
  
  // Technology and nature (modern contrast)
  "[rand(technology)] set aside for [rand(naturalWorld)]",
  "Beyond [rand(technology)], [rand(seasonalMarkers)]",
  "[rand(naturalWorld)] reflected on [rand(technology)]",
  "[rand(sensoryDetails)] stronger than [rand(modernLife)]",
  "[rand(technology)] forgotten in [rand(seasonalMarkers)]",
  
  // Connection themes (relationship dimension)
  "[rand(connection)] sharing [rand(naturalWorld)]",
  "[rand(connection)] during [rand(seasonalMarkers)]",
  "[rand(sensoryDetails)] brings [rand(connection)]",
  "[rand(connection)] finding [rand(haikuConcepts)]",
  "[rand(emotions)] between [rand(connection)]",
  
  // Surprise elements (unexpectedness)
  "[rand(unexpected)] reveals [rand(naturalWorld)]",
  "[rand(seasonalMarkers)] brings [rand(unexpected)]",
  "[rand(unexpected)]: [rand(sensoryDetails)] follows",
  "[rand(humanMoments)] interrupted by [rand(unexpected)]",
  "[rand(unexpected)] changes [rand(emotions)]",
  
  // Digital/physical contrasts
  "[rand(technology)] off — [rand(naturalWorld)] noticed",
  "[rand(digitalLife)] versus [rand(naturalWorld)]",
  "Between [rand(technology)] and [rand(sensoryDetails)]",
  "[rand(digitalLife)] paused for [rand(mindfulness)]",
  "[rand(mindfulness)] despite [rand(technology)]",
  
  // Climate awareness
  "[rand(climateChange)] where [rand(seasonalMarkers)] once predictable",
  "[rand(naturalWorld)] amidst [rand(climateChange)]",
  "[rand(climateChange)] — still [rand(haikuConcepts)] remains",
  "[rand(emotions)] watching [rand(climateChange)]",
  "[rand(climateChange)] meets [rand(artAndCreativity)]",
  
  // Mindfulness in modern world
  "[rand(mindfulness)] during [rand(modernLife)]",
  "[rand(urbanLife)] — moment for [rand(mindfulness)]",
  "[rand(mindfulness)] despite [rand(technology)]",
  "[rand(sensoryDetails)] anchors [rand(mindfulness)]",
  "[rand(mindfulness)] practice amid [rand(globalIssues)]",
  
  // Identity and culture
  "[rand(identityAndSelf)] reflected in [rand(naturalWorld)]",
  "[rand(identityAndSelf)] through [rand(seasonalMarkers)]",
  "[rand(emotions)] about [rand(identityAndSelf)]",
  "[rand(identityAndSelf)] explored through [rand(artAndCreativity)]",
  "[rand(identityAndSelf)] within [rand(connection)]",
  
  // Food and sustenance
  "[rand(foodAndCuisine)] in [rand(seasonalMarkers)]",
  "[rand(foodAndCuisine)] connects [rand(connection)]",
  "[rand(sensoryDetails)] of [rand(foodAndCuisine)]",
  "[rand(foodAndCuisine)] tradition meets [rand(modernLife)]",
  "[rand(foodAndCuisine)] reflects [rand(climateChange)]",
  
  // Work and economy
  "[rand(workAndEconomy)] versus [rand(naturalWorld)]",
  "[rand(workAndEconomy)] needs [rand(mindfulness)]",
  "[rand(emotions)] about [rand(workAndEconomy)]",
  "[rand(workAndEconomy)] amid [rand(globalIssues)]",
  "[rand(workAndEconomy)] changes with [rand(seasonalMarkers)]",
  
  // Global challenges
  "[rand(globalIssues)] affecting [rand(naturalWorld)]",
  "[rand(emotions)] toward [rand(globalIssues)]",
  "[rand(globalIssues)] through [rand(sensoryDetails)]",
  "[rand(mindfulness)] amid [rand(globalIssues)]",
  "[rand(connection)] despite [rand(globalIssues)]",
  
  // Art and expression
  "[rand(artAndCreativity)] inspired by [rand(naturalWorld)]",
  "[rand(artAndCreativity)] captures [rand(emotions)]",
  "[rand(sensoryDetails)] in [rand(artAndCreativity)]",
  "[rand(artAndCreativity)] reflects [rand(climateChange)]",
  "[rand(digitalLife)] enables [rand(artAndCreativity)]",
  
  // Cultural commentary
  "[rand(modernLife)] yet [rand(haikuConcepts)] endures",
  "[rand(urbanLife)] reveals [rand(emotions)]",
  "[rand(technology)] era — [rand(connection)] changed",
  "[rand(unexpected)] in [rand(modernLife)]",
  "[rand(globalIssues)] through [rand(haikuConcepts)] lens",
  
  // Multiple elements (complex topics)
  "[rand(naturalWorld)], [rand(technology)], [rand(emotions)]",
  "[rand(seasonalMarkers)] meets [rand(digitalLife)] and [rand(mindfulness)]",
  "[rand(urbanLife)] between [rand(climateChange)] and [rand(haikuConcepts)]",
  "[rand(sensoryDetails)] of [rand(naturalWorld)] through [rand(technology)]",
  "[rand(globalIssues)], [rand(identityAndSelf)], [rand(naturalWorld)]"
];

// Function to generate a random topic with occasionally complex structure
function getRandomTopic() {
  // Occasionally create a compound/complex topic
  if (Math.random() < 0.15) {
    const template1 = rand(templates);
    const template2 = rand(templates);
    return template1.replace(/\[rand\((\w+)\)\]/g, (match, category) => {
      return rand(categories[category]);
    }) + " | " + template2.replace(/\[rand\((\w+)\)\]/g, (match, category) => {
      return rand(categories[category]);
    });
  }
  
  // Standard topic generation
  const template = rand(templates);
  return template.replace(/\[rand\((\w+)\)\]/g, (match, category) => {
    return rand(categories[category]);
  });
}

export default getRandomTopic;