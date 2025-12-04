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

  #### Modelo: `Profile`
  | Column | Type | Null | PK | FK | Relationship |
  |--------|------|------|----|----|--------------|
  | `id` | `AutoField` | No | Yes | – | – |
  | `user_id` | `OneToOneField → auth_user` | No | – | Yes | One‑to‑One with `auth_user` |
  | `user_type` | `CharField(20)` | No | – | – | Choices: `startup`, `incubator` |
  | `actions_freezed_till` | `DateTimeField` | Yes | – | – | Nullable timestamp for action freeze |

  #### Modelo: `Startup`
  | Column | Type | Null | PK | FK | Relationship |
  |--------|------|------|----|----|--------------|
  | `id` | `AutoField` | No | Yes | – | – |
  | `profile_id` | `OneToOneField → Profile` | No | – | Yes | One‑to‑One (each profile has one startup) |
  | `company_name` | `CharField(255)` | Yes | – | – | – |
  | `industry` | `CharField(50)` | Yes | – | – | – |
  | `logo_url` | `URLField` | Yes | – | – | – |
  | `TRL_level` | `IntegerField` | No | – | – | Default: 1, Choices: 1-9 |
  | `CRL_level` | `IntegerField` | No | – | – | Default: 1, Choices: 1-9 |
| `incubators` | `ManyToManyField → Incubator` | Yes | – | – | Many‑to‑Many (Startup can be associated with multiple Incubators) |

#### Modelo: `Incubator`
| Column | Type | Null | PK | FK | Relationship |
|--------|------|------|----|----|--------------|
| `id` | `AutoField` | No | Yes | – | – |
| `profile_id` | `OneToOneField → Profile` | No | – | Yes | One‑to‑One (each profile has one incubator) |
| `name` | `CharField(255)` | No | – | – | – |

#### Modelo: `IncubatorMember`
| Column | Type | Null | PK | FK | Relationship |
|--------|------|------|----|----|--------------|
| `id` | `AutoField` | No | Yes | – | – |
| `incubator_id` | `ForeignKey → Incubator` | No | – | Yes | Many‑to‑One |
| `full_name` | `CharField(255)` | No | – | – | – |
| `email` | `EmailField` | No | – | – | – |
| `phone` | `CharField(50)` | Yes | – | – | – |
| `role` | `CharField(20)` | No | – | – | Choices: `INVESTOR`, `MENTOR`, `BOTH` |

#### Modelo: `Challenge`
| Column | Type | Null | PK | FK | Relationship |
|--------|------|------|----|----|--------------|
| `id` | `AutoField` | No | Yes | – | – |
| `incubator_id` | `ForeignKey → Incubator` | No | – | Yes | Many‑to‑One |
| `title` | `CharField(255)` | No | – | – | – |
| `subtitle` | `CharField(255)` | Yes | – | – | – |
| `description` | `TextField` | No | – | – | – |
| `budget` | `DecimalField` | Yes | – | – | – |
| `deadline` | `DateField` | Yes | – | – | – |
| `required_technologies` | `TextField` | No | – | – | – |
| `status` | `CharField(20)` | No | – | – | Choices: `OPEN`, `CONCLUDED` |

#### Modelo: `ChallengeApplication`
| Column | Type | Null | PK | FK | Relationship |
|--------|------|------|----|----|--------------|
| `id` | `AutoField` | No | Yes | – | – |
| `challenge_id` | `ForeignKey → Challenge` | No | – | Yes | Many‑to‑One |
| `startup_id` | `ForeignKey → Startup` | No | – | Yes | Many‑to‑One |
| `text_solution` | `TextField` | No | – | – | – |

