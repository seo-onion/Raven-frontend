# MODEL.md

## Overview
This document provides a comprehensive overview of the **database schema** and **API endpoints** for the **Raven** Django backend. It includes:
- All models (tables) with field definitions, data types, nullability, primary/foreign keys.
- Relationships (One‑to‑One, One‑to‑Many, Many‑to‑One, Many‑to‑Many).
- REST API routes (generated via `router.register` and explicit `path` definitions).
- Request/Response payloads for each endpoint.
- Example **Axios + TypeScript** calls.

> **Note:** The project follows the file‑upload pattern where files are stored in Google Cloud Storage; only URL fields are persisted.

---

## 1. Database Models
### 1.1 Core Models (`core/models.py`)
| Table | Column | Type | Null | Primary Key | Foreign Key | Description |
|-------|--------|------|------|-------------|-------------|-------------|
| `BaseModel` (abstract) | `id` | `AutoField` | No | Yes | – | Base primary key (auto‑generated). |
| | `created` | `DateTimeField` (auto_now_add) | No | – | – | Timestamp of creation. |
| | `updated` | `DateTimeField` (auto_now) | No | – | – | Timestamp of last update. |
| `UserMixinModel` (abstract) | `user_id` | `ForeignKey` → `auth_user` | Yes | – | Yes | Links to Django's built‑in user model (nullable for optional association). |

### 1.2 Users App (`users/models.py`)
| Table | Column | Type | Null | Primary Key | Foreign Key | Relationship |
|-------|--------|------|------|-------------|-------------|--------------|
| `Profile` | `id` | `AutoField` | No | Yes | – | – |
| | `user_id` | `OneToOneField` → `auth_user` | No | – | Yes | One‑to‑One with `auth_user`. |
| | `user_type` | `CharField(20)` | No | – | – | Choices: `startup`, `incubator`. |
| | `actions_freezed_till` | `DateTimeField` | Yes | – | – | Nullable timestamp for action freeze. |
| `Startup` | `id` | `AutoField` | No | Yes | – | – |
| | `profile_id` | `OneToOneField` → `Profile` | No | – | Yes | One‑to‑One (each profile has one startup). |
| | `company_name` | `CharField(255)` | Yes | – | – |
| | `industry` | `CharField(50)` | Yes | – | – |
| | `logo_url` | `URLField` | Yes | – | – |

| `Evidence` | `id` | `AutoField` | No | Yes | – | – |
| | `startup_id` | `ForeignKey` → `Startup` (related_name=`evidences`) | No | – | – | Many‑to‑One (startup → evidences). |
| | `type` | `CharField(10)` | No | – | – | Choices: `TRL`, `CRL`. |
| | `level` | `IntegerField` | No | – | – |
| | `description` | `TextField` | Yes | – | – |
| | `file_url` | `URLField` | Yes | – | – |
| | `status` | `CharField(20)` | No | – | – | Choices: `PENDING`, `APPROVED`, `REJECTED`. |
| | `reviewer_notes` | `TextField` | Yes | – | – |
| `FinancialInput` | `id` | `AutoField` | No | Yes | – | – |
| | `startup_id` | `ForeignKey` → `Startup` (related_name=`financial_inputs`) | No | – | – |
| | `period_date` | `DateField` | No | – | – |
| | `revenue` | `DecimalField(15,2)` | No | – | – |
| | `costs` | `DecimalField(15,2)` | No | – | – |
| | `cash_balance` | `DecimalField(15,2)` | No | – | – |
| | `monthly_burn` | `DecimalField(15,2)` | No | – | – |
| | `notes` | `TextField` | Yes | – | – |
| `InvestorPipeline` | `id` | `AutoField` | No | Yes | – | – |
| | `startup_id` | `ForeignKey` → `Startup` (related_name=`investor_pipeline`) | No | – | – |
| | `investor_name` | `CharField(255)` | No | – | – |
| | `investor_email` | `EmailField` | Yes | – | – |
| | `stage` | `CharField(30)` | No | – | – | Choices: CONTACTED, PITCH_SENT, MEETING_SCHEDULED, DUE_DILIGENCE, TERM_SHEET, COMMITTED, DECLINED. |
| | `ticket_size` | `DecimalField(15,2)` | Yes | – | – |
| | `notes` | `TextField` | Yes | – | – |
| | `next_action_date` | `DateField` | Yes | – | – |
| `Round` | `id` | `AutoField` | No | Yes | – | – |
| | `startup_id` | `ForeignKey` → `Startup` (related_name=`rounds`) | No | – | – |
| | `name` | `CharField(100)` | No | – | – |
| | `target_amount` | `DecimalField(15,2)` | Yes | – | – |
| | `raised_amount` | `DecimalField(15,2)` (default=0) | No | – | – |
| | `is_open` | `BooleanField` (default=True) | No | – | – |
| | `start_date` | `DateField` | Yes | – | – |
| | `end_date` | `DateField` | Yes | – | – |
| | `notes` | `TextField` | Yes | – | – |
| `LoginHistory` (inherits `UserMixinModel`) | `id` | `AutoField` | No | Yes | – | – |
| | `ip` | `GenericIPAddressField` | Yes | – | – |
| | `user_agent` | `CharField(255)` | Yes | – | – |
| | `timestamp` | `DateTimeField` (default=now) | No | – | – |

