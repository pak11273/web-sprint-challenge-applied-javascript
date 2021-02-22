const Header = (title, date, temp) => {
  // TASK 1
  // ---------------------
  // Implement this function taking `title`, `date` and `temp` as its 3 args and returning the markup below.
  // The tags used, the hierarchy of elements and their attributes must match the provided markup exactly!
  // The text inside elements will be set using their `textContent` property (NOT `innerText`).
  //
  //  <div class="header">
  //    <span class="date">{ date }</span>
  //    <h1>{ title }</h1>
  //    <span class="temp">{ temp }</span>
  //  </div>
  //
  let headerEl = document.createElement("div")
  let dateEl = document.createElement("span")
  let titleEl = document.createElement("h1")
  let tempEl = document.createElement("span")

  headerEl.appendChild(dateEl)
  headerEl.appendChild(titleEl)
  headerEl.appendChild(tempEl)

  headerEl.classList.add("header")
  dateEl.classList.add("date")
  tempEl.classList.add("temp")

  dateEl.textContent = date 
  titleEl.textContent = title 
  tempEl.classList.add = temp

  return headerEl
}

const headerAppender = (selector) => {
  // TASK 2
  // ---------------------
  // Implement this function taking a css selector as its only argument.
  // It should create a header using the Header component above, passing arguments of your choosing.
  // It should append the header to the element in the DOM that matches the given selector.
  //
  const header = Header("Lambda", "1/12/2021", "temp")
  selector = document.querySelector(selector)
  selector.appendChild(header)
}

export { Header, headerAppender }