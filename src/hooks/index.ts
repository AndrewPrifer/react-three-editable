import { InitialState, useEditorStore } from '../store';
import { useThree } from 'react-three-fiber';
import { useLayoutEffect, useRef } from 'react';

export const useEditorConnector = (initialState?: InitialState) => {
  const init = useEditorStore((state) => state.init);
  const { scene, gl } = useThree();
  const initialStateRef = useRef(initialState);

  useLayoutEffect(() => {
    init(scene, gl, initialStateRef.current);
  }, [init, scene, gl]);
};
