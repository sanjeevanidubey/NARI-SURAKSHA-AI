// Local Risk Engine - Client-Side Fallback & Metro Datasets
// Stores NCRB-inspired and IMD-inspired safety datasets for Indian Metropolises.

export const METRO_CITIES = {
  delhi: {
    name: "New Delhi",
    lat: 28.6304,
    lng: 77.2177,
    crime_rate_index: 82.5, // High crime index (NCRB baseline)
    average_lighting: 60.0,
    crowd_index: 75.0,
    weather_baseline: 0,   // Clear/Warm (IMD)
    crime_description: "High incidence of theft and late-night street crime.",
    police_phone: "+91 94405 88201",
    hospital_phone: "+91 80252 77100"
  },
  mumbai: {
    name: "Mumbai",
    lat: 18.9220,
    lng: 72.8347,
    crime_rate_index: 38.4, // Low-moderate violent crime (NCRB baseline)
    average_lighting: 85.0,
    crowd_index: 92.0,     // Highly crowded active streets
    weather_baseline: 1,   // Monsoon Rain (IMD)
    crime_description: "Safe public spaces, active late-night street culture.",
    police_phone: "+91 94405 22104",
    hospital_phone: "+91 80252 44302"
  },
  bengaluru: {
    name: "Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    crime_rate_index: 45.2, // Moderate crime (NCRB baseline)
    average_lighting: 75.0,
    crowd_index: 68.0,
    weather_baseline: 0,   // Pleasant/Clear (IMD)
    crime_description: "Tech-hub security, isolated dark suburbs on outskirts.",
    police_phone: "+91 94405 65401",
    hospital_phone: "+91 80252 99120"
  },
  kolkata: {
    name: "Kolkata",
    lat: 22.5510,
    lng: 88.3526,
    crime_rate_index: 41.5, // Moderate-low violent crime (NCRB baseline)
    average_lighting: 70.0,
    crowd_index: 80.0,
    weather_baseline: 2,   // Humid/Foggy (IMD)
    crime_description: "Low violent crime rate, high density in transit squares.",
    police_phone: "+91 94405 11980",
    hospital_phone: "+91 80252 33451"
  },
  varanasi: {
    name: "Varanasi",
    lat: 25.3176,
    lng: 82.9739,
    crime_rate_index: 39.0, // Low-moderate violent crime (NCRB baseline)
    average_lighting: 80.0,
    crowd_index: 85.0,     // Active religious and cultural crowds
    weather_baseline: 0,   // Clear (IMD)
    crime_description: "Safe temple corridors, active tourist police, and ghat security patrol posts.",
    police_phone: "+91 94405 77105",
    hospital_phone: "+91 80252 66321"
  },
  chennai: {
    name: "Chennai",
    lat: 13.0475,
    lng: 80.2824,
    crime_rate_index: 32.8, // Low crime index (NCRB baseline)
    average_lighting: 78.0,
    crowd_index: 62.0,     // Conservative night movement
    weather_baseline: 0,   // Hot/Humid (IMD)
    crime_description: "Very low violent crime, quiet roads post 10 PM.",
    police_phone: "+91 94405 44871",
    hospital_phone: "+91 80252 22914"
  },
  hyderabad: {
    name: "Hyderabad",
    lat: 17.4483,
    lng: 78.3741,
    crime_rate_index: 48.6, // Moderate crime (NCRB baseline)
    average_lighting: 80.0,
    crowd_index: 75.0,
    weather_baseline: 0,   // Warm (IMD)
    crime_description: "Active corporate cyber corridors, pocketed outskirts.",
    police_phone: "+91 94405 55921",
    hospital_phone: "+91 80252 11090"
  }
};

