export function toggleView() {
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

export function fullscreen() {
    const button = this
    const container = this.parentNode.parentNode

    
}

export function removeCountdown() {
    const container = this.parentNode.parentNode
    container.remove()
}

$("button#showless").unbind("click").click(toggleView)