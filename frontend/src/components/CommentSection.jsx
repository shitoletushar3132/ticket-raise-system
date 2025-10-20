import React, { useState, useEffect } from "react";
import { getComments, addComment } from "../api/axios";
import { toast } from "react-toastify";
import { FaCommentAlt, FaUser } from "react-icons/fa";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Textarea from "./ui/Textarea";
import Badge from "./ui/Badge";
import Loading from "./ui/Loading";

const CommentSection = ({ ticketId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(ticketId);
      setComments(response.data.data.comments || []);
    } catch (error) {
      toast.error("Failed to load comments");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(ticketId, newComment);
      toast.success("Comment added successfully");
      setNewComment("");
      fetchComments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
        <FaCommentAlt className="text-primary-600" />
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <Card className="p-5 mb-6">
        <form onSubmit={handleSubmit}>
          <Textarea
            name="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      </Card>

      {/* Comments List */}
      {loading ? (
        <Loading text="Loading comments..." />
      ) : comments.length === 0 ? (
        <Card className="p-8 text-center">
          <FaCommentAlt className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first to comment!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment._id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  <span className="font-medium text-gray-900 text-sm">
                    {comment.user?.name || "Unknown"}
                  </span>
                  <Badge variant="default" size="sm">
                    {comment.user?.role || "user"}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {comment.message}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
