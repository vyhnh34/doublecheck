/** City vocabulary for the "City" detection sub-item. Matched with word
 * boundaries in detection.ts — full names case-insensitively, abbreviations
 * case-sensitively (so "SF" flags but "sf"/"la" inside ordinary words don't). */

export const CITY_NAMES: string[] = [
  // US — major cities
  "New York City", "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "Philly", "San Antonio", "San Diego", "Dallas", "Austin",
  "Jacksonville", "Fort Worth", "San Jose", "San Francisco", "Columbus",
  "Charlotte", "Indianapolis", "Seattle", "Denver", "Washington", "Boston",
  "Nashville", "El Paso", "Oklahoma City", "Las Vegas", "Vegas", "Detroit",
  "Portland", "Memphis", "Louisville", "Milwaukee", "Baltimore", "Albuquerque",
  "Tucson", "Fresno", "Sacramento", "Mesa", "Kansas City", "Atlanta",
  "Colorado Springs", "Omaha", "Raleigh", "Miami", "Virginia Beach",
  "Long Beach", "Oakland", "Minneapolis", "Tampa", "Tulsa", "Arlington",
  "Wichita", "Bakersfield", "Aurora", "New Orleans", "Cleveland", "Anaheim",
  "Honolulu", "Henderson", "Stockton", "Riverside", "Lexington",
  "Corpus Christi", "Orlando", "Irvine", "Cincinnati", "Santa Ana", "Newark",
  "Saint Paul", "St. Paul", "Pittsburgh", "Greensboro", "Durham", "Lincoln",
  "Jersey City", "Plano", "Anchorage", "St. Louis", "Saint Louis", "Madison",
  "Chandler", "Gilbert", "Reno", "Buffalo", "Chula Vista", "Fort Wayne",
  "Lubbock", "Toledo", "St. Petersburg", "Laredo", "Irving", "Chesapeake",
  "Glendale", "Winston-Salem", "Scottsdale", "Garland", "Boise", "Norfolk",
  "Spokane", "Fremont", "Richmond", "Santa Clarita", "San Bernardino",
  "Baton Rouge", "Hialeah", "Tacoma", "Modesto", "Huntsville", "Des Moines",
  "Frisco", "Rochester", "Yonkers", "Fayetteville", "Worcester", "Columbia",
  "Cape Coral", "McKinney", "Little Rock", "Amarillo", "Augusta",
  "Salt Lake City", "Montgomery", "Birmingham", "Grand Rapids", "Tallahassee",
  "Huntington Beach", "Sioux Falls", "Knoxville", "Providence", "Akron",
  "Brooklyn", "Queens", "Manhattan", "The Bronx", "Staten Island",

  // World — major cities
  "London", "Paris", "Tokyo", "Beijing", "Shanghai", "Hong Kong", "Singapore",
  "Seoul", "Sydney", "Melbourne", "Brisbane", "Perth", "Auckland",
  "Wellington", "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa",
  "Mexico City", "São Paulo", "Sao Paulo", "Rio de Janeiro", "Buenos Aires",
  "Lima", "Santiago", "Bogotá", "Bogota", "Madrid", "Barcelona", "Lisbon",
  "Rome", "Milan", "Naples", "Berlin", "Munich", "Hamburg", "Frankfurt",
  "Cologne", "Amsterdam", "Rotterdam", "Brussels", "Vienna", "Zurich",
  "Geneva", "Stockholm", "Oslo", "Copenhagen", "Helsinki", "Dublin",
  "Edinburgh", "Glasgow", "Manchester", "Birmingham UK", "Moscow", "Kyiv",
  "Istanbul", "Athens", "Warsaw", "Prague", "Budapest", "Bucharest", "Dubai",
  "Abu Dhabi", "Doha", "Riyadh", "Jeddah", "Tel Aviv", "Jerusalem", "Cairo",
  "Casablanca", "Nairobi", "Lagos", "Accra", "Johannesburg", "Cape Town",
  "Mumbai", "Delhi", "New Delhi", "Bangalore", "Bengaluru", "Hyderabad",
  "Chennai", "Kolkata", "Pune", "Karachi", "Lahore", "Dhaka", "Colombo",
  "Bangkok", "Jakarta", "Manila", "Kuala Lumpur", "Hanoi", "Ho Chi Minh City",
  "Saigon", "Phnom Penh", "Taipei", "Osaka", "Kyoto", "Nagoya", "Yokohama",
];

/** Matched case-sensitively so lowercase letter pairs inside ordinary words
 * ("la" in "plan") never flag. */
export const CITY_ABBREVIATIONS: string[] = [
  "NYC", "SF", "LA", "DC", "ATL", "NOLA", "OKC", "SLC", "KC", "HK",
];
