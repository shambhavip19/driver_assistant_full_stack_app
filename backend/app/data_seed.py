from datetime import datetime

from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import AppPreference, DemandZone, DriverProfile, Expense, Trip


def seed_demo_data() -> None:
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    if not db.query(DriverProfile).first():
        profile = DriverProfile(
            id=1,
            name="Ravi Kannan",
            city="Chennai",
            preferred_zone="T Nagar",
            vehicle_make="Maruti Suzuki",
            vehicle_model="Swift Dzire",
            vehicle_type="Sedan",
            fuel_efficiency_kmpl=18.5,
            operating_cost_per_km=6.2,
            base_ride_rate=120.0,
            online_hours_per_day=9.5,
            insurance_monthly=1500.0,
            service_tax_percent=5.0,
            preferred_work_window="18:00-22:00",
            platform_status="Online",
            rating=4.8,
        )
        db.add(profile)

    if not db.query(Trip).first():
        sample_trips = [
            Trip(date="2026-11-11", pickup="Anna Nagar", dropoff="T Nagar", distance_km=12.2, fare_inr=430, fuel_cost=78.5, operating_cost=75.6, net_earnings=276.0, demand_score=81, waiting_minutes=7, status="completed", profit_margin=36.1),
            Trip(date="2026-11-11", pickup="Mylapore", dropoff="Chromepet", distance_km=18.4, fare_inr=510, fuel_cost=118.5, operating_cost=114.1, net_earnings=277.4, demand_score=72, waiting_minutes=12, status="completed", profit_margin=31.7),
            Trip(date="2026-11-11", pickup="Guindy", dropoff="Adyar", distance_km=9.8, fare_inr=360, fuel_cost=63.2, operating_cost=60.7, net_earnings=236.1, demand_score=88, waiting_minutes=5, status="completed", profit_margin=39.6),
            Trip(date="2026-11-10", pickup="Velachery", dropoff="Tambaram", distance_km=22.6, fare_inr=620, fuel_cost=145.4, operating_cost=140.1, net_earnings=334.5, demand_score=69, waiting_minutes=16, status="completed", profit_margin=28.1),
            Trip(date="2026-11-10", pickup="Nungambakkam", dropoff="Koyambedu", distance_km=15.7, fare_inr=470, fuel_cost=101.1, operating_cost=97.4, net_earnings=271.5, demand_score=81, waiting_minutes=9, status="completed", profit_margin=33.9),
            Trip(date="2026-11-09", pickup="Porur", dropoff="Egmore", distance_km=13.8, fare_inr=420, fuel_cost=88.9, operating_cost=85.6, net_earnings=245.5, demand_score=76, waiting_minutes=10, status="completed", profit_margin=32.3),
        ]
        db.add_all(sample_trips)

    if not db.query(Expense).first():
        sample_expenses = [
            Expense(title="Fuel", category="Fuel", amount=1180.0, date="2026-11-11", percentage=42.5),
            Expense(title="Vehicle maintenance", category="Maintenance", amount=460.0, date="2026-11-11", percentage=16.5),
            Expense(title="Fastag & tolls", category="Tolls", amount=365.0, date="2026-11-11", percentage=13.1),
            Expense(title="Driver meals", category="Food", amount=220.0, date="2026-11-11", percentage=7.9),
            Expense(title="Phone + subscriptions", category="Utilities", amount=185.0, date="2026-11-11", percentage=6.6),
            Expense(title="Insurance + EMI", category="Fixed cost", amount=560.0, date="2026-11-11", percentage=20.1),
        ]
        db.add_all(sample_expenses)

    if not db.query(DemandZone).first():
        zone_data = [
            DemandZone(name="T Nagar", score=91, pickup_count=342, lat=13.0414, lng=80.2332, time_window="Evening peak", is_high_demand=True),
            DemandZone(name="Guindy", score=84, pickup_count=289, lat=13.0064, lng=80.2212, time_window="Late evening", is_high_demand=True),
            DemandZone(name="Nungambakkam", score=77, pickup_count=236, lat=13.0608, lng=80.2348, time_window="Office commute", is_high_demand=True),
            DemandZone(name="Velachery", score=68, pickup_count=201, lat=12.9792, lng=80.2205, time_window="Night", is_high_demand=False),
            DemandZone(name="Tambaram", score=59, pickup_count=168, lat=12.9248, lng=80.1281, time_window="Morning", is_high_demand=False),
            DemandZone(name="Porur", score=66, pickup_count=182, lat=13.0271, lng=80.1520, time_window="Afternoon", is_high_demand=False),
            DemandZone(name="Adyar", score=82, pickup_count=260, lat=13.0030, lng=80.2540, time_window="Evening", is_high_demand=True),
        ]
        db.add_all(zone_data)

    if not db.query(AppPreference).first():
        db.add(AppPreference(alert_threshold=0.75, fuel_price_alert=True, demand_zone_alerts=True, auto_recommendations=True, language="English"))

    db.commit()
    db.close()