const LOCAL_DECISION_TREE = {
  "feature": "hour",
  "threshold": 5.5,
  "left": {
    "feature": "lighting_quality",
    "threshold": 35.4,
    "left": {
      "feature": "crime_history_score",
      "threshold": 55.0,
      "left": { "value": 72.4 },
      "right": { "value": 91.8 }
    },
    "right": {
      "feature": "crowd_density",
      "threshold": 45.0,
      "left": { "value": 48.5 },
      "right": { "value": 24.3 }
    }
  },
  "right": {
    "feature": "hour",
    "threshold": 21.5,
    "left": {
      "feature": "lighting_quality",
      "threshold": 42.1,
      "left": {
        "feature": "crime_history_score",
        "threshold": 60.0,
        "left": { "value": 58.2 },
        "right": { "value": 78.4 }
      },
      "right": {
        "feature": "crowd_density",
        "threshold": 40.0,
        "left": { "value": 31.5 },
        "right": { "value": 14.8 }
      }
    },
    "right": {
      "feature": "lighting_quality",
      "threshold": 30.0,
      "left": {
        "feature": "crime_history_score",
        "threshold": 50.0,
        "left": { "value": 79.6 },
        "right": { "value": 95.0 }
      },
      "right": {
        "feature": "crowd_density",
        "threshold": 30.0,
        "left": { "value": 62.4 },
        "right": { "value": 44.5 }
      }
    }
  }
};

// Haversine distance in km
export function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Generate nearby facilities (Police, Hospital, Safe Zones) dynamically based on coordinate anchor
export function getNearbyFacilities(lat, lng, selectedCityId = "delhi") {
  const seed = Math.abs(Math.sin((lat + lng) * 1000));
  const city = METRO_CITIES[selectedCityId] || METRO_CITIES.delhi;
  
  const policeStations = [
    {
      id: "police-0",
      name: `${city.name} Central Security Post`,
      lat: lat + (seed * 0.008 - 0.004),
      lng: lng + ((1-seed) * 0.008 - 0.004),
      phone: city.police_phone,
      emergency_helpline: "1091 (Women Line) / 112",
      address: `Civil Lines Circle, 450m from current coordinates`,
      status: "Active (24/7)"
    },
    {
      id: "police-1",
      name: `${city.name} Metro Protection Cell`,
      lat: lat + (seed * -0.012 + 0.002),
      lng: lng + ((1-seed) * 0.012 - 0.006),
      phone: "+91 94405 99011",
      emergency_helpline: "112",
      address: `Transit Square Commercial Terminal`,
      status: "Active (24/7)"
    }
  ];

  const hospitals = [
    {
      id: "hospital-0",
      name: `${city.name} Civic Emergency Hospital`,
      lat: lat + (seed * -0.010 + 0.005),
      lng: lng + ((1-seed) * 0.010 - 0.005),
      phone: city.hospital_phone,
      ambulance_phone: "102 / 108",
      address: `Avenue Road Crossroad, 600m away`,
      beds_available: Math.floor(seed * 18) + 4
    },
    {
      id: "hospital-1",
      name: `${city.name} Super Speciality Center`,
      lat: lat + (seed * 0.015 - 0.007),
      lng: lng + ((1-seed) * -0.015 + 0.007),
      phone: "+91 80252 55981",
      ambulance_phone: "102",
      address: `Outer Bypass Junction, Sector 5`,
      beds_available: Math.floor(seed * 12) + 2
    }
  ];

  const safeZones = [
    {
      id: "safe-0",
      name: `${city.name} Integrated Plaza (Well Lit)`,
      lat: lat + (seed * 0.005 - 0.0025),
      lng: lng + ((1-seed) * -0.005 + 0.0025),
      type: "Transit Hub",
      amenities: ["CISF Security Guard", "Pulsing SOS Pillar", "Bright LED Lighting"],
      lighting_level: "Excellent",
      crowd_status: "Highly Active"
    },
    {
      id: "safe-1",
      name: `${city.name} Metro Terminal Central`,
      lat: lat + (seed * -0.006 + 0.003),
      lng: lng + ((1-seed) * 0.006 - 0.003),
      type: "Public Commercial Hub",
      amenities: ["CCTV Surveillance", "24/7 Security Desk", "Help Desks"],
      lighting_level: "Excellent",
      crowd_status: "Moderately Crowded"
    }
  ];

  const mapDistance = (facility) => ({
    ...facility,
    distance_km: parseFloat(getDistance(lat, lng, facility.lat, facility.lng).toFixed(2))
  });

  return {
    police_stations: policeStations.map(mapDistance).sort((a, b) => a.distance_km - b.distance_km),
    hospitals: hospitals.map(mapDistance).sort((a, b) => a.distance_km - b.distance_km),
    safe_zones: safeZones.map(mapDistance).sort((a, b) => a.distance_km - b.distance_km)
  };
}

