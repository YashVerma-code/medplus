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
  // const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`;

  return (
    <iframe
      width="90%"
      height="500"
      frameBorder="0"
      src={mapUrl}
      title="OpenStreetMap"
      className="rounded-lg drop-shadow-lg shadow-slate-400 w-full"
    ></iframe>
  );
};

export default HospitalLocation;
