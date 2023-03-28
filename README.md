# Ghola

Ghola is an open source chat bot profile manager for creating and managing different personas and engaging in conversation with them. To see this running in action check out the [website](https://ghola.ai). 

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

Ghola comes with a range of features, including:

- Creating and managing chat bot personas.
- Engaging in conversations with your chat bot personas.
- Customizing your chat bot's profile, including name, profile picture, and interests.
- Saving conversation history with your chat bot personas.
- Exporting and importing chat bot profiles.

## Getting Started

To get started with Ghola, you will need to have Node.js and npm installed on your system as well as a MongoDB database running locally (or hosted). **To use the default application** you will also need a Google developer profile set up for required enviroment variables.

## Installation

To install Ghola, follow these steps:

1. Clone the repository:

git clone https://github.com/your-username/ghola.git

markdown


2. Install the dependencies:

cd ghola
npm install

javascript


3. Create a `.env` file with the following contents:

MONGODB_URI=mongodb://localhost/ghola
SESSION_SECRET=your_session_secret

javascript


Replace `your_session_secret` with a secret key that you generate for your application.

4. Start the application:

npm start

markdown


Ghola will start running at `http://localhost:3000`.

## Usage

To use Ghola, follow these steps:

1. Sign up for an account.
2. Create a new chat bot profile.
3. Customize your chat bot's profile and interests.
4. Start a conversation with your chat bot persona by clicking the "Start Conversation" button.
5. Have fun chatting with your chat bot persona!

## Contributing

Contributions to Ghola are welcome and encouraged! To contribute, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request.

## License

Ghola is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as you see fit.
