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
    "sunlit meadow", "distant mountain", "rainbow arc", "misty morning"
  ],
  
  seasonalMarkers: [
    "cherry blossoms", "summer cicada", "first snow", "harvest moon",
    "falling leaves", "winter solstice", "spring thaw", "summer solstice",
    "autumn equinox", "spring equinox", "migrating birds", "hibernating bear",
    "plum blossoms", "early frost", "summer rain", "autumn wind",
    "winter silence", "spring thunder", "melting snow", "new shoots",
    "dragonfly season", "cricket song", "falling snow", "first thunderstorm",
    "last firefly", "lingering heat", "early darkness", "late sunrise",
    "short day", "long shadow", "thin ice", "budding trees"
  ],
  
  urbanLife: [
    "city skyline", "street lamp", "cafe window", "park bench", 
    "subway entrance", "rooftop garden", "bicycle path", "bridge crossing",
    "morning rush", "evening calm", "shop awning", "alley cat",
    "street vendor", "market stall", "neon sign", "rain puddle",
    "bookstore shelf", "museum quiet", "plaza fountain", "clock tower",
    "street musician", "window display", "sidewalk crack", "bus stop",
    "quiet library", "busy intersection", "empty theater", "corner store",
    "taxi passing", "food truck line", "construction site", "fire escape"
  ],
  
  sensoryDetails: [
    "scent of pine", "taste of tea", "sound of rain", "warmth of sun",
    "cool breeze", "rough bark", "smooth stone", "bitter herb",
    "sweet honey", "salty air", "whisper of leaves", "cricket chirp",
    "distant thunder", "shadow play", "morning light", "evening glow",
    "water droplet", "fading echo", "cold metal", "warm earth",
    "bird song", "wind chime", "crackling fire", "silent snow",
    "fragrant bloom", "tart berry", "soft moss", "sharp thorn",
    "steam rising", "ice melting", "dust settling", "fog lifting"
  ],
  
  humanMoments: [
    "solitary walk", "shared meal", "chance meeting", "silent prayer",
    "child's laughter", "elder's sigh", "artist's pause", "writer's thought",
    "gardener's hands", "traveler's rest", "fisherman's wait", "reader's smile",
    "morning ritual", "evening reflection", "brief greeting", "long goodbye",
    "first step", "last glance", "empty room", "full table",
    "open door", "closed window", "lost path", "found moment",
    "careful stitch", "gentle touch", "quiet breath", "sudden smile",
    "slow walk", "quick decision", "patient wait", "hurried step"
  ],
  
  emotions: [
    "quiet joy", "gentle sadness", "brief wonder", "calm acceptance",
    "sudden hope", "patient waiting", "deep longing", "simple pleasure",
    "old sorrow", "new delight", "familiar comfort", "strange excitement",
    "peaceful content", "restless thought", "grateful heart", "curious mind",
    "tender memory", "sharp realization", "sweet nostalgia", "quiet pride",
    "soft regret", "firm resolve", "light humor", "deep respect",
    "mild surprise", "steady calm", "fleeting worry", "lasting peace",
    "warm affection", "cool detachment", "bright enthusiasm", "soft melancholy"
  ],
  
  technology: [
    "phone screen", "keyboard tap", "camera click", "message sent",
    "screen glow", "battery low", "wifi signal", "video call",
    "email ping", "update notice", "power button", "loading circle",
    "digital clock", "smart speaker", "drone buzzing", "earbuds in",
    "forgotten password", "broken link", "saved photo", "deleted text",
    "silent mode", "airplane mode", "voice command", "missed call",
    "app icon", "search result", "online map", "digital memory",
    "virtual meeting", "distant friend", "shared file", "digital art"
  ],
  
  modernLife: [
    "digital fatigue", "quick coffee", "packed schedule", "quiet notification",
    "deadline looming", "brief pause", "too many tabs", "forgotten task",
    "social distance", "virtual gathering", "remote work", "crowded inbox",
    "delivery waiting", "online queue", "streaming show", "instant message",
    "news overload", "information flow", "planned obsolescence", "mindful moment",
    "urban garden", "local produce", "wellness check", "screen time",
    "digital detox", "slow living", "minimal design", "sustainable choice"
  ],
  
  haikuConcepts: [
    "impermanence", "simplicity", "naturalness", "seasonal awareness",
    "present moment", "empty space", "subtle beauty", "hidden meaning",
    "transience", "quiet mind", "direct experience", "ordinary wonder",
    "withering beauty", "fleeting moment", "gentle acceptance", "quiet observation",
    "wabi-sabi", "mono no aware", "yugen", "karumi",
    "nature's voice", "seasonal shift", "fleeting life", "eternal cycle",
    "simple truth", "profound ordinary", "between worlds", "just this"
  ],
  
  transitions: [
    "suddenly", "gradually", "momentarily", "silently",
    "unexpectedly", "finally", "briefly", "slowly",
    "in contrast", "meanwhile", "afterwards", "beforehand",
    "just then", "at that moment", "all at once", "little by little",
    "from afar", "up close", "inside", "outside",
    "above", "below", "between", "beyond",
    "yet", "still", "again", "once more",
    "not yet", "already", "almost", "barely"
  ],
  
  unexpected: [
    "sudden rain", "falling leaf", "broken twig", "last train",
    "forgotten key", "found coin", "lost glove", "wrong turn",
    "power outage", "cancelled plan", "surprise gift", "chance meeting",
    "dropped cup", "spilled ink", "torn page", "knocked door",
    "stray cat", "wild deer", "lone cloud", "shooting star",
    "fallen nest", "hidden path", "old letter", "new sprout",
    "bird on wire", "fish jumping", "frog leaping", "butterfly landing",
    "first snowflake", "last firefly", "single raindrop", "lone footprint"
  ],
  
  connection: [
    "old friends", "new neighbors", "family meal", "shared silence",
    "brief encounter", "long distance", "written letter", "spoken word",
    "helping hand", "gentle guidance", "mutual understanding", "common ground",
    "divided opinion", "reconciled view", "missed connection", "renewed bond",
    "teacher student", "parent child", "strangers meeting", "partners working",
    "group effort", "solo journey", "team success", "personal victory",
    "public space", "private moment", "cultural exchange", "language barrier",
    "global concern", "local action", "universal truth", "personal insight"
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
  connection: 2,        // Relational aspect
  technology: 2,        // Modern relevance
  modernLife: 2         // Contemporary concerns
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
  "[rand(unexpected)] changes [rand(emotions)]"
];

// Function to generate a random topic
function getRandomTopic() {
  const template = rand(templates);
  return template.replace(/\[rand\((\w+)\)\]/g, (match, category) => {
    return rand(categories[category]);
  });
}

export default getRandomTopic;
