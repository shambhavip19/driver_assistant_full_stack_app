import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { fetchDemandMap } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

function getZoneColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#facc15";
  return "#f87171";
}

export function DemandMapPage() {
  const [zones, setZones] = useState<any[]>([]);
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchDemandMap().then((data) => setZones(data.zones)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!zones.length || !mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [80.2707, 13.0827],
      zoom: 10.5,
      minZoom: 8,
      maxZoom: 14,
    });

    map.on("load", () => {
      const features = zones.map((zone) => ({
        type: "Feature",
        properties: {
          id: zone.id,
          name: zone.name,
          score: zone.score,
          pickupCount: zone.pickupCount,
          timeWindow: zone.timeWindow,
        },
        geometry: {
          type: "Point",
          coordinates: [zone.lng, zone.lat],
        },
      }));

      map.addSource("demand-zones", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      map.addLayer({
        id: "demand-circles",
        type: "circle",
        source: "demand-zones",
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["get", "score"],
            50,
            16,
            90,
            28,
          ],
          "circle-color": ["step", ["get", "score"], "#f87171", 65, "#facc15", 80, "#22c55e"],
          "circle-opacity": 0.7,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: true });

      map.on("click", "demand-circles", (event: maplibregl.MapMouseEvent) => {
        const mapEvent = event as any;
        const feature = mapEvent.features?.[0];
        if (!feature) return;
        const { name, score, pickupCount, timeWindow } = feature.properties as Record<string, any>;
        popup
          .setLngLat(mapEvent.lngLat)
          .setHTML(
            `<div style="font-family: sans-serif; color: #0f172a; min-width:150px;">
              <strong>${name}</strong><br />
              Demand score: ${score}<br />
              Pickups: ${pickupCount}<br />
              Window: ${timeWindow}
            </div>`,
          )
          .addTo(map);
      });
    });

    return () => map.remove();
  }, [zones]);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Demand map</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Chennai demand hotspots</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geographic demand overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> High demand</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-yellow-400" /> Moderate demand</span>
            <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /> Low demand</span>
          </div>
          <div ref={mapContainer} className="h-[540px] w-full overflow-hidden rounded-2xl border border-slate-200" />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {zones.map((zone) => (
          <Card key={zone.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-slate-800">{zone.name}</p>
                <span className="rounded-full px-2 py-1 text-xs font-medium" style={{ backgroundColor: `${getZoneColor(zone.score)}22`, color: getZoneColor(zone.score) }}>
                  {zone.score}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">Pickups: {zone.pickupCount}</p>
              <p className="text-sm text-slate-600">Window: {zone.timeWindow}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
