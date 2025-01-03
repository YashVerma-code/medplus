export async function GET(
  req: Request,
) {
  const { searchParams } = new URL(req.url);
  const searchCity = searchParams.get('q') || "default";
  const updatedSearchCity=searchCity.trim().split(' ').join('%');
  let url;
  if (updatedSearchCity && updatedSearchCity !== "default") {
    url = `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(
      updatedSearchCity + " hospitals"
    )}&limit=20&accept-language=en-US,en&format=jsonv2`;
  } else {
    url = `https://nominatim.openstreetmap.org/search.php?q=nagpur+hospitals&limit=20&accept-language=en-US,en&format=jsonv2`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) { 
      console.log("Failed to fetch hospital data");
      return new Response(
        JSON.stringify({ error: "Failed to fetch hospital data" }),
        { status: response.status }
      );
    }

    const data = await response.json();
    // console.log("Data ",data);
    // console.log("Successfully fetched hospital data");
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.log("Something went wrong", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong", details: error }),
      { status: 500 }
    );
  }
}


