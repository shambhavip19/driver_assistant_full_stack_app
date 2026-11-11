from typing import Any, Dict, List

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.config import FRONTEND_URL
from app.data_seed import seed_demo_data
from app.database import SessionLocal
from app.models import AppPreference, DemandZone, DriverProfile, Expense, Trip
from app.schemas import RideEvaluationRequest, RideEvaluationResult

seed_demo_data()

app = FastAPI(title="DriverIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:4173", "http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "service": "DriverIQ API"}


@app.get("/api/overview")
def get_overview(db: Session = Depends(get_db)) -> Dict[str, Any]:
    profile = db.query(DriverProfile).first()
    trips = db.query(Trip).order_by(Trip.created_at.desc()).limit(5).all()
    expenses = db.query(Expense).all()

    gross_earnings = sum(trip.fare_inr for trip in trips)
    net_earnings = sum(trip.net_earnings for trip in trips)
    total_distance = round(sum(trip.distance_km for trip in trips), 1)
    fuel_expenditure = round(sum(trip.fuel_cost for trip in trips), 2)
    total_trips = db.query(Trip).count()
    avg_earning_per_hour = round((net_earnings / max(profile.online_hours_per_day, 1)) * 1.35, 2)

    weekly_series = [
        {"day": "Mon", "earnings": 1900},
        {"day": "Tue", "earnings": 2450},
        {"day": "Wed", "earnings": 2360},
        {"day": "Thu", "earnings": 2820},
        {"day": "Fri", "earnings": 3250},
        {"day": "Sat", "earnings": 3470},
        {"day": "Sun", "earnings": 2980},
    ]

    expense_breakdown = [
        {"name": "Fuel", "value": 42.5},
        {"name": "Maintenance", "value": 16.5},
        {"name": "Tolls", "value": 13.1},
        {"name": "Food", "value": 7.9},
        {"name": "Utilities", "value": 6.6},
        {"name": "Fixed cost", "value": 13.4},
    ]

    best_hours = [
        {"hour": "18:00", "value": 92},
        {"hour": "19:00", "value": 88},
        {"hour": "20:00", "value": 81},
        {"hour": "21:00", "value": 76},
    ]

    return {
        "date": "2026-11-11",
        "grossEarnings": round(gross_earnings, 2),
        "netEarnings": round(net_earnings, 2),
        "totalTrips": total_trips,
        "totalDistance": total_distance,
        "fuelExpenditure": fuel_expenditure,
        "estimatedProfit": round(net_earnings * 0.62, 2),
        "avgEarningsPerOnlineHour": avg_earning_per_hour,
        "currentDemandScore": 82,
        "recentTrips": [
            {
                "id": trip.id,
                "pickup": trip.pickup,
                "dropoff": trip.dropoff,
                "fare": trip.fare_inr,
                "distance": trip.distance_km,
                "net": trip.net_earnings,
                "demandScore": trip.demand_score,
            }
            for trip in trips
        ],
        "weeklyEarnings": weekly_series,
        "expenseBreakdown": expense_breakdown,
        "bestHours": best_hours,
        "expenseTotals": {
            "fuel": round(sum(item.amount for item in expenses if item.category == "Fuel"), 2),
            "maintenance": round(sum(item.amount for item in expenses if item.category == "Maintenance"), 2),
            "tolls": round(sum(item.amount for item in expenses if item.category == "Tolls"), 2),
            "other": round(sum(item.amount for item in expenses if item.category not in {"Fuel", "Maintenance", "Tolls"}), 2),
        },
    }


@app.get("/api/trips")
def get_trips(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    trips = db.query(Trip).order_by(Trip.created_at.desc()).all()
    return [
        {
            "id": trip.id,
            "date": trip.date,
            "pickup": trip.pickup,
            "dropoff": trip.dropoff,
            "distanceKm": trip.distance_km,
            "fareInr": trip.fare_inr,
            "netEarnings": trip.net_earnings,
            "demandScore": trip.demand_score,
            "waitingMinutes": trip.waiting_minutes,
            "profitMargin": trip.profit_margin,
            "status": trip.status,
        }
        for trip in trips
    ]


@app.get("/api/expenses")
def get_expenses(db: Session = Depends(get_db)) -> Dict[str, Any]:
    expenses = db.query(Expense).all()
    return {
        "totals": {
            "monthly": round(sum(item.amount for item in expenses), 2),
            "fuel": round(sum(item.amount for item in expenses if item.category == "Fuel"), 2),
            "maintenance": round(sum(item.amount for item in expenses if item.category == "Maintenance"), 2),
            "tolls": round(sum(item.amount for item in expenses if item.category == "Tolls"), 2),
        },
        "items": [
            {
                "id": item.id,
                "title": item.title,
                "category": item.category,
                "amount": item.amount,
                "date": item.date,
                "percentage": item.percentage,
            }
            for item in expenses
        ],
    }


@app.get("/api/vehicle-profile")
def get_vehicle_profile(db: Session = Depends(get_db)) -> Dict[str, Any]:
    profile = db.query(DriverProfile).first()
    return {
        "driverName": profile.name,
        "city": profile.city,
        "preferredZone": profile.preferred_zone,
        "vehicle": f"{profile.vehicle_make} {profile.vehicle_model}",
        "vehicleType": profile.vehicle_type,
        "fuelEfficiencyKmpl": profile.fuel_efficiency_kmpl,
        "operatingCostPerKm": profile.operating_cost_per_km,
        "onlineHoursPerDay": profile.online_hours_per_day,
        "baseRideRate": profile.base_ride_rate,
        "rating": profile.rating,
        "preferredWorkWindow": profile.preferred_work_window,
        "platformStatus": profile.platform_status,
    }


@app.get("/api/demand-map")
def get_demand_map(db: Session = Depends(get_db)) -> Dict[str, Any]:
    zones = db.query(DemandZone).all()
    return {
        "center": {"lat": 13.0827, "lng": 80.2707},
        "timeWindows": ["Morning", "Afternoon", "Evening", "Night"],
        "zones": [
            {
                "id": zone.id,
                "name": zone.name,
                "score": zone.score,
                "pickupCount": zone.pickup_count,
                "lat": zone.lat,
                "lng": zone.lng,
                "timeWindow": zone.time_window,
                "isHighDemand": zone.is_high_demand,
            }
            for zone in zones
        ],
    }


@app.get("/api/wait-vs-move")
def get_wait_vs_move() -> Dict[str, Any]:
    return {
        "stay": {
            "waitingTimeMinutes": 14,
            "pickupProbability": 0.64,
            "potentialEarnings": 260,
            "extraDistanceKm": 0,
            "fuelCost": 0,
            "netValue": 190,
        },
        "move": {
            "waitingTimeMinutes": 8,
            "pickupProbability": 0.81,
            "potentialEarnings": 320,
            "extraDistanceKm": 4.5,
            "fuelCost": 34,
            "netValue": 236,
        },
        "bestOption": "Move to demand hotspot",
        "reason": "The nearby hotspot yields a stronger probability of a pickup with a higher expected net value, even after commute fuel costs.",
    }


@app.get("/api/insights")
def get_insights() -> Dict[str, Any]:
    return {
        "summary": [
            "Your strongest earnings window is 18:00-22:00, when demand is consistently above the city average.",
            "T Nagar and Adyar are your most reliable areas for quick back-to-back trips, especially on weekday evenings.",
            "Fuel costs are 42.5% of your recent earning profile; reducing idle time at low-demand zones can improve net margin.",
        ],
        "recommendations": [
            {"title": "Shift to T Nagar after 18:30", "impact": "+₹280 expected", "detail": "Historical pickup density rises sharply there during evening peak."},
            {"title": "Avoid long waits in Porur", "impact": "-₹95 likely", "detail": "Lower demand score and elevated empty-km risk reduce profitability."},
            {"title": "Monitor toll costs", "impact": "+4.2% margin", "detail": "Your route mix is significantly increasing fixed operating costs on the current pattern."},
        ],
    }


@app.get("/api/settings")
def get_settings(db: Session = Depends(get_db)) -> Dict[str, Any]:
    settings = db.query(AppPreference).first()
    return {
        "alertThreshold": settings.alert_threshold,
        "fuelPriceAlert": settings.fuel_price_alert,
        "demandZoneAlerts": settings.demand_zone_alerts,
        "autoRecommendations": settings.auto_recommendations,
        "language": settings.language,
        "theme": "Dark Navy",
        "dateFilter": "Today",
    }


@app.post("/api/ride-evaluator", response_model=RideEvaluationResult)
def evaluate_ride(payload: RideEvaluationRequest) -> RideEvaluationResult:
    fuel_rate = 95.0 / 18.5
    fuel_cost = round(payload.tripDistanceKm * fuel_rate, 2)
    operating_cost = round(payload.tripDistanceKm * 6.2, 2)
    toll = round(payload.tollCost, 2)
    trip_profit = round(payload.offeredFare - fuel_cost - operating_cost - toll, 2)
    profit_per_km = round(trip_profit / payload.tripDistanceKm, 2)
    earnings_per_hour = round((payload.offeredFare / max(payload.tripDurationMinutes, 1)) * 60, 2)

    demand_score = 62
    if payload.pickupLocation.lower() in {"t nagar", "nungambakkam", "adyar", "guindy"}:
        demand_score = 81
    if payload.dropoffLocation.lower() in {"t nagar", "adyar", "guindy"}:
        demand_score += 12
    demand_score = max(35, min(96, demand_score))

    within_10 = min(0.91, round(0.28 + (demand_score / 100) * 0.52, 2))
    within_20 = min(0.96, round(0.4 + (demand_score / 100) * 0.46, 2))
    within_30 = min(0.99, round(0.52 + (demand_score / 100) * 0.38, 2))
    waiting_minutes = max(6, min(35, int(43 - demand_score / 2.2)))

    if trip_profit > 200:
        recommendation = "Promising opportunity"
        confidence = "High confidence"
        reasons = [
            "Good estimated trip profitability.",
            "Destination has relatively strong historical demand.",
            "Low empty-distance risk based on the selected corridor.",
        ]
    elif trip_profit > 90:
        recommendation = "Moderate opportunity"
        confidence = "Medium confidence"
        reasons = [
            "Trip is profitable but margin is tighter than preferred.",
            "Demand trend is mixed near the drop-off area.",
            "Potential waiting time after drop-off may reduce net yield.",
        ]
    else:
        recommendation = "Low opportunity"
        confidence = "Low confidence"
        reasons = [
            "Estimated trip profitability is thin relative to fuel and operating costs.",
            "Destination has weaker historical demand than the city average.",
            "Longer expected waiting time after drop-off limits the follow-on ride opportunity.",
        ]

    return RideEvaluationResult(
        recommendation=recommendation,
        confidence=confidence,
        estimatedFuelExpenditure=fuel_cost,
        estimatedOperatingCosts=operating_cost + toll,
        estimatedTripProfit=trip_profit,
        estimatedProfitPerKilometre=profit_per_km,
        estimatedEarningsPerHour=earnings_per_hour,
        destinationDemandScore=demand_score,
        probabilityWithin10Minutes=within_10,
        probabilityWithin20Minutes=within_20,
        probabilityWithin30Minutes=within_30,
        estimatedWaitingMinutesAfterDropoff=waiting_minutes,
        reasons=reasons,
    )
