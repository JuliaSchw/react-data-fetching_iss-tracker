import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import Controls from "../Controls/index";
import Map from "../Map/index";

const URL = "https://api.wheretheiss.at/v1/satellites/25544";

// FETCHING DATA START

const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch ISS coordinates");
  }
  const data = await response.json();
  return { longitude: data.longitude, latitude: data.latitude };
};

// FETCHING DATA END

export default function ISSTracker() {
  const { data, error } = useSWR(URL, fetcher);

  // INTERVAL START

  useEffect(() => {
    const timer = setInterval(() => {}, 5000);
    mutate(URL);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // INTERVAL END

  // ERROR HANDLING START

  if (error) {
    console.error(error);
  }

  // ERROR HANDLING END

  // REFRESH BUTTON START (don't forget to import mutate from SWR)

  const handleRefresh = () => {
    mutate(URL);
  };

  // REFRESH BUTTON END

  return (
    <main>
      <Map longitude={data?.longitude || 0} latitude={data?.latitude || 0} />
      <Controls
        longitude={data?.longitude || 0}
        latitude={data?.latitude || 0}
        onRefresh={handleRefresh}
      />
    </main>
  );
}
