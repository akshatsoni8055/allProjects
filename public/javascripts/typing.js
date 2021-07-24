const GS = {
    running: 0,
    stopped: 1,
    timeover: 2
}

class Letter {
    constructor(position, value) {
        this.value = value
        this.position = position
        this.color = 'white'
    }
}

class PlayGround {
    constructor(text, width, height) {
        this.text = text
        this.width = width
        this.height = height
        this.cursor = {
            position: 0,
            x: 10,
            y: 10
        }
        this.letters = []
        this.words = 0
        this.correct = 0
        this.incorrect = 0
        this.state = GS.stopped
        this.time = null
        this.elapsed = null
        this.timeLimit = null
    }

    forward(key) {
        if (this.cursor.position == this.text.length - 1)
            return

        if (this.letters[this.cursor.position].value == key) {
            this.letters[this.cursor.position].color = 'yellow'
            this.correct++
        } else {
            this.letters[this.cursor.position].color = 'red'
            this.incorrect++
        }

        if (this.letters[this.cursor.position].value == ' ') {
            this.words++
        }

        if (this.cursor.x < this.width-30) {
            this.cursor.x += 15
        } else {
            this.cursor.y += 30
            this.cursor.x = 10
        }

        this.cursor.position++

    }
    backward() {
        if (this.cursor.position == 0)
            return

        this.cursor.position--

        if (this.cursor.x >= 25) {
            this.cursor.x -= 15
        } else if (this.cursor.y >= 30) {
            this.cursor.y -= 30
            this.cursor.x = this.width-30
        }
        if (this.letters[this.cursor.position].value == ' ')
            this.words--

        if (this.letters[this.cursor.position].color == 'red')
            this.incorrect--
        else
            this.correct--

        this.letters[this.cursor.position].color = 'white'

    }
    start() {
        if (this.state == GS.running)
            return
        let k = 0
        for (let i = 30; i <= this.height - 10 && k < this.text.length; i += 30)
            for (let j = 10; j <= this.width - 30 && k < this.text.length; j += 15, k++)
                this.letters.push(new Letter({ x: j, y: i }, this.text[k]))
        this.state = GS.running
        this.timeLimit = document.getElementById('setTime').value * 60000

    }
    reset(ctx) {
        this.cursor = {
            position: 0,
            x: 10,
            y: 10
        }
        this.letters = []
        this.words = 0
        this.correct = 0
        this.incorrect = 0
        this.state = GS.stopped
        this.time = null
        this.elapsed = null
        this.timeLimit = null
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.rect(0, 0, width, height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.fillText('Press any key to continue', this.width / 2, this.height / 2)
    }

    draw(ctx, time) {
        if (ground.state !== GS.running)
            return

        this.time === null ? this.time = time : this.elapsed = time - this.time

        document.getElementById('displayTime').textContent = Math.round(this.elapsed / 1000)
        document.getElementById('displaySpeed').textContent = Math.round(this.words * 60000 / this.elapsed)
        document.getElementById('accuracy').textContent = Math.round(this.correct * 100 / (this.incorrect + this.correct))

        if (this.elapsed >= this.timeLimit)
            this.state = GS.timeover

        ctx.clearRect(0, 0, this.width, this.height);
        ctx.rect(0, 0, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.textAlign = 'start'


        this.letters.forEach((letter) => {
            ctx.fillStyle = letter.color
            ctx.fillText(letter.value, letter.position.x, letter.position.y)
        })

        ctx.fillStyle = "green";
        ctx.fillRect(this.cursor.x, this.cursor.y, 15, 30);
        ctx.fillStyle = "white";
        ctx.fillText(this.text[this.cursor.position], this.cursor.x, this.cursor.y + 20);
    }


}
let text = 'Hello My name is Akshat Soni & I am not a Robot. Hello My name is Akshat Soni. Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.Hello My name is Akshat Soni & I am Not a Robot.'
let width = 1000
let height = 360
let canvas = document.getElementById('typing-area')
let ctx = canvas.getContext('2d')
ctx.rect(0, 0, width, height);
ctx.font = '20px cursive'
ctx.fillStyle = "black";
ctx.fill();
ctx.fillStyle = 'white'
ctx.textAlign = 'center'
ctx.fillText('Press any key to continue', width / 2, height / 2)
let ground = new PlayGround(text, width, height)

document.addEventListener('keypress', (event) => {
    if (ground.state === GS.stopped) {
        ground.start()
        return
    }
    ground.forward(event.key)
})
document.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace') {
        ground.backward()
    }
})

$('#setTime').change(() => {
    ground.reset(ctx)
    document.getElementById('displayTime').textContent = '00'
    document.getElementById('displaySpeed').textContent = '00'
})

function gameloop(time) {
    ground.draw(ctx, time)
    requestAnimationFrame(gameloop)
}
requestAnimationFrame(gameloop)