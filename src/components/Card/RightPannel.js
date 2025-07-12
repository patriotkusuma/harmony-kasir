import React, { useState } from 'react';

const RightPanel = ({ messages, selectedContact, newMessage, setNewMessage, onSendMessage, setShowChat }) => {
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });

    const isMobile = window.innerWidth <= 768;


    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;
        setOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const closePreview = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
        setPreviewImageUrl(null);
    };




  return (
    <div className="right-panel">
      <div className="chat-header">
        <div className="chat-header-avatar">
          {selectedContact ? selectedContact.customer?.nama?.charAt(0) : 'N/A'}
        </div>
        <h2 className="chat-header-name">
          {selectedContact ? selectedContact.customer?.nama || selectedContact.number : 'Pilih Kontak'}
          <small style={{ marginLeft: "12px" }}>
            {selectedContact?.customer?.keterangan || ""}
          </small>
        </h2>
        {isMobile && (
          <button className="back-button" onClick={() => setShowChat(false)}>
            ← Kembali
          </button>
        )}
      </div>

      <div id="chat-messages" className="chat-messages">
        {messages.map(message => (
            <div
                key={message.id}
                className={`message-container ${message.sender === 'Me' ? 'my-message' : 'other-message'}`}
            >
                <div className="message-bubble">
                {message.text && <p>{message.text}</p>}
                {message.image_url && (
                    <img
                        src={message.image_url}
                        alt="Image"
                        className="chat-image-thumb"
                        onClick={() => setPreviewImageUrl(message.image_url)}
                    />
                )}

                
                <div className="message-meta">
                    <span className="message-time">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}
                    </span>
                    {message.sender === 'Me' && (
                    <span className={`message-status ${message.status}`}>
                        {message.status === 'read' ? '✅✅' : message.status === 'delivered' ? '✅✅' : '✅'}
                    </span>
                    )}
                </div>
                </div>
            </div>
            ))}

      </div>

      <div className="message-input-area">
        <input
          type="text"
          placeholder="Ketik pesan..."
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSendMessage();
            }
          }}
        />
        <button className="send-button" onClick={onSendMessage}>
          Kirim
        </button>
      </div>

        {previewImageUrl && (
            <div
                className="image-modal-overlay"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={closePreview}
            >
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                src={previewImageUrl}
                alt="Preview"
                style={{
                    transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
                />
                <div className="zoom-controls">
                <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 5))}>🔍+</button>
                <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 1))}>🔍−</button>
                </div>
            </div>

            <button className="close-button" onClick={closePreview}>✕</button>
            </div>

        )}


    </div>
  );
};

export default RightPanel;