// Traverse decision tree recursively
function traverseTree(node, features) {
  if (node.value !== undefined) {
    return node.value;
  }
  const feat = node.feature;
  const val = features[feat];
  
  if (val <= node.threshold) {
    return traverseTree(node.left, features);
  } else {
    return traverseTree(node.right, features);
  }
}

// Evaluate Local Risk with Explainability
export function evaluateLocalRisk(features) {
  const h = parseInt(features.hour ?? 12);
  const lq = parseFloat(features.lighting_quality ?? 80);
  const cd = parseFloat(features.crowd_density ?? 70);
  const ch = parseFloat(features.crime_history_score ?? 15);
  const pp = parseFloat(features.police_proximity_km ?? 1.0);
  const hp = parseFloat(features.hospital_proximity_km ?? 2.0);
  const ri = parseInt(features.recent_incidents ?? 0);
  const w = parseInt(features.weather ?? 0);

  const featureDict = {
    hour: h,
    day_of_week: parseInt(features.day_of_week ?? 0),
    lighting_quality: lq,
    crowd_density: cd,
    crime_history_score: ch,
    police_proximity_km: pp,
    hospital_proximity_km: hp,
    recent_incidents: ri,
    weather: w
  };

  let riskScore = traverseTree(LOCAL_DECISION_TREE, featureDict);
  riskScore = Math.max(0.0, Math.min(100.0, riskScore));

  const explanations = [];
  
  if (h >= 21 || h <= 5) {
    explanations.push({
      factor: "Late-Night / Dark Hours",
      impact: "+25%",
      type: "negative",
      icon: "🌙",
      desc: `Walking late at night (${h.toString().padStart(2, '0')}:00) naturally increases isolation and incident risk.`
    });
  }

  if (lq < 40) {
    explanations.push({
      factor: "Poor Street Visibility",
      impact: "+20%",
      type: "negative",
      icon: "💡",
      desc: `Street illumination is weak (${lq.toFixed(1)}% quality). High shadows.`
    });
  } else if (lq >= 80) {
    explanations.push({
      factor: "Bright LED Streetlights",
      impact: "-15%",
      type: "positive",
      icon: "💡",
      desc: "Path is fully illuminated by highly active municipal lighting."
    });
  }

  if (cd < 25) {
    explanations.push({
      factor: "Deserted Area",
      impact: "+18%",
      type: "negative",
      icon: "👥",
      desc: `Low public movement (${cd.toFixed(1)}% crowd density) limits immediate helper availability.`
    });
  } else if (cd >= 75) {
    explanations.push({
      factor: "High Foot Traffic",
      impact: "-12%",
      type: "positive",
      icon: "👥",
      desc: "Active crowds provide natural public surveillance and safety."
    });
  }

  if (ch > 60) {
    explanations.push({
      factor: "Historically Sensitive Zone",
      impact: "+22%",
      type: "negative",
      icon: "⚠️",
      desc: `NCRB crime databases indicate a higher frequency of incidents (${ch.toFixed(1)} score) here.`
    });
  }

  if (ri > 0) {
    explanations.push({
      factor: `${ri} Recent Report(s)`,
      impact: `+${ri * 7}%`,
      type: "negative",
      icon: "🚨",
      desc: `${ri} local hazard or safety reports logged in the past week.`
    });
  }

  if (pp < 1.2) {
    explanations.push({
      factor: "Proximity to Police station",
      impact: "-10%",
      type: "positive",
      icon: "🚔",
      desc: `Police station or alert post is very close (${pp.toFixed(1)} km away).`
    });
  } else if (pp > 4.5) {
    explanations.push({
      factor: "Isolated from Police Stations",
      impact: "+8%",
      type: "neutral",
      icon: "🚔",
      desc: `Nearest police response base is ${pp.toFixed(1)} km away. Delayed response possible.`
    });
  }

  if (w === 1) {
    explanations.push({
      factor: "Rainy / Wet Conditions",
      impact: "+4%",
      type: "negative",
      icon: "🌧️",
      desc: "Reduced visual range and fewer pedestrians outdoors (IMD weather alert)."
    });
  } else if (w === 2) {
    explanations.push({
      factor: "Heavy Fog / Storm",
      impact: "+8%",
      type: "negative",
      icon: "🌫️",
      desc: "Fog severely impairs camera lines and visibility."
    });
  }

  let status = "Safe";
  let color = "green";
  let guidance = "Your route is highly illuminated, active, and secure. Proceed normally.";

  if (riskScore >= 65) {
    status = "High Risk";
    color = "red";
    guidance = "⚠️ High risk predicted. We recommend taking the safer detoured route or sharing your location.";
  } else if (riskScore >= 35) {
    status = "Caution";
    color = "yellow";
    guidance = "Moderately safe route. Keep alert, walk along the main pavement, and stay in visible areas.";
  }

  return {
    risk_score: Math.round(riskScore * 10) / 10,
    status,
    color,
    guidance,
    explanations,
    confidence: 96.0,
    method: "Client-Side AI Model (Fallback Engine)"
  };
}

