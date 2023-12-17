import { removeCountdown, fullscreen } from "./interact"

function invokeTimer(frame, event) {
    frame.querySelector("#title").innerHTML = `${event.event}`
    frame.dataset.timestamp = JSON.stringify(event.timestamp)

    $(frame).find("button#remove").click(removeCountdown)
    $(frame).find("button#fullscreen").click(fullscreen)

    const interval = setInterval(function(){
        const timeLeft = event.timestamp - Date.now()
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        const plain = `${days} days : ${hours} hours : ${minutes} minutes : ${seconds} seconds`
        const formatted = (`<span class="value" id="val-days">${days}</span> <span class="legend" id="leg-days">days</span> : <span class="value" id="val-hours">${hours}</span> <span class="legend" id="leg-hours">hours</span> <br> <span class="value" id="val-minutes">${minutes}</span> <span class="legend" id="leg-minutes">minutes</span> : <span class="value" id="val-seconds">${seconds}</span> <span class="legend" id="leg-seconds">seconds</span>`)
        
        const shorthand = (timeLeft / (1000 * 60 * 60 * 24)).toFixed(2);
        const shorthandFormatted = `<span class="value">${shorthand}</span><span class="legend"> days</span>`

        const outPlain = `0 days : 0 hours : 0 minutes : 0 seconds`
        const outFormatted = (`<span class="value" id="val-days">0</span> <span class="legend" id="leg-days">days</span> : <span class="value" id="val-hours">0</span> <span class="legend" id="leg-hours">hours</span> : <span class="value" id="val-minutes">0</span> <span class="legend" id="leg-minutes">minutes</span> : <span class="value" id="val-seconds">0</span> <span class="legend" id="leg-seconds">seconds</span>`)

        if (timeLeft > 0) {
            frame.querySelector("#counter").innerHTML = formatted

            if (frame.querySelector("#shorthand").innerHTML != shorthandFormatted) {
                frame.querySelector("#shorthand").innerHTML = shorthandFormatted
            }
        } else {
            clearInterval(interval)

            frame.querySelector("#counter").innerHTML = outFormatted
            frame.querySelector("#shorthand").innerHTML = `Refresh to remove`
        }
    }, 100)
}

function generateFrame(parent) {
    const frame = document.createElement("div")
    frame.classList = "countdown"
    frame.innerHTML = `
        <div id="grouping">
            <button id="remove"></button>
            <button id="fullscreen"></button>
        </div>
        <h2 id="title"></h2> 
        <h2 id="counter"></h2>
        <h3 id="shorthand"></h3>
    `

    parent.appendChild(frame)

    return frame
}

$.ajax({
    url: "events.json",
    async: false,
    success: function(userEvents) {
        if (!window.localStorage.getItem("userEvents")) {
            window.localStorage.setItem("userEvents", JSON.stringify({
                "recurring": [],
                "oneTime": []
            }))
        }

        const local = JSON.parse(window.localStorage.getItem("userEvents"))

        const recurring = [userEvents.recurring, local.recurring].flat()
        const oneTime = [userEvents.oneTime, local.oneTime].flat()

        var events = []

        for (let i=0; i<oneTime.length; i++) {
            let event = oneTime[i]
            event.timestamp = event.timestamp * 1000

        }

        events.push(oneTime)
        events = events.flat()

        for (let i=0; i<recurring.length; i++) {
            let event = recurring[i]
            event.timestamp = event.timestamp * 1000

            let yearWhenSet = new Date(event.timestamp).getFullYear()
            let difference = (new Date(Date.now()).getFullYear() - yearWhenSet + 10)

            events.push(event)

            for (let x=0; x<difference; x++) {
                let newEvent = structuredClone(event)
                let date = new Date(newEvent.timestamp)
                let nextYear = date.getFullYear() + (x + 1)
                let newDate = date.toISOString().replace(date.getFullYear(), nextYear)

                newEvent.timestamp = new Date(newDate).valueOf()

                events.push(newEvent)
            }
        }

        events = events.filter(e => e.timestamp >= Date.now() && e.timestamp <= (Date.now() + 31556926000))

        if (window.localStorage.getItem("userRemoved")) {
            events = events.filter(e => !JSON.parse(window.localStorage.getItem("userRemoved")).find(t => e.timestamp / 1000 == t))
        }


        events.sort(function(a,b){
            return a.timestamp > b.timestamp
        })

        for (let i=0; i<events.length; i++) {
            console.log(new Date(events[i].timestamp).toUTCString())
        }

        console.log(events)

        document.title = `Countdown to ${events[0].event}`

        for (let i=0; i<events.length; i++) {
            const frame = generateFrame(document.querySelector("body > #container > #countdowns"))

            invokeTimer(frame, events[i])
        }
    },
    error: function(xhr){
        const baseError = generateFrame(document.querySelector("body > #container > #countdowns"))
        baseError.querySelector("#title").innerHTML = "Error fetching events.json"
        baseError.querySelector("#counter").innerHTML = '<span class="legend">Have you checked to make sure that <code>/events.json</code> exists and is set up proplerly?</span>'

        const customError = generateFrame(document.querySelector("body > #container > #countdowns"))
        customError.querySelector("#title").innerHTML = `Error ${xhr.status}`
        customError.querySelector("#counter").style.marginLeft = 0
        customError.querySelector("#counter").innerHTML = `<span class="value">Here's what we know: </span><span class="legend">${xhr.statusText}</span>`
    }
})

$("#newtimer").submit(function(e){
    e.preventDefault();
    const input = ($("#newtimer").serializeArray())

    const event = {
        "event": input[0].value,
        "timestamp": new Date(input[1].value).valueOf() / 1000
    }

    if (!window.localStorage.getItem("userEvents")) {
        window.localStorage.setItem("userEvents", JSON.stringify({
            "recurring": [],
            "oneTime": []
        }))
    }

    let updated = JSON.parse(window.localStorage.getItem("userEvents"))
    
    if (input[2].value == "1") {
        updated.oneTime.push(event)
    } else {
        updated.recurring.push(event)
    }

    window.localStorage.setItem("userEvents", JSON.stringify(updated))

    if (event.timestamp * 1000 > Date.now() || input[2].value == "2") {
        const frame = generateFrame(document.querySelector("body > #container > #countdowns"))
        window.location.reload()
        invokeTimer(frame, event)
    } else {
        alert("Cannot set timers in the past")
    }
})