# Water Resources & Flood Risk API

## Backend Integration Guide

This document provides the complete API specification and backend implementation prompts for the **Water Resources & Flood Risk** section.

---

## 🎯 Overview

The Water Resources & Flood Risk system provides:
- **HyFuse Scores**: Hybrid fusion of multiple water/flood indicators (0-100 scale)
- **Flood Masks**: SAR-derived flood extent polygons and rasters
- **Field Packs**: Automated report generation with maps and recommendations
- **Alerts**: Real-time notifications when risk thresholds are exceeded

---

## 📋 API Endpoints

### Base URL
```
http://localhost:8000/api/v1  (development)
https://your-domain.com/api/v1  (production)
```

### Authentication
All endpoints require JWT Bearer token authentication:
```bash
Authorization: Bearer <your_jwt_token>
```

---

## 🔌 Endpoint Specifications

### 1. Get HyFuse Tiles

Fetch HyFuse scores for tiles within a bounding box.

**Endpoint:** `GET /api/v1/hyfuse`

**Query Parameters:**
- `bbox` (required): Comma-separated values `minLon,minLat,maxLon,maxLat`
- `date` (optional): ISO date `YYYY-MM-DD` (defaults to today)
- `agg_window` (optional): Aggregation window in days: `7`, `30`, or `90` (default: `7`)

**Response:** GeoJSON FeatureCollection
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": "tile_abc123",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lon, lat], ...]]
      },
      "properties": {
        "tile_id": "tile_abc123",
        "hyfuse_score": 67,
        "confidence": 0.85,
        "timestamp": "2025-10-02T12:00:00Z",
        "components": {
          "recent_rain_mm": 45.2,
          "soil_moisture_index": 0.62,
          "grace_anomaly_mm": -12.5,
          "recent_inundation_count": 3
        }
      }
    }
  ]
}
```

**curl Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/hyfuse?bbox=-0.3,5.5,-0.1,5.7&date=2025-10-02&agg_window=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 2. Get HyFuse Tile Detail

Fetch detailed HyFuse data for a specific tile.

**Endpoint:** `GET /api/v1/hyfuse/tile/{tile_id}`

**Path Parameters:**
- `tile_id` (required): Tile identifier

**Response:** HyFuse JSON
```json
{
  "tile_id": "tile_abc123",
  "hyfuse_score": 67,
  "confidence": 0.85,
  "timestamp": "2025-10-02T12:00:00Z",
  "components": {
    "recent_rain_mm": 45.2,
    "soil_moisture_index": 0.62,
    "grace_anomaly_mm": -12.5,
    "recent_inundation_count": 3
  },
  "z_scores": {
    "rain": 1.2,
    "soil": 0.8,
    "grace": -0.5,
    "inundation": 1.5
  },
  "recommendations": [
    "Monitor drainage systems in low-lying areas",
    "Prepare flood barriers near critical infrastructure",
    "Review emergency response protocols"
  ]
}
```

**curl Example:**
```bash
curl -X GET "http://localhost:8000/api/v1/hyfuse/tile/tile_abc123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. Get Flood Scenes

List available flood mask scenes for a bounding box.

**Endpoint:** `GET /api/v1/flood_scenes`

**Query Parameters:**
- `bbox` (required): Comma-separated `minLon,minLat,maxLon,maxLat`
- `limit` (optional): Maximum results (default: `50`)

**Response:** Array of scene metadata
```json
[
  {
    "scene_id": "scene_xyz789",
    "scene_date": "2025-09-15",
    "processing_date": "2025-09-16T08:30:00Z",
    "confidence": 0.92,
    "extent_km2": 45.7
  }
]
```

---

### 4. Get Flood Mask

Fetch flood mask data for a specific scene.

**Endpoint:** `GET /api/v1/floodmask`

**Query Parameters:**
- `scene_id` (required): Scene identifier
- `format` (required): `geojson` or `geotiff`

**Response (GeoJSON):**
```json
{
  "type": "Feature",
  "properties": {
    "scene_id": "scene_xyz789",
    "confidence": 0.92
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[...]]
  }
}
```

**Response (GeoTIFF):**
```json
{
  "scene_id": "scene_xyz789",
  "format": "geotiff",
  "download_url": "https://s3.../flood_scene_xyz789.tif",
  "expires_at": "2025-10-02T15:00:00Z"
}
```

---

### 5. Request Field Pack

Create a field pack generation job.

**Endpoint:** `POST /api/v1/fieldpack`

**Request Body:**
```json
{
  "aoi": {
    "type": "Polygon",
    "coordinates": [[...]]
  },
  "email": "user@example.com",
  "type": "full"
}
```

**Response:**
```json
{
  "job_id": "fp_1727878800000",
  "status": "queued",
  "message": "Field pack generation started"
}
```

---

