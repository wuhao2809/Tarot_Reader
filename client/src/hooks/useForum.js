import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useForum = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchComments() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/comments`);
        const data = await response.json();
        setComments(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching comments');
        setLoading(false);
      }
    }

    fetchComments();
  }, []);

  const addComment = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: newComment }),
      });
      const newCommentData = await response.json();
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (error) {
      setError('Error adding comment');
    }
  };

  const editComment = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content: editingComment.content }),
      });
      const updatedComment = await response.json();
      setComments(comments.map(comment => (comment.id === id ? updatedComment : comment)));
      setEditingComment(null);
    } catch (error) {
      setError('Error editing comment');
    }
  };

  const deleteComment = async (id) => {
    try {
      const accessToken = await getAccessTokenSilently();
      await fetch(`${process.env.REACT_APP_API_URL}/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setComments(comments.filter(comment => comment.id !== id));
    } catch (error) {
      setError('Error deleting comment');
    }
  };

  return {
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
  };
};

export default useForum;