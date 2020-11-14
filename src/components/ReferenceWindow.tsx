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
      animationHandle = requestAnimationFrame(draw(gl));

      if (!gl.domElement) {
        return;
      }

      const width = (gl.domElement.width / gl.domElement.height) * height;

      const ctx = canvasRef.current!.getContext('2d')!;

      // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing
      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(gl.domElement, 0, 0, width, height);
    };

    if (gl) {
      draw(gl)();
    }

    return () => {
      cancelAnimationFrame(animationHandle);
    };
  }, [gl, height]);

  return gl?.domElement ? (
    <Box
      display="inline-block"
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
  ) : null;
};

export default ReferenceWindow;
