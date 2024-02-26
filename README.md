**WEB RTC Video Conference Application**

**Athanassios Stamogiannopoulos 3200185**

**Dimitrios Andritsanos 3200**

Installation instructions

1. We install **Node.js** for the server operation.

For more information and installation: <https://nodejs.org/en>

2. Open the folder containing the app and execute the following command in the terminal:

***npm install***

3. We start the server by running the following command again in the terminal:

***node server.js***

4. We open a browser of our choice and visit the following address:

[***http://127.0.0.1:3000/***](http://127.0.0.1:3000/)

5. We are ready! Have fun!

Instructions for use

Once you visit the home page you should see the following screen:

![Picture3](https://github.com/nasosStamog/WEB-RTC-Video-Conference-Application/assets/92870089/4f9a3302-b084-4049-aae8-4f1929fa0b72)
First enter **username**. Then if you don't have a room code press **Create Room** and the app will create your own room with a unique code.

If you have a code press the **Join Room** button and enter the room code as below.

![Picture2](https://github.com/nasosStamog/WEB-RTC-Video-Conference-Application/assets/92870089/72dabfb4-ce95-4db4-874c-b0475fabc1af)


Then press the **Join** button and you are connected!

Basic Application Functions

![Picture4](https://github.com/nasosStamog/WEB-RTC-Video-Conference-Application/assets/92870089/345cbdec-f9f1-4bd6-b61b-3766ad2dd390)

**Mute:** Mute the microphone

**Stop Video:** Stop video image

**Share Screen:** Share the computer screen with the other user

**Participants:** Display names of participants in the call

**Copy RoomID:** Copy unique room code

**Chat Enabled/Disabled:** Toggle between open and closed chat mode

**Leave Meeting:** Exit the room

**Important information**

- **No more than 2 people can connect in the same room.
- The application has been tested and works on Chrome, Opera, Mozilla.

**Member Contribution**

Stamogiannopoulos Athanassios: Undertook the initial research for libraries to be used, the basis of the application and the styling of the home page. Made functions like share screen, participants List and chat enable/disable. Also adjusted the basic functionality of the app and buttons.

Andritsanos Dimitrios: He undertook the creation of the home page and the creation and passing of parameters to the room such as username and room ID. Also created the custom url that each room has. He also took over the styling of the room page and the copy Room ID button. He made important corrections to the operation of the application and fixed important bugs.

**Developed Software**

A software was created which is capable of creating rooms so that one user can chat (video and audio) with another in a remote location. During the call the user can turn off his camera and microphone. It is possible to share the screen of each of the users. Additional options given to the users of the software are to view the active users in the call, to disable the chat and also to leave the call.

**Software Used**

\- <https://peerjs.com/>

\- <https://socket.io/>

\- <https://nodejs.org/en>

\- <https://expressjs.com/>

\- <https://www.npmjs.com/package/uuid>

Browser:

- Google Chrome

**Sources of information**

\- <http://www.webrtc.org/>

\- <https://webrtc.ventures/2018/07/tutorial-build-video-conference-application-webrtc-2/>

\- <https://webrtc.ventures/2018/07/tutorial-build-video-conference-application-webrtc-2/>

**Problems Encountered**

- There was a lot of effort to add more than 2 people to the call but with the above libraries no solution was found
- There was an issue with user login in the basic version of the application which was resolved by using ready ICE server for login.
- There were bugs in the share screen that did not allow its correct use and also in the leave meeting where as soon as a user left his image did not "leave" the room but remained stuck. Both with many hours of debugging but also with appropriate changes were fixed.