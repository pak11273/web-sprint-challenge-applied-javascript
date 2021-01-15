const Tabs = (topics) => {

  // TASK 3
  // ---------------------
  // Implement this function which takes an array of strings ("topics") as its only argument.
  // As an example, if the topics passed are ['javascript', 'bootstrap', 'technology']
  // then the function returns the markup below.
  // The tags used, the hierarchy of elements and their attributes must match the provided markup!
  // The text inside elements will be set using their `textContent` property (NOT `innerText`).
  //
  // <div class="topics">
  //   <div class="tab">javascript</div>
  //   <div class="tab">bootstrap</div>
  //   <div class="tab">technology</div>
  // </div>
  //
  let topicsEl = document.createElement("div")
  topicsEl.classList.add("topics")
  topics.forEach((topic) => {
    let topicEl = document.createElement("div")
    topicEl.classList.add("tab")
    topicEl.textContent = topic
    topicEl.addEventListener("click", () => {
      window.localStorage.setItem("topic", topic)
      location.reload()
    })

    topicsEl.appendChild(topicEl)
  })
  return topicsEl
}

const tabsAppender = (selector) => {
  // TASK 4
  // ---------------------
  // Implement this function which takes a css selector as its only argument.
  // It should obtain topics from this endpoint: `https://lambda-times-api.herokuapp.com/topics`
  // Find the array of topics inside the response, and create the tabs using the Tabs component.
  // Append the tabs to the element in the DOM that matches the selector passed to the function.
  //

  fetch(`https://lambda-times-api.herokuapp.com/topics`).then( r => r.json()).then( r => {
    let topics = r.topics
    let tabs = Tabs(topics)
    selector = document.querySelector(selector) 
    selector.appendChild(tabs)
  }).catch( e => console.log(e))

}

export { Tabs, tabsAppender }
