let form = {
  name: "turtur",
  scientific_name: "turtu",
  types: ['{"text":"spice","value":6}', '{"text":"flower","value":113}'],
  compounds: [
    '{"text":"geraniol","value":71}',
    '{"text":"nerol","value":114}',
    '{"text":"Eugenol","value":21}',
    '{"text":"linalool","value":26}',
  ],
  characters: [
    '{"text":"floral","value":110}',
    '{"text":"musky","value":64}',
    '{"text":"sweet","value":1}',
  ],
};

let relationsTable = [
  {
    fieldName: "compounds",
    relationshipName: "CONTAINS",
    nodeName: "Compound",
    nodeIdFieldName: "name",
    formIdFieldName: "text",
  },
  {
    fieldName: "characters",
    relationshipName: "HAS",
    nodeName: "Character",
    nodeIdFieldName: "name",
    formIdFieldName: "text",
  },
  {
    fieldName: "types",
    relationshipName: "BELONGS_TO",
    nodeName: "Ingredient_type",
    nodeIdFieldName: "name",
    formIdFieldName: "text",
  },
  {
    fieldName: "compatibility",
    relationshipName: "GOES_WELL_WITH",
    nodeName: "Ingredient",
    nodeIdFieldName: "name",
    formIdFieldName: "text",
  },
];
module.exports = { form, relationsTable };
