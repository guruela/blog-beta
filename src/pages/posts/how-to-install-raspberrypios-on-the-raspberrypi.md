---
layout: ../../layouts/MarkDownLayout.astro
title: "How to install Raspberry Pi OS on the Raspberry Pi"
cover: "/images/posts/20200715/cover.png"
pubDate: "2020-07-15"
---

# A Little Insight
In this post we will be exploring the Raspberry Pi and it's features and make some cool Projects!!. But before we start digging any further we need to know how to install Raspberry Pi OS because a huge number of great Raspberry Pi starts with it. Raspberry Pi OS is a competent and versatile operating system based to the Debian flavour that gives your Raspberry Pi all the comforts of a PC: a command line, a browser, and tons of other programs. You can use a Raspberry Pi running Raspberry Pi OS as a cheap and effective home computer, or you can turn your Raspberry Pi into any of countless other functional devices, from wireless access points to retro gaming machines. Here’s how to install Raspberry Pi OS on the Raspberry Pi.

## How to install Raspberry Pi OS on the Raspberry Pi
Installing Raspbian on the Raspberry Pi is pretty straightforward. We’ll be downloading Raspbian and writing the disc image to a microSD card, then booting the Raspberry Pi to that microSD card. For this project, you’ll need a microSD card (go with at least 8 GB), a sd card reader or computer with a slot for it , and, of course, a Raspberry Pi and basic peripherals (a mouse, keyboard, screen, and power source).

**NOTE : Raspberry Pi OS was previously called Raspbian .Raspbian's latest image is based on  "Debian Stretch" whereas the Raspberry Pi OS is based on "Debian Buster". So don't confused between them as they're both partly same.**

So without further ado we'll start the installation process. I have put it step by step for you to easily understand.

### Step 1: Download Raspberry Pi OS itself
![image](/images/posts/20200715/1.png)

Now it’s about time that we get started! First things first: head over to this link and download the disc image. I recommend you to download the "Raspberry Pi OS (32-bit) with desktop" disk image as it is more than enough for our purpose. It can easily take a half hour or more to download depending on your internet connection.

### Step 2: Unzip the file
The Raspbian disc image is compressed and file uses the ZIP64 format, so use the inbuilt archieve utilities on your Operating System.

### Step 3: Write the image to your microSD Card
![image](/images/posts/20200715/2.png)

Now that we have extracted the disc image, it's time to write it to our microSD card .There are many tools to download online but I recommend Etcher or Raspberry Pi Imager which is available to all of the popular operating systems and it's seamless and hassle-free. But in this case I'm gonna be using Etcher.

When you fire up the software, firstly select the disc image we had just unzipped and secondly, choose your microSD card that you want to have the OS written to and click flash .This process will take a good 10-15 mins depending on your microSD's make.

### Step 4: Put the microSD Card in your Pi and boot up
Once the disc image has been written to the microSD card, you’re ready to go! Put the microSD into your Rasberry Pi, plug in the peripherals and power source, and enjoy. The current edition to Raspberry Pi OS will boot directly to the desktop. Your default credentials are username pi and password raspberry.

## And we're done!
So there you have it - A fully functional Raspberry Pi in which we can start making some amazing projects .I will be posting some cool Raspberry Pi Projects in the upcoming days, so stay tuned for that .Until then, I'm Guru signing off and I'll catch you in my next post!
