---
layout: ../../layouts/MarkDownLayout.astro
title: "Controlling LED over WiFi using ESP8266 module (Wemos D1 Mini) and Blynk App"
cover: "/images/posts/20200724/cover.png"
pubDate: "2020-07-24"
---

# Code
```cpp
#define BLYNK_PRINT Serial
#include "ESP8266WiFi.h"
#include "BlynkSimpleEsp8266.h"

// You should get Auth Token in the Blynk App. 
//Go to the Project Settings (nut icon).
//The Auth Token Credentials will be sent to your E-Mail 
char auth[] = "**********************"; 

char ssid[] = "Start"; 
char pass[] = "1234567890"; 

void setup()
{

Serial.begin(9600);

Blynk.begin(auth, ssid, pass);
}

void loop()
{
Blynk.run();
}
```

# Demo
![](/videos/posts/20200724/demo.mp4)
