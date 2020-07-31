import React, { useEffect, useState, useContext } from "react"
import Page from "./Page"
import Axios from "axios"
import { Link, Redirect, useParams } from "react-router-dom"
import LoadingDotsIcon from "./LoadingDotsIcon"
import ReactMarkdown from "react-markdown"
import ReactTooltip from "react-tooltip"
import NotFound from "./NotFound"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function ViewSinglePost() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState()
  const { id } = useParams()
  const [deleteAttempt, setDeleteAttempt] = useState(0)
  const [deleteWasSuccessful, setDeleteWasSuccessful] = useState(false)
  useEffect(() => {
    const ourRequest = Axios.CancelToken.source()
    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, { CancelToken: ourRequest.token })
        setPost(response.data)
        setIsLoading(false)
      } catch (e) {
        console.log("Error")
      }
    }
    fetchPost()
    return () => {
      ourRequest.cancel()
    }
  }, [id])
  useEffect(() => {
    if (deleteAttempt) {
      const ourRequest = Axios.CancelToken.source()
      async function deletePost() {
        try {
          const response = await Axios.delete(`/post/${id}`, { data: { token: appState.user.token } }, { CancelToken: ourRequest.token })
          if (response.data === "Success") {
            setDeleteWasSuccessful(true)
          }
        } catch (e) {
          console.log("Error")
        }
      }
      deletePost()
      return () => {
        ourRequest.cancel()
      }
    }
  }, [deleteAttempt])
  if (deleteWasSuccessful) {
    appDispatch({ type: "flashMessage", value: "Your post has been successfully deleted !" })
    return <Redirect to={`/profile/${appState.user.username}`} />
  }

  if (!isLoading && !post) {
    return <NotFound />
  }

  if (isLoading)
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    )

  const date = new Date(post.createdDate)
  const dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username === post.author.username
    } else {
      return false
    }
  }
  function deleteHandler() {
    const areYouSure = window.confirm("Are you sure want to delete the post ? ")
    if (areYouSure) {
      setDeleteAttempt((prev) => prev + 1)
    }
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        {" "}
        <h2>{post.title}</h2>
        {isOwner() && (
          <span className="pt-2">
            <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
              <i className="fas fa-edit"></i>
            </Link>
            <ReactTooltip id="edit" className="custom-tooltip" />
            {"   "}
            <Link onClick={deleteHandler} data-tip="Delete" data-for="delete" className="delete-post-button text-danger">
              <i className="fas fa-trash"></i>
            </Link>
            <ReactTooltip id="delete" className="custom-tooltip" />
          </span>
        )}
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link> on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown source={post.body} allowedTypes={["paragraph", "strong", "emphasis", "text", "heading", "list", "listItem"]} />{" "}
      </div>
    </Page>
  )
}

export default ViewSinglePost
