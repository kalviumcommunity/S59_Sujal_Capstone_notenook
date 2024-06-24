import { Link } from "react-router-dom";

import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";
function Comment({ comment, deleteComment }) {
  return (
    <div className="comment">
      <img src={pic} alt="User Avatar" className="avatar" />
      <div className="comment-content">
        <div className="flex w-full justify-between items-center">
          <Link to={`/notenook/viewUser/${comment.postedBy._id}`}>
            <p className="commentedBy">
              <strong>{comment.postedBy.username}</strong>
            </p>
          </Link>
          <button
            className="delete text-sm text-red-600"
            onClick={() => deleteComment(comment._id)}
          >
            Delete
          </button>
        </div>

        <p className="commentedAt">
          Commented at: {formatDate(comment.updatedAt)}
        </p>
        <p>{comment.comment}</p>
      </div>
    </div>
  );
}

export default Comment;
