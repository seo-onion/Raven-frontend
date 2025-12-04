# Backend Fix Required: Onboarding Financial Data

## Error Description

When submitting the onboarding wizard, the backend throws a `KeyError: 'financial_data'` at line 288 in `users/views.py`.

```python
Traceback (most recent call last):
  File "/home/seodos/Documentos/Raven/backend/daddy-django/users/views.py", line 288, in post
    f"{len(result['financial_data'])} financial periods, "
           ~~~~~~^^^^^^^^^^^^^^^^^^
KeyError: 'financial_data'
```

## Root Cause

The backend is trying to access `result['financial_data']` in the response message formatting, but the `result` dictionary doesn't contain this key. This happens after the data has been processed but before returning the response.

## Frontend Payload

The frontend is correctly sending the `financial_data` field in the payload:

```json
{
  "company_name": "Startup Name",
  "industry": "technology",
  "current_trl": 3,
  "current_crl": null,
  "target_funding_amount": 100000,
  "financial_projections": {
    "q1": { "revenue": 0, "cogs": 0, "opex": 0 },
    "q2": { "revenue": 0, "cogs": 0, "opex": 0 },
    "q3": { "revenue": 0, "cogs": 0, "opex": 0 },
    "q4": { "revenue": 0, "cogs": 0, "opex": 0 }
  },
  "evidences": [],
  "financial_data": [
    {
      "period_date": "2025-12-04",
      "revenue": 0,
      "costs": 0,
      "cash_balance": 0,
      "monthly_burn": 0
    }
  ],
  "investors": [],
  "incubator_ids": []
}
```

## Backend Fix Required

In `users/views.py` around line 288, you need to ensure that the `result` dictionary includes the `financial_data` key before trying to access it.

### Option 1: Add the missing key to result
After processing the financial_data, add it to the result dictionary:

```python
# After processing financial_data
result['financial_data'] = financial_data_objects  # or the processed list
```

### Option 2: Use .get() with default value
Change the line that's causing the error to use safe dictionary access:

```python
# Instead of:
f"{len(result['financial_data'])} financial periods, "

# Use:
f"{len(result.get('financial_data', []))} financial periods, "
```

### Option 3: Return financial_periods_count separately
If the financial data is being processed and saved correctly, but just not included in the result dict, you could calculate the count separately:

```python
financial_periods_count = FinancialData.objects.filter(startup=startup).count()
```

## Testing

After fixing the backend, test the onboarding wizard by:

1. Navigate to `/onboarding/wizard`
2. Fill in all steps:
   - Step 0: Company name and industry
   - Step 1: TRL/CRL levels
   - Step 2: Financial data (should have at least one period)
   - Step 3: Investors (optional)
3. Submit the wizard
4. Verify the response includes all counts including `financial_periods_count`

## Expected Backend Response

The backend should return:

```json
{
  "detail": "Onboarding completed successfully",
  "startup_id": 18,
  "is_mock_data": false,
  "current_trl": 3,
  "target_funding_amount": "100000.00",
  "evidences_count": 0,
  "financial_periods_count": 1,
  "investors_count": 0,
  "current_crl": null
}
```
