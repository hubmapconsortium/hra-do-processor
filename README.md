# HRA Digital Objects Processor

This repository contains digital object definitions and a data processor (do-processor) to process conforming digital objects. The primary use case for this processor is to generate the Human Reference Atlas Knowledge Graph (hra-kg).

## Local Setup Requirements

- python 3.x
- node.js 16+ (if not using the virtualenv, which has it installed)

## Local Setup

First create a virtual environment by running:

`./scripts/setup-environment.sh`

After finishing, you can enter the virtual environment by running:

`source .venv/bin/activate`

## Running the do-processor

While in the virtual environment (or if installed globally), use the `do-processor` command.

```bash
$ do-processor --help
Usage: do-processor [options] [command]

Digital Object Processing Command-Line Interface

Options:
  -V, --version                    output the version number
  --do-home <string>               Digital Objects home directory
  --processor-home <string>        DO Processor home
  --skip-validation                Skip validation in each command (default: false)
  -h, --help                       display help for command

Commands:
  normalize <digital-object-path>  Mechanically normalizes a Digital Object from it's raw form. Minimally, it converts the source DO type + integrates the
                                   metadata into a single linkml-compatible JSON file.
  enrich <digital-object-path>     Enriches a Normalized Digital Object, optionally pulling in data from other sources like Uberon, CL, Ubergraph, or other
                                   external resources. Minimally, it converts the Normalized JSON file into RDF. Optionally enriches data from the original
                                   form (ie add Metadata to nodes in the SVG or GLB files).
  package <digital-object-path>    Packages an Enriched Digital Object, such that it can published to a website/DOI'd/etc and used
  build <digital-object-path>      Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.
  list                             Lists all digital objects in the DO_HOME directory
  help [command]                   display help for command
```

## Digital Object Processor Subcommands

Each subcommand typically takes a path to the digital object and processes it according to the command's requirements. The digital object path usually looks like `${DO_TYPE}/${DO_NAME}/${DO_VERSION}`. For example, the ASCT+B Table for Kidney, v1.2 looks like this: `asct-b/kidney/v1.2`.

**normalize** - Mechanically normalizes a Digital Object from it's raw form. Minimally, it converts the source DO type + integrates the metadata into a single linkml-compatible JSON file.

**enrich** - Enriches a Normalized Digital Object, optionally pulling in data from other source like Uberon, CL, Ubergraph, or any other external resource. Minimally, it converts the Normalized JSON file into RDF. Optionally enriches data from the original form (ie add Metadata to nodes in the SVG or GLB files).

**package** - Packages an Enriched Digital Object, such that it can published to a website/DOI'd/etc.

**build** - Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.

**list** - Lists digital object information in the DO_HOME directory
