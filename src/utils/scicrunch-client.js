import fetch from 'node-fetch';

const API_BASE = "https://api.scicrunch.io/elastic/v1";
const ANTIBODY_INDEX = "RIN_Antibody_pr";
const TOOL_INDEX = "RIN_Tool_pr";

export function retrieveAntibody(rrids) {
  const url = `${API_BASE}/${ANTIBODY_INDEX}/_search`;
  const options = {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      apikey: process.env.SCICRUNCH_API_KEY
    },
    body: JSON.stringify(createQuery(rrids))
  };
  return fetch(url, options).then((response) => {
    return response.json().then((data) => {
      return data.hits.hits;
    });
  }).catch((err) => { console.log(err); });
}

function createQuery(rrids) {
  return {
    size: 1000,
    query: {
      terms: {
        "rrid.curie": rrids
      }
    },
    "_source": {
      includes: [
        "item.identifier",
        "item.name",
        "item.description"
      ]
    }
  }
}