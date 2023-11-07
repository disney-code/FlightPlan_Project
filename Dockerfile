# Use an official Node.js runtime as the base image
FROM node:20 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]
