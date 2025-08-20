// Converted from transpiled ccf-ui code:
// https://github.com/hubmapconsortium/ccf-ui/blob/main/projects/ccf-body-ui/src/lib/util/process-scene-nodes.ts

import { Matrix4 } from '@math.gl/core';
import cannon from 'cannon-es';
import { __awaiter } from 'tslib';
import { loadGLTF, registerGLTFLoaders } from './load-gltf.js';
import { traverseScene } from './scene-traversal.js';

const { AABB, Vec3 } = cannon;

function childNames(scene, names = []) {
  for (const child of scene.nodes || scene.children || []) {
    names.push(child.name);
    childNames(child, names);
  }
  return names;
}

export function processSceneNodes(gltfUrl, worldMatrix, scenegraphNode, gltfCache) {
  return __awaiter(this, void 0, void 0, function* () {
    registerGLTFLoaders();
    const gltf = yield loadGLTF({ scenegraph: gltfUrl, scenegraphNode }, gltfCache);
    const nodes = {};
    const gltfNodes = [];
    for (const scene of gltf.scenes) {
      worldMatrix = new Matrix4(worldMatrix || Matrix4.IDENTITY);
      traverseScene(scene, worldMatrix, (node, modelMatrix) => {
        const processedNode = {
          '@id': node.name || node.id,
          '@type': 'ProcessedNode',
          transformMatrix: new Matrix4(modelMatrix),
          geometry: 'wireframe',
          node,
        };
        gltfNodes.push({
          '@id': `GLTF:${processedNode['@id']}`,
          '@type': 'GLTFNode',
          scenegraph: gltfUrl,
          scenegraphNode: processedNode['@id'],
          transformMatrix: new Matrix4(worldMatrix || Matrix4.IDENTITY),
          tooltip: node.name || node.id,
          color: [255, 255, 255, 255],
          _lighting: 'pbr',
          zoomBasedOpacity: true,
          node,
        });
        if (node.mesh && node.mesh.primitives && node.mesh.primitives.length > 0) {
          for (const primitive of node.mesh.primitives) {
            if (primitive.attributes.POSITION && primitive.attributes.POSITION.min) {
              const lowerBound = modelMatrix.transformAsPoint(primitive.attributes.POSITION.min, []);
              const upperBound = modelMatrix.transformAsPoint(primitive.attributes.POSITION.max, []);
              processedNode.bbox = new AABB({
                lowerBound: new Vec3(...lowerBound.map((n, i) => Math.min(n, upperBound[i]))),
                upperBound: new Vec3(...upperBound.map((n, i) => Math.max(n, lowerBound[i]))),
              });
            }
          }
        }
        nodes[processedNode['@id']] = processedNode;
        return true;
      });
    }
    for (const node of Object.values(nodes).filter((n) => !n.bbox)) {
      for (const child of childNames(node.node)
        .map((n) => nodes[n])
        .filter((n) => n.bbox)) {
        if (!node.bbox) {
          node.bbox = child.bbox.clone();
        } else {
          node.bbox.extend(child.bbox);
        }
      }
      if (!node.bbox) {
        delete nodes[node['@id']];
      }
    }
    for (const node of Object.values(nodes)) {
      const lb = node.bbox.lowerBound;
      const ub = node.bbox.upperBound;
      const size = (node.size = ub.clone().vsub(lb));
      const halfSize = size.clone().vmul(new Vec3(0.5, 0.5, 0.5));
      const center = (node.center = lb.clone().vadd(halfSize));
      node.transformMatrix = new Matrix4(Matrix4.IDENTITY).translate(center.toArray()).scale(halfSize.toArray());
    }
    for (const node of gltfNodes) {
      nodes[node['@id']] = node;
    }
    return nodes;
  });
}
