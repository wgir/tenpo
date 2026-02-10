# Backend API Requirement – Get All Transactions (DTO + Tests)

## Context

You are working on a Java backend API built with **Spring Boot**, using **PostgreSQL** and **JPA/Hibernate**.  
The system manages **tenpistas**, and **transactions**.

- A **transaction** belongs to an **tenpista**

---

## Requirement

Update the **GET /transactions** endpoint so that it returns a **flattened response DTO** containing transaction, and tenpista data.

Update the **GET /getTransactionsByTenpistaId/tenpista/{tenpistaId}** endpoint so that it returns a **flattened response DTO** containing transaction, and tenpista data.

---

## Expected Response Format

The endpoint must return a JSON array with the following structure:

```json
[
  {
    "id": 12,
    "amount": 2000,
    "merchant_or_business": "Amazon",
    "date": "2026-02-04T03:48:00",
    "tenpista_id": 1,
    "tenpista_name": "tenpista 1"
  }
]

Check all tests to ensure they are updated to use the new response format.