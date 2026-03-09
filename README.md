# wialon-ts

TypeScript SDK for Wialon API with strong typing and error handling.

## Installation

Install directly from GitHub:

```bash
bun add git+https://github.com/peperc22/wialon-ts.git
```

## Usage

```typescript
import { CoreAPI, WialonAuthError, WialonErrorCode } from 'wialon-ts';

const api = new CoreAPI();

try {
  const result = await api.auth.login('your-wialon-token');
  console.log('Session ID:', result.sid);
  console.log('Resource ID:', result.resourceId);
  console.log('User:', result.user);

  // Use the API with result.sid...

  await api.auth.logout(result.sid);
} catch (error) {
  if (error instanceof WialonAuthError) {
    console.error(`Wialon error ${error.code}: ${error.message}`);
  }
}
```

## Development

To install dependencies:

```bash
bun install
```

This project was created using `bun init` in bun v1.2.22. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
