## poolBlynkLink

This small NodeJS app works with [nodejs-poolController](https://github.com/tagyoureit/nodejs-poolController) to send the socket.io data to your [blink.io](https://blynk.io/) IoT project.

1. To get started created a new project with Blynk and copy the auth token to new file called `.env` in the root directory.  You also need to define the `server:port` that nodejs-poolController is running on.  In most cases this is localhost.

### Example `.env` file
```markdown
API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SERVER=http://localhost:3000
```
2. You will also need to review [/src/pinDefs.js](/src/pinDefs.js) as we will be reading and writing to the blynk virtual pins.  Map pins to your liking and add more as needed.  These are used to map the data between the poolController socket.io API and Blynk's widgets you add to your project.

3. Before your initial start run `npm i` to download all dependencies.

4. Start the app by running `npm start`

5. [PM2.io](https://pm2.io/) is a great NodeJS app manager that can help run, monitor and auto-start scripts like this.  I highly recommend it as it's what I use.
```
┌────────────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬──────┬───────────┬──────┬──────────┐
│ App name       │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu  │ mem       │ user │ watching │
├────────────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼──────┼───────────┼──────┼──────────┤
│ poolBlynkLink  │ 0  │ 1.0.0   │ fork │ 22235 │ online │ 0       │ 114m   │ 1.7% │ 37.9 MB   │ pi   │ enabled  │
│ poolController │ 1  │ 5.3.0   │ fork │ 24251 │ online │ 0       │ 84m    │ 3.5% │ 60.8 MB   │ pi   │ disabled │
└────────────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴──────┴───────────┴──────┴──────────┘
```

6. Add widgets to your project and link them to the appropriate vPins.  Below in the example I created.

![Example Screenshot](/screenshot1.jpeg)

7. Use the following Blynk QR code as a project template to get you started. ![Blynk QR Code](/QR_Blynk_Demo.jpeg)