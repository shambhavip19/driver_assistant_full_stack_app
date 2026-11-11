from pydantic import BaseModel, Field
from typing import List, Optional


class RideEvaluationRequest(BaseModel):
    offeredFare: float = Field(..., ge=0)
    pickupLocation: str = Field(..., min_length=2)
    dropoffLocation: str = Field(..., min_length=2)
    tripDistanceKm: float = Field(..., gt=0)
    tripDurationMinutes: int = Field(..., gt=0)
    tollCost: float = Field(default=0.0, ge=0)


class RideEvaluationResult(BaseModel):
    recommendation: str
    confidence: str
    estimatedFuelExpenditure: float
    estimatedOperatingCosts: float
    estimatedTripProfit: float
    estimatedProfitPerKilometre: float
    estimatedEarningsPerHour: float
    destinationDemandScore: int
    probabilityWithin10Minutes: float
    probabilityWithin20Minutes: float
    probabilityWithin30Minutes: float
    estimatedWaitingMinutesAfterDropoff: int
    reasons: List[str]
