const socket = io('/')
var UserId;
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer({
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      {urls: 'turn:3.67.77.128:3478?transport=tcp', credential: '12345678', username: 'kareem'}
      // {urls: process.env.TURN_SERVER_URI, credential: process.env.TURN_PASSWORD, username: process.env.TURN_USERNAME}
    ]
  }
})
var isSharing = false;
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = []
const shareVideoList = []
var userIdList = []
var usersList = []
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  myVideo.id = 'uservideo'
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    video.addEventListener('click', () => {
      toggleLargeVideo(video);
    });
    call.on('stream', userVideoStream => {
      video.addEventListener('click', () => {
        toggleLargeVideo(video);
      });
      
      addVideoStream(video, userVideoStream)
      if(isSharing===true){
        console.log(videoGrid)
        const ids = 'sharedVideo'
        socket.emit('add-share-id',ids)
        isSharing = false;
        socket.emit('boolean',isSharing)
      }
    
    })
  })
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", data => {
    $("ul").append(`<li class="message"><b>${data.username}</b><br/>${data.message}</li>`);
    scrollToBottom();
  });
  
})
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  const videoIdToFind = 'remoteVideo';
  
  videoGrid.removeChild(document.getElementById('remoteVideo'))
 
  
  console.log(videoGrid)

})



socket.on('stop-shared-screen', (video) => {
  // Function to remove the shared screen video from the grid
  console.log('stamata screen share')
  const videoToRemove = document.getElementById('sharedVideo');
  if(videoToRemove){
  videoGrid.removeChild(videoToRemove)}

});
 socket.on('add-share-id-to-videogrid', (id) => {
  console.log(videoGrid)

  // Function to remove the shared screen video from the grid
  const lastVideoElement = videoGrid.lastChild;
  lastVideoElement.id=id;
  console.log(videoGrid)
});

myPeer.on('open', userId => {
    UserId = userId;
    
    
  socket.emit('join-room', ROOM_ID, userId,userName)
})

function connectToNewUser(userId, stream) {
  
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  video.addEventListener('click', () => {
    toggleLargeVideo(video);
  });
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
    peers.push(userId)
  })
  call.on('close', () => {
    video.remove()
    peers.pop(userId)
  })
  console.log(videoGrid)
  peers[userId] = call
  
}
socket.on('user-ids', ids => {
  userIdList = ids;
  
});
// Listen for the 'user-list' event emitted from the server
socket.on('user-list', users => {
  // Call the updateUserList function with the updated user list
  updateUserList(users);
});

const updateUserList = (users) => {
  // Do something with the updated user list in the client-side script
  usersList = users;
  
};

function addVideoStream(video, stream) {
  socket.on('receive-boolean', boolean=> {
    isSharing = boolean
    
  })
  video.addEventListener('click', () => {
    toggleLargeVideo(video);
  });
  
  video.srcObject = stream
  if (!video.id) {
    video.id = 'remoteVideo'
  }
  
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
  
  
}

function addShareStream(video, stream,id) {
  video.addEventListener('click', () => {
    toggleLargeVideo(video);
  });
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  video.id = id;
  console.log(videoGrid)
  videoGrid.append(video)
 
        
  
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}

let chatOn = true;
const chatUnchat = () => {
  const chatWindow = document.querySelector('.main__right');
  if(chatOn){
    const participantsBox = document.getElementById('participantsBox');
    participantsBox.classList.add('hidden');
    chatWindow.classList.add('hidden');
    chatOn = false;
    setCloseChat();
  } else{
    participantsBox.classList.remove('hidden');
      chatWindow.classList.remove('hidden');
      chatOn = true;
      setOpenChat();
  }

}

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}


const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
const setCloseChat = () => {
  const html = `
  <i class=" fas fa-toggle-off"></i>
    <span>Chat Disabled</span>
  `
  document.querySelector('.main__chat_button').innerHTML = html;
}
const setOpenChat = () => {
  const html = `
  <i class="fas fa-toggle-on"></i>
    <span>Chat Enabled</span>
  `
  document.querySelector('.main__chat_button').innerHTML = html;
}

const setStartShare = () => {
  const html = `
  <i class="stop fa fa-desktop "></i>
    <span>Stop Sharing</span>
  `
  document.querySelector('.main__share_button').innerHTML = html;
}
const setStopShare = () => {
  const html = `
  <i class="stop fa fa-desktop text-white"></i>
    <span>Share Screen</span>
  `
  document.querySelector('.main__share_button').innerHTML = html;
}

let isParticipantsView = false; // Flag to keep track of the view

