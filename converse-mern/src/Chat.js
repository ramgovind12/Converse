import { AttachFile, MoreVert, SearchOutlined } from '@mui/icons-material'
import { Avatar, IconButton } from '@mui/material'
import React, { useState } from 'react'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import './Chat.css' 
import axios from './axios'

function Chat({ messages }) {

  const [input, setInput] = useState("");

const sendMessage = async (e) => {
  e.preventDefault();

  await axios.post('/messages/new', {
    message: input,
    name: "Demo",
    timestamp: "Just Now",
    received: false,
  });
  setInput('');
};

  return (
    <div className='chat'>
      <div className="chat__header">
        <Avatar></Avatar>
        <div className="chat__headerInfo">
          <h3>Room Name</h3>
          <p>Last seen at ...</p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined></SearchOutlined>
          </IconButton>
          <IconButton>
            <AttachFile></AttachFile>
          </IconButton>
          <IconButton>
          <MoreVert ></MoreVert>
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map(message => (
          <p 
            className={`chat__message ${message.received && "chat__reciever"}`} 
          >
            <span className="chat__name">{message.name}</span>
              {message.message}

            <span className="chat__timestamp">{message.timestamp}</span>
          </p> 
        ))}
        

        {/* <p className='chat__message'>
        
          <span className="chat__name">Sonny</span>

        This is a message
        
        <span className="chat__timestamp">
           {new Date().toUTCString()}
        </span>
        
        </p> */}

        {/* <p className='chat__message chat__reciever' >
        
          <span className="chat__name">Sonny</span>

        This is a message
        
        <span className="chat__timestamp">
           {new Date().toUTCString()}
        </span>
        
        </p> */}
      </div>
      <div className="chat__footer">
        <EmojiEmotionsIcon></EmojiEmotionsIcon>
        <form action="">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            type="text" 
            placeholder='Type a message' 
          />
          <button onClick={sendMessage} type='submit'>Send a message</button>
        </form>
        <MicIcon></MicIcon>
      </div>
    </div>
  )
}

export default Chat