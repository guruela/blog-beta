---
layout: ../../layouts/MarkDownLayout.astro
title: "Interfacing PCD8544 (Nokia 5110) LCD with Arduino Nano"
cover: "/images/posts/20200718/cover.jpg"
pubDate: "2020-07-18"
---

# Circuit
![image](/images/posts/20200718/circuit.jpg)

# Code
```cpp
#include "Adafruit_GFX.h"
#include "Adafruit_PCD8544.h"

Adafruit_PCD8544 display = Adafruit_PCD8544(7, 6, 5, 4, 3);

#define NUMFLAKES 10
#define XPOS 0
#define YPOS 1
#define DELTAY 2
#define LOGO16_GLCD_HEIGHT 16
#define LOGO16_GLCD_WIDTH  16

static const unsigned char PROGMEM logo16_glcd_bmp[] =
{ B00000000, B11000000,
  B00000001, B11000000,
  B00000001, B11000000,
  B00000011, B11100000,
  B11110011, B11100000,
  B11111110, B11111000,
  B01111110, B11111111,
  B00110011, B10011111,
  B00011111, B11111100,
  B00001101, B01110000,
  B00011011, B10100000,
  B00111111, B11100000,
  B00111111, B11110000,
  B01111100, B11110000,
  B01110000, B01110000,
  B00000000, B00110000 };

void testdrawbitmap(const uint8_t *bitmap, uint8_t w, uint8_t h) {
  uint8_t icons[NUMFLAKES][3];
  randomSeed(666);     // whatever seed
 
  // initialize
  for (uint8_t f=0; f< NUMFLAKES; f++) {
    icons[f][XPOS] = random(display.width());
    icons[f][YPOS] = 0;
    icons[f][DELTAY] = random(5) + 1;
    
    Serial.print("x: ");
    Serial.print(icons[f][XPOS], DEC);
    Serial.print(" y: ");
    Serial.print(icons[f][YPOS], DEC);
    Serial.print(" dy: ");
    Serial.println(icons[f][DELTAY], DEC);
  }

  while (1) {
    // draw each icon
    for (uint8_t f=0; f< NUMFLAKES; f++) {
      display.drawBitmap(icons[f][XPOS], icons[f][YPOS], logo16_glcd_bmp, w, h, BLACK);
    }
    display.display();
    delay(200);

    while(Serial.available()) {
        switch (Serial.read()) {
          case 'w':display.setContrast(display.getContrast() + 1);
                   break;
          case 's':if(display.getContrast()) display.setContrast(display.getContrast() - 1);
                     break;
          case 'e':display.setBias(display.getBias() + 1);
                   break;
          case 'd':if(display.getBias()) display.setBias(display.getBias() - 1);
                   break;
          case 'R':display.setReinitInterval(10);
                   break;
          case 'r':display.initDisplay();
                   display.setReinitInterval(0);
                   break;
        }
    }
    Serial.print("contrast (w/s): 0x");
    Serial.print(display.getContrast(), HEX);
    Serial.print("   bias (e/d): 0x");
    Serial.print(display.getBias(), HEX);
    Serial.print("   reinitialize display (r/R): 0x");
    Serial.print(display.getReinitInterval(), HEX);
    Serial.print("   \r");

    // then erase it + move it
    for (uint8_t f=0; f< NUMFLAKES; f++) {
      display.drawBitmap(icons[f][XPOS], icons[f][YPOS],  logo16_glcd_bmp, w, h, WHITE);
      // move it
      icons[f][YPOS] += icons[f][DELTAY];
      // if its gone, reinit
      if (icons[f][YPOS] > display.height()) {
	icons[f][XPOS] = random(display.width());
	icons[f][YPOS] = 0;
	icons[f][DELTAY] = random(5) + 1;
      }
    }
   }
}


void testdrawchar(void) {
  display.setTextSize(1);
  display.setTextColor(BLACK);
  display.setCursor(0,0);

  for (uint8_t i=0; i < 168; i++) {
    if (i == '\n') continue;
    display.write(i);
    //if ((i > 0) && (i % 14 == 0))
      //display.println();
  }    
  display.display();
}

void testdrawroundrect(void) {
  for (int16_t i=0; i
}
```
# Demo
![](/videos/posts/20200718/demo.mp4)
