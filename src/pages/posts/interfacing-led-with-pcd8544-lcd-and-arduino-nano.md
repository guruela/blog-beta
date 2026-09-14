---
layout: ../../layouts/MarkDownLayout.astro
title: "Integrating LED with PCD8544 (Nokia 5110) LCD and Arduino Nano"
cover: "/images/posts/20200722/cover.jpg"
pubDate: "2020-07-22"
---

# Circuit
![image](/images/posts/20200722/circuit.jpg)

# Code
```cpp
#include "Adafruit_PCD8544.h"
#include "Adafruit_GFX.h"

#define LED 2

Adafruit_PCD8544 display = Adafruit_PCD8544(11, 10, 8, 9, 7);//Clk, Din, DC, CE, RST

void setup() {
  display.begin();
  display.setContrast(50);
  delay(1000);
  display.display();
  display.clearDisplay();

  pinMode(LED, OUTPUT);
}

void loop() {
  display.setTextSize(1);
  display.setTextColor(WHITE, BLACK);
  display.setCursor(35, 24);
  display.print("LED ON"); 
  digitalWrite(LED, HIGH);
  delay(1000);
  display.display();
  display.clearDisplay();

  display.setTextSize(1);
  display.setTextColor(WHITE, BLACK);
  display.setCursor(35, 24);
  display.print("LED OFF"); 
  digitalWrite(LED, LOW);
  delay(1000);
  display.display();
  display.clearDisplay();
}
```

# Demo
![](/videos/posts/20200722/demo.mp4)





