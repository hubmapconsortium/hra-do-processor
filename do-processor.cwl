#!/usr/bin/env cwl-runner

cwlVersion: v1.0
class: CommandLineTool

requirements:
  DockerRequirement:
    dockerPull: ghcr.io/hubmapconsortium/hra-do-processor:main
    dockerOutputDirectory: /output
  EnvVarRequirement:
    envDef:
      DO_HOME: /output/digital-objects
      DEPLOY_HOME: /output/dist
  InitialWorkDirRequirement:
    listing:
    - entryname: digital-objects
      writable: true
      entry: $(inputs.do_home)
    - entryname: dist
      writable: true
      entry: $(inputs.deploy_home)

inputs:
  do_home:
    type: Directory
  deploy_home:
    type: Directory
  arguments:
    type: string[]
    inputBinding:
      position: 1

outputs:
  do_home:
    type: Directory
    outputBinding:
      glob: digital-objects
  deploy_home:
    type: Directory
    outputBinding:
      glob: dist
  output:
    type: stdout
stdout: output.txt
