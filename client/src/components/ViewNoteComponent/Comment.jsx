import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";
import { Link } from "react-router-dom";
function Comment({ comment }) {
  return (
    <div className="comment">
      <img src={pic} alt="User Avatar" className="avatar" />
      <div className="comment-content">
        <Link to={`/notenook/viewUser/${comment.postedBy._id}`}>
          <p className="commentedBy">
            <strong>{comment.postedBy.username}</strong>
          </p>
        </Link>
        <p className="commentedAt">
          Commented at: {formatDate(comment.updatedAt)}
        </p>
        <p>{comment.comment}</p>
      </div>
    </div>
  );
}

export default Comment;
