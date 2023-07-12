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

    if (!button.dataset.on) {
        button.dataset.on = "true"

        container.style.borderRadius = 0
        container.style.position = "fixed"
        container.style.left = "50%"
        container.style.top = "50%"
        container.style.translate = "-50% -50%"
        container.style.width = "100vw"
        container.style.height = "100vh"
        container.style.padding = "100px"
        container.style.zIndex = 100
    } else {
        button.dataset.on = ""

        container.style.borderRadius = ""
        container.style.position = ""
        container.style.left = ""
        container.style.top = ""
        container.style.translate = ""
        container.style.width = ""
        container.style.height = ""
        container.style.padding = ""
        container.style.zIndex = ""
    }
}

export function removeCountdown() {
    const container = this.parentNode.parentNode
    container.remove()
}

$("button#showless").unbind("click").click(toggleView)