import pic from "../../assets/pic.png";
import formatDate from "../../Functions/FormatDate";
function MyComment({ comment }) {
  return (
    <div className="my-comment">
      <img src={pic} alt="My Avatar" className="avatar" />
      <div className="comment-content">
        <p>
          <strong>{comment.postedBy.username} (You):</strong> {comment.comment}
        </p>
        <p>Posted at: {formatDate(comment.updatedAt)}</p>
      </div>
    </div>
  );
}

export default MyComment;
