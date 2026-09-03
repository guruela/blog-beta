---
layout: ../../layouts/MarkDownLayout.astro
title: "Interfacing HC-SR04 (Ultrasonic) sensor with PCD8544 (Nokia 5110) LCD and Arduino Nano"
cover: "/images/posts/20200719/cover.png"
pubDate: "2020-07-19"
---

# Circuit
![image](/images/posts/20200719/circuit.jpg)

# Code
```cpp
#include "Adafruit_GFX.h"
#include "Adafruit_PCD8544.h"

Adafruit_PCD8544 display = Adafruit_PCD8544(11, 10, 8, 9, 7);

const int trigPin = 6;
const int echoPin = 5;

float duration, distance;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);

  display.begin();
  display.setContrast(60);
  display.clearDisplay();
  display.display();
  delay(100);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  distance = (duration*.0343)/2;
  Serial.print("Distance: ");
  Serial.println(distance);
  delay(100);

  display.setTextSize(1);
  display.setTextColor(WHITE, BLACK);
  display.setCursor(1, 20);
  display.print("Distance:");
  display.setCursor(54, 20);
  display.print(distance);
  display.display();
  display.clearDisplay();
  delay(100);
}
```
# Demo
![](/videos/posts/20200719/demo.mp4)
