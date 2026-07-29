import { useCallback, useRef, useState } from "react";

interface ScenePoint {
  x: number;
  y: number;
}

const REST: ScenePoint = { x: 0, y: 0 };

// Tracks normalized cursor position (-1..1 on each axis) across an entire
// container, so multiple elements inside it (a tilting card, parallax glow
// layers) can all react to the same cursor as one coherent 3D scene, instead
// of each element only responding when hovered directly.
export const useScenePointer = () => {
  const ref = useRef<HTMLElement>(null);
  const [point, setPoint] = useState<ScenePoint>(REST);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPoint({ x: x * 2 - 1, y: y * 2 - 1 });
  }, []);

  const onMouseLeave = useCallback(() => setPoint(REST), []);

  return { ref, point, onMouseMove, onMouseLeave };
};
