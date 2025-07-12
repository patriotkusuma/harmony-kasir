import React, { useState, useEffect, useContext } from 'react';
import axios from 'services/axios-instance';
import { SocketContext } from 'services/socket';
import 'assets/css/chatui.css'
import RightPanel from './RightPannel';

// Main App component for the chat UI
const ChatUi = (props) => {
  // const {contacts} = props
  // Mock data for contacts and messages
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null)
  const [contacts, setContacts] = useState(null)
  
  // State variables for the chat application
  const [messages, setMessages] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(contacts ? contacts[0].number : null); // Default to the first contact
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [showChat, setShowChat] = useState(false); // default false



  const getContacts =  async() => {
    // get(route('message.index', {telpon: telpon}))
    try{
      const response = await axios.get('/whatsapp/get-contacts', {
        headers: {
          'Authorization' : `Bearer ${authToken}`
        }
      })
      setContacts(response.data.contacts)
      const firstContact = response.data.contacts[0]
      getMessagesByTelpon(firstContact?.number || '')
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
      id: msg.id,
      sender: msg.sender_no === selectedContactId ? msg.sender_no : 'Me',
      text: msg.message_content,
      image_url: msg.image_url || null,
      timestamp: msg.created_at, // pastikan field ini ada di backend
      status: msg.status || 'sent', // contoh: sent, delivered, read
  })) : []

  // Function to handle sending a new message
  const handleSendMessage = async () => {
    try{

      if (newMessage.trim() === '') return; // Don't send empty messages
      
      const response = await axios.post('/whatsapp/send-message', 
        {
          telpon: selectedContactId,
          message: newMessage
        }, 
      );

      console.log(`[${new Date().toLocaleString()}] - Respon`, response)
    
    // Setelah berhasil, jalankan:
    setNewMessage('');
    // getMessagesByTelpon(selectedContactId);
    }catch(error){
      console.error(`[${new Date().toLocaleString()}] - Gagal mengirim pesan `, error)
    }

  };
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(new Date(timestamp));
  };


  const socket = useContext(SocketContext)

  // Effect to scroll to the bottom of the chat messages when new messages arrive
  useEffect(() => {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

  }, [currentChatMessages]);

    // Saat contacts berhasil didapat, set kontak pertama
  useEffect(() => {
    if (contacts && contacts.length > 0 && !selectedContactId) {
      setSelectedContactId(contacts[0].number);
      getMessagesByTelpon(contacts[0].number);
    }
  }, [contacts]);

  // Inisialisasi sekali saja saat komponen mount
  useEffect(() => {
    if (contacts === null && authToken !== null) {
      getContacts();
    }

    const handleIncomingMessage = (msg) => {
      getContacts();
      if (msg.to === selectedContactId || msg.from === selectedContactId) {
        getMessagesByTelpon(selectedContactId);
      }
      // if (selectedContactId) {
      //   getMessagesByTelpon(selectedContactId);
      // }
    };

    socket.on('message_create', handleIncomingMessage);

    return () => {
      socket.off('message_create', handleIncomingMessage);
    };
  }, [authToken, selectedContactId]); // cukup authToken + contact terpilih

  return (
    <div className={`chat-app-container ${showChat ? 'show-chat' : ''}`}>

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
              <div className={`contact-item ${selectedContactId === contact.number ? 'selected' : ''}`} 
                onClick={() =>{ 
                  getMessagesByTelpon(contact.number)
                  setShowChat(true)
                }}
                >
                <div className="contact-avatar">
                  {contact?.customer?.nama?.charAt(0) || contact.number?.charAt(0)}
                </div>
                <div className="contact-content">
                  <div className="contact-header">
                    <h3 className="contact-name">
                      {contact?.customer?.nama || contact.number}
                    </h3>
                    <div className="contact-keterangan">
                      {contact?.customer?.keterangan || ''}
                    </div>
                    <span className="contact-time">{formatTime(contact?.timestamp)}</span>
                  </div>
                  <div className="contact-footer">
                    <p className="contact-last-message">{contact?.message_content?.substr(0, 30) || ''}</p>
                    {contact?.unread_count > 0 && (
                      <span className="unread-badge">{contact.unread_count}</span>
                    )}
                  </div>
                </div>
              </div>

            ))
          ) : (
            <p className="no-contacts-found">Tidak ada kontak ditemukan.</p>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
          <RightPanel 
             messages={currentChatMessages}
            selectedContact={selectedContact}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            setShowChat={setShowChat}
          />
    </div>
  );
}

export default ChatUi;