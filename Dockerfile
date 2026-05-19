# Use official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the daemon code into the container
COPY daemon/ /app/daemon/

# Expose the port the app runs on
EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "daemon.main:app", "--host", "0.0.0.0", "--port", "8000"]
