import React, { useEffect, useRef, VFC } from 'react';
import { useEditorStore } from '../store';
import shallow from 'zustand/shallow';
import { WebGLRenderer } from 'three';

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
    <div className="rounded overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        width={(gl.domElement.width / gl.domElement.height) * height}
        height={height}
      />
    </div>
  ) : null;
};

export default ReferenceWindow;
