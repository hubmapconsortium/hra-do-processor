#!/bin/bash
set -ev

for schemaFile in schemas/digital-objects/*.yaml; do
  type=$(basename ${schemaFile%.yaml})
  echo $type $schemaFile

  # Generate JSON Schema for validation
  mkdir -p schemas/generated/json-schema
  gen-json-schema $schemaFile > schemas/generated/json-schema/${type}.schema.json

  # Generate JSON-LD Context
  mkdir -p schemas/generated/json-ld
  gen-jsonld-context $schemaFile > schemas/generated/json-ld/${type}.context.jsonld

  # Generate Markdown documentation
  mkdir -p schemas/generated/docs
  gen-markdown $schemaFile -d schemas/generated/docs/${type}

  # Generate OWL schema definitions
  mkdir -p schemas/generated/owl
  gen-owl $schemaFile > schemas/generated/owl/${type}.owl.ttl
done