### 1.3 Campaigns App (`campaigns/models.py`)
| Table | Column | Type | Null | Primary Key | Foreign Key | Relationship |
|-------|--------|------|------|-------------|-------------|--------------|
| `Campaign` | `id` | `AutoField` | No | Yes | – | – |
| | `startup_id` | `OneToOneField` → `users.Startup` (related_name=`campaign`) | No | – | – | One‑to‑One (each startup has one campaign). |
| | `problem` | `TextField` | Yes | – | – |
| | `solution` | `TextField` | Yes | – | – |
| | `business_model` | `TextField` | Yes | – | – |
| | `status` | `CharField(20)` (choices DRAFT, SUBMITTED, APPROVED, REJECTED) | No | – | – |
| `InvestmentRound` | `id` | `AutoField` | No | Yes | – | – |
| | `campaign_id` | `ForeignKey` → `Campaign` (related_name=`rounds`) | No | – | – | Many‑to‑One (campaign → rounds). |
| | `name` | `CharField(100)` | No | – | – |
| | `target_amount` | `DecimalField(12,2)` | No | – | – |
| | `pre_money_valuation` | `DecimalField(15,2)` | Yes | – | – |
| | `status` | `CharField(20)` (choices PLANNED, OPEN, CLOSED) | No | – | – |
| | `is_current` | `BooleanField` (default=False) | No | – | – |
| `Investor` (for a round) | `id` | `AutoField` | No | Yes | – | – |
| | `round_id` | `ForeignKey` → `InvestmentRound` (related_name=`investors`) | No | – | – |
| | `name` | `CharField(255)` | No | – | – |
| | `email` | `EmailField` | No | – | – |
| | `status` | `CharField(20)` (choices CONTACTED, MEETING, DUE_DILIGENCE, COMMITTED) | No | – | – |
| | `amount` | `DecimalField(12,2)` | No | – | – |
| `CampaignTeamMember` | `id` | `AutoField` | No | Yes | – | – |
| | `campaign_id` | `ForeignKey` → `Campaign` (related_name=`team_members`) | No | – | – |
| | `name` | `CharField(255)` | No | – | – |
| | `role` | `CharField(255)` | No | – | – |
| | `linkedin` | `URLField` | Yes | – | – |
| | `avatar_url` | `URLField` | Yes | – | – |
| `CampaignFinancials` | `id` | `AutoField` | No | Yes | – | – |
| | `campaign_id` | `OneToOneField` → `Campaign` (related_name=`financials`) | No | – | – |
| | `funding_goal` | `DecimalField(12,2)` | Yes | – | – |
| | `valuation` | `DecimalField(12,2)` | Yes | – | – |
| | `usage_of_funds` | `JSONField` (default=dict) | No | – | – |
| | `revenue_history` | `JSONField` (default=dict) | No | – | – |
| | `pre_money_valuation` | `DecimalField(15,2)` | Yes | – | – |
| | `current_cash_balance` | `DecimalField(15,2)` | Yes | – | – |
| | `monthly_burn_rate` | `DecimalField(15,2)` | Yes | – | – |
| | `financial_projections` | `JSONField` (default=dict) | No | – | – |
| `CampaignTraction` | `id` | `AutoField` | No | Yes | – | – |
| | `campaign_id` | `ForeignKey` → `Campaign` (related_name=`tractions`) | No | – | – |
| | `metrics` | `JSONField` (default=dict) | No | – | – |
| | `proof_doc_url` | `URLField` | Yes | – | – |
| `CampaignLegal` | `id` | `AutoField` | No | Yes | – | – |
| | `campaign_id` | `OneToOneField` → `Campaign` (related_name=`legal`) | No | – | – |
| | `constitution_url` | `URLField` | Yes | – | – |
| | `whitepaper_url` | `URLField` | Yes | – | – |
| | `cap_table_url` | `URLField` | Yes | – | – |

