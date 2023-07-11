function toggleView() {
    const button = $("button#showless")[0]
    const container = $("#countdowns")[0]

    if (!button.dataset.on) {
        button.dataset.on = "true"
        button.innerHTML = "Show More"

        $("#countdowns .countdown").each(function(index){
            if (index > 0) {
                this.style.display = "none"
            }
        })
    } else {
        button.dataset.on = ""
        button.innerHTML = "Show Less"

        $("#countdowns .countdown").each(function(index){
            if (index > 0) {
                this.style.display = ""
            }
        })
    }
}

function removeCountdown() {
    const countdown = this.parentNode.parentNode
    countdown.remove()
}

$(".countdown button#remove").click(removeCountdown)
$("button#showless").click(toggleView)