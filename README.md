# HRA Digital Objects Processor

This repository contains digital object definitions and a data processor (do-processor) to process conforming digital objects. The primary use case for this processor is to generate the Human Reference Atlas Knowledge Graph (hra-kg).

# Running with Docker

## Docker Setup Requirements

All that's required for execution using our Docker-based setup is `Docker` with `docker` available on command line. See the [Docker website](https://docs.docker.com/engine/install/) for details on installation based on your platform.

## Building the Docker container

If you want to use a pre-built container run:

`docker pull ghcr.io/hubmapconsortium/hra-do-processor:main`

if you are not using a pre-built container run:

`docker build . -t hra-do-processor`

## Running the Docker container

To run using a pre-built container, use the following command:

`docker run --mount type=bind,source=./digital-objects,target=/digital-objects --mount type=bind,source=./dist,target=/dist -t ghcr.io/hubmapconsortium/hra-do-processor:main help`

If you are using a locally built container, replace `ghcr.io/hubmapconsortium/hra-do-processor:main` with `hra-do-processor:latest`.

Replace `./digital-objects` and `./dist` with paths to your own `digital-objects` and `dist` folders if not the same.

You can also use the docker-compose.yaml file as an example if you want to run it

`docker compose run do-processor help`

# Running with CWL

## CWL Setup Requirements

You will need to install a Python 3 and Docker (or other container system supported by CWL) and a cwl runner. The default cwl runner can be installed with Python 3's pip module like so:

`python3 -m pip cwltool cwl-runner`

## Running the DO Processor with CWL

For running with a pre-built container (no git checkout required), use this command:

`cwl-runner https://raw.githubusercontent.com/hubmapconsortium/hra-do-processor/main/do-processor.cwl example-cwl-job.yaml`

For running with a local container, use this command:

`cwl-runner do-processor.local.cwl example-cwl-job.yaml`

# Running Locally

## Local Setup Requirements

- python 3.x
- node.js 16+ (if not using the virtualenv, which has it installed)
- Java 11

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
  -V, --version                          output the version number
  --base-iri <string>                    Base IRI for Digital Objects
  --do-home <string>                     Digital Objects home directory
  --processor-home <string>              DO Processor home
  --deployment-home <string>             DO deployment home
  --skip-validation                      Skip validation in each command (default: false)
  --exclude-bad-values                   Do not pass invalid values from data processors (default: false)
  -h, --help                             display help for command

Commands:
  normalize <digital-object-path>        Mechanically normalizes a Digital Object from it's raw form. Minimally, it converts the source DO type +
                                         integrates the metadata into a single linkml-compatible JSON file.
  enrich <digital-object-path>           Enriches a Normalized Digital Object, optionally pulling in data from other sources like Uberon, CL, Ubergraph,
                                         or other external resources. Minimally, it converts the Normalized JSON file into RDF. Optionally enriches data
                                         from the original form (ie add Metadata to nodes in the SVG or GLB files).
  build [options] <digital-object-path>  Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.
  deploy <digital-object-path>           Deploys a given Digital Object to the deployment home (default ./site)
  finalize [options]                     Finalize the deployment home before sending to the live server
  list                                   Lists all digital objects in the DO_HOME directory
  help [command]                         display help for command
```

## Digital Object Processor Subcommands

Each subcommand typically takes a path to the digital object and processes it according to the command's requirements. The digital object path usually looks like `${DO_TYPE}/${DO_NAME}/${DO_VERSION}`. For example, the ASCT+B Table for Kidney, v1.2 looks like this: `asct-b/kidney/v1.2`.

**normalize** - Mechanically normalizes a Digital Object from it's raw form. Minimally, it converts the source DO type + integrates the metadata into a single linkml-compatible JSON file.

**enrich** - Enriches a Normalized Digital Object, optionally pulling in data from other source like Uberon, CL, Ubergraph, or any other external resource. Minimally, it converts the Normalized JSON file into RDF. Optionally enriches data from the original form (ie add Metadata to nodes in the SVG or GLB files).

**build** - Given a Digital Object, checks for and runs normalization, enrichment, and packaging in one command.

**finalize** - Finalizes the deployment home before sending to the live server

**list** - Lists digital object information in the DO_HOME directory
