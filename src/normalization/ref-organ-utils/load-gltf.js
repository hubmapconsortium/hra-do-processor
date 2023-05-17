// Converted from transpiled ccf-ui code:
// https://github.com/hubmapconsortium/ccf-ui/blob/main/projects/ccf-body-ui/src/lib/util/load-gltf.ts

import { parse, registerLoaders } from '@loaders.gl/core';
import { DracoLoader, DracoWorkerLoader } from '@loaders.gl/draco';
import { GLTFLoader } from '@loaders.gl/gltf';
import { Matrix4 } from '@math.gl/core';
import { __awaiter } from 'tslib';
import { traverseScene } from './scene-traversal.js';

export function registerGLTFLoaders() {
  registerLoaders([DracoWorkerLoader, GLTFLoader]);
}

export function deriveScenegraph(scenegraphNodeName, gltf) {
  var _a;
  const scenegraphNode =
    (_a = gltf.nodes) === null || _a === void 0 ? void 0 : _a.find((n) => n.name === scenegraphNodeName);
  if (scenegraphNode) {
    let foundNodeInScene = false;
    for (const scene of gltf.scenes) {
      if (!foundNodeInScene) {
        traverseScene(scene, new Matrix4(Matrix4.IDENTITY), (child, modelMatrix) => {
          if (child === scenegraphNode) {
            child.matrix = modelMatrix;
            child.translation = undefined;
            child.rotation = undefined;
            child.scale = undefined;
            foundNodeInScene = true;
            return false;
          }
          return true;
        });
      }
    }
    gltf.scene = {
      id: scenegraphNodeName,
      name: scenegraphNodeName,
      nodes: [scenegraphNode],
    };
    gltf.scenes = [gltf.scene];
    return { scene: gltf.scene, scenes: gltf.scenes };
  } else {
    return gltf;
  }
}

export function loadGLTF(model, cache) {
  return __awaiter(this, void 0, void 0, function* () {
    const gltfUrl = model.scenegraph;
    let gltfPromise;
    if (cache) {
      gltfPromise = cache[gltfUrl] || (cache[gltfUrl] = fetch(gltfUrl).then((r) => r.blob()));
    } else {
      gltfPromise = fetch(gltfUrl);
    }

    const gltf = yield parse(gltfPromise, GLTFLoader, {
      DracoLoader,
      gltf: { decompressMeshes: true, postProcess: true },
    });
    if (!gltf.nodes) {
      console.log('WARNING: Empty Scene', gltfUrl, gltf);
    }
    return deriveScenegraph(model.scenegraphNode, gltf);
  });
}

export function loadGLTF2(scenegraphNodeName, gltfPromise) {
  return __awaiter(this, void 0, void 0, function* () {
    return deriveScenegraph(scenegraphNodeName, yield gltfPromise);
  });
}
