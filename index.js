export function routIt() {
    // Clear the body
    document.body.innerHTML = "";

    // Create the logo image
    let logo = document.createElement("img");
    logo.src = "./images/logo.png";
    logo.style.width = "150px"; // Optional styling for size
    logo.style.marginBottom = "20px"; // Optional margin

    // Create the input fields
    let name = document.createElement("input");
    name.type = "text";
    name.placeholder = "Enter your name";
    name.id = "name";

    let pass = document.createElement("input");
    pass.type = "password";
    pass.placeholder = "Enter your password";
    pass.id = "password";

    // Create an error message container
    let errorPlace = document.createElement("div");
    errorPlace.id = "errorPlace";

    // Create the login button
    let btn = document.createElement("button");
    btn.textContent = "Login";
    btn.id = "loginButton";

    // Create the main login container
    let login = document.createElement("div");
    login.classList.add("login");

    let tocenter = document.createElement("div");
    tocenter.classList.add("tocenter");

    let texts = document.createElement("div");
    texts.classList.add("texts");

    let bigtext = document.createElement("div");
    bigtext.classList.add("Bigtext");
    bigtext.textContent = "Login";

    let smalltext = document.createElement("div");
    smalltext.classList.add("smalltext");
    smalltext.textContent = "and let's see if you're a real talent";

    // Assemble the elements together
    texts.append(bigtext, smalltext);
    tocenter.append(texts);

    let form = document.createElement("div");
    form.classList.add("form");
    form.append(name, pass, errorPlace, btn);

    login.append(tocenter, form, logo);

    // Add the login container to the body
    document.body.appendChild(login);
}
routIt()