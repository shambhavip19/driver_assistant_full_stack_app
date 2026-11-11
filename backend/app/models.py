from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String

from app.database import Base


class DriverProfile(Base):
    __tablename__ = "driver_profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    preferred_zone = Column(String, nullable=False)
    vehicle_make = Column(String, nullable=False)
    vehicle_model = Column(String, nullable=False)
    vehicle_type = Column(String, nullable=False)
    fuel_efficiency_kmpl = Column(Float, nullable=False, default=18.5)
    operating_cost_per_km = Column(Float, nullable=False, default=6.2)
    base_ride_rate = Column(Float, nullable=False, default=120.0)
    online_hours_per_day = Column(Float, nullable=False, default=9.5)
    insurance_monthly = Column(Float, nullable=False, default=1500.0)
    service_tax_percent = Column(Float, nullable=False, default=5.0)
    preferred_work_window = Column(String, nullable=False, default="18:00-22:00")
    platform_status = Column(String, nullable=False, default="Online")
    rating = Column(Float, nullable=False, default=4.8)


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    pickup = Column(String, nullable=False)
    dropoff = Column(String, nullable=False)
    distance_km = Column(Float, nullable=False)
    fare_inr = Column(Float, nullable=False)
    fuel_cost = Column(Float, nullable=False, default=0.0)
    operating_cost = Column(Float, nullable=False, default=0.0)
    net_earnings = Column(Float, nullable=False, default=0.0)
    demand_score = Column(Integer, nullable=False, default=55)
    waiting_minutes = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="completed")
    profit_margin = Column(Float, nullable=False, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(String, nullable=False)
    percentage = Column(Float, nullable=False, default=0.0)


class DemandZone(Base):
    __tablename__ = "demand_zones"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    pickup_count = Column(Integer, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    time_window = Column(String, nullable=False)
    is_high_demand = Column(Boolean, nullable=False, default=False)


class AppPreference(Base):
    __tablename__ = "app_preferences"

    id = Column(Integer, primary_key=True, index=True)
    alert_threshold = Column(Float, nullable=False, default=0.75)
    fuel_price_alert = Column(Boolean, nullable=False, default=True)
    demand_zone_alerts = Column(Boolean, nullable=False, default=True)
    auto_recommendations = Column(Boolean, nullable=False, default=True)
    language = Column(String, nullable=False, default="English")
