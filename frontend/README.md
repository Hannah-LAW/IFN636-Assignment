# Lost and Found App

A web application for reporting and searching lost and found items.  
Users must **register** or **log in** before they can view or submit items.

---

## Public URL
http://13.239.240.86

---

## Test Accounts

### Admin Account
- **Email:** sysadmin@gmail.com  
- **Password:** sysadmin123

### User Accounts
- **Email:** hannah@qut.edu.au  
  **Password:** 2134  

- **Email:** alex@gmail.com  
  **Password:** 123  

---

## Features

### User
- **View Items**
  - See all **approved** items.
  - See items **submitted by themselves**.
- **Report Lost/Found Item**
  - Submit a report for a lost or found item.
- **Update/Delete Submitted Items**
  - Any updates or deletions will be sent to the admin for approval.

### Admin
- **Approve / Reject** user submissions.

---

## How to Access the Project

### 1. AWS EC2 Setup
1. Log in to your AWS account and go to **EC2**.
2. Copy your **Public IPv4 address** from the instance details.
3. Make sure your **Security Group** inbound rules allow:
   - **HTTP (port 80)**
   - **Custom TCP for backend (port 5001)** if testing APIs
   - **Custom TCP for frontend (port 3000)** if running locally
4. Use the public IP in your browser:  
   `http://<public-ip>` (e.g., `http://54.253.25.142`)

---

### 2. Update live BaseURL
1. Copyr your **Public IPv4 address** from the instance details.
2. Update the live localhost in file frontend/src/axiosConfig.jsx
   `http://<public-ip>:5001` (e.g., `http://54.253.25.142:5001`)

### 3. Check PM2 Status on Server
1. SSH into the EC2 instance using **PuTTY**:
   - **Host Name:** `<public-ip>`
   - **Username:** `ubuntu`
   - **Key:** Your `.pem` private key

2. Once logged in, check the PM2 process status:
   run pm2 status

3. If frontend or backend is not online, restart them:
   run pm2 restart all

--------------------------------------------------------------------------------------------------------------------------------------------

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
