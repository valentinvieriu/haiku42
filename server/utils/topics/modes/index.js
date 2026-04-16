// Aggregator for the 8 mode definitions used by the scene-seed builder.
//
// Order MUST match the original inline modes array in topics.js: weighted
// picking iterates this array in order, so reordering would change which
// mode a given seed produces and break determinism for shared haiku URLs
// and the analyze-haiku-seeds.mjs golden output.

import { observation }      from "./observation.js";
import { urbanNature }      from "./urban-nature.js";
import { humanTrace }       from "./human-trace.js";
import { domesticTurn }     from "./domestic-turn.js";
import { climateEcho }      from "./climate-echo.js";
import { comicGlimpse }     from "./comic-glimpse.js";
import { transit }          from "./transit.js";
import { nightAndSilence }  from "./night-and-silence.js";

export const modes = [
  observation,
  urbanNature,
  humanTrace,
  domesticTurn,
  climateEcho,
  comicGlimpse,
  transit,
  nightAndSilence,
];
