Deploycell - vercel clone
# Deploycell - vercel clone
This project is the clone of a vercel platform that basically take a github URL (of a react app) and gives the uploaded url(that is being deployed on your localhost).

It automates the deployment of React applications from GitHub repositories. 
 It is divided into four main parts:

1. **vercel-upload-service**: This service downloads all files from a GitHub repository to your local machine and uploads them to an Azure container.

2. **vercel-deploy-service**: This service downloads all files from the Azure container, builds the React code, and uploads the generated HTML, CSS, and JavaScript files to another Azure container.

3. **vercel-request-handler**: This service handles requests for specific files, such as `index.html`, and renders the HTML, CSS, and JavaScript files stored in the Azure container.

4. **frontend**: This directory contains the frontend code of the project.

## How to Use

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
    
    