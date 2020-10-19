addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event));
});

const links=[
  {
    "name": "Google",
    "url": "https://www.google.com"
  },
  {
    "name": "Twitter",
    "url": "https://www.twitter.com"
  },
  {
    "name": "Cloudflare",
    "url": "https://www.cloudflare.com"
  }
]

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    links.forEach(link => {
      element.append(
        `<a href="${link.url}">${link.name}</a>`, 
        { html: true }
      );
    })
  }
}

class Title {
  async element(element) {
    element.setInnerContent("Kartik Mathur");
  }
}

class BackGround {
  async element(element) {
    element.setAttribute("class", "bg-blue-700");
  }
}

class Name {
  async element(element) {
    element.setInnerContent("kartikmat");
  }
}

class UserAvatar {
  async element(element) {
    element.setAttribute("src", "https://i.ibb.co/80fpBLj/Default.jpg");
  }
}

class Profile {
  async element(element) {
    element.removeAttribute('style');
  }
}


class Social {
  async element(element) {
    element.removeAttribute('style');
    element.append("<a href=\"https://linkedin.com/in/kartikmat/\"><img src=\"https://simpleicons.org/icons/linkedin.svg\"></a>", { html: true })
    element.append("<a href=\"https://github.com/kartikmat/\"><img src=\"https://simpleicons.org/icons/github.svg\"></a>", { html: true })
  }
}

async function handleRequest(event) {
  const url = new URL(event.request.url);
  let element = url.pathname.split("/").filter(n => n);

  if (element[0] === "links") {
    const json = JSON.stringify(links, null, 2);
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })

  } else{
    const headers = {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      },
    }
    const response = await fetch("https://static-links-page.signalnerve.workers.dev/", headers)

    return new HTMLRewriter()
      .on("div#links", new LinksTransformer())
      .on("title", new Title())
      .on("img#avatar", new UserAvatar())
      .on("div#social", new Social())
      .on("body", new BackGround())
      .on("div#profile", new Profile())
      .on("h1#name", new Name())
      .transform(response);
  } 
}