const words = [
"Computer Architect",
"Robotics Engineer",
"RTL Designer",
"FPGA Developer",
"AI Researcher",
"Future Innovator"
];

let index = 0;

function updateTitle() {

```
document.getElementById("typing").textContent =
    words[index];

index++;

if (index >= words.length) {
    index = 0;
}
```

}

updateTitle();

setInterval(updateTitle, 2000);
