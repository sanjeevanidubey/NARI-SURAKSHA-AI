import os
import json
import math
import random

# Pure-Python Custom Decision Tree Regressor for SafeHer AI
# This ensures 100% compatibility on all platforms without requiring numpy, pandas, or scikit-learn.

def generate_synthetic_data(num_samples=1000):
    random.seed(42)
    dataset = []
    
    for _ in range(num_samples):
        hour = random.randint(0, 23)
        day_of_week = random.randint(0, 6)
        lighting_quality = random.uniform(0.0, 100.0)
        crowd_density = random.uniform(0.0, 100.0)
        crime_history_score = random.uniform(0.0, 100.0)
        police_proximity_km = random.uniform(0.1, 10.0)
        hospital_proximity_km = random.uniform(0.1, 15.0)
        recent_incidents = random.randint(0, 5)
        weather = random.randint(0, 2)  # 0: Clear, 1: Rain, 2: Fog
        
        # Risk score calculation formula
        base_risk = 30.0
        
        # Night hour factors
        night_factor = 25.0 if (hour >= 21 or hour <= 5) else 0.0
        late_night_factor = 10.0 if (hour >= 23 or hour <= 3) else 0.0
        
        # Environmental factors
        lighting_effect = -0.35 * lighting_quality
        crowd_effect = -0.25 * crowd_density
        crime_effect = 0.40 * crime_history_score
        incidents_effect = 4.0 * recent_incidents
        police_effect = 1.5 * police_proximity_km
        
        weather_effect = 5.0 if weather == 1 else (8.0 if weather == 2 else 0.0)
        
        noise = random.normalvariate(0, 2.0)
        
        risk = (
            base_risk + 
            night_factor + 
            late_night_factor + 
            lighting_effect + 
            crowd_effect + 
            crime_effect + 
            incidents_effect + 
            police_effect + 
            weather_effect + 
            noise
        )
        
        # Clamp between 0.0 and 100.0
        risk = max(0.0, min(100.0, risk))
        
        dataset.append({
            'hour': hour,
            'day_of_week': day_of_week,
            'lighting_quality': lighting_quality,
            'crowd_density': crowd_density,
            'crime_history_score': crime_history_score,
            'police_proximity_km': police_proximity_km,
            'hospital_proximity_km': hospital_proximity_km,
            'recent_incidents': recent_incidents,
            'weather': weather,
            'risk_score': risk
        })
        
    return dataset

# Helper to calculate Mean Squared Error of a list of values
def calculate_mse(values):
    if not values:
        return 0.0
    mean = sum(values) / len(values)
    return sum((x - mean) ** 2 for x in values) / len(values)

# Find the best split point for a feature
def find_best_split(data, feature):
    best_mse = float('inf')
    best_threshold = None
    best_left_data = []
    best_right_data = []
    
    # Extract unique values of this feature
    values = sorted(list(set(row[feature] for row in data)))
    if len(values) <= 1:
        return best_mse, None, [], []
        
    # Try thresholds in between consecutive sorted values
    # To be fast, limit the number of thresholds tested (max 30)
    step = max(1, len(values) // 30)
    thresholds = []
    for idx in range(0, len(values) - 1, step):
        thresholds.append((values[idx] + values[idx+1]) / 2.0)
        
    for thresh in thresholds:
        left = [row for row in data if row[feature] <= thresh]
        right = [row for row in data if row[feature] > thresh]
        
        if not left or not right:
            continue
            
        left_targets = [row['risk_score'] for row in left]
        right_targets = [row['risk_score'] for row in right]
        
        # Weighted MSE of the split
        n_left, n_right = len(left_targets), len(right_targets)
        n_total = n_left + n_right
        
        combined_mse = (n_left / n_total) * calculate_mse(left_targets) + \
                       (n_right / n_total) * calculate_mse(right_targets)
                       
        if combined_mse < best_mse:
            best_mse = combined_mse
            best_threshold = thresh
            best_left_data = left
            best_right_data = right
            
    return best_mse, best_threshold, best_left_data, best_right_data

# Build the decision tree recursively
def build_tree(data, max_depth=5, min_samples_split=10, depth=0):
    targets = [row['risk_score'] for row in data]
    
    # Base cases: pure node, max depth, or too few samples
    if len(data) < min_samples_split or depth >= max_depth or len(set(targets)) == 1:
        return {"value": sum(targets) / len(targets)}
        
    features = [k for k in data[0].keys() if k != 'risk_score']
    best_feature = None
    best_threshold = None
    best_left = []
    best_right = []
    best_combined_mse = float('inf')
    
    for feat in features:
        mse, thresh, left, right = find_best_split(data, feat)
        if mse < best_combined_mse:
            best_combined_mse = mse
            best_feature = feat
            best_threshold = thresh
            best_left = left
            best_right = right
            
    # If no split was beneficial
    if best_feature is None or not best_left or not best_right:
        return {"value": sum(targets) / len(targets)}
        
    # Recurse
    left_child = build_tree(best_left, max_depth, min_samples_split, depth + 1)
    right_child = build_tree(best_right, max_depth, min_samples_split, depth + 1)
    
    return {
        "feature": best_feature,
        "threshold": best_threshold,
        "left": left_child,
        "right": right_child
    }

def main():
    print("Generating synthetic safety dataset (pure Python)...")
    data = generate_synthetic_data(1500)
    
    print("Training Custom Decision Tree Regressor (Depth = 5)...")
    tree = build_tree(data, max_depth=5, min_samples_split=15)
    
    # Ensure backend ml folder exists
    ml_dir = "../backend/app/ml"
    os.makedirs(ml_dir, exist_ok=True)
    
    tree_path = os.path.join(ml_dir, "safety_tree.json")
    with open(tree_path, "w") as f:
        json.dump(tree, f, indent=2)
        
    print(f"Custom Decision Tree trained and saved to {tree_path}")
    
    # Quick visual check of the root
    if "feature" in tree:
        print(f"Root Split: {tree['feature']} <= {tree['threshold']:.2f}")
    else:
        print(f"Root Leaf Value: {tree['value']:.2f}")

if __name__ == "__main__":
    main()
