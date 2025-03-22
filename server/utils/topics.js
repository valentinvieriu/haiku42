// Define categories and their elements
const categories = {
  urbanLife: [
    "city skyline", "street art", "bustling market", "neon signs", "café window",
    "urban park", "coffee shop", "skyscraper", "graffiti wall", "taxi ride",
    "rooftop view", "street musician", "bicycle lane", "food truck", "urban sunset",
    "pedestrian crossing", "street festival", "hidden alleyway", "bus stop", 
    "city garden", "street vendor", "city lights", "commuter train", "bridge crossing",
    "downtown rain", "subway station", "foggy street", "traffic lights", "bookstore corner",
    "outdoor dining", "night market", "public square", "museum steps", "morning rush",
    "evening stroll", "outdoor concert", "neighborhood park", "farmers market"
  ],
  
  technology: [
    "smartphone screen", "video call", "coding project", "digital art", 
    "wireless earbuds", "virtual meeting", "online gallery", "e-book reader",
    "smart home", "3D printing", "digital camera", "electric vehicle",
    "drone flight", "selfie moment", "app notification", "password forgotten",
    "software update", "battery dying", "social media post", "text message",
    "video streaming", "online shopping", "digital map", "web search",
    "voice assistant", "wireless charging", "digital calendar", "cloud storage",
    "online learning", "remote work", "virtual classroom", "video gaming"
  ],
  
  socialThemes: [
    "family gathering", "childhood friend", "online community", "social meetup",
    "shared memory", "distant relatives", "team collaboration", "mentor's advice",
    "cultural exchange", "generation gap", "social connection", "community service",
    "neighborhood watch", "public debate", "support network", "friendly rivalry",
    "group celebration", "shared journey", "morning commute", "daily ritual",
    "work deadline", "career change", "retirement party", "school reunion",
    "first interview", "last goodbye", "new friendship", "old promise",
    "mutual understanding", "shared silence", "unspoken agreement", "common ground"
  ],
  
  emotions: [
    "quiet joy", "lingering sorrow", "gentle longing", "brief worry",
    "sudden hope", "peaceful content", "unexpected delight", "moment of awe",
    "deep gratitude", "calm acceptance", "restless energy", "sweet nostalgia",
    "quiet pride", "nervous excitement", "shared laughter", "solitary tear",
    "warm comfort", "cool relief", "eager anticipation", "fleeting doubt",
    "growing confidence", "simple satisfaction", "heartfelt thanks", "silent grief",
    "tender memory", "profound respect", "patient waiting", "playful humor",
    "careful consideration", "joyful recognition", "unexpected courage", "quiet determination"
  ],
  
  modernLife: [
    "digital fatigue", "information overload", "screen reflection", "internet outage",
    "video buffering", "remote connection", "data backup", "password reset",
    "online shopping", "food delivery", "instant message", "social update",
    "trending topic", "viral photo", "news cycle", "podcast episode",
    "playlist shuffle", "email inbox", "digital receipt", "online review",
    "tech support", "software glitch", "system update", "filtered image",
    "targeted ad", "digital signature", "online reservation", "contact list",
    "virtual tour", "digital payment", "screen time", "low battery"
  ],
  
  naturalWorld: [
    "mountain path", "flowing river", "cherry blossoms", "morning dew",
    "setting sun", "gentle breeze", "crashing waves", "snow-capped peak",
    "hidden waterfall", "ancient oak", "starry sky", "fireflies dancing",
    "blooming wildflowers", "singing birds", "buzzing bees", "autumn leaves",
    "first snowfall", "spring rain", "summer heat", "winter frost",
    "forest clearing", "desert cactus", "prairie grass", "coastal rock",
    "morning fog", "evening shadow", "moonlit path", "fallen petals",
    "budding branch", "fading light", "rising tide", "rustling leaves",
    "sunlit meadow", "cloudy horizon", "rainbow arch", "misty morning",
    "sunrise glow", "sunset colors", "northern lights", "ocean depths"
  ],
  
  humanMoments: [
    "solitary walk", "shared meal", "chance meeting", "silent prayer",
    "child's laughter", "elder's wisdom", "artist's creation", "writer's pause",
    "teacher's guidance", "friend's embrace", "lover's touch", "family photo",
    "birthday candle", "graduation day", "wedding dance", "holiday tradition",
    "bedtime story", "morning coffee", "evening tea", "weekend escape",
    "homecoming smile", "farewell wave", "welcome hug", "travel journal",
    "cooking lesson", "garden harvest", "handwritten note", "photo album",
    "first dance", "last chapter", "quiet moment", "decisive step"
  ],
  
  sensoryDetails: [
    "scent of pine", "taste of tea", "sound of rain", "warmth of sunlight",
    "coolness of shade", "touch of silk", "smell of coffee", "whisper of wind",
    "crunch of leaves", "splash of water", "aroma of bread", "music fading",
    "candle flicker", "shadow play", "echo of footsteps", "distant thunder",
    "crackling fire", "soft blanket", "sweet honey", "bitter chocolate",
    "spicy pepper", "salty breeze", "smooth stone", "rough bark",
    "cold metal", "warm ceramic", "fresh linen", "damp moss",
    "crisp apple", "fresh mint", "lavender sachet", "cinnamon stick"
  ],
  
  reflection: [
    "fleeting thought", "childhood memory", "life lesson", "forgotten dream",
    "inner voice", "quiet insight", "deeper meaning", "simple truth",
    "passing time", "changing seasons", "growing older", "new beginning",
    "hidden purpose", "second chance", "missed opportunity", "future hope",
    "present moment", "mindful breath", "grateful heart", "curious mind",
    "patient waiting", "gentle acceptance", "letting go", "moving forward",
    "finding balance", "seeking peace", "embracing change", "honoring tradition",
    "questioning certainty", "celebrating diversity", "finding connection", "choosing kindness"
  ],
  
  seasonalMarkers: [
    "cherry blossoms", "summer cicada", "first snow", "harvest moon",
    "falling leaves", "winter solstice", "spring thaw", "summer solstice",
    "autumn equinox", "spring equinox", "migrating birds", "hibernating bear",
    "flower buds", "ripening fruit", "harvest festival", "winter coat",
    "spring cleaning", "summer vacation", "autumn colors", "winter silence",
    "melting snow", "April shower", "July heat", "October chill",
    "December frost", "February ice", "March wind", "May bloom",
    "June picnic", "August storm", "September harvest", "November fog"
  ],
  
  unexpected: [
    "sudden rain", "forgotten key", "lost letter", "surprise visitor",
    "misplaced phone", "power outage", "cancelled plans", "detour sign",
    "found treasure", "lucky penny", "wrong turn", "chance encounter",
    "delayed flight", "gift unplanned", "mystery package", "spontaneous trip",
    "street performer", "wildlife sighting", "meteor shower", "double rainbow",
    "breaking news", "store closing", "recipe mistake", "hidden message",
    "book falling", "photo discovered", "unknown caller", "familiar stranger"
  ],
  
  contemporaryTerms: [
    "digital nomad", "online meeting", "virtual event", "remote workplace",
    "social distancing", "video reunion", "screen sharing", "contactless payment",
    "trending hashtag", "streaming show", "playlist shuffle", "podcast episode",
    "email thread", "online learning", "virtual tour", "digital archive",
    "memory storage", "cloud backup", "online shopping", "food delivery",
    "ride sharing", "subscription service", "fitness tracker", "meditation app",
    "digital assistant", "voice command", "wireless headphones", "charging cable"
  ],
  
  balance: [
    "work and rest", "focus and release", "giving and taking", "speaking and listening",
    "action and patience", "planning and spontaneity", "creation and appreciation", 
    "connection and solitude", "tradition and innovation", "routine and novelty",
    "digital and analog", "urban and natural", "personal and shared", "local and global",
    "saving and spending", "learning and teaching", "remembering and forgetting",
    "holding on and letting go", "progress and tradition", "speed and stillness"
  ]
};

