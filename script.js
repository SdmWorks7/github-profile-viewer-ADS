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
    renderUser(user);
 
    await renderRepos(username);
    
  } catch (err) {
     setStatus(err.message, true);
  } finally {
    showSpinner(false);
  }
}

async function renderRepos(username) {
  repoList.innerHTML = "";
 
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=5`
    );
 
    if (!response.ok) {
      throw new Error("Could not load repositories.");
    }
 
    const repos = await response.json();
 
    if (repos.length === 0) {
      repoList.innerHTML = `<li class="repo-empty">No public repositories yet.</li>`;
      return;
    }
 
    repos.forEach((repo) => {
      const li = document.createElement("li");
      li.className = "repo-item";
      li.innerHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
        <span class="repo-lang">${repo.language || ""}</span>
      `;
      repoList.appendChild(li);
    });
  } catch (err) {
    repoList.innerHTML = `<li class="repo-empty">${err.message}</li>`;
  }
}

function renderUser(user) {
  avatar.src = user.avatar_url;
  avatar.alt = `${user.login}'s avatar`;
 
  nameEl.textContent = user.name || user.login;
  loginEl.textContent = `@${user.login}`;
  loginEl.href = user.html_url;
 
  bioEl.textContent = user.bio || "";
  bioEl.style.display = user.bio ? "block" : "none";
 
  followersEl.textContent = user.followers;
  followingEl.textContent = user.following;
  reposEl.textContent = user.public_repos;
 
  locationEl.textContent = user.location ? `📍 ${user.location}` : "";
 
  const joinedDate = new Date(user.created_at);
  joinedEl.textContent = `Joined ${joinedDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  })}`;
 
  profileLink.href = user.html_url;
 
  result.classList.remove("hidden");
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