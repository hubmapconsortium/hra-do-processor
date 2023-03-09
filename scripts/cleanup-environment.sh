#!/bin/bash
set -ev

if [ "$(which deactivate)" != "" ]; then
  deactivate
fi
rm -rf node_modules .venv schemas/generated