---

## 2. API Endpoints
### 2.1 Users App (`users/urls.py`)
| Method | Path | View / ViewSet | Description |
|--------|------|----------------|-------------|
| **POST** | `/auth/registration/` | `dj_rest_auth.registration` | Register a new user (email/password). |
| **POST** | `/auth/login/` | `dj_rest_auth` | Obtain JWT tokens. |
| **POST** | `/auth/logout/` | `dj_rest_auth` | Logout (blacklist refresh token). |
| **POST** | `/auth/password/reset/` | `dj_rest_auth` | Request password reset email. |
| **POST** | `/auth/password/reset/confirm/` | `dj_rest_auth` | Confirm password reset. |
| **POST** | `/auth/registration/account-confirm-email/` | `CustomVerifyEmailView` | Verify email and receive JWT tokens. |
| **POST** | `/resend-email-confirmation/` | `ResendEmailConfirmationView` | Resend verification email (requires token). |
| **POST** | `/reset-password/<uidb64>/<token>/` | `PasswordResetConfirmView` | Render password reset page (HTML). |
| **GET** | `/onboarding/startup/` | `StartupOnboardingView.get` | Retrieve current startup profile & onboarding status. |
| **POST** | `/onboarding/startup/` | `StartupOnboardingView.post` | Complete startup onboarding (company_name, industry). |
| **GET** | `/startup/complete-onboarding/` | `OnboardingCompleteView` | **POST** only – finalize wizard, create evidences, financial data, investors. |
| **GET** | `/startup/data/` | `StartupDataView` | Return startup details (incl. computed `current_trl`, `current_crl`, `actual_revenue`). |
| **GET** | `/startup/financial-data/` | `FinancialDataListView` | List all `FinancialInput` records for the startup. |
| **GET** | `/startup/investors/` | `InvestorPipelineListView` | List all investor pipeline entries. |
| **GET/POST/PUT/PATCH/DELETE** | `/startup/rounds/` | `RoundViewSet` (router) | CRUD for `Round` objects. |
| **GET/POST/PUT/PATCH/DELETE** | `/startup/evidences/` | `EvidenceViewSet` (router) | CRUD for `Evidence` objects. |

### 2.2 Campaigns App (`campaigns/urls.py`)
| Method | Path | ViewSet | Description |
|--------|------|---------|-------------|
| **GET/POST/PUT/PATCH/DELETE** | `/campaigns/` | `CampaignViewSet` (router) | CRUD for `Campaign` objects (one per startup). |

---

