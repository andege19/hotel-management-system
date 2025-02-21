Hotel Management System is a multi-page Node.js application designed to streamline hotel operations. It supports two primary user roles—**Receptionist** and **Housekeeping Staff**—and now includes a complete sign-up feature along with login and logout capabilities. The system uses Express for its server framework, EJS as the templating engine, and session-based authentication. Data for users and room statuses is stored locally in JSON files.

Features

- Authentication:
  - **Sign Up:** New users can register by selecting a role (Receptionist or Housekeeping Staff), providing a work ID, and a password.
  - **Login/Logout:** Existing users can log in using their work ID, password, and selected role. Sessions are maintained using `express-session`.

- Receptionist Dashboard:
  - **Check-In Guest:** Book a room by selecting from available rooms. The system updates the room status to "occupied" and assigns a guest name.
  - **Check-Out Guest:** Mark a room as vacant by checking out the guest, which resets the room's status.
  - **Add Cleaning Request:** Send a cleaning request for any room by selecting it from a dropdown list that displays all rooms along with their current status.

- Housekeeping Dashboard:
  - **View Cleaning Tasks:** Displays a list (via a dropdown) of rooms that require cleaning.
  - **Update Room Status:** Allows housekeeping staff to mark rooms as clean, updating the room's status to "available".

- Data Storage:
  - **Rooms Data:** Stored in `data/rooms.json`, initially containing 10 rooms with status set to "available".
  - **User Data:** Stored in `data/users.json`. The file is automatically initialized with default users if it does not exist or is empty.

- Design & Styling:
  - A refined CSS file (located at `public/styles.css`) uses a vibrant color palette inspired by modern designs.
  - Animated elements and a responsive layout enhance the user experience.
  - A logo (e.g., `public/images/logo.png`) is incorporated into the header and login screens.


