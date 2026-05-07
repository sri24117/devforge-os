
import hmac
import hashlib


def test_razorpay_checkout_signature_shape():
    secret = "test_secret"
    order_id = "order_123"
    payment_id = "pay_123"
    expected = hmac.new(secret.encode(), f"{order_id}|{payment_id}".encode(), hashlib.sha256).hexdigest()
    assert len(expected) == 64


def test_razorpay_webhook_signature_shape():
    secret = "webhook_secret"
    raw_body = b'{"event":"order.paid"}'
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    assert len(expected) == 64