#### Modelo: `InvestorPipeline`
| Column | Type | Null | PK | FK | Relationship |
|--------|------|------|----|----|--------------|
| `id` | `AutoField` | No | Yes | – | – |
| `challenge_id` | `ForeignKey → Challenge` | No | – | Yes | Many‑to‑One |
| `startup_id` | `ForeignKey → Startup` | No | – | Yes | Many‑to‑One |
| `round_id` | `ForeignKey → InvestmentRound` | Yes | – | Yes | Many‑to‑One (Optional) |
| `investor_name` | `CharField(255)` | No | – | – | – |

  #### Modelo: `ReadinessLevel`
  | Column | Type | Null | PK | FK | Relationship |
  |--------|------|------|----|----|--------------|
  | `id` | `AutoField` | No | Yes | – | – |
  | `startup_id` | `ForeignKey → Startup` | No | – | Yes | Many‑to‑One (related_name=`readiness_levels`) |
  | `type` | `CharField(10)` | No | – | – | Choices: `TRL`, `CRL` |
  | `level` | `IntegerField` | No | – | – | 1-9 |
  | `title` | `CharField(255)` | No | – | – | – |
  | `subtitle` | `CharField(255)` | Yes | – | – | – |

  #### Modelo: `Evidence`
  | Column | Type | Null | PK | FK | Relationship |
  |--------|------|------|----|----|--------------|
  | `id` | `AutoField` | No | Yes | – | – |
  | `startup_id` | `ForeignKey → Startup` | No | – | Yes | Many‑to‑One (related_name=`evidences`) |
  | `type` | `CharField(10)` | No | – | – | Choices: `TRL`, `CRL` |
  | `level` | `IntegerField` | No | – | – | – |
  | `description` | `TextField` | Yes | – | – | – |
  | `file_url` | `URLField` | Yes | – | – | – |
  | `status` | `CharField(20)` | No | – | – | Choices: `PENDING`, `APPROVED`, `REJECTED` |
  | `reviewer_notes` | `TextField` | Yes | – | – | – |

  #### Modelo: `FinancialInput`
  | Column | Type | Null | PK | FK | Notes |
  |--------|------|------|----|----|-------|
  | `id` | `AutoField` | No | Yes | – | – |
  | `startup_id` | `ForeignKey → Startup` | No | – | Yes | Many‑to‑One (related_name=`financial_inputs`) |
  | `period_date` | `DateField` | No | – | – | – |
  | `revenue` | `DecimalField(15,2)` | No | – | – | – |
  | `costs` | `DecimalField(15,2)` | No | – | – | – |
  | `cash_balance` | `DecimalField(15,2)` | No | – | – | – |
  | `monthly_burn` | `DecimalField(15,2)` | No | – | – | – |
  | `notes` | `TextField` | Yes | – | – | – |

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
  | | `launch_date` | `DateField` | Yes | – | – | Date when the round officially opened. |
  | | `target_close_date` | `DateField` | Yes | – | – | Target deadline communicated to investors. |
  | | `actual_close_date` | `DateField` | Yes | – | – | Date when the round was actually closed. |
  | `Investor` (for a round) | `id` | `AutoField` | No | Yes | – | – |
  | | `round_id` | `ForeignKey` → `InvestmentRound` (related_name=`investors`) | No | – | – |
  | | `incubator_id` | `ForeignKey` → `users.Incubator` (related_name=`investments`) | No | – | – |
  | | `status` | `CharField(20)` (choices CONTACTED, MEETING, DUE_DILIGENCE, COMMITTED) | No | – | – |
  | | `amount` | `DecimalField(12,2)` | No | – | – |
  | | **Constraint** | `unique_together` | – | – | – | (`round_id`, `incubator_id`) |
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
  | | `cap_table_url` | `URLField` | Yes | – | – | – |

#### Modelo: `FinancialSheet`
| Column | Type | Null | PK | FK | Relationship |
|--------|------|------|----|----|--------------|
| `id` | `AutoField` | No | Yes | – | – |
| `campaign_id` | `OneToOneField → Campaign` | No | – | Yes | One‑to‑One |
| `sheet_data` | `JSONField` | No | – | – | Stores config, grid_rows (metrics, values, formulas) |

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
  | **POST** | `/startup/complete-onboarding/` | `OnboardingCompleteView` | Finalize wizard, create evidences and incubator associations. Only sends completed fields. |
  | **GET** | `/startup/data/` | `StartupDataView` | Return startup details (incl. computed `current_trl`, `current_crl`, `actual_revenue`). |
  | **GET** | `/startup/financial-data/` | `FinancialDataListView` | List all `FinancialInput` records for the startup. |
  | **GET** | `/startup/investors/` | `InvestorPipelineListView` | List all investor pipeline entries. |
  | **GET/POST/PUT/PATCH/DELETE** | `/startup/rounds/` | `RoundViewSet` (router) | CRUD for `Round` objects. |
  | **GET/POST/PUT/PATCH/DELETE** | `/startup/evidences/` | `EvidenceViewSet` (router) | CRUD for `Evidence` objects. |
  | **GET/POST/PUT/PATCH/DELETE** | `/startup/readiness-levels/` | `ReadinessLevelViewSet` (router) | CRUD for `ReadinessLevel` objects (TRL/CRL metadata). |
