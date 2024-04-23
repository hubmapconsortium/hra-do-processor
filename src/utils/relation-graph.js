import { throwOnError } from './sh-exec.js';

// The complete inference closure for all subclass and existential
// relations. This includes all transitive, reflexive subclass 
// relations. 
export function redundant(input, output) {
  throwOnError(
    `relation-graph --ontology-file ${input} \
            --output-subclasses true \
            --disable-owl-nothing true \
            --reflexive-subclasses false \
            --output-file ${output}`,
    `Processing inference closure failed.`);
}

