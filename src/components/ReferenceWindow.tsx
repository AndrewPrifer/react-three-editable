import React, { useEffect, useRef, VFC } from 'react';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { WebGLRenderer } from 'three';
import { Box } from '@chakra-ui/core';

interface ReferenceWindowProps {
  height: number;
}

const ReferenceWindow: VFC<ReferenceWindowProps> = ({ height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gl] = useEditorStore((state) => [state.gl], shallow);

  useEffect(() => {
    let animationHandle: number;
    const draw = (gl: WebGLRenderer) => () => {
      const width = (gl.domElement.width / gl.domElement.height) * height;

      const ctx = canvasRef.current!.getContext('2d')!;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(gl.domElement, 0, 0, width, height);
      animationHandle = requestAnimationFrame(draw(gl));
    };

    if (open && gl) {
      draw(gl)();
    }

    return () => {
      cancelAnimationFrame(animationHandle);
    };
  }, [open]);

  return (
    gl && (
      <Box
        display="inline-box"
        borderRadius={5}
        overflow="hidden"
        boxShadow="0px 0px 50px 10px rgba(0,0,0,0.20)"
      >
        <canvas
          ref={canvasRef}
          width={(gl.domElement.width / gl.domElement.height) * height}
          height={height}
        />
      </Box>
    )
  );
};

export default ReferenceWindow;
