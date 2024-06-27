import React from 'react';
import { useGuest } from './GuestContext';
import useForum from '../hooks/useForum';
import '../style/forum.css';

export default function Forum() {
  const { isGuest } = useGuest();
  const {
    comments,
    newComment,
    setNewComment,
    editingComment,
    setEditingComment,
    loading,
    error,
    addComment,
    editComment,
    deleteComment,
    isAuthenticated,
    user,
  } = useForum();

  return (
    <div className="forum-container">
      <h2>Forum</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {isGuest && (
            <div className="guest-message">
              <p>Welcome, Guest! Please log in to participate in the forum.</p>
            </div>
          )}
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                <div>
                  <strong>{comment.user ? comment.user.name : 'Unknown User'}</strong> - 
                  <span className="comment-dates">
                    {new Date(comment.createdAt).toLocaleString()} {comment.updatedAt && `(Updated: ${new Date(comment.updatedAt).toLocaleString()})`}
                  </span>
                  <p>{comment.content}</p>
                  {isAuthenticated && comment.user?.auth0Id === user.sub && (
                    <div className="comment-actions">
                      <button onClick={() => setEditingComment(comment)}>Edit</button>
                      <button onClick={() => deleteComment(comment.id)}>Delete</button>
                    </div>
                  )}
                </div>
                {editingComment && editingComment.id === comment.id && (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingComment.content}
                      onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
                    />
                    <button onClick={() => editComment(comment.id)}>Save</button>
                    <button onClick={() => setEditingComment(null)}>Cancel</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          {isAuthenticated && (
            <div className="new-comment">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button onClick={addComment}>Post</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}