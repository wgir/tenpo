CREATE TABLE tenpistas (
    tenpista_id SERIAL PRIMARY KEY,
    tenpista_name VARCHAR(255) NOT NULL,
    tenpista_rut VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    transaction_amount INTEGER NOT NULL,
    merchant_or_business VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    tenpista_id INTEGER NOT NULL REFERENCES tenpistas(tenpista_id)
);
