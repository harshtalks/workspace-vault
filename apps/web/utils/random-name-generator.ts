import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  starWars,
  countries,
} from "unique-names-generator";

export const getName = () =>
  uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors, starWars, countries],
    length: 3,
    separator: " ",
    style: "capital",
  });
