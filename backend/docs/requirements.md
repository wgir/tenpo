## 1. Objective

Design and develop an API (backend) in Java using Spring Boot, following software development best practices.  
The objective is to evaluate technical skills to implement a scalable, well-documented, and maintainable solution.

---

## 2. Context

**Tenpo** is a fintech company that provides services to tenpistas.  
To support this, it has a platform that allows tenpistas to register their transactions.

---

## 3. Functional Requirements

### Main Functionality

Create an application that allows the registration of **tenpistas**, and **transactions**.

### Tenpistas

The application must allow:

- Create new tenpistas with the following fields:
  - `tenpista_id` (int)
  - `tenpista_name` (varchar)
  - `tenpista_rut` (varchar)
- Retrieve all tenpistas
- Retrieve a tenpista by ID
- Update a tenpista
- Delete a tenpista

### Transactions

The application must allow:

- Create new transactions with the following fields:
  - `transaction_id` (int)
  - `transaction_amount` in pesos (int)
  - `merchant_or_business` (varchar)
  - `tenpista_id` (int)
  - `transaction_date` (datetime)
- Retrieve all transactions
- Retrieve a transaction by ID
- Update a transaction
- Delete a transaction

### Constraints

- Each tenpista may have a **maximum of 100 transactions**.
- Transactions **cannot have negative amounts**.
- The transaction date **cannot be later than the current date and time**.

---

## 4. Technical Requirements

### Backend

- **Spring Boot**
  - Implement a REST API to handle the described functionality.
  - Suggested endpoint:
    - `/transaction` (`GET`, `POST`, `PUT`, `DELETE`)

- **Database**
  - Use **PostgreSQL** as the relational database.
  - Design an appropriate structure for transaction storage.

- **Rate Limiting**
  - Implement a limit of **3 requests per minute per client** to prevent system abuse.

- **Unit Testing**
  - Include unit tests for:
    - Services
    - Repositories
    - Controllers
  - Using mocks is a plus.

- **Error Handling**
  - Implement a global HTTP error handler.
  - Return structured and clear responses.
  - Example: return HTTP **500** for server errors.

- **Documentation**
  - Document endpoints using **Swagger**.
  - Provide a Swagger UI accessible via `swagger-ui`.

---

## 5. Evaluation Criteria

- **Correctness**
  - Compliance with functional and technical requirements.

- **Code Quality**
  - Readability, organization, use of patterns, and best practices.

- **Testing**
  - Coverage and quality of unit tests.

- **Documentation**
  - Clarity and completeness of `README.md` and Swagger documentation.

- **Docker Usage**
  - Proper configuration and functionality of the Docker environment.

- **Scalability and Efficiency**
  - Proper implementation of rate limiting and error handling.

---

## 6. Deliverables

- **Public Repository**
  - Upload the code to a public repository on GitHub or similar.

- **Instructions**
  - Provide a `README.md` file including:
    - Project description
    - Instructions to run the service and database locally
    - Details on how to interact with the API

- **Docker Hub**
  - Share the link to the published image or a `docker-compose` file
    that allows the project to be started locally.
