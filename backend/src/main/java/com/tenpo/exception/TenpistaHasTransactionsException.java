package com.tenpo.exception;

public class TenpistaHasTransactionsException extends RuntimeException {
    public TenpistaHasTransactionsException(String message) {
        super(message);
    }
}
