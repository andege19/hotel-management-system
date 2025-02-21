Hotel Management System is a multi-page Node.js application designed to streamline hotel operations. It allows two main user roles—Receptionist and Housekeeping Staff—to efficiently manage check-ins, room assignments, and housekeeping tasks.

- Receptionist Capabilities:
  - Check in guests and assign rooms.
  - Add cleaning requests.
  - View room statuses.

- Housekeeping Capabilities:
  - View pending cleaning tasks.
  - Update room statuses upon cleaning completion.

- Authentication:
  - Session-based login using Express sessions.
  - Hardcoded credentials (for demo purposes):
    - Receptionist: Username: `receptionist`, Password: `1234`
    - Housekeeping: Username: `housekeeping`, Password: `1234`

- Data Storage:
  - Uses a local JSON file (`data/rooms.json`) to store room data.

- Technologies:
  - Node.js
  - Express
  - EJS (Templating Engine)
  - CSS for styling



