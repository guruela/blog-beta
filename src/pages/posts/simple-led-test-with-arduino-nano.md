---
layout: ../../layouts/MarkDownLayout.astro
title: "Simple LED Test with Arduino Nano"
cover: "/images/posts/20200720/cover.png"
pubDate: "2020-07-20"
---

# Circuit
![image](/images/posts/20200720/circuit.jpg)

# Code
```cpp
#define LED1 11
#define LED2 10
#define LED3 9
#define LED4 8

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(LED4, OUTPUT);
}

void loop() {
  digitalWrite(LED1, HIGH);
  delay(100);
  digitalWrite(LED1, LOW);
  digitalWrite(LED2, HIGH);
  delay(100);
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, HIGH);
  delay(100);
  digitalWrite(LED3, LOW);
  digitalWrite(LED4, HIGH);
  delay(100);
  digitalWrite(LED4, LOW);
  delay(100);
}
```

# Demo
![](/videos/posts/20200720/demo.mp4)



