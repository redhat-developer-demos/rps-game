# Rock Paper Scissors Game

Welcome to the Rock Paper Scissors game powered by [Red Hat OpenShift AI](https://red.ht/openshift_ai)! :rocket:

This game uses a Quarkus backend and a React frontend. The game integrates machine learning models to process your move, giving it a modern twist to the classic game! 

<div align="center">
<img width="33%" src="roshambo-phone.png" alt="Roshambo on iPhone" title="Roshambo on iPhone"</img>
</div>

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, you will need to have the following installed:

- Node.js (v18 or v20) and npm
- Java Development Kit (v17)
- Maven

Optionally, you might want to the Quarkus backend upload captures images to AWS
S3. This requires creating an S3 bucket and configuring an IAM user with write
access to the bucket. Check the backend README for more information.

### Installing

- Clone the repository to your local machine.
- Navigate to the root directory of the project.
- Install frontend dependencies using `npm install` in the frontend directory (`roshambo-ui`).
- Install backend dependencies using `mvn install` in the backend directory (`roshambo-backend`).
- Start the Quarkus backend using `./mvnw quarkus:dev`.
- Start the React development server using `npm run dev`.
- Visit http://localhost:5173 in your web browser to view the application (view the README in the `roshambo-ui` folder for details about SSL and iOS Camera access)

## Built With

- [React](https://react.dev) - The web framework used.
- [TypeScript](https://www.typescriptlang.org) - The main language for the frontend.
- [XState](https://xstate.js.org/docs/) - State management for the frontend, and bot players.
- [Quarkus](https://quarkus.io) - Used for the backend.
- [Tailwind CSS](https://tailwindcss.com) - Used for styling.

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Authors

- [Alex Soto Bueno](https://twitter.com/alexsotob) (Backend)
- [Evan Shortiss](https://twitter.com/evanshortiss) (Frontend)
- [Cedric Clyburn](https://twitter.com/cedricclyburn) (Frontend)
- [Chris Chase](https://twitter.com/chaseredhat) (AI Model)

## License

This project is licensed under the Apache License 2.0 - see the LICENSE.md file for details.
