import { loadGLTF, registerGLTFLoaders } from '../../normalization/ref-organ-utils/load-gltf.js';
import { traverseScene } from '../../normalization/ref-organ-utils/scene-traversal.js';

export async function getSceneNodes(gltfUrl) {
  registerGLTFLoaders();
  const gltf = await loadGLTF({ scenegraph: gltfUrl });
  const nodes = new Set();
  for (const scene of gltf.scenes) {
    traverseScene(scene, undefined, (node) => {
      nodes.add(node.name || node.id);
    });
  }
  return nodes;
}
