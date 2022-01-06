"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
const { js2cypher } = require("../index.js");
let { form, relationsTable } = require("./data");

chai.use(chaiAsPromised);

// Then either:
var expect = chai.expect;

describe("#relations test", function () {
  it("Should generate correctly the creation query", function () {
    let options = {
      create: true,
      startLabel: "Ingredient",
      startProperties: "name: $name, scientific_name: $scientific_name",
    };
    let query = js2cypher.createRelations(form, relationsTable, options);
    expect(query.length).to.equal(916);
  });
  it("Should generate correctly the update query", function () {
    let options = {
      create: false,
      startLabel: "Ingredient",
      startCondition: "name = $name",
    };
    let query = js2cypher.createRelations(form, relationsTable, options);
    //console.log(query);
    expect(query.length).to.equal(1070);
  });
});