## 3. Request / Response Schemas & Axios TypeScript Examples
### 3.1 Authentication (Login)
**Request** (`POST /auth/login/`)
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```
**Response**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```
**Axios TS**
```ts
import axios from 'axios';

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export const login = async (email: string, password: string) => {
  const resp = await axios.post<LoginResponse>('/auth/login/', { email, password });
  // Store tokens (e.g., localStorage) for subsequent calls
  localStorage.setItem('access', resp.data.access_token);
  localStorage.setItem('refresh', resp.data.refresh_token);
  return resp.data;
};
```
---
### 3.2 Get Startup Data
**Request** (`GET /startup/data/` with Authorization header)
```http
GET /startup/data/ HTTP/1.1
Authorization: Bearer <access_token>
```
**Response** (excerpt)
```json
{
  "id": 3,
  "company_name": "Acme Corp",
  "industry": "technology",
  "logo_url": "https://storage.googleapis.com/.../logo.png",
  "created": "2024-11-01T12:34:56Z",
  "updated": "2025-01-15T08:20:10Z",
  "current_trl": 4,
  "current_crl": 2,
  "actual_revenue": 125000.00
}
```
**Axios TS**
```ts
import axios from 'axios';

export interface StartupDTO {
  id: number;
  company_name: string;
  industry: string;
  logo_url?: string;
  created: string; // ISO date
  updated: string;
  current_trl?: number;
  current_crl?: number;
  actual_revenue?: number;
}

export const fetchStartup = async (token: string): Promise<StartupDTO> => {
  const resp = await axios.get<StartupDTO>('/startup/data/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};
```
---
### 3.3 Create Evidence (POST `/startup/evidences/`)
**Request**
```json
{
  "type": "TRL",
  "level": 3,
  "description": "Prototype demonstrated to early adopters.",
  "file_url": "https://storage.googleapis.com/.../evidence.pdf",
  "status": "APPROVED"
}
```
**Response** (201)
```json
{
  "id": 12,
  "type": "TRL",
  "level": 3,
  "description": "Prototype demonstrated to early adopters.",
  "file_url": "https://storage.googleapis.com/.../evidence.pdf",
  "status": "APPROVED",
  "reviewer_notes": null,
  "created": "2025-12-02T10:05:00Z",
  "updated": "2025-12-02T10:05:00Z"
}
```
**Axios TS**
```ts
export interface EvidenceCreateDTO {
  type: 'TRL' | 'CRL';
  level: number;
  description?: string;
  file_url?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const createEvidence = async (token: string, data: EvidenceCreateDTO) => {
  const resp = await axios.post<EvidenceCreateDTO & { id: number; created: string; updated: string }>(
    '/startup/evidences/',
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};
```
---
### 3.4 List Financial Inputs (GET `/startup/financial-data/`)
**Response** (array)
```json
[
  {
    "id": 5,
    "period_date": "2024-01-31",
    "revenue": "5000.00",
    "costs": "8000.00",
    "cash_balance": "45000.00",
    "monthly_burn": "3000.00",
    "notes": null,
    "created": "2025-01-10T14:22:00Z",
    "updated": "2025-01-10T14:22:00Z"
  }
]
```
**Axios TS**
```ts
export interface FinancialInputDTO {
  id: number;
  period_date: string; // YYYY-MM-DD
  revenue: string; // decimal as string
  costs: string;
  cash_balance: string;
  monthly_burn: string;
  notes?: string;
  created: string;
  updated: string;
}

export const fetchFinancials = async (token: string): Promise<FinancialInputDTO[]> => {
  const resp = await axios.get<FinancialInputDTO[]>('/startup/financial-data/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};
```
---
### 3.5 Create Round (POST `/startup/rounds/`)
**Request**
```json
{
  "name": "Series A",
  "target_amount": "2000000.00",
  "raised_amount": "0.00",
  "is_open": true,
  "start_date": "2025-03-01",
  "end_date": "2025-06-30",
  "notes": "First institutional round"
}
```
**Response** (201)
```json
{
  "id": 4,
  "startup": 3,
  "name": "Series A",
  "target_amount": "2000000.00",
  "raised_amount": "0.00",
  "is_open": true,
  "start_date": "2025-03-01",
  "end_date": "2025-06-30",
  "notes": "First institutional round",
  "created": "2025-12-03T12:00:00Z",
  "updated": "2025-12-03T12:00:00Z"
}
```
**Axios TS**
```ts
export interface RoundCreateDTO {
  name: string;
  target_amount: string; // decimal string
  raised_amount?: string;
  is_open?: boolean;
  start_date?: string; // YYYY-MM-DD
  end_date?: string;
  notes?: string;
}

export const createRound = async (token: string, data: RoundCreateDTO) => {
  const resp = await axios.post<RoundCreateDTO & { id: number; startup: number; created: string; updated: string }>(
    '/startup/rounds/',
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return resp.data;
};
```
---
### 3.6 Campaign CRUD (router `/campaigns/`)
**GET** `/campaigns/` returns list of campaigns belonging to the authenticated startup.
**POST** `/campaigns/` creates a new campaign (requires `startup` relationship is inferred from token).
**Example POST payload**
```json
{
  "problem": "We lack a scalable onboarding process.",
  "solution": "AI‑driven onboarding platform.",
  "business_model": "SaaS subscription",
  "status": "DRAFT"
}
```
**Axios TS**
```ts
export interface CampaignDTO {
  id: number;
  problem?: string;
  solution?: string;
  business_model?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  created: string;
  updated: string;
}

export const createCampaign = async (token: string, data: Partial<CampaignDTO>) => {
  const resp = await axios.post<CampaignDTO>('/campaigns/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data;
};
```
---

## 4. How to Use This Document
- **Developers** can copy the TypeScript snippets into a shared `api.ts` module.
- **Backend engineers** can reference the table definitions when extending models or writing migrations.
- **API consumers** (frontend) should follow the request/response schemas to ensure type safety.

---

*Generated automatically on 2025‑12‑03 by Antigravity.*
