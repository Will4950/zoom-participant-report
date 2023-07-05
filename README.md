# Zoom Meeting Participant Report Getter

This is a sample app for a specific Zoom use case.

On the meeting.ended webhook event, get the meeting participant report and host user object.

scopes:
- user:read:admin
- dashboard_meetings:read:admin

events:
- meeting.ended

### Setup

First install nodejs 18 LTS on your machine.


```bash
# clone the repo
git clone https://github.com/Will4950/zoom-participant-report.git

# Navigate into the cloned project directory
cd zoom-participant-report

# edit .env
nano .env

# Install required dependencies
npm install 

# Start the app
npm start

```

App is listening on localhost:3000
