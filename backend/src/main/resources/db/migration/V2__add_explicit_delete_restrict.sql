-- Constraint for transactions table (prevents deleting tenpistas with transactions)
ALTER TABLE transactions 
DROP CONSTRAINT transactions_tenpista_id_fkey;

ALTER TABLE transactions 
ADD CONSTRAINT transactions_tenpista_id_fkey 
    FOREIGN KEY (tenpista_id) 
    REFERENCES tenpistas(tenpista_id) 
    ON DELETE RESTRICT;
