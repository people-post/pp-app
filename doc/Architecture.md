# Architecture

This document is a Markdown representation of `doc/architecture.dia`.

## Overview

- **Frontend**
  - **Query agent**
  - **Frontend API**
- **Backend**
  - **Url endpoints**
  - **Backend API**
- **Integration**
  - Frontend calls Backend via **Url based API**

## Diagram (Mermaid)

```mermaid
flowchart LR
  subgraph Frontend
    QA[Query agent]
    FAPI[Frontend API]
  end

  subgraph Backend
    UE[Url endpoints]
    BAPI[Backend API]
  end

  Frontend -->|Url based API| Backend
```

