import math
import random
from typing import List, Dict, Any

class OSMService:
    @staticmethod
    def get_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        # Haversine formula
        R = 6371.0  # Earth's radius in km
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        return R * c

    @staticmethod
    def get_nearby_facilities(lat: float, lng: float) -> Dict[str, List[Dict[str, Any]]]:
        # Generate realistic, coordinate-relative facilities
        # In real life this would query OpenStreetMap, we mock it to be fast and fully reliable
        random.seed(int((lat + lng) * 10000))
        
        police_names = ["Central Police Division", "Metro Security Hub", "Women Helpline Desk", "District Help Post"]
        hospital_names = ["Grace General Hospital", "City Emergency Care", "St. Jude Hospital", "Apex Medical Center"]
        pharmacy_names = ["Care 24x7 Pharmacy", "Wellness Drugstore", "QuickAid Apothecary"]
        
        police_stations = []
        for i, name in enumerate(police_names):
            offset_lat = random.uniform(-0.02, 0.02)
            offset_lng = random.uniform(-0.02, 0.02)
            p_lat = lat + offset_lat
            p_lng = lng + offset_lng
            dist = OSMService.get_distance(lat, lng, p_lat, p_lng)
            
            police_stations.append({
                "id": f"police-{i}",
                "name": name,
                "lat": p_lat,
                "lng": p_lng,
                "distance_km": round(dist, 2),
                "phone": f"+91 94405 {random.randint(10000, 99999)}",
                "emergency_helpline": "1091 (Women Helpline) / 112",
                "address": f"Sector {random.randint(1, 15)}, Near Metro Station, City Hub",
                "status": "Active (24/7)"
            })
            
        hospitals = []
        for i, name in enumerate(hospital_names):
            offset_lat = random.uniform(-0.03, 0.03)
            offset_lng = random.uniform(-0.03, 0.03)
            h_lat = lat + offset_lat
            h_lng = lng + offset_lng
            dist = OSMService.get_distance(lat, lng, h_lat, h_lng)
            
            hospitals.append({
                "id": f"hospital-{i}",
                "name": name,
                "lat": h_lat,
                "lng": h_lng,
                "distance_km": round(dist, 2),
                "phone": f"+91 80252 {random.randint(10000, 99999)}",
                "ambulance_phone": "102 / 108",
                "address": f"Block {random.choice(['A', 'B', 'C', 'D'])}, Main Highway, City",
                "beds_available": random.randint(5, 30)
            })
            
        safe_zones = []
        # Safe zones are highly-rated public spots with great lighting & crowds
        safe_names = ["City Center Mall", "Central Metro Station", "24/7 Plaza Food Court", "Sunrise Tech Park"]
        for i, name in enumerate(safe_names):
            offset_lat = random.uniform(-0.015, 0.015)
            offset_lng = random.uniform(-0.015, 0.015)
            s_lat = lat + offset_lat
            s_lng = lng + offset_lng
            dist = OSMService.get_distance(lat, lng, s_lat, s_lng)
            
            safe_zones.append({
                "id": f"safe-{i}",
                "name": name,
                "lat": s_lat,
                "lng": s_lng,
                "distance_km": round(dist, 2),
                "type": "Metro Station" if "Metro" in name else "Public Area",
                "amenities": ["24/7 Security", "CCTV Surveillance", "Bright Lighting"],
                "lighting_level": "Excellent",
                "crowd_status": "Moderately Crowded"
            })
            
        # Sort by distance
        police_stations.sort(key=lambda x: x['distance_km'])
        hospitals.sort(key=lambda x: x['distance_km'])
        safe_zones.sort(key=lambda x: x['distance_km'])
        
        return {
            "police_stations": police_stations,
            "hospitals": hospitals,
            "safe_zones": safe_zones
        }

    @staticmethod
    def generate_route_coordinates(start_lat: float, start_lng: float, end_lat: float, end_lng: float, mode: str = "fastest") -> List[Dict[str, float]]:
        # Generates a path between start and end.
        # For "safest", we add a slight detour (a bend) to bypass high-risk nodes.
        points = []
        steps = 10
        
        # Start point
        points.append({"lat": start_lat, "lng": start_lng})
        
        # Intermediate points
        for i in range(1, steps):
            t = i / steps
            
            # Linear interpolation
            interp_lat = start_lat + t * (end_lat - start_lat)
            interp_lng = start_lng + t * (end_lng - start_lng)
            
            if mode == "safest":
                # Add a sine-wave deviation in the middle to simulate taking a safer bypass road
                # This shifts coordinates slightly to the side
                deviation = 0.004 * math.sin(t * math.pi)
                # Apply deviation perpendicular to the path
                dy = end_lat - start_lat
                dx = end_lng - start_lng
                length = math.sqrt(dx*dx + dy*dy)
                if length > 0:
                    interp_lat += (-dx / length) * deviation
                    interp_lng += (dy / length) * deviation
            elif mode == "fastest":
                # Add a tiny noise to make it look like actual street routes
                interp_lat += random.uniform(-0.0003, 0.0003)
                interp_lng += random.uniform(-0.0003, 0.0003)
                
            points.append({"lat": interp_lat, "lng": interp_lng})
            
        # End point
        points.append({"lat": end_lat, "lng": end_lng})
        return points