// Define category weights - adjusting to favor more traditional haiku elements
// while maintaining contemporary relevance
const categoryWeights = {
  naturalWorld: 5,      // Increased - core haiku element
  seasonalMarkers: 5,   // Increased - core haiku element
  sensoryDetails: 4,    // Increased - important for vivid imagery
  emotions: 4,          // Important for resonance
  humanMoments: 4,      // Relatable experiences
  urbanLife: 3,         // Modern setting but not overwhelming
  reflection: 3,        // Thoughtful element
  balance: 3,           // Creates harmony
  technology: 2,        // Contemporary but not dominant
  socialThemes: 2,      // Human connection
  modernLife: 2,        // Contemporary relevance
  unexpected: 2,        // Element of surprise
  contemporaryTerms: 1  // Used sparingly for modern touch
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

// Improved templates focused on creating more meaningful combinations
// Each template is designed to balance traditional haiku elements with contemporary themes
const templates = [
  // Nature-focused (traditional haiku foundation)
  "[rand(naturalWorld)] — [rand(seasonalMarkers)] arrives",
  "[rand(seasonalMarkers)] brings [rand(sensoryDetails)]",
  "[rand(naturalWorld)] and [rand(sensoryDetails)]",
  "Under [rand(seasonalMarkers)], [rand(naturalWorld)] waits",
  "[rand(sensoryDetails)] of [rand(naturalWorld)]",
  
  // Human experience in nature (traditional balance)
  "[rand(humanMoments)] beside [rand(naturalWorld)]",
  "[rand(emotions)] while watching [rand(seasonalMarkers)]",
  "[rand(sensoryDetails)] reminds of [rand(reflection)]",
  "[rand(unexpected)] during [rand(seasonalMarkers)]",
  "[rand(naturalWorld)] teaches [rand(reflection)]",
  
  // Urban nature (bridging traditional and modern)
  "[rand(urbanLife)] meets [rand(naturalWorld)]",
  "[rand(seasonalMarkers)] in [rand(urbanLife)]",
  "Between [rand(urbanLife)], [rand(naturalWorld)] thrives",
  "[rand(sensoryDetails)] amid [rand(urbanLife)]",
  "[rand(unexpected)] at [rand(urbanLife)] — [rand(emotions)]",
  
  // Technology and nature (modern contrast)
  "[rand(technology)] set aside for [rand(naturalWorld)]",
  "Away from [rand(technology)], finding [rand(naturalWorld)]",
  "[rand(naturalWorld)] reflected on [rand(technology)]",
  "[rand(sensoryDetails)] stronger than [rand(modernLife)]",
  "[rand(seasonalMarkers)] despite [rand(modernLife)]",
  
  // Human moments (emotional core)
  "[rand(humanMoments)] brings [rand(emotions)]",
  "[rand(emotions)] during [rand(humanMoments)]",
  "[rand(reflection)] after [rand(humanMoments)]",
  "[rand(unexpected)] changes [rand(humanMoments)]",
  "[rand(humanMoments)] — [rand(sensoryDetails)] lingers",
  
  // Balance and harmony (philosophical element)
  "Finding [rand(balance)] in [rand(naturalWorld)]",
  "[rand(balance)] through [rand(reflection)]",
  "[rand(emotions)] teaches [rand(balance)]",
  "Between [rand(modernLife)] and [rand(naturalWorld)], [rand(balance)]",
  "[rand(seasonalMarkers)] reminds of [rand(balance)]",
  
  // Contemporary life with traditional wisdom
  "[rand(contemporaryTerms)] paused for [rand(reflection)]",
  "From [rand(technology)] to [rand(naturalWorld)]",
  "[rand(modernLife)] simplified by [rand(reflection)]",
  "[rand(socialThemes)] beneath [rand(seasonalMarkers)]",
  "Despite [rand(modernLife)], [rand(sensoryDetails)] remains",
  
  // Sensory experiences (core haiku element)
  "[rand(sensoryDetails)] awakens [rand(emotions)]",
  "[rand(sensoryDetails)] of [rand(seasonalMarkers)]",
  "[rand(urbanLife)] — suddenly [rand(sensoryDetails)]",
  "[rand(unexpected)]: [rand(sensoryDetails)] follows",
  "[rand(sensoryDetails)] fades, [rand(reflection)] remains",
  
  // Seasonal awareness (essential haiku element)
  "First day of [rand(seasonalMarkers)]: [rand(emotions)]",
  "[rand(seasonalMarkers)] changes [rand(naturalWorld)]",
  "[rand(seasonalMarkers)] brings [rand(unexpected)]",
  "[rand(humanMoments)] during [rand(seasonalMarkers)]",
  "[rand(seasonalMarkers)] — time for [rand(reflection)]",
  
  // Moments of awareness
  "[rand(unexpected)] reveals [rand(reflection)]",
  "Through [rand(emotions)], seeing [rand(naturalWorld)] anew",
  "[rand(sensoryDetails)] brings moment of [rand(reflection)]",
  "In [rand(humanMoments)], discovering [rand(balance)]",
  "[rand(unexpected)] shifts [rand(emotions)]"
];

// Function to generate a random topic
function getRandomTopic() {
  const template = rand(templates);
  return template.replace(/\[rand\((\w+)\)\]/g, (match, category) => {
    return rand(categories[category]);
  });
}

export default getRandomTopic;
