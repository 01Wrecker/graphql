function skillCard(skills) {
    console.log(skills);


    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", svgHeight);
    svg.setAttribute("width", "100%");

    let placeholder = Div("skillsholder");

    let count = 0;

    skills.forEach(skill => {
        let xPos = count += 30;
        let barHeight = skill.amount;
        let yPos = svgHeight - barHeight; // Flip the bar to grow upward

        let rectan = rect(xPos, yPos, 16, barHeight, 10, 10, "#fbc02d");

        rectan.addEventListener("mouseenter", function (e) {
            let tooltip = Div("tooltip");
            tooltip.textContent = skill.type + " " + skill.amount + "%";
            tooltip.style.top = e.clientY +"300"+ "px";
            tooltip.style.left = e.clientX + "px";
            tooltip.setAttribute("ishover", "true");
            document.body.appendChild(tooltip);
        });

        rectan.addEventListener("mouseleave", function () {
            const tooltip = document.querySelector("[ishover]");
            if (tooltip) tooltip.remove();
        });

        svg.append(rectan);
    });

    placeholder.append(svg);
    document.body.append(placeholder);
}
