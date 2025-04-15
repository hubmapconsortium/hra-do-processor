#!/bin/bash

# Turn off command echoing/tracing
set +x
set +v
set -e

# Process the edit version of the LinkML schema
for schemaFile in schemas/src/{metadata,modules,digital-objects}/*.yaml; do
  type=$(basename ${schemaFile%.yaml})
  echo -n "Processing $schemaFile..."

  # Generate resolved LinkML schema definitions
  mkdir -p schemas/generated/linkml
  gen-linkml -f yaml --no-materialize $schemaFile > schemas/generated/linkml/${type}.yaml
  echo -e "\rProcessing $schemaFile... done"
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
  echo Processing $type

  # Insert to README.md
  echo "- [$type]($type/)" >> $README

  # Generate JSON Schema for validation
  echo -n "-> Generating JSON Schema..."
  mkdir -p schemas/generated/json-schema
  gen-json-schema --title-from title $genSchemaFile > schemas/generated/json-schema/${type}.schema.json
  echo -e "\r-> Generating JSON Schema... done"

  # Generate JSON-LD Context
  echo -n "-> Generating JSON-LD Context..."
  mkdir -p schemas/generated/json-ld
  gen-jsonld-context $genSchemaFile > schemas/generated/json-ld/${type}.context.jsonld
  echo -e "\r-> Generating JSON-LD Context... done"

  # Generate Markdown documentation
  echo -n "-> Generating Markdown documentation..."
  mkdir -p schemas/generated/docs
  gen-markdown $genSchemaFile --img --index-file README.md -d schemas/generated/docs/${type}
  echo -e "\r-> Generating Markdown documentation... done"

  # Generate OWL schema definitions
  echo -n "-> Generating OWL schema..."
  mkdir -p schemas/generated/owl
  gen-owl --log_level ERROR $genSchemaFile > schemas/generated/owl/${type}.owl.ttl
  echo -e "\r-> Generating OWL schema... done"
  
  # Generate Mermaid diagrams
  echo -n "-> Generating ER diagram..."
  mkdir -p schemas/generated/erdiagram
  gen-erdiagram --format mermaid $genSchemaFile > schemas/generated/erdiagram/${type}.mmd
  echo -e "\r-> Generating ER diagram... done"

  # In headless environments, these optional commands will fail
  echo -n "-> Generating SVG and PNG ER diagrams..."
  mmdc -p puppeteer-config.json -b transparent -i schemas/generated/erdiagram/${type}.mmd -o schemas/generated/erdiagram/${type}.svg --quiet
  mmdc -p puppeteer-config.json -b white -i schemas/generated/erdiagram/${type}.mmd -o schemas/generated/erdiagram/${type}.png --quiet
  echo -e "\r-> Generating SVG and PNG ER diagrams... done"
done

echo -n "-> Patching ds-graph JSON-LD Context..."
node src/patch-ds-graph-context.js schemas/generated/json-ld/ds-graph.context.jsonld
echo -e "\r-> Patching ds-graph JSON-LD Context... done"

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
