CS418/518 Spring 2025 Project – Milestone 1

Overview

This milestone focuses on setting up the basic framework and authentication system for the website written in nextjs with and express backend and mysql database.

Requirements

User Registration

Users register with an email address.

Email serves as the unique identifier.

Passwords must be encrypted before storage.

Duplicate email registrations are not allowed.

Email Verification

Verification email sent upon successful registration.

Users cannot log in until email verification is completed via a confirmation link.

Authentication & Security

Users must log in with registered accounts.

Password reset functionality.

Users can change passwords after logging in.

Implement two-factor authentication (2FA) via email, SMS, or DUO push.

User Dashboard

Each user has a homepage to:

View profile.

Change password.

Update information (Email is immutable).

Admin User

One admin account must be created from the backend.

Admin has a distinct view from regular users.

Admin will approve advising sheets later.




