import Home from "./pages/Home.js";
import Posts from "./pages/Posts.js";
import Settings from "./pages/Settings.js";

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    if (event.target.matches("[data-link]")) {
      event.preventDefault();
      navigate(event.target.href);
    }
  });
  render();
});

function renderer() {
  const routes = [
    {
      path: "/",
      view: Home,
    },
    {
      path: "/posts",
      view: Posts,
    },
    {
      path: "/settings",
      view: Settings,
    },
  ];

  const setRoutesMatch = routes.map((route) => {
    return {
      ...route,
      isCurrentPathMatch: location.pathname === route.path,
    };
  });

  let matchRoute = setRoutesMatch.find((matche) => matche.isCurrentPathMatch);
  if (!matchRoute) {
    matchRoute = {
      view: () => console.log("404 Not Found"),
    };
  }

  const view = new matchRoute.view();

  return view;
}

function render() {
  const view = renderer();
  document.querySelector("#root").innerHTML = view.getViewHtml();
}

function navigate(url) {
  history.pushState(null, null, url);
  render();
}
