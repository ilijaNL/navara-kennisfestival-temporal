# Temporal Kennis festival

## Requirements

- NodeJS (">=20.0.0)
- NPM
- Temporal CLI (https://docs.temporal.io/cli#install)

## Installation

- `npm install`

## Running

**Local Temporal server**

1. Open new terminal in root directory
2. Run command `temporal server start-dev -f .temporal`

**Fulfillment Process**

1. Open new terminal in root directory
2. Run command `npx nx serve fulfillment`

**Create Order Process**

1. Open new terminal in root directory
2. Run command `npx nx create-order fulfillment`

**Flaky API**

1. Open new terminal in root directory
2. Run command `npx nx serve flaky-api`