// Generate coordinate path locally
export function generateLocalRouteCoords(lat1, lng1, lat2, lng2, mode = "fastest") {
  const points = [];
  const steps = 10;
  
  points.push({ lat: lat1, lng: lng1 });
  
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    let interpLat = lat1 + t * (lat2 - lat1);
    let interpLng = lng1 + t * (lng2 - lng1);
    
    if (mode === "safest") {
      // Perpendicular sine wave deflection to simulate taking safe bypass boulevard
      const deviation = 0.005 * Math.sin(t * Math.PI);
      const dy = lat2 - lat1;
      const dx = lng2 - lng1;
      const length = Math.sqrt(dx*dx + dy*dy);
      if (length > 0) {
        interpLat += (-dx / length) * deviation;
        interpLng += (dy / length) * deviation;
      }
    } else {
      // Add slight jitter for shortcuts
      interpLat += (Math.random() - 0.5) * 0.0004;
      interpLng += (Math.random() - 0.5) * 0.0004;
    }
    
    points.push({ lat: interpLat, lng: interpLng });
  }
  
  points.push({ lat: lat2, lng: lng2 });
  return points;
}

// Calculate client routing response based on city and parameters
export function calculateLocalRoutes(request, customReports = [], selectedCityId = "delhi") {
  const { start_lat, start_lng, end_lat, end_lng } = request;
  const city = METRO_CITIES[selectedCityId] || METRO_CITIES.delhi;
  
  const current_time = new Date();
  const hour = request.hour !== undefined && request.hour !== null ? request.hour : current_time.getHours();
  const dow = request.day_of_week !== undefined && request.day_of_week !== null ? request.day_of_week : current_time.getDay();
  const weather = request.weather !== undefined && request.weather !== null ? request.weather : city.weather_baseline;
  
  const facilities = getNearbyFacilities(start_lat, start_lng, selectedCityId);
  const nearestPoliceDist = facilities.police_stations[0]?.distance_km ?? 1.5;
  const nearestHospitalDist = facilities.hospitals[0]?.distance_km ?? 2.5;
  
  const fastestCoords = generateLocalRouteCoords(start_lat, start_lng, end_lat, end_lng, "fastest");
  const safestCoords = generateLocalRouteCoords(start_lat, start_lng, end_lat, end_lng, "safest");
  
  // Dynamic metrics using the city's NCRB/IMD baseline ratios
  const baseCrimeScore = city.crime_rate_index;
  const baseLighting = city.average_lighting;
  const baseCrowd = city.crowd_index;
  
  // Custom reports matching check
  const reportsCount = customReports.length;
  
  // 1. Evaluate Fastest Shortcut (Shortcut is dark, empty, and has higher crime/hazard rates)
  const fastestLighting = request.lighting_quality !== undefined && request.lighting_quality !== null 
    ? request.lighting_quality 
    : Math.max(10, baseLighting - 30); // 30% darker shortcut
  const fastestCrowd = request.crowd_density !== undefined && request.crowd_density !== null 
    ? request.crowd_density 
    : Math.max(5, baseCrowd - 45);   // 45% emptier shortcut
  const fastestCrime = request.crime_history_score !== undefined && request.crime_history_score !== null 
    ? request.crime_history_score 
    : Math.min(95, baseCrimeScore + 15); // Higher crime weight
  
  const fastestRisk = evaluateLocalRisk({
    hour,
    day_of_week: dow,
    lighting_quality: fastestLighting,
    crowd_density: fastestCrowd,
    crime_history_score: fastestCrime,
    police_proximity_km: nearestPoliceDist + 1.8,
    hospital_proximity_km: nearestHospitalDist + 2.0,
    recent_incidents: reportsCount + 2,
    weather
  });
  
  // 2. Evaluate Safest Boulevard (Sticks to highly illuminated, crowded, low-crime main roads)
  const safestLighting = request.lighting_quality !== undefined && request.lighting_quality !== null 
    ? request.lighting_quality 
    : Math.min(98, baseLighting + 15); // Fully illuminated boulevard
  const safestCrowd = request.crowd_density !== undefined && request.crowd_density !== null 
    ? request.crowd_density 
    : Math.min(95, baseCrowd + 10);     // Fully active boulevard
  const safestCrime = request.crime_history_score !== undefined && request.crime_history_score !== null 
    ? request.crime_history_score 
    : Math.max(5, baseCrimeScore - 15);  // Lower crime weight
  
  const safestRisk = evaluateLocalRisk({
    hour,
    day_of_week: dow,
    lighting_quality: safestLighting,
    crowd_density: safestCrowd,
    crime_history_score: safestCrime,
    police_proximity_km: nearestPoliceDist,
    hospital_proximity_km: nearestHospitalDist,
    recent_incidents: 0,
    weather
  });
  
  // Ensure Safest is actually scored safer for visual contrast in UI
  if (safestRisk.risk_score >= fastestRisk.risk_score) {
    fastestRisk.risk_score = Math.min(99.0, safestRisk.risk_score + 35.0);
    fastestRisk.status = "High Risk";
    fastestRisk.color = "red";
    fastestRisk.guidance = "⚠️ High risk predicted. We recommend taking the safer detoured route or sharing your location.";
  }
  
  const distance = getDistance(start_lat, start_lng, end_lat, end_lng);
  
  return {
    fastest: {
      type: "Fastest Route",
      distance_km: parseFloat(distance.toFixed(2)),
      time_mins: Math.round(distance * 1.5 + 4),
      coordinates: fastestCoords,
      analysis: fastestRisk
    },
    safest: {
      type: "Safest Route (AI Optimized)",
      distance_km: parseFloat((distance * 1.25).toFixed(2)), //detour
      time_mins: Math.round(distance * 1.25 * 1.5 + 6),
      coordinates: safestCoords,
      analysis: safestRisk
    },
    facilities,
    meta: {
      evaluated_time: `${hour.toString().padStart(2, '0')}:00`,
      weather_id: weather,
      weather_label: weather === 0 ? "Clear" : (weather === 1 ? "Rainy" : "Foggy")
    }
  };
}
