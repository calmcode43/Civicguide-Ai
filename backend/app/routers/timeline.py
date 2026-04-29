from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import ApiResponse, ElectionPhase, ElectionStep, ElectionTimelineResponse

router = APIRouter(prefix="/api", tags=["timeline"])


@router.get("/timeline", response_model=ApiResponse)
async def get_timeline() -> ApiResponse:
    """
    Detailed election process timeline for CivicMind.
    """
    phases = [
        ElectionPhase(
            id="pre-poll",
            name="Pre-Election",
            color="#d4a017",
            steps=[
                ElectionStep(
                    id="announcement",
                    phase="Pre-Election",
                    title="Election Announcement",
                    description="The Election Commission of India announces the election schedule and the Model Code of Conduct comes into force.",
                    duration="Day 0",
                    order=1,
                    details=[
                        "Release of press note by ECI",
                        "Immediate enforcement of MCC",
                        "Publication of key dates (Notification, Nomination, Polling, Counting)"
                    ]
                ),
                ElectionStep(
                    id="voter-list",
                    phase="Pre-Election",
                    title="Voter List Finalization",
                    description="Electoral rolls are updated to include new voters and correct existing entries.",
                    duration="Ongoing",
                    order=2,
                    details=[
                        "Verification by Booth Level Officers (BLOs)",
                        "Online application via Voter Portal/App",
                        "Publication of final electoral rolls"
                    ]
                ),
                ElectionStep(
                    id="nomination",
                    phase="Pre-Election",
                    title="Candidate Nomination",
                    description="Prospective candidates file nomination papers with the Returning Officer.",
                    duration="7-10 Days",
                    order=3,
                    details=[
                        "Filing of Form 2A/2B",
                        "Submission of security deposit",
                        "Affidavits on criminal records and assets"
                    ]
                ),
                ElectionStep(
                    id="scrutiny",
                    phase="Pre-Election",
                    title="Scrutiny & Withdrawal",
                    description="Returning Officer scrutinizes nominations and candidates may withdraw.",
                    duration="3 Days",
                    order=4,
                    details=[
                        "RO examines validity of nomination papers",
                        "Opportunity for candidates to resolve objections",
                        "Final list of contesting candidates published"
                    ]
                ),
            ]
        ),
        ElectionPhase(
            id="campaign",
            name="Campaign",
            color="#3b82f6",
            steps=[
                ElectionStep(
                    id="campaigning",
                    phase="Campaign",
                    title="Election Campaign",
                    description="Approved candidates reach out to voters through rallies and media.",
                    duration="14-20 Days",
                    order=5,
                    details=[
                        "Door-to-door campaigning",
                        "Public rallies and manifestos",
                        "Strict adherence to MCC and expenditure limits"
                    ]
                ),
                ElectionStep(
                    id="silence",
                    phase="Campaign",
                    title="Silence Period",
                    description="All active campaigning stops 48 hours before the conclusion of polling.",
                    duration="48 Hours",
                    order=6,
                    details=[
                        "Ban on public meetings and rallies",
                        "Restriction on bulk SMS/social media campaigning",
                        "Focus on internal party booth preparation"
                    ]
                ),
            ]
        ),
        ElectionPhase(
            id="polling",
            name="Polling",
            color="#10b981",
            steps=[
                ElectionStep(
                    id="voting",
                    phase="Polling",
                    title="Voting Day",
                    description="Registered voters cast their votes at designated polling stations.",
                    duration="1 Day",
                    order=7,
                    details=[
                        "Verification of ID (EPIC/Alternate documents)",
                        "Voting via EVM and VVPAT confirmation",
                        "Sealing of EVMs after polling concludes"
                    ]
                ),
            ]
        ),
        ElectionPhase(
            id="post-poll",
            name="Post-Poll",
            color="#ef4444",
            steps=[
                ElectionStep(
                    id="counting",
                    phase="Post-Poll",
                    title="Counting & Results",
                    description="Votes are tallied and results are declared constituency-wise.",
                    duration="1 Day",
                    order=8,
                    details=[
                        "Counting under RO supervision",
                        "Mandatory VVPAT slip verification (5 random booths)",
                        "Declaration of winners and certificate issue"
                    ]
                ),
                ElectionStep(
                    id="formation",
                    phase="Post-Poll",
                    title="Government Formation",
                    description="The majority party or coalition is invited to form the government.",
                    duration="10-15 Days",
                    order=9,
                    details=[
                        "Leader election by winning party",
                        "Invitation by President/Governor",
                        "Swearing-in ceremony"
                    ]
                ),
            ]
        )
    ]
    
    total_steps = sum(len(p.steps) for p in phases)
    
    return ApiResponse(
        data=ElectionTimelineResponse(
            phases=phases,
            total_steps=total_steps
        )
    )


