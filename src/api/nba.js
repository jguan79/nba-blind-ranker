export async function getStandings() {
  const res = await fetch(
    "https://v2.nba.api-sports.io/standings?league=standard&season=2021",
    {
      method: "GET",
      headers: {
        "x-apisports-key": import.meta.env.VITE_APISPORTS_KEY
      }
    }
  );

  if (!res.ok) {
    console.error("API ERROR:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();

  console.log("API RAW DATA:", data);

  return data.response || [];
}
