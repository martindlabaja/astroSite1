---
layout: ../../layouts/MarkdownPostLayout.astro
title: 'Arduino'
pubDate: 2022-07-01
description: 'This is the first post of my new Astro blog.'
author: 'Astro Learner'
image:
    url: 'https://docs.astro.build/assets/full-logo-light.png'
    alt: 'The full Astro logo.'
tags: ["engineering", "electronics", "arduino"]
---
[High Power Control w Arduino](http://adam-meyer.com/arduino/high-power-control-with-arduino-and-tip120)
http://adam-meyer.com/arduino/high-power-control-with-arduino-and-tip120

collector - Vcc
emmiter - GND


telemetry program:
To use the program you will need to have Java 8 installed. Download the program and source code here: [http://www.farrellf.com/TelemetryViewer/](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbm90eHZMWTZWeHNUeHBIRzR2T2txc3QxaW5nUXxBQ3Jtc0tuZ01SRjZEWXF1amh6OTk1TWJFVWZYbVQ2MGJMUS1HTlRQb0dLeEVPeExIT0JQWVFQQkZweGdUdHR1V1JxeV9WRnRvdDNkeThUaVcwSmdxcGJjcmhLMGVSMkg0WS1takxNc3FaSHB2d0dhemgxczVydw&q=http%3A%2F%2Fwww.farrellf.com%2FTelemetryViewer%2F&v=lFZ26gD7OIE) [https://github.com/farrellf/Telemetry...](https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqbVJ1ZFVyZDVPMGtza1BmRGVMRDVKeGpqWWNqUXxBQ3Jtc0tteE5IZUlYM3RYeV95OVBkMFJuWGdjLXlFRVZrdmdCdjNQNmEwMHZJWEQtLXJzMi1nTGxkZk9yNlJYT25JN2lxcmhqc29UWDF2Y01zclBieElhaE11dnFWOXZiN0NMRWIyVDd5SXFaSGZqQkw1Nk94OA&q=https%3A%2F%2Fgithub.com%2Ffarrellf%2FTelemetry-Viewer&v=lFZ26gD7OIE)

**UE4 Arduino**
[plugin 一](https://forums.unrealengine.com/t/free-windows-only-ue4duino-2-arduino-com-port-communication/95217)
[plugin 三](https://forums.unrealengine.com/t/new-free-arduino-serial-communication-plugin-serial-com-v3-fork-from-ue4duino/265486)


**read multiple values from serial for var inputs**
```
 // serial input // parameters
  if(Serial.available()){
    String rxString = "";
    String strArr[2]; //Set the size of the array to equal the number of values you will be receiveing.
    //Keep looping until there is something in the buffer.
    while (Serial.available()) {
      //Delay to allow byte to arrive in input buffer.
      delay(2);
      //Read a single character from the buffer.
      char ch = Serial.read();
      //Append that single character to a string.
      rxString+= ch;
    }
    int stringStart = 0;
    int arrayIndex = 0;
    for (int i=0; i < rxString.length(); i++){
      //Get character and check if it's our "special" character.
      if(rxString.charAt(i) == ','){
        //Clear previous values from array.
        strArr[arrayIndex] = "";
        //Save substring into array.
        strArr[arrayIndex] = rxString.substring(stringStart, i);
        //Set new string starting point.
        stringStart = (i+1);
        arrayIndex++;
      }
    }
    //Put values from the array into the variables.
    String value1 = strArr[0];
    String value2 = strArr[1];
    //Convert string to int if you need it.
    int intValue1 = value1.toInt();
  }
```


Serial data arrives one byte at a time. It is put in a buffer until you read it. If you f**k around and don't read data before the buffer gets full, any data that won't fit in the buffer is just discarded.

If you are not doing anything with the data, as in your example, do NOT use the String class or the blocking readString() method.

Learn to use the available() and read() methods, instead.