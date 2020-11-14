import { State, useEditorStore } from '../store';
import { useThree } from 'react-three-fiber';
import { useLayoutEffect, useRef, useState } from 'react';

export const useEditableManager = (state?: State) => {
  const init = useEditorStore((state) => state.init);
  const { scene, gl } = useThree();
  const initialStateRef = useRef(state);

  useLayoutEffect(() => {
    init(scene, gl, initialStateRef.current);
  }, [init, scene, gl]);

  // For some reason the reference window stays blank on the first Canvas render, even though everything seems to be the same
  // on both renders, specifically the domElement that we are copying from, but everything else too for that matter.
  // For now this hack will have to do, but it is too strange not to investigate further.
  const [, forceUpdate] = useState(false);
  useLayoutEffect(() => {
    forceUpdate((i) => !i);
  }, []);
};
