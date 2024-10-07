const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Define categories and their elements
const categories = {
  urbanLife: [
    'city skyline', 'street art', 'bustling market', 'neon signs', 'subway ride',
    'crowded sidewalk', 'urban park', 'coffee shop chatter', 'skyscraper reflection',
    'graffiti wall', 'taxi ride', 'nightlife', 'rooftop view', 'traffic jam',
    'street musician', 'shopping mall', 'bicycle lane', 'food truck', 'urban sunset',
    'construction site', 'pedestrian crossing', 'street festival', 'hidden alleyway',
    'bus stop', 'high-rise balcony', 'urban wildlife', 'street vendor', 'city lights',
    'urban garden', 'abandoned building', 'digital billboard', 'commuter rush',
    'urban decay', 'gentrified neighborhood', 'pop-up shop', 'street performance',
    'tech startup', 'urban oasis', 'city library', 'food court', 'urban explorer',
    'hipster café', 'night market', 'public square', 'street protest', 'urban renewal',
  ],
  technology: [
    'smartphone glow', 'virtual meeting', 'coding marathon', 'social media scroll',
    'drone delivery', 'AI assistant', 'cryptocurrency trade', 'VR experience',
    'self-driving car', 'tech conference', 'online shopping', 'digital art',
    'wearable tech', 'cybersecurity breach', 'remote work', 'eSports tournament',
    'cloud computing', 'smart home', '3D printing', 'streaming binge',
    'electric vehicle', 'tech startup', 'digital detox', 'online dating',
    'coding bootcamp', 'tech innovation', 'data analytics', 'machine learning',
    'quantum computing', 'blockchain', 'gaming marathon', 'app development',
    'virtual reality', 'augmented reality', 'biohacking', 'space exploration',
    'smart city', 'tech disruption', 'digital currency', 'tech entrepreneurship',
    'algorithmic art', 'smartwatch', 'online learning', 'telehealth',
    'internet of things', 'big data', 'artificial intelligence', 'robotics',
    'drone photography', 'e-book reader', 'smartwatch ping', 'algorithm blues',
    'cryptic code', 'social media blackout',
  ],
  socialDynamics: [
    'social media influencer', 'viral trend', 'online community', 'hashtag activism',
    'digital nomad', 'crowdfunding campaign', 'co-working space', 'gig economy',
    'remote collaboration', 'online challenge', 'virtual friendship', 'dating app match',
    'online troll', 'influencer marketing', 'meme culture', 'internet celebrity',
    'online debate', 'live streaming', 'viral video', 'podcast series',
    'virtual event', 'community garden', 'urban farming', 'pop culture reference',
    'online petition', 'crowdsourced project', 'digital footprint', 'networking event',
    'social networking', 'virtual book club', 'online course', 'digital detox',
    'remote team building', 'online auction', 'e-commerce boom', 'shared economy',
    'virtual hangout', 'online marketplace', 'influencer collaboration', 'remote mentoring',
    'cyberbullying awareness', 'digital inclusion', 'net neutrality', 'online support group',
    'virtual museum tour', 'streaming concert', 'e-sports event', 'virtual classroom',
    'online workshop', 'internet activism', 'social justice campaign', 'tech startup culture',
    'online therapy', 'digital privacy', 'remote fitness class', 'virtual book launch',
    'cancel culture', 'hashtag movement', 'digital activism', 'filter bubbles',
  ],
  modernEmotions: [
    'digital fatigue', 'virtual intimacy', 'tech anxiety', 'screen addiction',
    'online empathy', 'cyber loneliness', 'remote connection', 'algorithmic bias',
    'data overwhelm', 'tech optimism', 'digital liberation', 'virtual nostalgia',
    'screen time guilt', 'cyber friendship', 'online vulnerability', 'digital empathy',
    'tech frustration', 'remote bonding', 'virtual mindfulness', 'screen escapism',
    'data dependency', 'algorithmic comfort', 'digital distraction', 'cyber joy',
    'online compassion', 'tech excitement', 'remote harmony', 'virtual presence',
    'screen tranquility', 'data security', 'algorithmic trust', 'digital creativity',
    'cyber resilience', 'online solidarity', 'tech wonder', 'remote wellness',
    'virtual serenity', 'screen contentment', 'data enlightenment', 'algorithmic clarity',
    'digital freedom', 'cyber awareness',
  ],
  surrealElements: [
    'digital reflection', 'neon glow', 'virtual whispers', 'pixelated dreams',
    'algorithmic echoes', 'data streams', 'electric hum', 'code whispers',
    'binary heartbeat', 'silicon soul', 'cybernetic dreams', 'AI awakening',
    'quantum entanglement', 'cosmic glitch', 'parallel reality', 'time loop',
    'memory fragment', 'lost in the cloud', 'digital afterlife', 'technological transcendence',
    'virtual horizon', 'glowing holograms', 'simulated worlds', 'cybernetic echoes',
    'code symphony', 'virtual gardens', 'digital dawn', 'silicon valleys',
    'neon twilight', 'virtual silence', 'algorithmic flow', 'holographic touch',
    'quantum whispers', 'glitch in reality', 'virtual labyrinth', 'neon skyline',
    'cyberspace journey', 'holographic dreams', 'digital sunset', 'AI muse',
    'data cascade', 'neural networks', 'virtual odyssey', 'augmented reality',
    'digital avatar', 'virtual persona', 'holographic presence', 'cyberpunk city',
    'neo-tokyo nights', 'dystopian future', 'post-apocalyptic dawn', 'transhuman evolution',
    "singularity's edge", 'artificial consciousness', 'robotic zen', "android's lament",
    "cyborg's quest", 'digital reincarnation', 'virtual nirvana', "matrix's illusion",
    "simulation's end", 'quantum leap', "multiverse's dance", 'space-time fold',
    'dimensional rift', 'temporal anomaly', "reality's glitch", 'holographic universe',
    'fractal consciousness', 'infinite regression', 'recursive dream', 'strange loop',
    'self-referential paradox', 'meta-awareness', 'transcendent algorithm', 'emergent complexity',
    'chaotic beauty', 'order from chaos', 'pattern in noise', 'signal in static',
    'meaning in randomness', 'purpose in absurdity', 'unity in diversity', 'interconnected web',
    'cosmic network', 'universal mind', 'collective unconscious', 'akashic records',
    'noospheric library', 'holographic akasha', 'quantum akashic field', "meme's fleeting fame",
    "emoji's cryptic smile", "notification's gentle buzz", "algorithm's unseen hand",
    "infinite scroll's abyss", "dopamine hit's brief joy", "virtual influencer's curated life",
    "filter bubble's distorted view", "dark web's hidden secrets", "social media's echo chamber",
    "cyberbullying's venomous sting", "viral video's fleeting fame", "deepfake's uncanny valley",
    "AI-generated art's unsettling beauty", "blockchain's immutable ledger", "surveillance state's watchful eye",
    "biohacking's promise and peril", "gene editing's ethical dilemmas", "climate change's looming shadow",
    "extinction's silent threat", "post-truth era's shifting sands", "fake news's deceptive allure",
    "conspiracy theory's tangled web", "surveillance capitalism's data harvest", "technocracy's seductive power",
    "dystopia's flickering neon", "utopia's elusive promise", 'glitch in the feed',
    'pixels unraveling', 'virtual void',
  ],
  surprise: [
    'unexpected rain', 'forgotten melody', 'childhood toy', 'midnight snack',
    'lost key', 'old photograph', 'surprise encounter', 'hidden message',
    'whimsical thought', 'random act of kindness', 'chance meeting', 'mysterious letter',
    'unplanned journey', 'accidental discovery', 'fleeting moment', 'serendipitous event',
    'spontaneous dance', 'sudden laughter', 'forgotten word', 'unseen presence',
  ],
  naturalWorld: [
    'moonlit pond', 'whispering bamboo', 'autumn leaves', 'mountain path',
    'flowing river', 'blooming cherry blossoms', 'chirping crickets', 'morning dew',
    'setting sun', 'gentle breeze', 'crashing waves', 'snow-capped peak',
    'hidden waterfall', 'ancient oak tree', 'starry night sky', 'fireflies dancing',
    'blooming wildflowers', 'singing birds', 'buzzing bees', 'rippling stream',
    'sun-drenched meadow', 'misty forest path', 'rocky coastline', 'desert oasis',
    'hidden cave', 'winding path', 'moonlit garden', 'fallen petals',
    'first snowfall', 'frozen lake', 'thawing ice', 'spring rain',
    'summer thunderstorm', 'autumn harvest', 'winter silence', 'echoing canyons',
    'glacial melt', 'whispering pines', 'emerald lake', 'golden sand dunes',
    'radiant sunrise', 'crimson sunset', 'verdant hills', 'rustling grasses',
    'rolling fog', 'twinkling stars', 'hazy twilight', 'verdant meadow',
    'volcanic eruption', "rainbow's arc", 'drifting clouds', 'shimmering stars',
    'lunar eclipse', 'solar flare', 'cosmic dust', 'galactic dance',
    'meteor shower', "comet's tail", 'northern lights', 'bioluminescent sea',
    'coral reef', 'deep ocean trench', 'tidal pool', 'mangrove forest',
    'tropical rainforest', 'savanna grasslands', 'arctic tundra', 'alpine meadow',
    'cactus bloom', 'monsoon rains', "hurricane's eye", "tornado's fury",
    'lightning strike', "wildfire's blaze", "drought's thirst", "flood's rage",
    "earthquake's tremor", "tsunami's surge", 'sunbeam through leaves', "dewdrop's prism",
    "spider's silken thread", "river's murmuring song", "pebble's smooth touch", "butterfly's fragile wings",
    "moon's silvery glow", "cloud's fluffy dance", "ocean's vast expanse", "mountain's silent strength",
    "desert's arid kiss", "forest's emerald embrace", "grasshopper's nimble leap", "owl's silent flight",
    "starfish's delicate form", "seashell's whispered secrets", "stone's weathered face", "mushroom's earthy scent",
    "feather's gentle drift", "riverbank's muddy scent", "ant's diligent march", "earthworm's humble toil",
    "rock pool's teeming life", "moss's velvety touch", "lichen's colorful patterns", "tree root's gnarled grasp",
    "bird nest's cozy warmth", "fish's shimmering scales", "crab's sideways scurry", "wave's rhythmic crash",
    "thunder's booming voice", "lightning's jagged dance", "rain's cleansing touch", "snowflake's unique design",
    "frost's icy grip", "wind's playful caress", "sun's warming rays", "moon's guiding light",
    "star's distant twinkle",
  ],
  humanExperience: [
    'solitary traveler', 'shared laughter', 'fleeting dream', 'silent contemplation',
    'unexpected encounter', "child's curiosity", "old man's wisdom", "artist's brushstroke",
    "lover's touch", "mother's embrace", "warrior's resolve", "farmer's toil",
    "dancer's grace", "poet's words", "musician's melody", 'lost in thought',
    'moment of clarity', 'inner turmoil', 'shared meal', 'passing glance',
    'stolen kiss', 'broken promise', 'new beginning', 'end of an era',
    "journey's end", 'path unknown', 'uncharted territory', 'familiar face',
    "stranger's kindness", 'shared sorrow', 'celebration of life', 'whispered secrets',
    'silent tears', 'joyful reunion', 'painful farewell', 'childhood memory',
    'ancient tale', 'moment of triumph', 'hidden desire', 'longing gaze',
    'echo of laughter', 'forgotten dream', 'silent prayer', 'unexpected gift',
    'solitary walk', 'busy marketplace', 'rustic village', 'urban sprawl',
    "refugee's plight", "immigrant's hope", "pilgrim's journey", "hermit's solitude",
    "activist's passion", "scientist's discovery", "philosopher's musings", "historian's research",
    "teacher's impact", "student's growth", "doctor's healing", "nurse's compassion",
    "firefighter's courage", "police officer's duty", "soldier's sacrifice", "peacemaker's mission",
    "missionary's faith", "volunteer's dedication", "philanthropist's generosity", "entrepreneur's vision",
    "inventor's breakthrough", "explorer's quest", "adventurer's thrill", "survivor's resilience",
    "witness's testimony", "storyteller's magic", "elder's wisdom", "youth's potential",
    "community's strength", "society's progress", "humanity's hope",
  ],
  emotionalLandscape: [
    'quiet joy', 'lingering sorrow', 'gentle longing', 'fleeting anger',
    'serene acceptance', 'peaceful solitude', 'unexpected delight', 'moment of awe',
    'deep despair', 'burning passion', 'calm serenity', 'restless energy',
    'bitter regret', 'sweet nostalgia', 'overwhelming grief', 'bubbling excitement',
    'nervous anticipation', 'quiet contentment', 'melancholy reflection', 'sense of wonder',
    'feeling of belonging', 'yearning for connection', 'fear of the unknown', 'courage in adversity',
    'hope for the future', 'acceptance of the past', "love's embrace", "loss's sting",
    'joyful reunion', 'painful farewell', 'hidden sorrow', 'latent joy',
    'vibrant love', 'simmering rage', 'unexpected surprise', 'contented sigh',
    'wistful remembrance', 'radiant happiness', 'deep-seated fear', 'flickering hope',
    'palpable tension', 'gentle reassurance', 'passionate outburst', 'solemn vow',
    'warmth of companionship', 'echo of a smile', 'whisper of doubt', 'shadow of despair',
    'glimmer of optimism', 'weight of responsibility', 'lightness of being', 'depth of gratitude',
    'ache of loneliness', 'comfort of solace', 'thrill of discovery', 'rush of adrenaline',
    'calm of meditation', 'spark of creativity', 'glow of pride', 'chill of terror',
    'warmth of forgiveness', 'bitterness of betrayal', 'sweetness of revenge', 'sourness of defeat',
    'spiciness of challenge', 'richness of experience', 'complexity of emotions', 'simplicity of truth',
    'profoundness of wisdom', 'absurdity of existence', 'irony of fate', 'paradox of life',
    'ambiguity of reality', 'certainty of change', 'unpredictability of future', 'inevitability of death',
    'eternity of love', 'transcendence of spirit', 'immanence of nature', 'interconnectedness of all',
    'oneness of being',
  ],
  sensoryImpressions: [
    'scent of pine', 'taste of tea', 'sound of wind chimes', 'warmth of sunlight',
    'coolness of moonlight', 'roughness of bark', 'softness of petals', 'taste of raindrops',
    'salty sea breeze', 'sweet fragrance of flowers', 'bitter taste of coffee', 'spicy aroma of food',
    'soft touch of silk', 'rough texture of stone', 'warm glow of firelight', 'cool touch of metal',
    'vibrant colors of sunset', 'muted tones of dawn', 'echoing footsteps', 'distant thunder',
    'crackling fire', 'whispering leaves', 'lapping waves', 'chirping birds',
    'humming insects', 'rhythmic heartbeat', 'gentle touch of a loved one', 'sharp pain of loss',
    'sweet taste of victory', 'scent of fresh grass', 'buzz of neon lights', 'taste of fresh fruit',
    'sound of rustling leaves', 'feel of cool water', 'sight of morning mist', 'flavor of ripe berries',
    'chill of winter air', 'warmth of a smile', 'smell of rain', 'rustle of pages',
    'hum of a city', 'crunch of snow', 'drone of cicadas', 'whiff of incense',
    'tingling of goosebumps', 'prickling of tears', 'lump in throat', 'flutter of butterflies',
    'rumble of hunger', 'dryness of thirst', 'stickiness of humidity', 'heaviness of exhaustion',
    'lightness of laughter', 'sharpness of focus', 'blurriness of vision', 'ringing of silence',
    'rhythm of breath', 'pulse of life', 'texture of memory', 'fragility of time',
    'solidity of space', 'fluidity of motion', 'viscosity of emotion', 'density of thought',
    'weight of words', 'pressure of expectations', 'vacuum of loss', 'echo of the past',
    'vibration of the present', 'resonance of the future', 'harmony of the universe',
  ],
  spiritualPhilosophical: [
    'impermanence', 'oneness', 'inner peace', 'cycle of life',
    'path of enlightenment', 'search for meaning', 'transcendence', 'connection to nature',
    "universe's mysteries", 'eternal dance', 'cosmic connection', 'spiritual awakening',
    'inner journey', 'quest for truth', 'duality of existence', 'yin and yang',
    "karma's embrace", 'mindfulness', 'present moment', "meditation's stillness",
    "prayer's power", 'sacred rituals', 'ancient wisdom', 'philosophical questions',
    'existential ponderings', 'search for purpose', 'meaning of life', "nature's teachings",
    'divine presence', 'spiritual guidance', 'quiet contemplation', 'path of wisdom',
    'sacred silence', 'harmony with nature', 'balance of life', 'circle of time',
    "soul's journey", 'infinite universe', 'serenity of being', 'flow of energy',
    'whisper of the divine', 'dance of shadows', 'light of awareness', "truth's revelation",
    'inner sanctuary', 'essence of existence', "maya's veil", "samsara's wheel",
    "nirvana's bliss", "dharma's path", 'buddha nature', 'christ consciousness',
    "allah's grace", "brahman's unity", "atman's realization", "moksha's liberation",
    "tao's flow", "zen's simplicity", "sufi's devotion", "kabbalah's wisdom",
    'shamanic journey', 'animistic spirits', 'pantheistic divine', 'non-duality',
    'emptiness and form', 'relative and absolute', 'illusion and reality', 'creation and destruction',
    'birth and death', 'joy and suffering', 'attachment and liberation', 'ignorance and enlightenment',
    'ego and true self', 'individual and collective', 'microcosm and macrocosm', 'immanent and transcendent',
    'sacred and profane', 'temporal and eternal', 'finite and infinite', 'known and unknown',
    'seen and unseen', 'tangible and intangible', 'mundane and profound', 'ordinary and extraordinary',
    'rational and mystical', 'logical and intuitive', 'intellectual and experiential', 'theory and practice',
    'belief and direct experience', 'head and heart', 'mind and no-mind', 'self and no-self',
    'being and non-being', 'becoming and unbecoming',
  ],
  seasonalMarkers: [
    'cherry blossoms', 'summer cicada', 'first snow', 'harvest moon',
    'falling leaves', 'winter solstice', 'spring awakening', 'summer heat',
    'autumnal equinox', 'vernal equinox', 'melting snow', 'budding trees',
    'migrating birds', 'hibernating animals', 'blooming flowers', 'ripening fruit',
    'harvest festival', "winter's chill", "spring's warmth", "summer's abundance",
    "autumn's colors", 'icy branches', 'sun-kissed leaves', 'moonlit snow',
    'starry winter night', 'rainy spring day', 'windy autumn afternoon', 'calm summer evening',
    'spring blossoms', 'midsummer night', 'fall harvest', 'crisp autumn air',
    'frosty mornings', 'springtime renewal', 'scorching summer sun', 'cool autumn breeze',
    "snowfall's hush", 'budding flowers', 'long summer days', 'snow-covered hills',
    'gentle spring rain', 'summer nights', 'frost-covered leaves', 'blooming tulips',
    'winter dawn', 'spring equinox', 'summer solstice', 'winter wonderland',
    'spring fever', 'dog days of summer', 'Indian summer', 'first frost',
    'lengthening shadows', 'shortening days', 'lengthening nights', 'darkest night',
    'brightest day', 'seedlings sprouting', 'flowers fading', 'leaves turning',
    'snow melting', 'sap rising', 'buds swelling', 'fruit ripening',
    'crops harvesting', 'seeds falling', 'ground freezing', 'ice thawing',
    'rivers flooding', 'lakes freezing', 'seas storming', 'winds howling',
    'thunder rumbling', 'lightning flashing', 'clouds gathering', 'mist rising',
    'dew forming', 'frost sparkling', 'hail pelting', 'sleet falling',
    'sun blazing', 'moon glowing', 'stars twinkling',
  ],
  contemporaryLanguage: [
    'ghosting', 'binge-watching', 'viral meme', 'swipe right',
    'FOMO (fear of missing out)', 'YOLO (you only live once)', 'hashtag blessed', 'epic fail',
    'throw shade', 'squad goals', 'lit night', 'going viral',
    'selfie game', 'vibe check', 'cancel culture', 'digital detox',
    'influencer life', 'side hustle', 'unboxing', 'mood board',
    'adulting', 'clickbait', 'meme stock', 'deep dive',
    'algorithm blues', 'filter bubble', 'echo chamber', 'fake news',
    'clicktivism', 'story time',
  ],
  popCultureReferences: [
    'superhero saga', 'streaming wars', 'space race 2.0', 'eSports arena',
    'reality TV drama', 'cryptocurrency boom', 'AI uprising', 'virtual influencer',
    'dystopian novel', 'time traveler', 'pandemic lockdown', 'climate strike',
    'viral dance challenge', 'blockbuster sequel', 'fantasy realm', 'galactic empire',
    'wizarding world', 'apocalyptic wasteland', 'zombie apocalypse', 'supernatural thriller',
    'detective noir', 'cyberpunk aesthetic', 'steampunk adventure', 'retro revival',
    'indie game sensation', 'comic-con gathering', 'anime marathon', 'fan fiction saga',
    'cosplay parade', 'cult classic',
  ],
};

