import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

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

  // Open Google Maps with given coordinates
  const openGoogleMaps = (position: LatLngLiteral) => {
    const { lat, lng } = position;
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(googleMapsUrl, "_blank"); // Open in a new tab
  };

  // Handle click event on the map
  const onMapClick = () => {
    if (office) {
      openGoogleMaps(office);
    }
  };

  return (
    <div className="flex flex-col h-96">
      <div className="w-full h-full">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
          onClick={onMapClick}
        >
          {office && <Marker position={office} />}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Map;
