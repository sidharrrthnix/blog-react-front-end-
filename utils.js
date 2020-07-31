mongodb+srv://testUser:testaccount@cluster0.uss0q.mongodb.net/ReactCourse?retryWrites=true&w=majority



const date = new Date(post.createdDate)
const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`


<div className="d-flex justify-content-between">
{" "}
<h2>{post.title}</h2>
<span className="pt-2">
  <Link to="#" className="text-primary mr-2" title="Edit">
    <i className="fas fa-edit"></i>
  </Link>
  <Link className="delete-post-button text-danger" title="Delete">
    <i className="fas fa-trash"></i>
  </Link>
</span>
</div>

<p className="text-muted small mb-4">
<Link to="#">
  <img className="avatar-tiny" src={post.author.avatar} />
</Link>
Posted by <Link to="#">{post.author.username}</Link> on {dateFormatted}
</p>

<div className="body-content">{post.body}</div>