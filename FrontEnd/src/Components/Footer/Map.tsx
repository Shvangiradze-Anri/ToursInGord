import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

import Places from "./Places";

type LatLngLiteral = google.maps.LatLngLiteral;
type MapOptions = google.maps.MapOptions;

function Map() {
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 42.4576, lng: 42.5246 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "2c9b7255eb27c333",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );

  const [office, setOffice] = useState<LatLngLiteral>();

  useEffect(() => {
    setOffice({ lat: 42.4576, lng: 42.5246 });
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onLoad = useCallback(async (map: any) => (mapRef.current = map), []);
  return (
    <div className="flex flex-col  h-96">
      <div className="grid w-full p-4  text-center bg-[#00e1ff0f] text-blue-800 dark:text-[#e89c3e] text-res-md">
        <h1>Places</h1>
        <Places
          setOffice={(position) => {
            setOffice(position);
            mapRef.current?.panTo(position);
          }}
        />
      </div>
      <div className="w-full h-full">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {office && <Marker position={office} />}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Map;
