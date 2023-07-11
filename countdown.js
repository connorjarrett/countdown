$.ajax({
    url: "events.json",
    success: function(userEvents) {
        const recurring = userEvents.recurring
        const oneTime = userEvents.oneTime

        const outPlaint = `0 days : 0 hours : 0 minutes : 0 seconds`
        const outFormatted = (`<span class="value" id="val-days">0</span> <span class="legend" id="leg-days">days</span> : <span class="value" id="val-hours">0</span> <span class="legend" id="leg-hours">hours</span> : <span class="value" id="val-minutes">0</span> <span class="legend" id="leg-minutes">minutes</span> : <span class="value" id="val-seconds">0</span> <span class="legend" id="leg-seconds">seconds</span>`)

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

        events.sort(function(a,b){
            return a.timestamp > b.timestamp
        })

        for (let i=0; i<events.length; i++) {
            console.log(new Date(events[i].timestamp).toUTCString())
        }

        console.log(events)

        function invokeTimer(frame, event) {
            frame.querySelector("#title").innerHTML = `${event.event}`

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

                document.title = `Countdown to ${events[0].event}`

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

        for (let i=0; i<events.length; i++) {
            const frame = document.createElement("div")
            frame.classList = "countdown"
            frame.innerHTML = `
                <div id="grouping">
                    <button id="remove"></button>
                    <h2 id="title"></h2> 
                </div>
                <h2 id="counter"></h2>
                <h3 id="shorthand"></h3>
            `

            document.querySelector("body > #container > #countdowns").appendChild(frame)

            invokeTimer(frame, events[i])
        }
    }
})