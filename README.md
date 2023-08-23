# Zoom Meeting Participant Report Getter

> **Note**
> 
> The following sample application is a personal, open-source project shared by the app creator and not an officially supported Zoom Video Communications, Inc. sample application. Zoom Video Communications, Inc., its employees and affiliates are not responsible for the use and maintenance of this application. Please use this sample application for inspiration, exploration and experimentation at your own risk and enjoyment. You may reach out to the app creator and broader Zoom Developer community on https://devforum.zoom.us/ for technical discussion and assistance, but understand there is no service level agreement support for this application. Thank you and happy coding!

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
