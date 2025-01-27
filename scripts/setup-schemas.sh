#!/bin/bash
set -ev

# Process the edit version of the LinkML schema
for schemaFile in schemas/src/{metadata,modules,digital-objects}/*.yaml; do
  type=$(basename ${schemaFile%.yaml})
  echo $type $schemaFile

  # Generate resolved LinkML schema definitions
  mkdir -p schemas/generated/linkml
  gen-linkml -f yaml --no-materialize-attributes --materialize-patterns $schemaFile > schemas/generated/linkml/${type}.yaml
done

# Initialize README.md for docs dir
README=schemas/generated/docs/README.md
mkdir -p schemas/generated/docs
echo "# Digital Object Schemas" > $README
echo "" >> $README
echo "[All ER Diagrams](er-diagrams/)" >> $README
echo "" >> $README
echo "## Digital Object Types:" >> $README

# Use the resolved LinkML schema to generate the other data schemas
for genSchemaFile in schemas/generated/linkml/*.yaml; do
  type=$(basename ${genSchemaFile%.yaml})

  echo "- [$type]($type/)" >> $README

  # Generate JSON Schema for validation
  mkdir -p schemas/generated/json-schema
  gen-json-schema --title-from title $genSchemaFile > schemas/generated/json-schema/${type}.schema.json

  # Generate JSON-LD Context
  mkdir -p schemas/generated/json-ld
  gen-jsonld-context $genSchemaFile > schemas/generated/json-ld/${type}.context.jsonld

  # Generate Markdown documentation
  mkdir -p schemas/generated/docs
  gen-markdown $genSchemaFile --img --index-file README.md -d schemas/generated/docs/${type}

  # Generate OWL schema definitions
  mkdir -p schemas/generated/owl
  gen-owl $genSchemaFile > schemas/generated/owl/${type}.owl.ttl

  # Generate Mermaid diagrams
  mkdir -p schemas/generated/erdiagram
  gen-erdiagram --format mermaid $genSchemaFile > schemas/generated/erdiagram/${type}.mmd

  # In headless environments, these optional commands will fail
  mmdc -p puppeteer-config.json -b transparent -i schemas/generated/erdiagram/${type}.mmd -o schemas/generated/erdiagram/${type}.svg
  mmdc -p puppeteer-config.json -b white -i schemas/generated/erdiagram/${type}.mmd -o schemas/generated/erdiagram/${type}.png
done

# Generate ER diagrams
OUT=er-diagrams.md

echo "# HRA DO Processor Diagrams" > $OUT

for genSchemaFile in `ls schemas/generated/linkml/*.yaml | grep -v 'metadata'` schemas/generated/linkml/basic-metadata.yaml; do
  type=$(basename ${genSchemaFile%.yaml})
  echo "## $type" >> $OUT

  echo "" >> $OUT
  gen-erdiagram $genSchemaFile >> $OUT
  echo "" >> $OUT
done

mkdir -p schemas/generated/docs/er-diagrams docs/er-diagrams
mmdc -p puppeteer-config.json -i er-diagrams.md -o docs/er-diagrams/index.md
