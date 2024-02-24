import { writeFileSync } from 'fs';
import { graph, sym, lit, serialize } from 'rdflib';


export function RdfBuilder(iri) {
  const store = graph();
  store.add(
    sym(iri), 
    sym("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"), 
    sym("http://www.w3.org/2002/07/owl#Ontology"));

  this.add = function (subject, predicate, object) {
    if (subject && predicate && object) {
      store.add(subject, predicate, object);
    }
    return this;
  }

  this.build = function () {
    return serialize(null, store, null, null, (err, result) => {
      return result;
    })
  }

  this.save = function(filePath) {
    serialize(null, store, null, null, (err, result) => {
      writeFileSync(filePath, result);
    })
  }
}

export function iri(text) {
  return sym(text);
}

export function literal(text) {
  return lit(text);
}
