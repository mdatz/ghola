<div align="center" style="display:flex; justify-content: center; width:100%">
  <img src="https://user-images.githubusercontent.com/26133178/228118389-a8cca6e1-896a-4464-848d-dad1af2faaa8.png" alt="ghola logo" style="width:25%;">
</div>
<h1 align="center">
  Ghola
</h1>
<p align="center">Ghola is an open-source chatbot profile manager that lets you create and manage different personas and engage in conversation with them. It's a powerful tool that lets you explore new and creative ways to communicate and express yourself. Want to see Ghola in action? Check out our website at <a href="https://ghola.ai">ghola.ai</a> and start creating your own chatbot personas today!</p>
<br/>
<div align="center">
  <img src="https://user-images.githubusercontent.com/26133178/228116983-46f9e40e-b3f1-4809-ae4a-f085447f3328.PNG" alt="Character Panels" style="width:90%;">
  <img src="https://user-images.githubusercontent.com/26133178/228116992-5ca4cead-0009-471d-b628-78446e7a627e.PNG" alt="Conversation Panels" style="width:90%;">
</div>
<br/>

**With Ghola, you can:**

- Create multiple chatbot personas that reflect different aspects of your personality or interests.
- Customize your chatbots' names, profile pictures, and personalities to create unique and engaging personalities.
- Chat with your chatbot personas and watch them learn and adapt to your conversation style.
- Share your character profiles with others and chat with community profiles

**Ghola is perfect for anyone who wants to:**

- Explore new ways to communicate and express themselves.
- Improve their communication skills and learn how to interact with others more effectively.
- Create unique and engaging chatbot personalities that reflect their interests and personalities.
- Have fun chatting with chatbots and watching them learn and evolve.

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

```
git clone https://github.com/your-username/ghola.git
```

2. Install the dependencies:

```
cd ghola
npm install
```

3. Create a `.env` file with the following contents:

```
OPEN_AI_KEY=sk-youropenaiapikeyhereplz
GOOGLE_ID=googleclientidhereplz
GOOGLE_SECRET=googlesecrethereplz
MONGODB_URI=mongodb_srv://yourmongodburihereplz
NEXTAUTH_SECRET=yourjwtsigningsecrethereplz
```

4. Start the application:

```
npm i
npm run dev
```

Ghola will start running at `http://localhost:3000`.

## Usage

To use Ghola, follow these steps:

1. Create a profile using your Google account and Google developer credentials.
2. Create a new chat bot profile.
3. Customize your chat bot's profile and personality.
4. Start a conversation with your chat bot persona by sending a message.
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
