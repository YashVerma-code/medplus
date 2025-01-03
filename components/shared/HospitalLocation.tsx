import useGlobalStore from "@/zustand/useProps";
import { useEffect } from "react";

type MapProps = {
  latitude: number;
  longitude: number;
  placeId: number;
};

const HospitalLocation: React.FC<MapProps> = ({
  latitude,
  longitude,
  placeId,
}) => {
  const { setCheckedIndex } = useGlobalStore();
  useEffect(() => {
    setCheckedIndex(placeId); // Update state only when placeId changes
  }, [placeId, setCheckedIndex]);

  // console.log("Latitude and Longitude", latitude, longitude);
  const zoomPadding = 0.003; // Adjust this value for desired zoom
  const bbox = `${longitude - zoomPadding},${latitude - zoomPadding},${
    longitude + zoomPadding
  },${latitude + zoomPadding}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <iframe
      width="80%"
      height="500"
      frameBorder="0"
      src={mapUrl}
      title="OpenStreetMap"
      className="rounded-lg shadow-xl shadow-slate-400"
    ></iframe>
  );
};

export default HospitalLocation;
