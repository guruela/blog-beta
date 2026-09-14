---
layout: ../../layouts/MarkDownLayout.astro
title: "Simple Push Button Test with Arduino Nano"
cover: "/images/posts/20200721/cover.png"
pubDate: "2020-07-21"
---

# Circuit
![image](/images/posts/20200721/circuit.jpg)

# Code
```cpp
int Button = 2;
int val = 0;     

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  
  pinMode(Button, INPUT);    
}

void loop(){
  val = digitalRead(Button);  
  if (val == HIGH) {         
    digitalWrite(LED_BUILTIN, LOW);  
  } else {
    digitalWrite(LED_BUILTIN, HIGH);  
  }
}
```

# Demo
![](/videos/posts/20200721/demo.mp4)




