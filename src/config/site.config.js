// main site config - turn stuff on/off and wire up elections, clubs, etc.
import electionsConfig from "./elections.config.js";
import { clubCategories } from "./clubs/index.js";

export const site = {
  electionsEnabled: true,
  elections: electionsConfig,
};

export const clubs = {
  categories: clubCategories,
};

export { default as organizationsConfig } from "./organizations.config.js";
export { default as electionsConfig } from "./elections.config.js";
export { clubCategories } from "./clubs/index.js";

export default site;
