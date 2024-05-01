import { throwOnError } from './sh-exec.js';

export function ancestors(scheme = "", path = "", termFile, predicates = [], output) {
    throwOnError(
        `runoak -i ${scheme}${path} ancestors \`${`cat ${termFile} | tr -d '\r' | tr '\n' ' ' && echo ''`}\` -p i,${predicates.join()} -o ${output}`,
        `Getting ancestors failed.`
    );
}