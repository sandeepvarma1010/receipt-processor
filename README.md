# Receipt Processor

This project implements a receipt processing web service with a Dockerized setup. The service allows users to process receipts and calculate points based on specific rules.

---

## Features

- Process receipts by sending JSON payloads.
- Calculate points based on a set of rules.
- Retrieve points for processed receipts using a unique receipt ID.
- In-memory data storage (data is lost when the application restarts).

---

## API Endpoints

### 1. Process Receipts

- **Path:** `/receipts/process`
- **Method:** `POST`
- **Request Body:** JSON receipt payload.
- **Response:** A unique receipt ID.

Example Request:
```json
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },
    {
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    }
  ],
  "total": "35.35"
}
```
Example Response:
```json
{
  "id": "7fb1377b-b223-49d9-a31a-5a02701dd310"
}

```
### 2. Get points

- **Path:** `/receipts/{id}/points`
- **Method:** `Get`
- **Response:** The total points awarded for the receipt.

Example Response:
```json
{
  "points": 28
}
```
---

## Run With Docker

### 1. Build the Docker image:

```bash
docker build -t receipt-processor .

```
### 2. Run the Docker container:

```bash
docker run -p 8080:8080 receipt-processor

```
### 3.	Access the application at http://localhost:8080.

---

