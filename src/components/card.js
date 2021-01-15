// get localStorage
let topicLS = localStorage.getItem("topic")

const Card = (article) => {
  // grab topic from localStorage


  // TASK 5
  // ---------------------
  // Implement this function, which should return the markup you see below.
  // It takes as its only argument an "article" object with `headline`, `authorPhoto` and `authorName` properties.
  // The tags used, the hierarchy of elements and their attributes must match the provided markup exactly!
  // The text inside elements will be set using their `textContent` property (NOT `innerText`).
  // Add a listener for click events so that when a user clicks on a card, the headline of the article is logged to the console.
  //
  // <div class="card">
  //   <div class="headline">{ headline }</div>
  //   <div class="author">
  //     <div class="img-container">
  //       <img src={ authorPhoto }>
  //     </div>
  //     <span>By { authorName }</span>
  //   </div>
  // </div>
  //
  let cardEl = document.createElement("div")
  let headlineEl = document.createElement("div")
  let authorContainerEl = document.createElement("div")
  let imgContainerEl = document.createElement("div")
  let imgEl = document.createElement("img")
  let nameEl = document.createElement("span")

  cardEl.appendChild(headlineEl)
  cardEl.appendChild(authorContainerEl)
  authorContainerEl.appendChild(imgContainerEl)
  authorContainerEl.appendChild(nameEl)
  imgContainerEl.appendChild(imgEl)

  cardEl.classList.add("card")
  headlineEl.classList.add("headline")
  authorContainerEl.classList.add("author")
  imgContainerEl.classList.add("img-container")

  headlineEl.textContent = article.headline 
  imgEl.setAttribute("src", article.authorPhoto)
  nameEl.textContent = article.authorName

  return cardEl
}

const cardAppender = (selector) => {
  // TASK 6
  // ---------------------
  // Implement this function that takes a css selector as its only argument.
  // It should obtain articles from this endpoint: `https://lambda-times-api.herokuapp.com/articles`
  // However, the articles do not come organized in a single, neat array. Inspect the response closely!
  // Create a card from each and every article object in the response, using the Card component.
  // Append each card to the element in the DOM that matches the selector passed to the function.
  //

  fetch(`https://lambda-times-api.herokuapp.com/articles`).then( r => r.json()).then( r => {
    let topics = r.articles
    console.log(topics)
    if(topicLS) {
      topics = [topics[topicLS]]
    }

    selector = document.querySelector(selector)

    for( let prop in topics) {
      if(!topics.hasOwnProperty(prop)) {
        continue
      }
      let articles = topics[prop]
      for (let i = 0; i < articles.length; i++) {
        let card = Card(articles[i])
        selector.appendChild(card)
      }
    }
  }).catch( e => console.log(e))
}

export { Card, cardAppender }
