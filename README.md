# Weather App

A weather app that uses the OpenWeatherMap API to get weather data.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [APIs](#apis)
- [Technologies Used](#technologies-used)
- [Testing](#testing)
- [Directory Structure](#directory-structure)
- [Production Deployment](#production-deployment)
- [Contributing](#contributing)
- [License](#license)

## Description

This app allows users to search for weather data of a specific city. The user can search for a city by name, latitude and longitude through the use of map. The app will fetch weather data from the OpenWeatherMap API and display the current weather status of the searched city.

## Installation

To install the app, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/weatherapp.git`
1. Change the working directory to the cloned repository: `cd weatherapp`
1. Install the dependencies: `npm install`
1. Change the working directory to the client: `cd client`
1. Install the dependencies: `npm install`

## Usage

To start the app, run `npm start` from the root directory of the project.
This will start the development server at `localhost:3000` and open the app in your default browser.

## APIs

To utilize the app, you need to sign up for an API key with the OpenWeatherMap API. Add this API key to the `.env` file in the root directory of the project. The API key should be added as `OPENWEATHERMAP_API_KEY=YOUR_API_KEY`. Additionally, you need to obtain an API key for the Google Maps API. You can obtain it from the Google Developers Console by following the instructions at [https://developers.google.com/maps/get-started#api-key](https://developers.google.com/maps/get-started#api-key).

## Technologies Used

- React
- Tailwind CSS
- Express
- Node.js

## Testing

To test the app, run `npm test` in the root directory of the project. This will run the tests defined in the `client` directory.


## Directory Structure

The app is structured as a client-server application. The client code is located in the `client` directory, and the server code is located in the root directory of the project. The client code is a React application, and the server code is a Node.js application using Express. The server serves the client code and acts as an API endpoint for the client.

The structure of the directory is as follows:

    app
    ├── cache - contains caching services
    └── controllers - contains controller classes
    client - react app
    tests - test cases

## Production Deployment

To deploy the app in production, follow these steps:

1. Update the `.env` file in the `client` directory with the production API URL: `REACT_APP_API_URL=http://localhost:5000` (dont forget to remove something like http://localhost:5000 in REACT_APP_API_URL in development mode)
1. Build the client code: `npm run build` in the `client` directory
1. Start the app in production mode: `npm rurn server` in the root directory of the project

Note: Make sure to set the `NODE_ENV` environment variable to `production` in the production environment, by setting it in the root directory of the `weatherapp` project.

## Contributing

If you want to contribute to the project, please follow these guidelines:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.