### 6. Check Field Pack Status

Poll job status and get download link when ready.

**Endpoint:** `GET /api/v1/fieldpack/{job_id}`

**Response (Processing):**
```json
{
  "job_id": "fp_1727878800000",
  "status": "processing",
  "progress": 65
}
```

**Response (Completed):**
```json
{
  "job_id": "fp_1727878800000",
  "status": "completed",
  "download_url": "https://s3.../fieldpack_fp_1727878800000.zip",
  "created_at": "2025-10-02T12:00:00Z"
}
```

---

### 7. Create Alert

Create a new alert rule.

**Endpoint:** `POST /api/v1/alerts`

**Request Body:**
```json
{
  "aoi": {
    "type": "Polygon",
    "coordinates": [[...]]
  },
  "threshold": 60,
  "channel": "email",
  "contact": "user@example.com"
}
```

**Response:**
```json
{
  "alert_id": "alert_1727878800000",
  "aoi": {...},
  "threshold": 60,
  "channel": "email",
  "contact": "user@example.com",
  "created_at": "2025-10-02T12:00:00Z",
  "active": true
}
```

---

## 🔧 Environment Configuration

Create a `.env` file in your project root:

```env
# Backend API URL (frontend will use this)
VITE_HYFUSE_API_URL=http://localhost:8000/api/v1

# Backend configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/hyfuse_db
REDIS_URL=redis://localhost:6379
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
JWT_SECRET=your-secret-key-here

# Data sources (when connecting to real services)
NASA_EARTHDATA_TOKEN=your_token
GRACE_API_URL=https://...
SMAP_API_URL=https://...
SAR_PROCESSING_ENDPOINT=https://...
```

---

## 🚀 Quick Start (Frontend Only - Mock Data)

The frontend is already configured with mock data generators. To use it:

1. **Run the app:**
   ```bash
   npm run dev
   ```

2. **Toggle the Water/Flood panel** in the header
3. **Interact with the UI** - all data is mocked locally
4. **When ready for backend**, update `src/lib/nasa/hyfuse.js` to uncomment the real API calls

---

## 🏗️ Backend Implementation Prompts

### Prompt 1: OpenAPI Specification

Use this prompt with an LLM (temperature=0.0) to generate the complete OpenAPI spec:

```
Create an OpenAPI 3.0 specification for the "Water Resources & Flood Risk" section. Include the following endpoints with full request/response schemas and example payloads:

GET /api/v1/hyfuse?bbox=lonmin,latmin,lonmax,latmax&date=YYYY-MM-DD&agg_window=7|30|90 — returns a paginated GeoJSON FeatureCollection of tiles with the HyFuse schema (include hyfuse_score, components, confidence, timestamp, tile_id).

GET /api/v1/hyfuse/tile/{tile_id} — returns single HyFuse JSON for the tile.

GET /api/v1/flood_scenes?bbox=...&limit=50 — returns array of available flood scenes.

GET /api/v1/floodmask?scene_id={scene_id}&format=geojson|geotiff — returns flood mask metadata and a pre-signed download link or inline GeoJSON.

POST /api/v1/fieldpack — body: { "aoi": GeoJSON, "email": "optional", "type": "brief|full" } — returns { "job_id","status","download_url" }.

GET /api/v1/fieldpack/{job_id} — returns job status and download URL when ready.

POST /api/v1/alerts — create an alert rule: { "aoi":GeoJSON, "threshold":number, "channel":"email|webhook", "contact":"string" }.

Authentication: describe JWT-based auth (Bearer) with roles (viewer, planner, admin) and which endpoints require which roles.
Provide explicit JSON Schema for HyFuse, sample Response codes (200/400/401/404/500) and one runnable curl example per endpoint.
```

### Prompt 2: FastAPI HyFuse Microservice

```
Generate a complete FastAPI microservice called hyfuse_service that implements:

Endpoint: GET /api/v1/hyfuse with bbox, date, agg_window params; returns GeoJSON FeatureCollection of HyFuse tiles per the HyFuse JSON schema.

Endpoint: GET /api/v1/hyfuse/tile/{tile_id} returns single HyFuse JSON.

Implementation details:
- Use placeholder helper functions fetch_recent_rain(tile,date), fetch_soil_moisture(tile,date), fetch_grace_anomaly(tile,date), fetch_recent_inundation_count(tile,window)
- Implement these to read from local JSON cache files (provide example cached JSON format) and include TODOs where to call S3/PostGIS
- Compute z-scores over a sliding window and apply weights: 0.4 rain, 0.3 soil, 0.15 grace, 0.15 inundation
- Rescale to 0–100 and compute confidence = completeness fraction
- Add in-memory caching (LRU), logging, health endpoint /healthz, and simple rate limiting middleware
- Include requirements.txt, Dockerfile, pytest unit test that hits /api/v1/hyfuse with synthetic cached data, and a curl example
```

