import {
  Component,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import type { OrbitControls as OrbitType } from "three-stdlib";
import { Mesh } from "three";
import { Minus, Plus, RotateCcw, RotateCw } from "lucide-react";
import { useApp } from "../context";
class Boundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function Model({ url, onReady }: { url: string; onReady: () => void }) {
  const { scene } = useGLTF(url);
  useEffect(() => {
    onReady();
  }, [onReady]);
  useEffect(
    () => () => {
      scene.traverse((object) => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          for (const material of Array.isArray(object.material)
            ? object.material
            : [object.material])
            material.dispose();
        }
      });
    },
    [scene],
  );
  return <primitive object={scene} dispose={null} />;
}
function Controls({
  zoom,
  angle,
  reset,
}: {
  zoom: number;
  angle: number;
  reset: number;
}) {
  const ref = useRef<OrbitType>(null);
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(
      Math.sin(angle) * zoom,
      zoom * 0.38,
      Math.cos(angle) * zoom,
    );
    camera.lookAt(0, 0, 0);
    ref.current?.target.set(0, 0, 0);
    ref.current?.update();
    invalidate();
  }, [zoom, angle, reset, camera, invalidate]);
  return (
    <OrbitControls
      ref={ref}
      enablePan={false}
      minDistance={2}
      maxDistance={7}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.8}
      enableDamping={false}
    />
  );
}
export default function ThreeScene({
  url,
  onError,
}: {
  url: string;
  onError: () => void;
}) {
  const { t } = useApp();
  const [zoom, setZoom] = useState(4);
  const [angle, setAngle] = useState(0.45);
  const [reset, setReset] = useState(0);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    const timeout = setTimeout(onError, 10000);
    return () => clearTimeout(timeout);
  }, [ready, onError]);
  useEffect(
    () => () => {
      const cached = useGLTF as typeof useGLTF;
      cached.clear(url);
    },
    [url],
  );
  return (
    <Boundary onError={onError}>
      <div className="three-canvas" dir="ltr">
        <Canvas
          dpr={[1, 1.5]}
          frameloop="demand"
          camera={{ position: [2, 1.5, 4], fov: 38 }}
          fallback={<span role="alert">{t("modelError")}</span>}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", onError, {
              once: true,
            });
          }}
        >
          <color attach="background" args={["#eee5d6"]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[3, 5, 4]} intensity={3} />
          <Suspense fallback={null}>
            <Model url={url} onReady={() => setReady(true)} />
          </Suspense>
          <Controls zoom={zoom} angle={angle} reset={reset} />
        </Canvas>
        {!ready && (
          <p className="canvas-status" role="status">
            {t("loading")}
          </p>
        )}
      </div>
      <div className="toolbar">
        <button
          aria-label={t("zoomIn")}
          onClick={() => setZoom((v) => Math.max(2, v - 0.4))}
        >
          <Plus />
        </button>
        <button
          aria-label={t("zoomOut")}
          onClick={() => setZoom((v) => Math.min(7, v + 0.4))}
        >
          <Minus />
        </button>
        <button
          aria-label={t("rotateLeft")}
          onClick={() => setAngle((v) => v - 0.4)}
        >
          <RotateCcw />
        </button>
        <button
          aria-label={t("rotateRight")}
          onClick={() => setAngle((v) => v + 0.4)}
        >
          <RotateCw />
        </button>
        <button
          onClick={() => {
            setZoom(4);
            setAngle(0.45);
            setReset((v) => v + 1);
          }}
        >
          {t("reset3d")}
        </button>
      </div>
    </Boundary>
  );
}
