const _ = require("lodash");

/**
 *
 * @param  {Object} form Dictionnary of fieldName: value Relation fields have to be arrays
 * @param  {Array} relationsTable Array defining relationships
 * Ex. [{
    fieldName: "compounds", // key of the distionnary
    relationshipName: "CONTAINS", // Name of rel like in [:CONTAINS] 
    nodeName: "Compound", // like in (:Compound)
    nodeIdFieldName: "name", // Field name to search for the related node
    formIdFieldName: "text", // Field value to search for the related node
  }]
 * @param  {boolean} [startQuery=false] The query (MATCH or CREATE) that starts the final query to define the starting node
 * Ex. "CREATE (i:Ingredient {name: $name})";
 * @param  {Object} [options={}] TODO
 * @return Cypher query, ready to be executed
 */
function createRelations(
  form,
  relationsTable,
  options = {
    create: true,
    startLabel: "",
    startProperties: "",
  }
) {
  let rel = [];
  let del = [];
  startQuery = getStartQuery(options);
  if (!relationsTable || !_.isArray(relationsTable))
    throw new Error("relationsTable not set or not an array");
  if (!startQuery || !_.isString(startQuery)) {
    throw new Error("startQuery not set or not a string");
  }
  relationsTable.forEach((relation) => {
    if (form[relation.fieldName] && form[relation.fieldName].length > 0) {
      rel = [...rel, ...relationsQuery(form, relation)];
      if (!options.create) del = [...del, deleteRelationsQuery(relation)];
    }
  });

  let query = `
        ${startQuery}
        ${del.length > 0 ? "WITH (i)" : ""}
        ${del.join("\nWITH (i)\n")}
        WITH (i)
        ${rel.join("\nWITH (i)\n")}
        RETURN (i)
   `;
  return query;
}

function relationsQuery(form, relation) {
  //values, name, entity) {
  let res = [];
  form[relation.fieldName].forEach((value) => {
    value = JSON.parse(value);
    res.push(`
    MATCH (c:${relation.nodeName} {${relation.nodeIdFieldName}:'${
      value[relation.formIdFieldName]
    }'})
    MERGE (i)-[:${relation.relationshipName}]->(c)
    `);
  });
  return res;
}

function deleteRelationsQuery(relation) {
  //values, name, entity) {
  let res = [];
  res.push(`
        MATCH (i)-[r:${relation.relationshipName}]-()
        DELETE r
    `);
  return res;
}

function getStartQuery(options) {
  //"CREATE (i:Ingredient {name: $name, scientific_name: $scientific_name})"
  if (options.create) {
    return `CREATE (i:${options.startLabel} {${options.startProperties}})`;
  } else {
    return `MATCH (i:${options.startLabel}) WHERE ${options.startCondition}`;
  }
}

module.exports = {
  createRelations,
};
