import React, { useState, useEffect, useContext } from 'react';
import axios from 'services/axios-instance';
import { SocketContext } from 'services/socket';
// Main App component for the chat UI
const ChatUi = (props) => {
  // const {contacts} = props
  // Mock data for contacts and messages
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null)
  const [contacts, setContacts] = useState(null)
  
  // State variables for the chat application
  const [messages, setMessages] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null); // Default to the first contact
  const [currentContact, setCurrentContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');


  const getContacts =  async() => {
    // get(route('message.index', {telpon: telpon}))
    try{
      const response = await axios.get('/whatsapp/get-contacts', {
        headers: {
          'Authorization' : `Bearer ${authToken}`
        }
      })
      setContacts(response.data.contacts)
      // setContacts(response.data.)
    }catch(error) {

    }


  }

  const getMessagesByTelpon = async(telpon) => {
    try{
      const response = await axios.get('/whatsapp/get-messages', {
        params: {
          telpon: telpon
        },
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      setSelectedContactId(telpon)
      setMessages(response.data.messages)
    }catch(error){

    }
  }
  // Filter contacts based on search term
  const filteredContacts = contacts? contacts.filter(contact =>
    contact?.customer?.nama.toLowerCase().includes(searchTerm.toLowerCase())
  ) : null;

  // Get the currently selected contact
  const selectedContact = contacts ? contacts.find(contact => contact.number === selectedContactId) : null;
  // Get messages for the selected contact
  // const currentChatMessages = messages[selectedContactId] || [];
  const currentChatMessages = Array.isArray(messages)? messages.map(msg => ({
    id:msg.id,
    sender: msg.sender_no === selectedContactId? msg.sender_no : 'Me',
    text:msg.message_content,
    image_url: msg.image_url || null
  })) : []

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    try{

      if (newMessage.trim() === '') return; // Don't send empty messages
      
      const formData = new FormData()
    formData.append('telpon', selectedContactId)
    formData.append('message', newMessage)
    const response = await axios.post('/whatsapp/send-message', 
      {
        telpon: selectedContactId,
        messages: newMessage
      }, 
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
      }
    );
    
    // Setelah berhasil, jalankan:
    setNewMessage('');
    getMessagesByTelpon(selectedContactId);
    }catch(error){
      console.error(`[${new Date().toLocaleString()}] - Gagal mengirim pesan `, error)
    }

  };

  const socket = useContext(SocketContext)

  // Effect to scroll to the bottom of the chat messages when new messages arrive
  useEffect(() => {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

     if(contacts === null && authToken !== null){
      getContacts()
    }

    socket.on('message_create', (msg) => {
      getContacts()
      getMessagesByTelpon(selectedContactId)
    })
  }, [currentChatMessages, authToken, socket]);

  return (
    <div className="chat-app-container">
      {/* Inline styles for the component */}
      <style>
        {`
        .chat-app-container {
          display: flex;
          height: 80vh;
          background-color: #f3f4f6; /* bg-gray-100 */
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .left-panel {
          width: 33.33%; /* w-1/3 */
          background-color: #fff;
          border-right: 1px solid #e5e7eb; /* border-r border-gray-200 */
          display: flex;
          flex-direction: column;
          border-top-left-radius: 0.5rem; /* rounded-l-lg */
          border-bottom-left-radius: 0.5rem; /* rounded-l-lg */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          margin: 1rem; /* m-4 */
        }

        .search-bar {
          padding: 1rem; /* p-4 */
          border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
        }

        .search-input {
          width: 100%; /* w-full */
          padding: 0.75rem; /* p-3 */
          border-radius: 0.5rem; /* rounded-lg */
          border: 1px solid #d1d5db; /* border border-gray-300 */
          outline: none; /* focus:outline-none */
          transition: all 0.2s ease-in-out; /* transition duration-200 */
        }

        .search-input:focus {
          border-color: #3b82f6; /* focus:ring-blue-500 */
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 */
        }

        .contact-list {
          flex-grow: 1; /* flex-1 */
          overflow-y: auto; /* overflow-y-auto */
        }

        .contact-item {
          display: flex;
          align-items: center;
          padding: 1rem; /* p-4 */
          cursor: pointer;
          transition: background-color 0.2s ease-in-out; /* transition duration-200 */
        }

        .contact-item:hover {
          background-color: #eff6ff; /* hover:bg-blue-50 */
        }

        .contact-item.selected {
          background-color: #dbeafe; /* bg-blue-100 */
          border-left: 4px solid #3b82f6; /* border-l-4 border-blue-500 */
        }

        .contact-avatar {
          flex-shrink: 0; /* flex-shrink-0 */
          width: 3rem; /* w-12 */
          height: 3rem; /* h-12 */
          background-color: #60a5fa; /* bg-blue-400 */
          color: #fff;
          border-radius: 9999px; /* rounded-full */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem; /* text-lg */
          font-weight: 700; /* font-bold */
          margin-right: 0.75rem; /* mr-3 */
        }

        .contact-name {
          font-weight: 600; /* font-semibold */
          color: #1f2937; /* text-gray-800 */
        }

        .contact-last-message {
          font-size: 0.875rem; /* text-sm */
          color: #6b7280; /* text-gray-500 */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .no-contacts-found {
          padding: 1rem; /* p-4 */
          color: #6b7280; /* text-gray-500 */
          text-align: center;
        }

        .right-panel {
          width: 66.66%; /* w-2/3 */
          background-color: #fff;
          display: flex;
          flex-direction: column;
          border-top-right-radius: 0.5rem; /* rounded-r-lg */
          border-bottom-right-radius: 0.5rem; /* rounded-r-lg */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          margin: 1rem; /* m-4 */
          margin-left: 0; /* ml-0 */
        }

        .chat-header {
          padding: 1rem; /* p-4 */
          border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
          display: flex;
          align-items: center;
        }

        .chat-header-avatar {
          flex-shrink: 0; /* flex-shrink-0 */
          width: 3rem; /* w-12 */
          height: 3rem; /* h-12 */
          background-color: #4ade80; /* bg-green-400 */
          color: #fff;
          border-radius: 9999px; /* rounded-full */
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem; /* text-lg */
          font-weight: 700; /* font-bold */
          margin-right: 0.75rem; /* mr-3 */
        }

        .chat-header-name {
          font-size: 1.25rem; /* text-xl */
          font-weight: 600; /* font-semibold */
          color: #1f2937; /* text-gray-800 */
        }

        .chat-messages {
          flex-grow: 1; /* flex-1 */
          overflow-y: auto; /* overflow-y-auto */
          padding: 1rem; /* p-4 */
          background-color: #f9fafb; /* bg-gray-50 */
          display: flex;
          flex-direction: column;
        }

        .chat-messages > div {
            margin-bottom: 1rem; /* space-y-4 */
        }

        .message-container {
          display: flex;
        }

        .message-bubble {
          max-width: 20rem; /* max-w-xs */
          padding: 0.75rem; /* p-3 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); /* shadow */
        }
        .message-bubble img{
          max-width: 100%;
          height: auto;
          margin-top: 0.5rem;
          border-radius: 0.5rem;
        }

        .message-container.my-message {
          justify-content: flex-end; /* justify-end */
        }

        .message-container.other-message {
          justify-content: flex-start; /* justify-start */
        }

        .my-message .message-bubble {
          background-color: #3b82f6; /* bg-blue-500 */
          color: #fff;
          border-bottom-right-radius: 0; /* rounded-br-none */
        }

        .other-message .message-bubble {
          background-color: #e5e7eb; /* bg-gray-200 */
          color: #1f2937; /* text-gray-800 */
          border-bottom-left-radius: 0; /* rounded-bl-none */
        }

        .message-input-area {
          padding: 1rem; /* p-4 */
          border-top: 1px solid #e5e7eb; /* border-t border-gray-200 */
          display: flex;
          align-items: center;
        }

        .message-input {
          flex-grow: 1; /* flex-1 */
          padding: 0.75rem; /* p-3 */
          border-radius: 0.5rem; /* rounded-lg */
          border: 1px solid #d1d5db; /* border border-gray-300 */
          outline: none; /* focus:outline-none */
          transition: all 0.2s ease-in-out; /* transition duration-200 */
          margin-right: 0.5rem; /* mr-2 */
        }

        .message-input:focus {
          border-color: #3b82f6; /* focus:ring-blue-500 */
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* focus:ring-2 focus:ring-blue-500 */
        }

        .send-button {
          padding: 0.75rem 1.5rem; /* px-6 py-3 */
          background-color: #2563eb; /* bg-blue-600 */
          color: #fff;
          border-radius: 0.5rem; /* rounded-lg */
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; /* transition duration-200 */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
        }

        .send-button:hover {
          background-color: #1d4ed8; /* hover:bg-blue-700 */
        }

        .send-button:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5), 0 0 0 4px rgba(59, 130, 246, 0.2); /* focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 */
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .chat-app-container {
            flex-direction: column;
          }

          .left-panel, .right-panel {
            width: calc(100% - 2rem); /* Full width minus margin */
            margin: 1rem;
            border-radius: 0.5rem; /* Apply full rounded corners */
          }

          .left-panel {
            border-right: none; /* Remove right border on small screens */
            border-bottom: 1px solid #e5e7eb; /* Add bottom border */
          }

          .right-panel {
            margin-left: 1rem; /* Ensure consistent margin */
          }
        }
        `}
      </style>

      {/* Left Panel: Contact List */}
      <div className="left-panel">
        {/* Search Bar - Stays at the top */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Cari kontak..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Contact List - Scrolls independently */}
        <div className="contact-list">
          {filteredContacts?.length > 0 ? (
            filteredContacts.map(contact => (
              <div
                key={contact.number}
                className={`contact-item ${selectedContactId === contact.number ? 'selected' : ''}`}
                onClick={() => getMessagesByTelpon(contact.number)}
              >
                <div className="contact-avatar">
                  {contact?.customer?.nama?.charAt(0) || contact.number?.charAt(0)}
                </div>
                <div>
                  <h3 className="contact-name">{contact?.customer?.nama || contact.number}</h3>
                  <p className="contact-last-message">{contact?.message_content?.substr(0,20) || ''}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-contacts-found">Tidak ada kontak ditemukan.</p>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="right-panel">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-avatar">
            {selectedContact ? selectedContact.customer?.nama.charAt(0) : 'N/A'}
          </div>
          <h2 className="chat-header-name">
            {selectedContact ? selectedContact.customer?.nama || selectedContact.number : 'Pilih Kontak'}
            <small style={{marginLeft:"12 px"}}>{selectedContact?.customer?.keterangan || ""}</small >
          </h2>
        </div>

        {/* Chat Messages */}
        <div id="chat-messages" className="chat-messages">
          {currentChatMessages.length > 0 ? (
            currentChatMessages.map(message => (
              <div
                key={message.id}
                className={`message-container ${message.sender === 'Me' ? 'my-message' : 'other-message'}`}
              >
                <div className="message-bubble">
                  {message.text && <p>{message.text}</p>}
                  {message.image_url && (
                    <img src={message.image_url} alt="Image" /> 
                  )}

                </div>
              </div>
            ))
          ) : (
            <p className="no-messages-found">Belum ada pesan. Mulai percakapan!</p>
          )}
        </div>

        {/* Message Input */}
        <div className="message-input-area">
          <input
            type="text"
            placeholder="Ketik pesan..."
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatUi;