#!/bin/bash

# Check if the user provided an argument
if [ -z "$1" ]; then
    echo "Usage: $0 <number_of_days_ago> \"commit message\""
    exit 1
fi

# Get the number of days ago
DAYS_AGO=$1
COMMIT_MESSAGE=$2

# Check if a commit message is provided
if [ -z "$COMMIT_MESSAGE" ]; then
    echo "Error: Commit message is required."
    exit 1
fi

# Stage all changes
git add .

# Commit with a past date
git commit -m "$COMMIT_MESSAGE" --date="$DAYS_AGO days ago"

echo "Commit created for $DAYS_AGO days ago with message: \"$COMMIT_MESSAGE\""

