import { lazy, Suspense, useState } from "react";
import { Box, X } from "lucide-react";
import { useApp } from "../context";
import { MediaImage } from "./MediaImage";
const Scene = lazy(() => import("./ThreeScene"));
export function ObjectViewer({ id }: { id: string }) {
  const { registry, prefs, t } = useApp();
  const object = registry.objects.find((o) => o.id === id)!;
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const finalAsset = registry.assets.find((a) => a.assetId === object.mediaId);
  const url = finalAsset?.url ?? `/media/demo/${id}.glb`;
  return (
    <section className="object-viewer">
      <div className="object-title">
        <div>
          <span className="eyebrow">
            {t("object")} · <bdi>{id}</bdi>
          </span>
          <h3>{object.name[prefs.locale]}</h3>
        </div>
        <Box size={24} />
      </div>
      {open && url && !failed ? (
        <Suspense
          fallback={
            <div className="viewer-loading" role="status">
              {t("loading")}
            </div>
          }
        >
          <Scene url={url} onError={() => setFailed(true)} />
        </Suspense>
      ) : (
        <MediaImage
          className="object-fallback"
          src={`/media/demo/${id}.svg`}
          alt={`${object.name[prefs.locale]} — ${t("objectCaution")}`}
        />
      )}
      <p className="small-note">{t("objectCaution")}</p>
      {(failed || !url) && (
        <p role={failed ? "alert" : undefined}>
          {t(failed ? "modelError" : "modelMissing")}
        </p>
      )}
      {url && (!open || failed) ? (
        <button
          className="button secondary"
          onClick={() => {
            setFailed(false);
            setOpen(true);
          }}
        >
          <Box size={18} />
          {t(failed ? "retry" : "view3d")}
        </button>
      ) : open ? (
        <button
          className="button secondary"
          onClick={() => {
            setOpen(false);
            setFailed(false);
          }}
        >
          <X size={18} />
          {t("close3d")}
        </button>
      ) : null}
    </section>
  );
}