// Function to show the list of online participants
const showParticipantsList = () => {
  // Retrieve the list of online users (usersList variable should be updated in your code with the online users)
  
  var participantsSection = document.getElementById('participantsSection');
  participantsSection.classList.toggle('show-participants');
  const onlineParticipants = usersList; // Replace with the actual list of online users

  // Get the main__participants div
  const participantsDiv = document.querySelector('.main__participants');

  if (!isParticipantsView) {
    // ... (previous code)
  
   
    const participantsHeader = document.createElement('h6');
    participantsHeader.textContent = 'Participants';
    
    // Apply styles to the header to match the chat header
    participantsHeader.style.backgroundColor = '#3498db'; // Match the chat header background color
    participantsHeader.style.color = '#ffffff'; // Match the chat header text color
    participantsHeader.style.textAlign = 'center';
    participantsHeader.style.padding = '10px 0'; // Adjust padding as needed
    participantsHeader.style.margin = '0'; // Remove any default margin
    
    // Make the background extend to the full width
    participantsHeader.style.width = '100%';
    
    // Create a div container for the header and set its styles for center alignment
    const hrElement = document.createElement('hr');
    hrElement.style.borderTop = '1px solid #000000';
    
    // Append the header to the container
    participantsDiv.appendChild(participantsHeader);
    participantsDiv.appendChild(hrElement);
    // Create an unordered list to hold the participants' names
    const participantsList = document.createElement('ul');

    // Loop through the onlineParticipants array and create list items for each participant
    onlineParticipants.forEach(participant => {
      const participantItem = document.createElement('li');
      const hrElement = document.createElement('hr');
      hrElement.style.borderTop = '1px solid #000000';
      participantsList.appendChild(hrElement);
      participantItem.textContent = participant;
      participantsList.appendChild(participantItem);
      participantsList.appendChild(hrElement);
      
    });

    // Append the participantsList to the participantsDiv
    participantsDiv.appendChild(participantsList);

    isParticipantsView = true; // Update the view state
  } else {
    // If already viewing participants, hide the list by clearing the content
    participantsDiv.innerHTML = '';
    isParticipantsView = false; // Update the view state
  }
};

let sharedVideoElement = null;
var screenSharing = false;
var currVideo = null;
const shareStop = async () => {
  if (screenSharing === false){
      try {
          // Start screen sharing
          // Change UI button for indicating sharing
          const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          sharedVideoElement = stream;
          const id = "sharedVideo"
          // Get the video track from the screen-sharing stream
          const screenTrack = stream.getVideoTracks()[0];
          
          
          userIdList.forEach(user => {
            isSharing = true
          socket.emit('boolean',isSharing)
          setStartShare();
              if (user === UserId) {
              
                  // Add screen sharing for local user
                  const userVideo = document.createElement('video');
                  currVideo = userVideo
                  
                  
                  addShareStream(userVideo, stream,id); // Display screen sharing locally
                  shareVideoList.push(stream)//einai local mono i lista theloume na einai koini
                  
                  
              } else {
                  // Share screen with other users in the room
                  
                 
                  myPeer.call(user, stream);
                  

              }
          });
          
          screenSharing = true; // Set screenSharing state to true
      } catch (error) {
          console.error('Error sharing screen:', error);
      }
  } else {
      // Stop screen sharing
      if (sharedVideoElement) {
        
        
        const tracks = sharedVideoElement.getTracks();
        tracks.forEach(track => track.stop());
        
        console.log('Before sending:', shareVideoList);
        
        
        socket.emit('stop-share-screen',currVideo); // Emit an event to notify all users to stop sharing screen
        const index = shareVideoList.indexOf(sharedVideoElement);
        shareVideoList.splice(index, 1);
        
        //stopShareAll(sharedVideoElement);
        sharedVideoElement = null; // Clear the reference
    }
      screenSharing = false; // Set screenSharing state to false
      setStopShare(); // Change UI button for indicating stop sharing
  }
}

function removeVideoStream(video,sharelist) {
  console.log(sharelist[0])
  const tracks = sharelist[0].getTracks();
  tracks.forEach(track => track.stop());
  video.srcObject = sharelist[0]
  
  videoGrid.removeChild(video)

 
}
function removeVideoStreamAll(videoElement) {
  if (videoElement && videoGrid.contains(videoElement)) {
    videoGrid.removeChild(videoElement);
  }
}
function copyTextToClipboard() {
  // Text to be copied
  const textToCopy = ROOM_ID;

  // Create a temporary input element
  const tempInput = document.createElement('input');
  tempInput.value = textToCopy;

  // Append the input element to the document
  document.body.appendChild(tempInput);

  // Select the text in the input element
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices

  // Copy the selected text to the clipboard
  document.execCommand('copy');

  // Remove the temporary input element
  document.body.removeChild(tempInput);
  const copyMessage = document.querySelector('.copyMessage');
  if(chatOn=== false){
    copyMessage.classList.add('hidden');
  }else{
    copyMessage.classList.remove('hidden');
  }
  copyMessage.style.display = 'flex';

  // Hide the message after one second
  setTimeout(function() {
      copyMessage.style.display = 'none';
  }, 1000);

}

const leaveMeatingButt = () => {
  window.location.href = '/';
}
let largeVideo = false;
function toggleLargeVideo(videoElement) {
 if(largeVideo === false){
  videoElement.style.height = '500px'
  videoElement.style.width = '800px'
  largeVideo = true;
  }else{
    videoElement.style.height = '300px'
    videoElement.style.width = '400px'
    
    largeVideo = false;
  }


}

socket.on('room-full-error', (data) => {
  // Assuming you have a div with the id 'error-message' in your HTML
  alert('room is full');
  window.location.href = '/';
});