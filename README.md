\# MarketSphere



MarketSphere is an AI-assisted customer intelligence platform that transforms customer transaction data into actionable business insights.



It helps businesses understand customer value, identify churn risk, discover behavioral segments, and plan targeted marketing campaigns.



\## Features



\- Customer CSV data ingestion.

\- Revenue and customer analytics dashboard.

\- Customer health and churn-risk scoring.

\- Rule-based customer segmentation.

\- K-Means customer segmentation using scikit-learn.

\- Customer personas and behavioral insights.

\- Marketing campaign recommendations.

\- AI business analyst interface.

\- REST API with FastAPI.

\- Responsive dashboard built with Next.js and Tailwind CSS.

\- Interactive API documentation using Swagger.



\## Tech Stack



\### Frontend



\- Next.js

\- React

\- TypeScript

\- Tailwind CSS

\- Lucide React



\### Backend



\- FastAPI

\- Python

\- SQLModel

\- SQLite

\- Uvicorn



\### Machine Learning



\- scikit-learn

\- K-Means clustering

\- Feature scaling

\- Customer behavior analysis



\## Architecture



```text

CSV upload

&#x20;   ↓

FastAPI ingestion API

&#x20;   ↓

SQLite database

&#x20;   ↓

Analytics and ML services

&#x20;   ↓

Next.js dashboard

```



\## Main Analytics



MarketSphere calculates:



\- Total customers.

\- Total revenue.

\- Average order value.

\- Revenue contribution by segment.

\- Customer churn-risk score.

\- Risk level for each customer.

\- Recommended marketing action.

\- K-Means behavioral clusters.



\## Customer Segments



The application identifies four business segments:



\- High Value Customers.

\- Loyal Repeat Buyers.

\- Discount Hunters.

\- At-Risk Customers.



\## Running Locally



\### Start the backend



```powershell

cd apps/api

.\\.venv\\Scripts\\Activate.ps1

python -m uvicorn app.main:app --reload

```



The backend runs at:



```text

http://127.0.0.1:8000

```



Swagger API documentation:



```text

http://127.0.0.1:8000/docs

```



\### Start the frontend



Open another terminal:



```powershell

cd marketsphere

npm install

npm run dev

```



The frontend runs at:



```text

http://localhost:3000

```



\## CSV Format



The uploaded CSV should contain these columns:



```text

customer id

age

gender

income

city

purchase amount

purchase frequency

category

last purchase date

```



Example:



```csv

customer id,age,gender,income,city,purchase amount,purchase frequency,category,last purchase date

CUST-001,28,Female,65000,Mumbai,12500,8,Electronics,2026-06-15

CUST-002,35,Male,82000,Pune,54000,12,Fashion,2026-04-20

```



\## API Endpoints



| Method | Endpoint | Purpose |

|---|---|---|

| GET | `/` | API status |

| GET | `/health` | Health check |

| GET | `/customers` | Retrieve customers |

| POST | `/customers/upload` | Upload customer CSV |

| GET | `/analytics/overview` | Retrieve business KPIs |

| GET | `/analytics/customers` | Retrieve customer health data |

| GET | `/analytics/ml-segments` | Retrieve K-Means segments |



\## Project Structure



```text

marketsphere/

├── apps/

│   └── api/

│       └── app/

│           ├── main.py

│           ├── models.py

│           ├── db.py

│           ├── auth.py

│           └── services/

│               └── segmentation.py

│

└── marketsphere/

&#x20;   └── src/

&#x20;       └── app/

&#x20;           ├── page.tsx

&#x20;           ├── customers/

&#x20;           ├── segments/

&#x20;           ├── campaigns/

&#x20;           ├── insights/

&#x20;           └── upload/

```



\## Current Scope



This project is currently a local demonstration MVP focused on customer analytics, churn-risk analysis, customer segmentation, and marketing intelligence.



Multi-user authentication, production database hosting, campaign execution, and external CRM integrations can be added in a future version.



\## Future Improvements



\- PostgreSQL database support.

\- Production authentication and workspace management.

\- Automated campaign execution.

\- External CRM integrations.

\- Real-time analytics.

\- Advanced churn prediction models.

\- Time-series revenue forecasting.

\- Cloud deployment.

\- Automated testing and CI/CD.



\## Resume Description



MarketSphere is a full-stack AI-assisted customer intelligence platform built with Next.js, FastAPI, SQLite, and scikit-learn. It processes customer transaction data, calculates churn risk, identifies behavioral segments using K-Means clustering, and provides revenue analytics and targeted marketing recommendations.



\## License



This project was created for educational and portfolio purposes.

