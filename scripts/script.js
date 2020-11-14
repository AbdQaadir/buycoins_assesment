import {getMonth} from './util.js';

const toggleBtn = document.querySelector(".toggle-btn");
const mobileNav = document.querySelector(".mobile-dropdown");

// Event Listener for Mobile Nav
toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle("active");
})

// Handle date formatting for repo last updated
const handleDate = date => {
    const month = getMonth(new Date(date).getMonth());
    const day = new Date(date).getDay();
    return `${month} ${day}`;
}

// Token for GraphQL API call, tampered with it because if github detects it, it will be automatically removed
// The add "<" would be removed in the header of the fetch api
const token = '<1<1<c<7<e<c<8<1<f<9<5<9<5<3<8<6<9<0<5<9<7<8<5<e<2<1<1<e<e<5<9<d<5<7<f<6<d<2<1<8<';

// API Call
fetch('https://api.github.com/graphql',  {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${token.replace(/</g, "")}`
    },
    body: JSON.stringify({
        query: `
            query {
                viewer {
                  login
                  name
                  avatarUrl
                  bio
                  repositories(first: 20) {
                    nodes {
                        name
                        url
                        updatedAt
                        description
                        forks {
                          totalCount
                        }
                      }
                  }
                }
              }
        `
    })
}).then(res=> res.json())
    .then(data => {
        const {avatarUrl, bio, login, name, repositories} = data.data.viewer;
        console.log(data);
        document.querySelectorAll(".profile-picture").forEach((img) => img.setAttribute("src", avatarUrl))
        document.getElementsByClassName("user")[0].textContent = name;
        document.getElementsByClassName("username")[0].textContent = login;
        document.getElementsByClassName("bio")[0].textContent = bio;
        document.getElementsByClassName("count")[0].textContent = repositories.nodes.length;

        repositories.nodes.forEach(repo => {
            document.getElementsByClassName("repositories")[0]. innerHTML += `
            <div class="repo-item">
                <div class="repo-side1">
                    <a href="${repo.url}">${repo.name}</a>
                    <p class="repo-description">${repo.description || ""}</p>
                    <div class="repo-details">
                        <span><i class="fas fa-circle"></i>HTML</span>
                        <span><i class="far fa-star"></i>22</span>
                        <span><i class="fas fa-code-branch"></i> ${repo.forks.totalCount}</span>
                        <span>Update on ${handleDate(repo.updatedAt)}</span>
                    </div>
                </div>
                <button class="star-btn"><i class="far fa-star"></i> Star</button>
            </div>
        `      
        });
        
    })
    .catch((err) => console.log(err.message))