// Define category weights
const categoryWeights = {
  urbanLife: 3,
  technology: 4,
  socialDynamics: 4,
  modernEmotions: 4,
  surrealElements: 3,
  naturalWorld: 2,
  humanExperience: 3,
  emotionalLandscape: 3,
  sensoryImpressions: 2,
  spiritualPhilosophical: 2,
  seasonalMarkers: 1,
  surprise: 1,
  contemporaryLanguage: 3,
  popCultureReferences: 3,
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

// Templates for generating topics
const templates = [
  // Contemporary Language and Modern Themes
  "[rand(contemporaryLanguage)] amid [rand(urbanLife)], [rand(modernEmotions)] surface.",
  "In the era of [rand(technology)], [rand(humanExperience)] feels [rand(emotionalLandscape)].",
  
  // Unexpected Imagery and Evocative Language
  "When [rand(naturalWorld)] meets [rand(technology)], [rand(surrealElements)] emerges.",
  "Beneath the [rand(seasonalMarkers)], [rand(sensoryImpressions)] of [rand(surrealElements)].",
  
  // Traditional/Modern Juxtaposition
  "[rand(spiritualPhilosophical)] in a world of [rand(popCultureReferences)].",
  "Ancient [rand(naturalWorld)], modern [rand(socialDynamics)], [rand(emotionalLandscape)].",
  
  // Open to Interpretation and Unique Perspectives
  "Through [rand(emotionalLandscape)], [rand(humanExperience)] [rand(surrealElements)].",
  "[rand(modernEmotions)] over [rand(popCultureReferences)], [rand(spiritualPhilosophical)] whispers.",
  
  // Experimentation with Form and Updated Allusions
  "[rand(surprise)]! A [rand(technology)] [rand(emotionalLandscape)] in [rand(naturalWorld)].",
  "Echoes of [rand(popCultureReferences)], shadows of [rand(spiritualPhilosophical)].",
  
  // Humorous and Witty Observations
  "Lost in [rand(socialDynamics)], found in [rand(surrealElements)]—oh, the irony!",
  "[rand(contemporaryLanguage)] during [rand(humanExperience)], a [rand(surprise)] indeed.",
  
  // Emotional Resonance and Brevity
  "[rand(emotionalLandscape)] at the sight of [rand(sensoryImpressions)], a moment fleeting.",
  "Silence after [rand(popCultureReferences)], [rand(emotionalLandscape)] lingers.",
  
  // Additional Templates
  "Between [rand(technology)] and [rand(naturalWorld)], [rand(modernEmotions)] arise.",
  "In [rand(socialDynamics)], [rand(surrealElements)] [rand(sensoryImpressions)].",
  "Under the [rand(seasonalMarkers)], [rand(spiritualPhilosophical)] unfolds.",
  "[rand(humanExperience)] meets [rand(surrealElements)] by the [rand(naturalWorld)].",
  "Amidst [rand(technology)], a [rand(surprise)] [rand(emotionalLandscape)].",
  "[rand(emotionalLandscape)] of [rand(naturalWorld)], [rand(modernEmotions)] stir.",
  "Through [rand(surrealElements)], [rand(emotionalLandscape)] unfolds.",
  "In [rand(spiritualPhilosophical)], [rand(popCultureReferences)] echo.",
  // Modern Technology and Human Experience
  "[rand(technology)] intersects with [rand(humanExperience)], [rand(emotionalLandscape)] unfolds.",
  "In the age of [rand(technology)], [rand(modernEmotions)] linger.",
  "Amidst [rand(technology)], [rand(emotionalLandscape)] of [rand(humanExperience)].",
  "When [rand(humanExperience)] meets [rand(technology)], [rand(sensoryImpressions)] arise.",
  "Under [rand(technology)], [rand(spiritualPhilosophical)] is questioned.",

  // Social Media and Contemporary Life
  "[rand(contemporaryLanguage)] in the realm of [rand(socialDynamics)], [rand(emotionalLandscape)] surfaces.",
  "Scrolling through [rand(socialDynamics)], a [rand(surprise)] emerges.",
  "In the feed of [rand(socialDynamics)], [rand(modernEmotions)] grow.",
  "Between likes and shares, [rand(humanExperience)] [rand(modernEmotions)].",
  "[rand(socialDynamics)] echoes with [rand(contemporaryLanguage)], [rand(emotionalLandscape)] felt.",

  // Environmental Concerns and Nature
  "Under [rand(seasonalMarkers)], [rand(naturalWorld)] faces [rand(modernEmotions)].",
  "[rand(naturalWorld)] amidst [rand(technology)], [rand(emotionalLandscape)] felt.",
  "Echoes of [rand(surrealElements)] in [rand(naturalWorld)], [rand(spiritualPhilosophical)] awakens.",
  "When [rand(technology)] touches [rand(naturalWorld)], [rand(humanExperience)] transforms.",
  "Silent [rand(naturalWorld)], loud [rand(modernEmotions)], a [rand(surprise)] indeed.",

  // Urban Life and Isolation
  "Among [rand(urbanLife)], [rand(humanExperience)] feels [rand(modernEmotions)].",
  "In the crowd of [rand(urbanLife)], a moment of [rand(spiritualPhilosophical)].",
  "[rand(urbanLife)] shadows, [rand(emotionalLandscape)] of [rand(humanExperience)].",
  "Beneath skyscrapers, [rand(modernEmotions)] whisper.",
  "Lost in [rand(urbanLife)], found in [rand(sensoryImpressions)].",

  // Pop Culture and Identity
  "[rand(popCultureReferences)] mirrors [rand(humanExperience)], [rand(emotionalLandscape)] ensues.",
  "Living through [rand(popCultureReferences)], [rand(modernEmotions)] arise.",
  "[rand(humanExperience)] in the age of [rand(popCultureReferences)], [rand(spiritualPhilosophical)] calls.",
  "Between reality and [rand(popCultureReferences)], [rand(surrealElements)] blend.",
  "[rand(contemporaryLanguage)] echoes, [rand(emotionalLandscape)] remains.",

  // Digital Age and Connection
  "Connected yet alone, [rand(humanExperience)] in [rand(technology)].",
  "Virtual [rand(surrealElements)], real [rand(emotionalLandscape)].",
  "In digital realms, [rand(spiritualPhilosophical)] emerges.",
  "Avatars of [rand(socialDynamics)], [rand(humanExperience)] persists.",
  "Pixels fade, [rand(emotionalLandscape)] stays.",

  // Modern Emotions and Mental Health
  "[rand(modernEmotions)] under [rand(technology)], [rand(humanExperience)] seeks peace.",
  "Amidst notifications, [rand(emotionalLandscape)] deepens.",
  "[rand(socialDynamics)] pressures, [rand(spiritualPhilosophical)] answers.",
  "Between screens and silence, [rand(humanExperience)] [rand(emotionalLandscape)].",
  "[rand(modernEmotions)] in the scroll, [rand(sensoryImpressions)] missed.",

  // Globalization and Cultural Fusion
  "In [rand(urbanLife)], cultures blend, [rand(emotionalLandscape)] forms.",
  "Global voices in [rand(socialDynamics)], [rand(spiritualPhilosophical)] shared.",
  "Traditions meet [rand(technology)], [rand(humanExperience)] evolves.",
  "[rand(naturalWorld)] meets metropolis, [rand(surrealElements)] appear.",
  "Melodies of [rand(popCultureReferences)], harmonies of [rand(naturalWorld)].",

  // Time and Change
  "[rand(seasonalMarkers)] shift, [rand(modernEmotions)] change.",
  "Echoes of past in [rand(technology)], [rand(emotionalLandscape)] linger.",
  "Transience of [rand(surrealElements)], permanence of [rand(humanExperience)].",
  "[rand(spiritualPhilosophical)] amid rapid [rand(technology)].",
  "Cycles of [rand(naturalWorld)], linear [rand(technology)], [rand(emotionalLandscape)].",

  // Hope and Resilience
  "[rand(humanExperience)] amidst chaos, [rand(spiritualPhilosophical)] shines.",
  "From [rand(modernEmotions)], [rand(emotionalLandscape)] blooms.",
  "Under pressure of [rand(technology)], [rand(humanExperience)] persists.",
  "In shadows of [rand(surrealElements)], [rand(emotionalLandscape)] glows.",
  "Resilience in [rand(socialDynamics)], hope in [rand(naturalWorld)].",

  // Humor and Irony
  "[rand(surprise)] in [rand(technology)], laughter echoes.",
  "Lost in [rand(technology)], found a [rand(surprise)].",
  "Irony of [rand(popCultureReferences)], [rand(emotionalLandscape)] smiles.",
  "[rand(contemporaryLanguage)] meets wisdom, [rand(humanExperience)] chuckles.",
  "Humor in chaos, [rand(emotionalLandscape)] in [rand(urbanLife)].",  
];

// Function to generate a random topic
function getRandomTopic() {
  const template = rand(templates);
  return template.replace(/\[rand\((\w+)\)\]/g, (match, category) => {
    return rand(categories[category]);
  });
}

export default getRandomTopic;