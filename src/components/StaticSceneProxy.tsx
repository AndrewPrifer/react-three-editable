import React, { VFC } from 'react';
import { Scene } from 'three';
import { useProxy } from '../hooks';

export interface StaticSceneProxyProps {
  scene: Scene;
}

const StaticSceneProxy: VFC<StaticSceneProxyProps> = ({ scene }) => {
  const [staticSceneProxy] = useProxy(scene);

  return staticSceneProxy ? <primitive object={staticSceneProxy} /> : null;
};

export default StaticSceneProxy;
