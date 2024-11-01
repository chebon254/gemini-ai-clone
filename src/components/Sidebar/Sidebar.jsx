import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'

function Sidebar() {

  const [extended, setExtended] = useState(false)
  const {onSent, prevPrompts, setRecentPrompt, newChat} = useContext(Context)
  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt)
    await onSent(prompt)
  }

  return (
    <div className='side-bar'>
        <div className="top">
            <img onClick={() => setExtended(prev=>!prev)} src={assets.menu_icon} alt="Gemini AI Clone" />
            <br />
            <div onClick={()=> newChat()} className="new-chat">
              <img src={assets.plus_icon} alt="Gemini AI Clone" />
              {extended ? <p>New Chat</p> : null }
            </div>
            {extended ? 
              <div className="recent">
                <p className='recent-title'>Recent</p>
                {prevPrompts.map((item, index)=>{
                  return (
                    <div onClick={()=> loadPrompt(item)} className="recent-entry">
                      <img src={assets.message_icon} alt="Gemini AI Clone" />
                      <p>{item.slice(0, 18)}...</p>
                    </div>
                  )
                })}
              </div> : null  
            }
        </div>
        <div className="bottom">
          <div className="bottom-item recent-entry">
            <img src={assets.question_icon} alt="Gemini AI Clone" />
            {extended ? <p>Help</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.history_icon} alt="Gemini AI Clone" />
            {extended ? <p>History</p> : null}
          </div>
          <div className="bottom-item recent-entry">
            <img src={assets.setting_icon} alt="Gemini AI Clone" />
           { extended ? <p>Settings</p>: null}
          </div>
        </div>
    </div>
  )
}

export default Sidebar
