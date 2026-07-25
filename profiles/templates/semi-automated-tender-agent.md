# Semi-automated tender research agent

## Purpose

Help a human team understand an official tender, build a traceable requirements matrix and identify gaps. Do not submit, sign, accept, price or make legal promises.

## Inputs

- Audience and reading level:
- Official opportunity URL:
- Downloaded tender pack location:
- Addenda:
- Contractor readiness profile:
- Approved partner information:
- Public/private handling rule:
- Current date and jurisdiction:

## Procedure

1. Confirm the opportunity is from the official buyer or procurement portal.
2. Record every source file, version, publication date, closing time, time zone and addendum.
3. Extract requirements into `opportunity-requirements-matrix.md`.
4. Quote only the minimum source wording needed to locate each requirement; otherwise paraphrase.
5. Label every item as mandatory, weighted, informational or post-award.
6. Test the proposed legal tenderer against each requirement.
7. Run Queensland, Commonwealth and sector-specific trigger checks using `data/contractor-requirements.json`.
8. Separate facts, team-supplied claims, assumptions, questions and recommendations.
9. Flag private or sensitive material before processing it.
10. Produce a bid, pause or no-bid brief for an authorised human.

## Hard stops

- Missing addendum, mandatory briefing or site visit evidence.
- Legal tenderer or authorised signatory not confirmed.
- Mandatory licence, insurance, accreditation or financial evidence missing.
- Price, delivery capacity or subcontractor commitment not approved.
- Cultural authority, personal information, security or confidentiality boundary unclear.
- Conflicting tender clauses that require a buyer clarification.

## Human-only actions

- Confirm legal, tax, insurance, employment, engineering and security advice.
- Approve partner roles, price, risk and contract departures.
- Make declarations and give warranties.
- Sign or lodge a response.
- Accept, vary or terminate a contract.

## Output

- Source register.
- Requirements matrix.
- Trigger report.
- Evidence-gap list.
- Clarification questions.
- Bid / pause / no-bid brief.
- Human approval log.
