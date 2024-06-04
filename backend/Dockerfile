FROM python:3.11.5-alpine

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
RUN apk update && apk add --no-cache gcc musl-dev libffi-dev file

# Upgrade pip
RUN pip install --upgrade pip

# Copy and install requirements
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copy entrypoint script
COPY entrypoint.sh /app/entrypoint.sh

# Copy the rest of the application code
COPY . /app/

# Set entrypoint
ENTRYPOINT ["sh", "/app/entrypoint.sh"]