### Prompt 3: Database Schema & Docker

```
Produce:

SQL DDL for tables: users, roles, hyfuse_scores (tile_id, geometry, timestamp, hyfuse_score, components JSONB, confidence), flood_masks, fieldpack_jobs, alerts. Include PostGIS geometry types, spatial indexes, and example insert.

A simple auth module: /auth/login returns JWT (expires 1h) using pyjwt, password hashing with bcrypt, and role-based dependency for endpoints. Include sample env variables file .env.example.

A docker-compose.yml that starts: postgres:postgis, redis, minio, backend (built from Dockerfile). Include volumes and example env.

One SQL migration for hyfuse_scores table (Alembic-style or plain SQL).
```

---

## 📊 HyFuse Score Calculation

### Formula
```
HyFuse = 0.4 × Z_rain + 0.3 × Z_soil + 0.15 × Z_grace + 0.15 × Z_inundation
```

Where each Z-score is normalized over a sliding window and then scaled to 0-100.

### Component Data Sources
- **Recent Rainfall**: GPM/IMERG or local weather stations
- **Soil Moisture**: SMAP L3 or SMOS
- **GRACE Anomaly**: GRACE-FO monthly gravity anomalies
- **Inundation Events**: Sentinel-1 SAR flood detections

### Confidence Score
```
Confidence = (number of available components) / 4
```

---

## 🧪 Testing

### Frontend Tests
```bash
# Run dev server
npm run dev

# Test all components:
1. Toggle Water/Flood panel in header
2. Click through all 4 tabs (HyFuse, Floods, Field Pack, Alerts)
3. Select different tiles in HyFuse view
4. Generate a field pack (watch job status)
5. Create an alert with different thresholds
6. Download flood mask GeoJSON
```

### Backend Tests (when implemented)
```bash
# Unit tests
pytest tests/

# Integration tests
pytest tests/integration/

# E2E test with frontend
npm run test:e2e
```

---

## 📦 Deliverables

### Included Files
```
src/
├── components/
│   └── Panels/
│       ├── WaterFloodPanel.jsx          ← Main panel component
│       └── WaterFlood/
│           ├── HyFuseCard.jsx           ← Score visualization
│           ├── FloodMaskOverlay.jsx     ← Flood timeline & overlays
│           ├── FieldPackModal.jsx       ← Field pack generation
│           └── AlertCreator.jsx         ← Alert management
├── lib/
│   └── nasa/
│       └── hyfuse.js                    ← API client with mock data
└── App.jsx                              ← Updated with new panel
```

### Documentation
- `WATER_FLOOD_API.md` ← This file
- OpenAPI spec (to be generated with Prompt 1)
- Backend implementation guides (Prompts 2-3)

---

## 🎨 Design Tokens

The components use your existing design system:

### Colors
- `nasa-blue`: Primary action color
- `space-800/900`: Background panels
- `white/10`: Borders and dividers
- Risk score colors: red (critical), orange (high), yellow (moderate), blue (low), green (minimal)

### Components Follow Pattern
- Similar structure to `ClimatePanel` and `EventsPanel`
- Consistent spacing and typography
- Responsive grid layout
- Accessibility (ARIA labels, keyboard navigation)

---

## 🚧 Next Steps

### Phase 1: Frontend (✅ Complete)
- [x] UI components with mock data
- [x] Tab navigation and state management
- [x] Field pack workflow
- [x] Alert creation and management

### Phase 2: Backend Implementation
1. Generate OpenAPI spec with Prompt 1
2. Build FastAPI microservice with Prompt 2
3. Set up database and Docker with Prompt 3
4. Implement Celery workers for field pack generation
5. Add alert evaluation cron job

### Phase 3: Data Integration
1. Connect to NASA Earthdata for real precipitation
2. Integrate SMAP/SMOS soil moisture
3. Process GRACE-FO gravity anomalies
4. Set up SAR processing pipeline (Sentinel-1)

### Phase 4: Production
1. Deploy backend to cloud (AWS/GCP/Azure)
2. Set up CDN for GeoTIFF delivery
3. Configure email/webhook services for alerts
4. Add monitoring and logging
5. Security audit and penetration testing

---

## 🤝 Support & Contribution

For questions or issues:
1. Check the inline code comments in `src/lib/nasa/hyfuse.js`
2. Review component props and state management
3. Test with mock data first before connecting backend
4. Use browser DevTools to debug API calls

---

## 📝 License & Credits

- **Frontend Framework**: React + Vite
- **Mapping**: Leaflet
- **NASA Data**: GIBS, EONET, POWER, GPM, SMAP, GRACE-FO
- **SAR Processing**: Sentinel-1 (ESA Copernicus)

Built for NASA Space Apps Challenge 2025 🚀
