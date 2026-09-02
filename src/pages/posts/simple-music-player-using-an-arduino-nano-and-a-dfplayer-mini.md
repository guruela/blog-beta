---
layout: ../../layouts/MarkDownLayout.astro
title: "Simple Music Player using an Arduino Nano and DFPlayer Mini"
cover: "/images/posts/20200717/cover.jpg"
pubDate: "2020-07-17"
---

# Circuit
![image](/images/posts/20200717/circuit.jpg)

# Code
```cpp
#include "Arduino.h"
#include "SoftwareSerial.h"
#include "DFRobotDFPlayerMini.h"

SoftwareSerial mySoftwareSerial(10, 11); // RX, TX
DFRobotDFPlayerMini myDFPlayer;
void printDetail(uint8_t type, int value);

void setup()
{
  mySoftwareSerial.begin(9600);
  Serial.begin(115200);
  
  Serial.println();
  Serial.println(F("DFRobot DFPlayer Mini Demo"));
  Serial.println(F("Initializing DFPlayer ... (May take 3~5 seconds)"));
  
  if (!myDFPlayer.begin(mySoftwareSerial)) {  //Use softwareSerial to communicate with DFPlayer Mini.
    Serial.println(F("Unable to begin:"));
    Serial.println(F("1.Please recheck the connection!"));
    Serial.println(F("2.Please insert the SD card!"));
    while(true){
      delay(0); 
    }
  }
  Serial.println(F("DFPlayer Mini online."));
  
  myDFPlayer.volume(25);  
  myDFPlayer.play(1);  //Play the first mp3
}

void loop()
{
  static unsigned long timer = millis();
  
  if (millis() - timer > 20000) {
    timer = millis();
    myDFPlayer.next();  //Play next mp3 every 20 second.
  }
}
```
# Demo
![](/videos/posts/20200717/demo.mov)