| **GET** | `/startup/associate-incubator/` | `StartupIncubatorAssociationViewSet` | List incubators associated with the startup. |
| **POST** | `/startup/associate-incubator/associate/` | `StartupIncubatorAssociationViewSet` | Associate startup with incubators (returns updated list). |
| **GET/POST/PUT/PATCH/DELETE** | `/incubators/` | `IncubatorViewSet` (router) | CRUD for Incubators. |
| **GET** | `/incubators/list_all/` | `IncubatorViewSet` (action) | Get ALL incubators (for selection). |
| **GET** | `/incubators/{id}/startups/` | `IncubatorViewSet` (action) | Get associated startups. |
| **GET/POST/PUT/PATCH/DELETE** | `/incubator/members/` | `IncubatorMemberViewSet` (router) | CRUD for Investors/Mentors. |
| **GET/POST/PUT/PATCH/DELETE** | `/challenges/` | `ChallengeViewSet` (router) | CRUD for Challenges. |
| **POST** | `/challenges/{id}/close/` | `ChallengeViewSet` (action) | Close a challenge. |
| **GET/POST/PUT/PATCH/DELETE** | `/challenge-applications/` | `ChallengeApplicationViewSet` (router) | Apply to challenges. |

  ### 2.2 Campaigns App (`campaigns/urls.py`)
  | Method | Path | ViewSet | Description |
  |--------|------|---------|-------------|
  | **GET/POST/PUT/PATCH/DELETE** | `/campaigns/` | `CampaignViewSet` (router) | CRUD for `Campaign` objects (one per startup). |

  ---

  ## 3. Request / Response Schemas & Axios TypeScript Examples
  ### 3.0 Authentication (Registration & Verification)
  #### Register (POST `/auth/registration/`)
  **Request**
  ```json
  {
    "email": "user@example.com",
    "password1": "securePassword123",
    "password2": "securePassword123",
    "user_type": "startup",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
  **Response**
  ```json
  {
    "detail": "Verification e-mail sent."
  }
  ```
  **Axios TS**
  ```ts
  import axios from 'axios';

  export interface RegisterDTO {
    email: string;
    password1: string;
    password2: string;
    user_type: 'startup' | 'incubator';
    first_name?: string;
    last_name?: string;
  }

  export const register = async (data: RegisterDTO) => {
    const resp = await axios.post('/auth/registration/', data);
    return resp.data;
  };
  ```

  #### Verify Email (POST `/auth/registration/account-confirm-email/`)
  **Request**
  ```json
  {
    "key": "Mg.X7... (verification key from email)"
  }
  ```
  **Response**
  ```json
  {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGci...",
    "detail": "Email verified successfully. You are now logged in."
  }
  ```
  **Axios TS**
  ```ts
  export const verifyEmail = async (key: string) => {
    const resp = await axios.post('/auth/registration/account-confirm-email/', { key });
    // Store tokens
    localStorage.setItem('access', resp.data.access_token);
    localStorage.setItem('refresh', resp.data.refresh_token);
    return resp.data;
  };
  ```

  ### 3.1 Onboarding Wizard (POST `/startup/complete-onboarding/`)
  **Important**: The frontend now sends **only the fields that the user completed** in the wizard. Optional fields (`evidences`, `incubator_ids`) are only sent if they contain data.

  **Required Fields**:
  - `company_name` (string, max 255 chars)
  - `industry` (string, max 50 chars)
  - `current_trl` (integer, 1-9)

  **Optional Fields**:
  - `current_crl` (integer, 1-9, nullable)
  - `evidences` (array of evidence objects)
  - `incubator_ids` (array of incubator IDs)

  #### Example: Minimal Request (Only Basic Info)
  ```json
  {
    "company_name": "Startup Inc",
    "industry": "technology",
    "current_trl": 3,
    "current_crl": null
  }
  ```

  #### Example: With Evidences
  ```json
  {
    "company_name": "Startup Inc",
    "industry": "technology",
    "current_trl": 3,
    "current_crl": 2,
    "evidences": [
      {
        "type": "TRL",
        "level": 3,
        "description": "Prototype demonstrated successfully",
        "title": "Working Prototype",
        "subtitle": "Lab validation complete"
      }
    ]
  }
  ```

  #### Example: Complete Request
  ```json
  {
    "company_name": "Startup Inc",
    "industry": "technology",
    "current_trl": 3,
    "current_crl": 2,
    "evidences": [
      {
        "type": "TRL",
        "level": 3,
        "description": "Prototype demonstrated successfully",
        "title": "Working Prototype",
        "subtitle": "Lab validation complete"
      }
    ],
    "incubator_ids": [1, 2]
  }
  ```

  **Response** (201 Created)
  ```json
  {
    "detail": "Onboarding wizard completed successfully",
    "startup_id": 5,
    "current_trl": 3,
    "current_crl": 2,
    "evidences_count": 1,
    "incubators_count": 2
  }
  ```

  **Axios TS**
  ```ts
  export interface OnboardingWizardDTO {
    company_name: string;
    industry: string;
    current_trl: number;
    current_crl?: number | null;
    evidences?: Array<{
      type: 'TRL' | 'CRL';
      level: number;
      description?: string;
      title?: string;
      subtitle?: string;
    }>;
    incubator_ids?: number[];
  }

  export interface OnboardingResponseDTO {
    detail: string;
    startup_id: number;
    current_trl: number;
    current_crl?: number;
    evidences_count: number;
    incubators_count: number;
  }

  export const completeOnboarding = async (
    token: string,
    data: OnboardingWizardDTO
  ): Promise<OnboardingResponseDTO> => {
    const resp = await axios.post<OnboardingResponseDTO>(
      '/startup/complete-onboarding/',
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data;
  };
  ```

  ### 3.2 Authentication (Login)
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
  ### 3.3 Get Startup Data
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
    "TRL_level": 4,
    "CRL_level": 2,
    "actual_revenue": 125000.00,
    "incubators": [
      {
        "id": 1,
        "name": "Y Combinator",
        "created": "2024-11-01T10:00:00Z",
        "updated": "2024-11-01T10:00:00Z"
      }
    ]
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
    TRL_level?: number;
    CRL_level?: number;
    actual_revenue?: number;
    incubators?: IncubatorDTO[];
  }

  export const fetchStartup = async (token: string): Promise<StartupDTO> => {
    const resp = await axios.get<StartupDTO>('/startup/data/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  };
  ```
  ---
  ### 3.4 Create Evidence (POST `/startup/evidences/`)
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
  ### 3.5 List Financial Inputs (GET `/startup/financial-data/`)
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
  ### 3.6 Create Round (POST `/startup/rounds/`)
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
  ### 3.7 Campaign CRUD (router `/campaigns/`)
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

  ### 3.7.1 Investment Rounds (CRUD `/rounds/`)
  **GET/POST/PUT/PATCH/DELETE** `/rounds/` manages investment rounds for the startup's campaign.
  **PATCH/PUT** supports nested updates for `investors` (tickets).

  **Request (PATCH/PUT with nested investors)**
  ```json
  {
    "target_amount": "500000.00",
    "launch_date": "2025-01-01",
    "target_close_date": "2025-06-30",
    "investors": [
      {
        "id": 10,
        "incubator_id": 1,
        "amount": "50000.00",
        "status": "COMMITTED"
      },
      {
        "incubator_id": 2,
        "amount": "25000.00",
        "status": "CONTACTED"
      }
    ]
  }
  ```

  **Axios TS**
  ```ts
  export interface InvestorDTO {
    id?: number;
    incubator_id?: number; // Write-only (for creating/updating)
    incubator_details?: {  // Read-only
      id: number;
      name: string;
    };
    amount: string;
    status: 'CONTACTED' | 'MEETING' | 'DUE_DILIGENCE' | 'COMMITTED';
  }

  export interface InvestmentRoundDTO {
    id: number;
    name: string;
    target_amount: string;
    pre_money_valuation?: string;
    status: 'PLANNED' | 'OPEN' | 'CLOSED';
    is_current: boolean;
    launch_date?: string;
    target_close_date?: string;
    actual_close_date?: string;
    investors?: InvestorDTO[];
    created: string;
    updated: string;
  }

  export const updateRound = async (token: string, id: number, data: Partial<InvestmentRoundDTO>) => {
    const resp = await axios.patch<InvestmentRoundDTO>(\`/rounds/\${id}/\`, data, {
      headers: { Authorization: \`Bearer \${token}\` },
    });
    return resp.data;
  };
  ```

  ### 3.8 Readiness Levels (CRUD `/startup/readiness-levels/`)
  **GET** `/startup/readiness-levels/` returns list of configured levels for the startup.
  **POST** `/startup/readiness-levels/` creates a new level definition.
  **DELETE** `/startup/readiness-levels/{id}/` deletes the level definition AND its associated evidence. Automatically recalculates the startup's TRL/CRL level (drops to the last continuous approved level).

  **Request (Create)**
  ```json
  {
    "type": "TRL",
    "level": 1,
    "title": "Basic Principles Observed",
    "subtitle": "Scientific research begins to be translated into applied research and development."
  }
  ```
  **Response** (201)
  ```json
  {
    "id": 1,
    "startup": 3,
    "type": "TRL",
    "level": 1,
    "title": "Basic Principles Observed",
    "subtitle": "Scientific research begins to be translated into applied research and development.",
    "created": "2025-12-03T18:30:00Z",
    "updated": "2025-12-03T18:30:00Z"
  }
  ```
  **Axios TS**
  ```ts
  export interface ReadinessLevelDTO {
    id: number;
    type: 'TRL' | 'CRL';
    level: number;
    title: string;
    subtitle?: string;
    created: string;
    updated: string;
  }

  export const createReadinessLevel = async (token: string, data: Partial<ReadinessLevelDTO>) => {
    const resp = await axios.post<ReadinessLevelDTO>('/startup/readiness-levels/', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  };

  export const fetchReadinessLevels = async (token: string): Promise<ReadinessLevelDTO[]> => {
    const resp = await axios.get<ReadinessLevelDTO[]>('/startup/readiness-levels/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  };

  export const deleteReadinessLevel = async (token: string, id: number) => {
    await axios.delete(`/startup/readiness-levels/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };
  ```
  ---
### 3.9 Startup Incubator Association (`/startup/associate-incubator/`)
  #### List Associated Incubators (GET `/startup/associate-incubator/`)
  **Response** (array of Incubator objects)
  ```json
  [
    {
      "id": 1,
      "name": "Y Combinator",
      "created": "2024-11-01T10:00:00Z",
      "updated": "2024-11-01T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Techstars",
      "created": "2024-11-02T11:00:00Z",
      "updated": "2024-11-02T11:00:00Z"
    }
  ]
  ```
  **Axios TS**
  ```ts
  export interface IncubatorDTO {
    id: number;
    name: string;
    created: string;
    updated: string;
    startups?: Array<{
      id: number;
      company_name: string;
      logo_url?: string;
      industry?: string;
    }>;
  }

  export const fetchAssociatedIncubators = async (token: string): Promise<IncubatorDTO[]> => {
    const resp = await axios.get<IncubatorDTO[]>('/startup/associate-incubator/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data;
  };
  ```

  #### Update Incubator Associations (POST `/startup/associate-incubator/associate/`)
  **Request**
  ```json
  {
    "incubator_ids": [1, 3]
  }
  ```
  **Response** (updated array of Incubator objects)
  ```json
  [
    {
      "id": 1,
      "name": "Y Combinator",
      "created": "2024-11-01T10:00:00Z",
      "updated": "2024-11-01T10:00:00Z"
    },
    {
      "id": 3,
      "name": "500 Startups",
      "created": "2024-11-03T12:00:00Z",
      "updated": "2024-11-03T12:00:00Z"
    }
  ]
  ```
  **Axios TS**
  ```ts
  export const updateIncubatorAssociations = async (
    token: string,
    incubatorIds: number[]
  ): Promise<IncubatorDTO[]> => {
    const resp = await axios.post<IncubatorDTO[]>(
      '/startup/associate-incubator/associate/',
      { incubator_ids: incubatorIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return resp.data;
  };
  ```
