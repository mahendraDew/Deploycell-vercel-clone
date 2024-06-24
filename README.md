Deploycell - vercel clone
# Deploycell - vercel clone
This project is the clone of a vercel platform that basically take a github URL (of a react app) and gives the uploaded url(that is being deployed on your localhost).

### Description: 
Deploycell is a clone of the Vercel platform. Vercel is a popular service used for deploying web applications, particularly those built with frameworks like React. Deploycell replicates Vercel's functionality to automate the deployment of React applications from GitHub repositories, enabling developers to deploy their applications in a single tap!!

### Key Components:
It automates the deployment of React applications from GitHub repositories. <br/>
 It is divided into four main parts:

- **vercel-upload-service**: This service downloads all files from a GitHub repository to your local machine and uploads them to an Azure container.

- **vercel-deploy-service**: This service downloads all files from the Azure container, builds the React code, and uploads the generated HTML, CSS, and JavaScript files to another Azure container.

- **vercel-request-handler**: This service handles requests for specific files, such as `index.html`, and renders the HTML, CSS, and JavaScript files stored in the Azure container.

- **frontend**: This directory contains the frontend code of the project.

### 1. vercel-upload-service:
- Purpose: Downloads application files from GitHub and uploads them to an Azure container.
- How it works: Connects to the specified GitHub repository, fetches necessary files, and stores them in Azure storage.

### 2. vercel-deploy-service:
- Purpose: Builds the React application and uploads compiled files (HTML, CSS, JavaScript) to another Azure container.
- How it works: Compiles the React app into static files required for browser-based execution.

### 3. vercel-request-handler:
- Purpose: Manages requests for specific files (e.g. index.html) and serves HTML, CSS, and JavaScript files from the Azure container.
- How it works: Listens for incoming requests and delivers appropriate files to serve the React application.

### 4. Frontend:
- Purpose: Provides a user interface for interacting with the deployment services.
- How it works: Users initiate deployments and access deployed applications through this interface.

## How to Use

### Usage:
To deploy applications with Deploycell:
Set up each service by navigating to respective directories, installing dependencies, building the project, and start all the server (4 services).
Configure local testing by mapping the generated URL to localhost in the /etc/hosts file, enabling access to deployed applications via custom subdomains.

### 1. vercel-upload-service

- Navigate to the `vercel-upload-service` directory:

    ```
    cd vercel-upload-service
    ```


- Install all the dependencies:
    ```
    npm install
    ```

- Build the project:
    ```
    tsc -b
    ```

- Start the server:
    ```
    node dist/index.js
    ```


### 2. vercel-deploy-service

- Open a new terminal window.

- Navigate to the `vercel-deploy-service` directory:
    ```
    cd vercel-deploy-service
    ```

- Install all the dependencies:
    ```
    npm install
    ```

- Build the project:
    ```
    tsc -b
    ```

- Start the server:
    ```
    node dist/index.js
    ```

### 3. vercel-request-handler

- Open another new terminal window.

- Navigate to the `vercel-request-handler` directory:
    ```
    cd vercel-request-handler
    ```

- Install all the dependencies:
    ```
    npm install
    ```

- Build the project:
    ```
    tsc -b
    ```

- Start the server:
    ```
    node dist/index.js
    ```

### 4. Frontend

- Navigate to the `frontend` directory:
    ```
    cd frontend
    ```
- Install all dependencies:
    ```
    npm install
    ```

- Run the project:
    ```
    npm run dev
    ```

## Note

- Install all dependencies in all servers by running `npm install` in each of the direcectory.
- You need a subdomain(generated at the end) to point to your localhost in order to run and test it locally. You can do this by following the bellow steps:
    
    - Open a new terminal
    - Open the /etc/hosts file:
        ```
         sudo vim /etc/hosts
        ```
        Note: This is for Linux(Ubuntu) not for windows or mac. 

    - Add a new entry that points to your localhost(127.0.0.1), for ex if the generated url is like http://vk1v6.dev.100xdevs.com:3001/index.html, then you should add a new entry of the same domain (here: vk1v6.dev.100xdevs.com) to /etc/hosts file like:
        ```
         127.0.0.1       vk1v6.10kdevs.com
        ```
    
    
