const newFormHandler = async (event) => {
  event.preventDefault();
  const comment = document.querySelector("#comment-input");
  const post_id = comment.dataset.id;
  const comment_text = comment.value.trim();
  console.log(comment);
  if (comment) {
    const response = await fetch(`/api/comments`, {
      method: "POST",
      body: JSON.stringify({ comment_text, post_id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.reload();
    } else {
      alert("Failed to create comment");
    }
  }
};

document.querySelector("#submit").addEventListener("click", newFormHandler);
