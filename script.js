const input = document.getElementById("usernameInput");
const button = document.getElementById("searchBtn");
const profile = document.getElementById("profile");
const repoList = document.getElementById("repoList");

const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close");
const text = document.getElementById("text");

button.addEventListener("click", getUser);
closeBtn.addEventListener("click", closePopup);
popup.addEventListener("click", (e) => {
    if (e.target === popup) closePopup();
}); 

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getUser();
});

async function getUser(){
    const username = input.value.trim();
    if(!username) return;

    button.disabled = true;
    profile.innerHTML = "Loading profile...";
    repoList.innerHTML = "";

    try {
        const userResponse = await fetch(
            `https://api.github.com/users/${username}`
        );
        if (!userResponse.ok) {
            throw new Error("User not found");
        } 
        const userData = await userResponse.json();
        showProfile(userData);

        const repoResponse = await fetch(userData.repos_url);
        const repos = await repoResponse.json();

        if (repos.length === 0) {
            repoList.innerHTML = "No repositories found";
            return;
        }

        showRepos(repos.slice(0, 6));
    } catch (error) {
        profile.innerHTML = error.message;
    } finally {
        button.disabled = false;
    }
}

function showProfile(user) {
    profile.innerHTML = `
    <img src="${user.avatar_url}" alt="avatar" />
    <div>
       <h3>${user.name || user.login}</h3>
       <p>${user.bio || "No bio available"}</p>
       <p>Followers: ${user.followers}</p>
       <p>Following: ${user.following}</p>
       <p>Public Repos: ${user.public_repos}</p>
    </div>
    `;
}

function showRepos(repos){
    repoList.innerHTML = "";

    repos.forEach((repo) => {
        const card = document.createElement("div");
        card.className = "repo";

        card.innerHTML = `
      <h4>${repo.name}</h4>
      <p>${repo.language || "Not specified"}</p>
    `;

    card.addEventListener("click", () => {
        openPopup(repo);
    });

    repoList.appendChild(card);
    });
}

function openPopup(repo) {
    text.innerHTML = `
     <p>Name: ${repo.name}</p>
     <p>Description: ${repo.description || "No description"}</p>
     <p>Language:
    `;

    popup.classList.remove("hide");
}

function closePopup() {
    popup.classList.add("hide");
}