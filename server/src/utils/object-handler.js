/*
 * Reference: https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
 */

const pick = (obj, ...keys) => Object.fromEntries(
    keys
    .filter(key => key in obj)
    .map(key => [key, obj[key]])
);

const inclusivePick = (obj, ...keys) => Object.fromEntries(
    keys.map(key => [key, obj[key]])
);
  
const omit = (obj, ...keys) => Object.fromEntries(
    Object.entries(obj)
    .filter(([key]) => !keys.includes(key))
);

module.exports = {
    pick, inclusivePick, omit, 
}