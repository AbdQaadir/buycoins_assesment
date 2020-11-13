import {getMonth} from './util.js';
const handleDate = date => {
    const month = getMonth(new Date(date).getMonth());
    const day = new Date(date).getDay();


    return `${month} ${day}`;
}
const token = '814bad78011f507486800620b4f8f8e92617433e';
// const token = '179365464f2900e85029cda78e82f7644de1580a';
fetch('https://api.github.com/graphql',  {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + token
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
        console.log(data)
        document.getElementsByClassName("profile-picture")[0].setAttribute("src", avatarUrl);
        document.getElementsByClassName("profile-picture")[1].setAttribute("src", avatarUrl);
        document.getElementsByClassName("user")[0].textContent = name;
        document.getElementsByClassName("username")[0].textContent = login;
        document.getElementsByClassName("bio")[0].textContent = bio;
        document.getElementsByClassName("count")[0].textContent = repositories.nodes.length;

        repositories.nodes.forEach(repo => {
            document.getElementsByClassName("repositories")[0]. innerHTML += `
            <div class="repo-item">
                <div>
                    <a href="${repo.url}">${repo.name}</a>
                    <p class="repo-description">${repo.description}</p>
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