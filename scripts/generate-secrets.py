#!/usr/bin/env python3
"""
Generate secure random secrets for production deployment.

Usage:
    python scripts/generate-secrets.py

This will generate:
- SECRET_KEY (for JWT signing)
- NEXTAUTH_SECRET (for NextAuth.js)
- POSTGRES_PASSWORD (optional, for database)
"""

import secrets
import string


def generate_secret(length: int = 64) -> str:
    """Generate a cryptographically secure random secret."""
    alphabet = string.ascii_letters + string.digits + "-_"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def generate_password(length: int = 32) -> str:
    """Generate a secure password with special characters."""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    password = "".join(secrets.choice(alphabet) for _ in range(length))
    # Ensure at least one of each type
    if not any(c.islower() for c in password):
        password = password[0].lower() + password[1:]
    if not any(c.isupper() for c in password):
        password = password[0].upper() + password[1:]
    if not any(c.isdigit() for c in password):
        password = password[0] + "1" + password[2:]
    return password


if __name__ == "__main__":
    print("=" * 70)
    print("Acuvera Enterprise - Secret Generator")
    print("=" * 70)
    print()
    print("Generated secure secrets for production deployment:")
    print()
    print(f"SECRET_KEY={generate_secret(64)}")
    print(f"NEXTAUTH_SECRET={generate_secret(64)}")
    print()
    print("Optional database password (if not using existing):")
    print(f"POSTGRES_PASSWORD={generate_password(32)}")
    print()
    print("=" * 70)
    print("Copy these values to your .env file")
    print("=" * 70)
