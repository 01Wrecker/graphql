
const Div = (className = "", textContent) => {
    const divElement = document.createElement("div");
    divElement.className = className;
    if (textContent !== undefined) divElement.textContent = textContent;
    divElement.on = function (eventName, callback) {
        divElement["on" + eventName] = callback;
        return this;
    };
    divElement.add = function (...args) {
        divElement.append(...args);
        return divElement;
    };
    return divElement;
};
const header = document.querySelector("header");
const logo = document.querySelector(".logo");
async function dataseter() {
    let data = await infogeter();
    let data1 = await datageter(data);
    body.add(data1);
}
let body = Div("home")
function loginfarm() {
    if (localStorage.getItem("jwt")) {
        dataseter();
        logo.onclick = profileshow;
        document.body.appendChild(body)
        return
    } else {
        localStorage.clear()
        username = document.createElement("input");
        username.placeholder = "Username";
        username.className = "username";
        username.type = "text";
        password = document.createElement("input");
        password.placeholder = "Password";

        password.className = "password";
        password.type = "password";
        loginButton = document.createElement("img");
        loginButton.src = "/media/login.svg";
        loginButton.className = "loginButton";
        loginButton.onclick = async function () {
            loginButton.style.pointerEvents = "none";
            let info = `${username.value}:${password.value}`
            let data = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
                method: "POST",
                headers: {
                    "Authorization": `Basic ${btoa(info)}`,
                }
            })
            if (data.ok) {
                let jwt = await data.json();
                localStorage.setItem("jwt", jwt);
                loginDiv.remove();
                dataseter();
                logo.onclick = profileshow;
                document.body.appendChild(body)
                return

            } else {
                alert("Login failed");
                loginButton.style.pointerEvents = "auto";
            }
        }
        loginDiv = document.createElement("div");
        loginDiv.className = "loginDiv";
        loginDiv.appendChild(username);
        loginDiv.appendChild(password);
        loginDiv.appendChild(loginButton);
        document.body.appendChild(loginDiv);
    }
}
loginfarm();
let userdata
function profileshow() {
    if (document.querySelector(".profile") && document.querySelector(".user-info")) {
        document.querySelector(".profile").remove();
        const picProfileElem = document.querySelector(".picprofile");
        if (picProfileElem) {
            picProfileElem.classList.remove("active");
        }
        return
    }
    document.querySelector(".picprofile").classList.add("active");
    profile = Div("profile")
    logout = document.createElement("img");
    logout.src = "/media/logout.svg";
    logout.className = "logout";
    logout.onclick = function () {
        localStorage.removeItem("jwt");
        location.reload();
    }

    let infoDiv = Div("user-info");
    infoDiv.add(
        Div("user-field", `First Name: ${userdata.firstName || ""}`),
        Div("user-field", `Last Name: ${userdata.lastName || ""}`),
        Div("user-field", `Email: ${userdata.email || ""}`),
        Div("user-field", `Phone: ${userdata.tel || ""}`),
        Div("user-field", `City: ${userdata.city || ""}`),
        Div("user-field", `Birth City: ${userdata.birthCity || ""}`),
        Div("user-field", `Date of Birth: ${userdata.dateOfBirth ? userdata.dateOfBirth.split("T")[0] : ""}`),
        Div("user-field", `Gender: ${userdata.gender || ""}`),
        logout
    );

    profile.add(infoDiv)
    header.append(profile);
}
async function infogeter() {
    let token = localStorage.getItem("jwt")
    let resp = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {
                user {
                    lastName
                    firstName
                    login
                    attrs
                }
     }`
        })
    })
    let dat = await resp.json()
    if (dat.errors) {
        console.log("1");
        alert("Login failed");
        localStorage.clear()
        location.reload();
        return

    }

    let login = dat.data.user[0].login
    // let div = Div("hello")

    /*  let va = `Hello ${dat.data.user[0].firstName} ${dat.data.user[0].lastName}`;
     div.add(va); */
    header.append(picprofile(login));
    return login;
}
async function datageter(login) {
    let token = localStorage.getItem("jwt")
    let resp = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query {  
                 user {
                    campus
                    auditRatio
                    attrs
                }
                    audit ( where: {
                    auditorLogin : {_eq : "${login}"}
                    closureType: { _is_null: true } 

                    }) {
                    private {
                    code
                    }
                    group {
                    captainLogin
                    path
                    }
                  }
                     xpTransactions : transaction_aggregate(where: { type: { _eq: "xp" }, eventId: { _eq: 41 } }) {
                            aggregate {
                                sum {
                                    amount
                                }
                            }
                        }
                        upTransactions : transaction_aggregate(where: { type: { _eq: "up" }, eventId: { _eq: 41 } }) {
                            aggregate {
                                sum {
                                    amount
                                }
                            }
                        }
                            downTransactions : transaction_aggregate(where: { type: { _eq: "down" }, eventId: { _eq: 41 } }) {
                            aggregate {
                                sum {
                                    amount
                                }
                            }
                        }
                    transaction (where : {type : {_eq : "xp"} ,
                        eventId : {_eq  :41}},
                        ){  
                        path
                        amount
                    } 
                    skils :   user {
                    transactions(
                    where: {type: {_regex: "skill"}}
                    order_by: [{type: asc}, {amount: desc}]
                    distinct_on: type
                    ) {
                    id
                    amount
                    type
                    }
                }
              }`
        })
    })
    let dat = await resp.json()
    if (dat.errors) {
        console.log("2");
        alert("Login failed");
        localStorage.removeItem("jwt");
        location.reload();
        return

    }
    if (dat.data.user[0].campus == null) {
        alert("you are not student")
        let h1 = document.createElement("h1")
        h1.textContent = "you are not student"
        document.body.appendChild(h1)
        return
    }
    let Userdata = dat.data.user[0].attrs
    userdata = Userdata
    if (!dat.data.audit || dat.data.audit.length === 0) {
        var h = Div("audit").add(
            Div("no-audit").add("No audit found.")
        );
    } else {
        let code = dat.data.audit[0].private.code;
        let kapitan = dat.data.audit[0].group.captainLogin;
        let projectname = (dat.data.audit[0].group.path).split("/").pop();
        var h = Div("audit").add(
            Div("project").add(`Project: ${projectname}`),
            Div("Code").add(`Code: ${code}`),
            Div("Auditor").add(`Auditor: ${login}`),
            Div("Captain").add(`Captain: ${kapitan}`),
        );
    }
    let data = dat.data
    body.add(h);
    let done = Math.round(data.upTransactions.aggregate.sum.amount / 1000)
    let received = Math.round(data.downTransactions.aggregate.sum.amount / 1000)
    let auditRatio = Math.round(data.user[0].auditRatio * 10) / 10
    let cardsContainer = Div("cardsContainer")
    body.add(cardsContainer)
    expinfo(Math.round((data.xpTransactions.aggregate.sum.amount) / 1000))
    auditGraph(auditRatio, done, received, cardsContainer)
    let skills = data.skils[0].transactions
    skillCard(skills);

    return h
}
function info(userdata) {

    body.add(infoDiv);
}
function skillCard(skills) {
    console.log(skills);
    if (!skills || !skills.length) return;

    let svgHeight = skills.length * 20;
    let svgWidth = skills.length * 30 + 30;
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.display = "block";
    svg.style.margin = "0 auto";
    let placeholder = Div("skillsholder");
    placeholder.add(Div("skillsTitle", "all Skills"), Div("skillsSubtitle", "Hover over a bar to see the skill and its percentage"));
    placeholder.style.width = "100%";
    placeholder.style.overflowX = "auto";
    placeholder.style.boxSizing = "border-box";
    placeholder.style.padding = "10px 0";

    let count = 0;
    skills.sort((a, b) => a.amount - b.amount);
    skills.forEach(skill => {
        let xPos = count += 30;
        let barHeight = skill.amount * 2.5;
        let yPos = svgHeight - barHeight;

        let rectan = rect(xPos, yPos, 16, barHeight, 10, 10, "#fbc02d");

        rectan.addEventListener("mouseenter", function (e) {
            let tooltip = Div("tooltip");
            tooltip.textContent = skill.type + " " + skill.amount + "%";
            tooltip.style.position = "absolute";
            tooltip.style.background = "#222";
            tooltip.style.color = "#fff";
            tooltip.style.padding = "4px 8px";
            tooltip.style.borderRadius = "4px";
            tooltip.style.fontSize = "12px";
            tooltip.style.pointerEvents = "none";
            tooltip.style.zIndex = 1000;
            tooltip.setAttribute("ishover", "true");
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = (rect.top - 30 + window.scrollY) + "px";
            tooltip.style.left = (rect.left + window.scrollX) + "px";

            document.body.appendChild(tooltip);
        });

        rectan.addEventListener("mouseleave", function () {
            const tooltip = document.querySelector("[ishover]");
            if (tooltip) tooltip.remove();
        });

        svg.append(rectan);
    });

    placeholder.append(svg);
    body.add(placeholder);
}

