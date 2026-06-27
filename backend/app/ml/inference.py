import os
import json

class SafetyPredictor:
    def __init__(self):
        self.tree = None
        self.load_model()
        
    def load_model(self):
        # Locate safety_tree.json relative to this script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        tree_path = os.path.join(current_dir, "safety_tree.json")
        
        if os.path.exists(tree_path):
            try:
                with open(tree_path, "r") as f:
                    self.tree = json.load(f)
                print("Custom ML Safety Decision Tree loaded successfully.")
            except Exception as e:
                print(f"Error loading decision tree: {e}")
        else:
            print("Model decision tree JSON not found. Running train.py will generate it. Relying on rule-based fallback.")

    def _predict_tree_node(self, node: dict, features: dict) -> float:
        if "value" in node:
            return float(node["value"])
            
        feature = node["feature"]
        threshold = node["threshold"]
        val = features.get(feature)
        
        if val is None:
            return self._predict_tree_node(node["left"], features)
            
        if val <= threshold:
            return self._predict_tree_node(node["left"], features)
        else:
            return self._predict_tree_node(node["right"], features)

    def predict(self, features: dict) -> dict:
        # Pull feature inputs with sensible defaults
        h = int(features.get('hour', 12))
        dow = int(features.get('day_of_week', 0))
        lq = float(features.get('lighting_quality', 80.0))
        cd = float(features.get('crowd_density', 70.0))
        ch = float(features.get('crime_history_score', 15.0))
        pp = float(features.get('police_proximity_km', 1.0))
        hp = float(features.get('hospital_proximity_km', 2.0))
        ri = int(features.get('recent_incidents', 0))
        w = int(features.get('weather', 0))
        
        # Structure features for tree evaluation
        feature_dict = {
            'hour': h,
            'day_of_week': dow,
            'lighting_quality': lq,
            'crowd_density': cd,
            'crime_history_score': ch,
            'police_proximity_km': pp,
            'hospital_proximity_km': hp,
            'recent_incidents': ri,
            'weather': w
        }
        
        # Inference
        if self.tree:
            try:
                risk_score = self._predict_tree_node(self.tree, feature_dict)
                method = "Machine Learning (Custom Decision Tree)"
            except Exception as e:
                print(f"Error traversing decision tree: {e}. Using rule-based fallback.")
                risk_score = self._fallback_rule_base(h, lq, cd, ch, pp, ri, w)
                method = "Rule-Based Engine (Fallback)"
        else:
            risk_score = self._fallback_rule_base(h, lq, cd, ch, pp, ri, w)
            method = "Rule-Based Engine (Standard)"
            
        risk_score = max(0.0, min(100.0, risk_score))
        
        # Generate Explainability Factors
        explanations = []
        confidence = 96.0 if self.tree else 85.0
        
        # Detail the localized circumstances for the user
        if (h >= 21) or (h <= 5):
            explanations.append({
                "factor": "Late-Night / Dark Hours",
                "impact": "+25%",
                "type": "negative",
                "icon": "🌙",
                "desc": f"Walking late at night ({h:02d}:00) naturally increases isolation and incident risk."
            })
            
        if lq < 40.0:
            explanations.append({
                "factor": "Poor Street Visibility",
                "impact": "+20%",
                "type": "negative",
                "icon": "💡",
                "desc": f"Street illumination is weak ({lq:.1f}% quality). High shadows."
            })
        elif lq >= 80.0:
            explanations.append({
                "factor": "Bright LED Streetlights",
                "impact": "-15%",
                "type": "positive",
                "icon": "💡",
                "desc": "Path is fully illuminated by highly active municipal lighting."
            })
            
        if cd < 25.0:
            explanations.append({
                "factor": "Deserted Area",
                "impact": "+18%",
                "type": "negative",
                "icon": "👥",
                "desc": f"Low public movement ({cd:.1f}% crowd density) limits immediate helper availability."
            })
        elif cd >= 75.0:
            explanations.append({
                "factor": "High Foot Traffic",
                "impact": "-12%",
                "type": "positive",
                "icon": "👥",
                "desc": "Active crowds provide natural public surveillance and safety."
            })
            
        if ch > 60.0:
            explanations.append({
                "factor": "Historically Sensitive Zone",
                "impact": "+22%",
                "type": "negative",
                "icon": "⚠️",
                "desc": "Police databases indicate a higher frequency of reports in this area."
            })
            
        if ri > 0:
            explanations.append({
                "factor": f"{ri} Recent Report(s)",
                "impact": f"+{ri * 7}%",
                "type": "negative",
                "icon": "🚨",
                "desc": f"{ri} local hazard or safety reports logged in the past week."
            })
            
        if pp < 1.2:
            explanations.append({
                "factor": "Proximity to Police station",
                "impact": "-10%",
                "type": "positive",
                "icon": "🚔",
                "desc": f"Police station or alert post is very close ({pp:.1f} km away)."
            })
        elif pp > 4.5:
            explanations.append({
                "factor": "Isolated from Police Stations",
                "impact": "+8%",
                "type": "neutral",
                "icon": "🚔",
                "desc": f"Nearest police response base is {pp:.1f} km away. Delayed response possible."
            })
            
        if w == 1:
            explanations.append({
                "factor": "Rainy / Wet Conditions",
                "impact": "+4%",
                "type": "negative",
                "icon": "🌧️",
                "desc": "Reduced visual range and fewer pedestrians outdoors."
            })
        elif w == 2:
            explanations.append({
                "factor": "Heavy Fog / Storm",
                "impact": "+8%",
                "type": "negative",
                "icon": "🌫️",
                "desc": "Fog severely impairs camera lines and visibility."
            })
            
        # Determine overall safety status
        if risk_score < 35.0:
            status = "Safe"
            color = "green"
            guidance = "Your route is highly illuminated, active, and secure. Proceed normally."
        elif risk_score < 65.0:
            status = "Caution"
            color = "yellow"
            guidance = "Moderately safe route. Keep alert, walk along the main pavement, and stay in visible areas."
        else:
            status = "High Risk"
            color = "red"
            guidance = "⚠️ High risk predicted. We recommend taking the safer detoured route or sharing your location."
            
        return {
            "risk_score": round(risk_score, 1),
            "status": status,
            "color": color,
            "guidance": guidance,
            "explanations": explanations,
            "confidence": confidence,
            "method": method
        }
        
    def _fallback_rule_base(self, hour, lighting, crowd, crime, police_dist, incidents, weather) -> float:
        score = 30.0
        
        if (hour >= 21) or (hour <= 5):
            score += 20.0
            if (hour >= 23) or (hour <= 3):
                score += 10.0
                
        score -= (lighting * 0.3)
        score -= (crowd * 0.2)
        score += (crime * 0.35)
        score += (incidents * 4.0)
        score += (police_dist * 1.2)
        
        if weather == 1:
            score += 4.0
        elif weather == 2:
            score += 7.0
            
        return float(score)
