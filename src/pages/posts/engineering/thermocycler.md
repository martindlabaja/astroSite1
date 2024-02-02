---
layout: ../../../layouts/MarkdownPostLayout.astro
title: Thermocycler
pubDate: 2022-11-28
description: Let me show you how I have built my own thermocycler machine for PCR reactions in genetics.
author: Martin D.C.
image:
  url: https://docs.astro.build/assets/full-logo-light.png
  alt: The full Astro logo.
tags:
  - engineering
  - electronics
  - arduino
  - genetics
  - biology
  - science
---
# Intro

One of the most common process in genetics is a PCR, which is shorthand for [polymerase chain reaction](https://www.bosterbio.com/protocol-and-troubleshooting/pcr-principle).

It is a set of chemical reactions that is giving us possibility to selectively **duplicate** a specific **part of DNA** that we extract from a tissue (cell) sample.
pozadovane
![PCR Reaction](pcr1.png)

For it to work, it needs a device that controls temperature **[C°]** in time. **[t]**

What we want from machine is to heat the sample as follows:

1.  **94 C°** for **30s** (Denaturation)
2.  **56 C°**  for  **30s** (Annealing)
3.  **72 C°** for **40s** (Extension)
   
   **ΔC°/s** otherwise called ramp-up & ramp-down time also plays a role. So we will need both heating and cooling.

Commercially available units are usually pretty expensive and look like this:

![Thermocycler Unit](thermo3.jpg)
# Planning considerations
Usual three stages:

1. find diagrams, plans, pdfs of existing commercial products and copy what you can (i.e. do not reinvent the wheel)
2. make a breadboard version and measure the performance 
3. make more robust design

These were probably the two **most useful diagrams** I have found while browsing:

![PCR Machine or Thermocycler](thermo2.jpg)
![PCR Machine or Thermocycler](thermo1.png)
[source1](https://www.genengnews.com/insights/development-and-evolution-of-pcr/) [source2](https://www.semanticscholar.org/paper/Temperature-Control-for-PCR-Thermocyclers-Based-on-Qiu-Yuan/8d26bb6e109e0f6a9a8ce5929e7fd1c4f334d723/figure/1)

We can see that a primary method for heating and cooling is a **Peltier** element (**TE** or **TEC** in diagrams). 

The most complex part seems to be a "sample block", which needs to be made out of material with great heating conductivity and also needs to have as minimal mass as possible, because more material = heating and cooling takes longer so our **ΔC°/s** would also increase. 
# Construction

First I constructed a diagram of whole device:![PCR Machine Diagram](thermo0.png)
Device has **two identical sections** that consist of the controller itself (Arduino in this case) that is connected to **H-Bridge** driver that **forwards  power** to the TEC Peltier elements.  H-Bridge can **reverse polarity** direction so Peltier can heat and cool the sample block when needed.

Why two identical sections you ask? Well because if we heated the mini vials inserted into the device only from the bottom, there would be lots of condensation due to the temperature gradient inside the vials and from what I have read could interfere with undergoing PCR reaction. Most **commercial designs are using heated top lid** for this reason, usually heated with resistance wire. (as lid does not have so much mass to be heated up) 

I will use TEC Peltier element for both sample block and a lid. Because I dont like the idea of the top lid slacking behind the temperature curve of a sample block.

Let' put it to test on  a breaboard version of a project. Before I make  a proper sample block, I used a small chamber with water just to see how Peltier works to make some measurements beforehand.


