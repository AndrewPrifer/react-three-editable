import { State, useEditorStore } from '../store';
import { useThree } from 'react-three-fiber';
import { useLayoutEffect, useRef } from 'react';

export const useEditableManager = (state?: State) => {
  const init = useEditorStore((state) => state.init);
  const { scene, gl } = useThree();
  const initialStateRef = useRef(state);

  useLayoutEffect(() => {
    init(scene, gl, initialStateRef.current);
  }, [init, scene, gl]);
};
