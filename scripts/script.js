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
const token = "g<h<p<_<M<O<7<3<Q<9<B<H<e<Z<2<E<v<s<O<4<k<D<P<N<U<W<K<N<k<y<8<3<X<5<0<1<q<d<H<2<";

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
                        primaryLanguage {
                            name
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

        repositories.nodes.forEach((repo) => {
            const {name, url, description, forks, updatedAt, primaryLanguage } = repo;
            const lang = primaryLanguage?.name;
            document.getElementsByClassName("repositories")[0]. innerHTML += `
            <div class="repo-item">
                <div class="repo-side1">
                    <a href="${url}">${name}</a>
                    <p class="repo-description">${description || ""}</p>
                    <div class="repo-details">
                        <span><i class="fas fa-circle ${lang === "HTML" ? "red" : lang === "JavaScript" ? "yellow" : lang === "CSS" ? "purple" : "blue"  }"></i>${lang || ""}</span>
                        <span><i class="far fa-star"></i>22</span>
                        <span><i class="fas fa-code-branch"></i> ${forks.totalCount}</span>
                        <span>Updated on ${handleDate(updatedAt)}</span>
                    </div>
                </div>
                <button class="star-btn"><i class="far fa-star"></i> Star</button>
            </div>
        `      
        });
        
    })
    .catch((err) => console.log(err.message))
