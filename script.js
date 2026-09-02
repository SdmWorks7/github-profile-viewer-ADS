const form = document.getElementById("search-form");
const input = document.getElementById("username-input");
const statusEl = document.getElementById("status");
const spinner = document.getElementById("spinner");
const result = document.getElementById("result");
const repoList = document.getElementById("repo-list");
 
const avatar = document.getElementById("avatar");
const nameEl = document.getElementById("name");
const loginEl = document.getElementById("login");
const bioEl = document.getElementById("bio");
const followersEl = document.getElementById("followers");
const followingEl = document.getElementById("following");
const reposEl = document.getElementById("repos");
const locationEl = document.getElementById("location");
const joinedEl = document.getElementById("joined");
const profileLink = document.getElementById("profile-link");

async function getGitHubUser(username) {
  if (!username) {
    setStatus("Enter a username to search.", true);
    return;
  }
 
  setStatus("");
  result.classList.add("hidden");
  showSpinner(true);
 
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
 
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? `User not found: no GitHub account matches "${username}"`
          : "Something went wrong talking to GitHub. Try again later."
      );
    }
 
    const user = await response.json();
    
  } catch (err) {
     setStatus(err.message, true);
  } finally {
    showSpinner(false);
  }
}

function showSpinner(show){
    spinner.classList.toggle("hidden", !show)
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle("error", isError);
}
 
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = input.value.trim();
  getGitHubUser(username);
});