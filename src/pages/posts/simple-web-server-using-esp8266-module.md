---
layout: ../../layouts/MarkDownLayout.astro
title: "Simple Web Server using ESP8266 module (Wemos D1 Mini)"
cover: "/images/posts/20200723/cover.jpg"
pubDate: "2020-07-23"
---

# Code
```cpp
#include "ESP8266WiFi.h"
#include "ESP8266WiFiMulti.h"

const char* ssid     = "*********"; // Change this to your network's SSID
const char* password = "*********"; // Change this to your network's password

const char* host = "192.168.1.1";
const uint16_t port = 3000;

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);

  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(ssid, password);

  Serial.println();
  Serial.println();
  Serial.print("Wait for WiFi... ");

  while (WiFiMulti.run() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  delay(500);
}


void loop() {
  Serial.print("connecting to ");
  Serial.print(host);
  Serial.print(':');
  Serial.println(port);

  WiFiClient client;

  if (!client.connect(host, port)) {
    Serial.println("connection failed");
    Serial.println("wait 5 sec...");
    delay(5000);
    return;
  }

  
  client.println("Hello from esp8266 and the MicroKid Team!!");


  Serial.println("receiving from remote server");
  String line = client.readStringUntil('\r');
  Serial.println(line);

  Serial.println("closing connection");
  client.stop();

  Serial.println("wait 5 sec...");
  delay(5000);
}
```

# Demo
![image](/images/posts/20200723/demo.png)
