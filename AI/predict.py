import os
import json

def predict_tree_node(node, features):
    # If it's a leaf node, return the value
    if "value" in node:
        return node["value"]
        
    # Check split
    feature = node["feature"]
    threshold = node["threshold"]
    val = features.get(feature)
    
    if val is None:
        # Fallback if feature is missing, traverse left by default
        return predict_tree_node(node["left"], features)
        
    if val <= threshold:
        return predict_tree_node(node["left"], features)
    else:
        return predict_tree_node(node["right"], features)

def predict_risk(hour, day_of_week, lighting_quality, crowd_density, crime_history_score, 
                 police_proximity_km, hospital_proximity_km, recent_incidents, weather):
    
    ml_dir = "../backend/app/ml"
    tree_path = os.path.join(ml_dir, "safety_tree.json")
    
    if not os.path.exists(tree_path):
        raise FileNotFoundError(f"Model tree file not found at {tree_path}. Run train.py first.")
        
    with open(tree_path, "r") as f:
        tree = json.load(f)
        
    features = {
        'hour': hour,
        'day_of_week': day_of_week,
        'lighting_quality': lighting_quality,
        'crowd_density': crowd_density,
        'crime_history_score': crime_history_score,
        'police_proximity_km': police_proximity_km,
        'hospital_proximity_km': hospital_proximity_km,
        'recent_incidents': recent_incidents,
        'weather': weather
    }
    
    risk_score = predict_tree_node(tree, features)
    return max(0.0, min(100.0, risk_score))

def main():
    print("Testing predictions on custom pure-Python decision tree model...")
    try:
        # High Risk Scenario: 11 PM, empty street, poor lighting, high crime rate
        high_risk = predict_risk(
            hour=23,
            day_of_week=5,
            lighting_quality=10.0,
            crowd_density=5.0,
            crime_history_score=80.0,
            police_proximity_km=4.5,
            hospital_proximity_km=8.0,
            recent_incidents=3,
            weather=1  # Rain
        )
        
        # Low Risk Scenario: 2 PM, crowded main street, bright lighting, low crime rate
        low_risk = predict_risk(
            hour=14,
            day_of_week=2,
            lighting_quality=95.0,
            crowd_density=90.0,
            crime_history_score=10.0,
            police_proximity_km=0.5,
            hospital_proximity_km=1.2,
            recent_incidents=0,
            weather=0  # Clear
        )
        
        print(f"\n[Test Predict - High Risk Scenario]: {high_risk:.2f}% Risk")
        print(f"[Test Predict - Low Risk Scenario]: {low_risk:.2f}% Risk")
    except Exception as e:
        print(f"Error making prediction: {e}")

if __name__ == "__main__":
    main()
