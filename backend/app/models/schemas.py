from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class SafetyFeatures(BaseModel):
    hour: int = Field(..., ge=0, le=23, description="Hour of the day (0-23)")
    day_of_week: int = Field(..., ge=0, le=6, description="Day of the week (0: Monday, 6: Sunday)")
    lighting_quality: float = Field(..., ge=0.0, le=100.0, description="Street lighting quality (0: dark, 100: bright)")
    crowd_density: float = Field(..., ge=0.0, le=100.0, description="Pedestrian crowd density (0: empty, 100: packed)")
    crime_history_score: float = Field(..., ge=0.0, le=100.0, description="Historical crime rate (0: none, 100: extremely high)")
    police_proximity_km: float = Field(..., ge=0.0, le=50.0, description="Distance to nearest police station in km")
    hospital_proximity_km: float = Field(..., ge=0.0, le=50.0, description="Distance to nearest hospital in km")
    recent_incidents: int = Field(..., ge=0, le=10, description="Count of recent incidents in the past week")
    weather: int = Field(..., ge=0, le=2, description="Weather condition (0: Clear, 1: Rain, 2: Fog)")

class RouteRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    # Circumstances override if the user sets them in the simulator
    hour: Optional[int] = None
    day_of_week: Optional[int] = None
    lighting_quality: Optional[float] = None
    crowd_density: Optional[float] = None
    crime_history_score: Optional[float] = None
    weather: Optional[int] = None

class ReportRequest(BaseModel):
    latitude: float
    longitude: float
    type: str  # "broken_light", "harassment", "construction", "isolated_area"
    description: str
    severity: int  # 1: minor, 2: moderate, 3: severe