function expinfo(exp) {
    let div = Div("expinfo");
    div.add("Your XP: " + exp + " kb");
    body.add(div);
}
function picprofile(login) {
    let picprofile = `https://discord.zone01oujda.ma/assets/pictures/${login}.jpg`;
    let img = document.createElement("img");
    img.className = "picprofile";
    img.src = picprofile;
    img.onclick = profileshow
    img.onerror = function () {
        img.onerror = null;
        img.src = "/media/ppp.jpg";
    };
    return img;
}
async function auditGraph(auditRatio, done, received, cardsContainer) {
    const total = done + received;
    const svgWidth = 200;
    const svgHeight = 70;
    const donLen = (done / total) * svgWidth;
    const recLen = (received / total) * svgWidth;
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.style.width = "100%";
    svg.style.height = "auto";
    svg.style.display = "block";

    let rectan = rect(0, 0, donLen, 16, 10, 10, "#fbc02d");
    let rectan2 = rect(0, 40, recLen, 16, 10, 10, "white");
    svg.append(rectan, rectan2);

    let auditRatioCard = Div("audiRatioCard").add(
        Div("texts").add(
            Div("smalltext", "audit Ratio"),
            Div("Bigtext", auditRatio)
        ),
        Div("graphTexts").add(
            Div("graph").add(svg),
            Div("nn").add(
                Div("texts").add(
                    Div("xp", "done"), Div("name", done + " kb")
                ),
                Div("texts").add(
                    Div("xp", "received"), Div("name", received + " kb")
                )
            )
        )
    );

    cardsContainer.append(auditRatioCard);
}

function rect(x, y, width, height, rx, ry, fill) {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("viewBox", "0 0 100 100")
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("rx", rx);
    rect.setAttribute("ry", ry);
    rect.setAttribute("fill", fill);
    return rect;
}
