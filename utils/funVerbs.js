export const funVerbs = [
  'Accomplishing', 'Architecting', 'Baking', "Beboppin'", 'Befuddling',
  'Blanching', 'Boogieing', 'Boondoggling', 'Bootstrapping', 'Brewing',
  'Canoodling', 'Caramelizing', 'Cascading', 'Cerebrating', 'Choreographing',
  'Churning', 'Clauding', 'Cogitating', 'Combobulating', 'Composing',
  'Concocting', 'Contemplating', 'Cooking', 'Crafting', 'Crunching',
  'Crystallizing', 'Cultivating', 'Deliberating', 'Dilly-dallying',
  'Discombobulating', 'Doodling', 'Enchanting', 'Envisioning', 'Fermenting',
  'Finagling', 'Flambéing', 'Flibbertigibbeting', 'Flummoxing', 'Forging',
  'Frolicking', 'Gallivanting', 'Garnishing', 'Generating', 'Germinating',
  'Grooving', 'Harmonizing', 'Hatching', 'Hullaballooing', 'Hyperspacing',
  'Ideating', 'Imagining', 'Improvising', 'Incubating', 'Infusing',
  'Jitterbugging', 'Julienning', 'Kneading', 'Lollygagging', 'Manifesting',
  'Marinating', 'Meandering', 'Metamorphosing', 'Moonwalking', 'Moseying',
  'Mulling', 'Musing', 'Noodling', 'Orchestrating', 'Percolating',
  'Philosophising', 'Pondering', 'Pontificating', 'Prestidigitating',
  'Puzzling', 'Razzle-dazzling', 'Recombobulating', 'Ruminating',
  'Sautéing', 'Scampering', 'Shenaniganing', 'Shimmying', 'Simmering',
  'Skedaddling', 'Sketching', 'Spelunking', 'Sprouting', 'Stewing',
  'Swirling', 'Synthesizing', 'Tinkering', 'Tomfoolering', 'Topsy-turvying',
  'Transmuting', 'Undulating', 'Unfurling', 'Vibing', 'Wandering',
  'Whatchamacalliting', 'Whisking', 'Wibbling', 'Wrangling', 'Zigzagging',
]

export function getRandomVerb() {
  return funVerbs[Math.floor(Math.random() * funVerbs.length)]
}
